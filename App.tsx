import React, { useState, useMemo } from 'react';
import { StreamSettings, Resolution, FrameRate, Codec, CalculationResult, LanguageCode } from './types';
import { CalculatorControls } from './components/CalculatorControls';
import { BitrateResult } from './components/BitrateResult';
import { AiAdvisor } from './components/AiAdvisor';
import { CalculationFormula } from './components/CalculationFormula';
import { BASE_BITRATE_REF, RESOLUTION_MULTIPLIERS, FRAMERATE_MULTIPLIERS, CODEC_EFFICIENCY, HDR_OVERHEAD } from './constants';
import { Settings, Cast, Github, Globe, Key } from 'lucide-react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ApiKeyProvider, useApiKey } from './contexts/ApiKeyContext';
import { ApiKeyModal } from './components/ApiKeyModal';
import { LANGUAGES } from './translations';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { setModalOpen, apiKey } = useApiKey();
  const [settings, setSettings] = useState<StreamSettings>({
    resolution: Resolution.P1080,
    frameRate: FrameRate.FPS60,
    hdr: false,
    codec: Codec.HEVC,
  });

  // State for Language Dropdown
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);

  const calculationResult = useMemo<CalculationResult>(() => {
    // Calculate Resolution Factor dynamically to support custom resolutions
    let resFactor = 1.0;
    
    // Check if it's a standard preset
    const standardResKey = Object.values(Resolution).find(r => r === settings.resolution);
    
    if (standardResKey) {
      resFactor = RESOLUTION_MULTIPLIERS[standardResKey as Resolution];
    } else {
      // Parse custom resolution "WxH"
      const match = settings.resolution.match(/^(\d+)[xX](\d+)$/);
      if (match) {
        const width = parseInt(match[1], 10);
        const height = parseInt(match[2], 10);
        // Compare pixel count to 1080p (1920x1080 = 2,073,600)
        // 1080p factor is 1.0
        const refPixels = 1920 * 1080;
        const currentPixels = width * height;
        resFactor = currentPixels / refPixels;
      }
    }

    const fpsFactor = FRAMERATE_MULTIPLIERS[settings.frameRate];
    const codecFactor = CODEC_EFFICIENCY[settings.codec];
    const hdrFactor = settings.hdr ? HDR_OVERHEAD : 1.0;

    // Base calculation: (Base * Res * FPS * Codec * HDR)
    // We adjust the curve slightly because Moonlight scales somewhat linearly but efficiency gains flatten out at higher bitrates.
    const rawBitrate = BASE_BITRATE_REF * resFactor * fpsFactor * codecFactor * hdrFactor;

    return {
      minBitrate: Math.max(1, Math.floor(rawBitrate * 0.6)), // Minimum viable, at least 1
      optimalBitrate: Math.ceil(rawBitrate),      // Sweet spot
      maxBitrate: Math.ceil(rawBitrate * 1.5),    // Diminishing returns
    };
  }, [settings]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-moonlight-500 selection:text-white pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-moonlight-600 p-2 rounded-lg">
                <Cast className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">StreamCalc</span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* API Key Button */}
               <button
                onClick={() => setModalOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-sm font-medium ${
                  apiKey 
                  ? 'bg-moonlight-900/30 text-moonlight-400 border-moonlight-500/30 hover:bg-moonlight-900/50' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-600'
                }`}
                title="API Key Settings"
              >
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">API Key</span>
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button 
                  onClick={() => setLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2"
                >
                  <span className="text-xl">{LANGUAGES[language].flag}</span>
                  <span className="hidden sm:inline text-sm font-medium">{LANGUAGES[language].name}</span>
                  <Globe className="w-4 h-4" />
                </button>
                
                {isLangMenuOpen && (
                  <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-20 py-1 overflow-hidden">
                    {(Object.keys(LANGUAGES) as LanguageCode[]).map((langCode) => (
                      <button
                        key={langCode}
                        onClick={() => {
                          setLanguage(langCode);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 hover:bg-slate-800 transition-colors ${language === langCode ? 'text-moonlight-400 bg-slate-800/50' : 'text-slate-300'}`}
                      >
                        <span className="text-lg">{LANGUAGES[langCode].flag}</span>
                        <span>{LANGUAGES[langCode].name}</span>
                      </button>
                    ))}
                  </div>
                  </>
                )}
              </div>

              <a href="https://github.com/jamie950315" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t('app_title_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-moonlight-400 to-cyan-400">{t('app_title_highlight')}</span> {t('app_title_suffix')}
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            {t('app_subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
                <Settings className="w-5 h-5 text-moonlight-500" />
                <h2 className="text-lg font-semibold text-white">{t('config_title')}</h2>
              </div>
              <CalculatorControls settings={settings} onChange={setSettings} />
            </div>
          </div>

          {/* Right Column: Results & AI */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              <BitrateResult result={calculationResult} />
              <CalculationFormula />
              <AiAdvisor settings={settings} result={calculationResult} />
            </div>
          </div>
        </div>
      </main>

      <ApiKeyModal />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ApiKeyProvider>
        <AppContent />
      </ApiKeyProvider>
    </LanguageProvider>
  );
};

export default App;