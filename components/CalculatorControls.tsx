import React, { useState, useEffect } from 'react';
import { Resolution, FrameRate, Codec, StreamSettings } from '../types';
import { Monitor, Gauge, Cpu, Zap, Eye, Plus, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface CalculatorControlsProps {
  settings: StreamSettings;
  onChange: (newSettings: StreamSettings) => void;
}

export const CalculatorControls: React.FC<CalculatorControlsProps> = ({ settings, onChange }) => {
  const { t } = useLanguage();
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');
  const [customPresets, setCustomPresets] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('moonlight_custom_resolutions');
    if (saved) {
      try {
        setCustomPresets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved presets');
      }
    }
  }, []);

  const savePresets = (presets: string[]) => {
      setCustomPresets(presets);
      localStorage.setItem('moonlight_custom_resolutions', JSON.stringify(presets));
  }

  const handleChange = <K extends keyof StreamSettings>(key: K, value: StreamSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const handleAddPreset = () => {
    if (!customWidth || !customHeight) return;
    const newPreset = `${customWidth}x${customHeight}`;
    
    // Switch to new preset immediately
    handleChange('resolution', newPreset);
    
    // Check for duplicates
    if (!customPresets.includes(newPreset)) {
        let newPresets = [...customPresets, newPreset];
        // Limit to 6 presets (FIFO)
        if (newPresets.length > 6) {
            newPresets = newPresets.slice(newPresets.length - 6);
        }
        savePresets(newPresets);
    }
    
    setCustomWidth('');
    setCustomHeight('');
  };

  const removePreset = (e: React.MouseEvent, preset: string) => {
    e.stopPropagation();
    const newPresets = customPresets.filter(p => p !== preset);
    savePresets(newPresets);
    if (settings.resolution === preset) {
         handleChange('resolution', Resolution.P1080);
    }
  };

  const getCodecDesc = (c: Codec) => {
    if (c === Codec.H264) return t('codec_h264_desc');
    if (c === Codec.HEVC) return t('codec_hevc_desc');
    if (c === Codec.AV1) return t('codec_av1_desc');
    return '';
  };

  return (
    <div className="space-y-8">
      {/* Resolution */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
          <Monitor className="w-4 h-4 text-moonlight-400" />
          <span>{t('resolution_label')}</span>
        </label>
        
        {/* Standard Presets */}
        <div className="grid grid-cols-4 gap-2">
          {Object.values(Resolution).map((res) => (
            <button
              key={res}
              onClick={() => handleChange('resolution', res)}
              className={`py-3 px-2 rounded-lg text-sm font-bold transition-all duration-200 border ${
                settings.resolution === res
                  ? 'bg-moonlight-600 border-moonlight-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:border-slate-600'
              }`}
            >
              {res}
            </button>
          ))}
        </div>

        {/* Custom Resolution Input */}
        <div className="mt-3 pt-3 border-t border-slate-800/50">
            <div className="flex gap-2 mb-3">
                <div className="relative flex-1 group">
                    <input 
                        type="number" 
                        placeholder={t('width_placeholder')}
                        value={customWidth}
                        onChange={e => setCustomWidth(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-2 text-sm focus:ring-1 focus:ring-moonlight-500 focus:border-moonlight-500 outline-none text-slate-200 placeholder:text-slate-600 transition-all"
                    />
                </div>
                <div className="flex items-center text-slate-600 font-medium text-xs">X</div>
                <div className="relative flex-1 group">
                    <input 
                        type="number" 
                        placeholder={t('height_placeholder')}
                        value={customHeight}
                        onChange={e => setCustomHeight(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-3 pr-2 text-sm focus:ring-1 focus:ring-moonlight-500 focus:border-moonlight-500 outline-none text-slate-200 placeholder:text-slate-600 transition-all"
                    />
                </div>
                <button 
                    onClick={handleAddPreset}
                    disabled={!customWidth || !customHeight}
                    className="bg-slate-800 hover:bg-moonlight-600 text-slate-400 hover:text-white border border-slate-700 hover:border-moonlight-500 rounded-lg px-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    title={t('add_custom_res')}
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Saved Custom Presets */}
            {customPresets.length > 0 && (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1">
                    {customPresets.map(preset => (
                        <button
                            key={preset}
                            onClick={() => handleChange('resolution', preset)}
                            className={`group relative py-2 px-2 rounded-lg text-xs font-medium border transition-all truncate ${
                                settings.resolution === preset
                                ? 'bg-moonlight-600/20 border-moonlight-500 text-moonlight-100'
                                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                            }`}
                        >
                            {preset}
                            <div 
                                onClick={(e) => removePreset(e, preset)}
                                className="absolute -top-1.5 -right-1.5 bg-slate-700 text-slate-400 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm border border-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* Frame Rate */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
          <Gauge className="w-4 h-4 text-moonlight-400" />
          <span>{t('framerate_label')}</span>
        </label>
        <div className="flex justify-between items-center bg-slate-800 p-1 rounded-lg border border-slate-700">
          {Object.values(FrameRate)
            .filter((v) => typeof v === 'number')
            .map((fps) => (
              <button
                key={fps}
                onClick={() => handleChange('frameRate', fps as FrameRate)}
                className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${
                  settings.frameRate === fps
                    ? 'bg-moonlight-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fps}
              </button>
            ))}
        </div>
      </div>

      {/* Codec */}
      <div className="space-y-3">
        <label className="flex items-center space-x-2 text-sm font-medium text-slate-400 uppercase tracking-wider">
          <Cpu className="w-4 h-4 text-moonlight-400" />
          <span>{t('codec_label')}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Object.values(Codec).map((codec) => (
            <button
              key={codec}
              onClick={() => handleChange('codec', codec)}
              className={`relative py-3 px-4 rounded-lg text-left border transition-all duration-200 ${
                settings.codec === codec
                  ? 'bg-slate-800 border-moonlight-500 ring-1 ring-moonlight-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-bold ${settings.codec === codec ? 'text-white' : 'text-slate-300'}`}>
                  {codec}
                </span>
                {settings.codec === codec && <div className="w-2 h-2 rounded-full bg-moonlight-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />}
              </div>
              <p className="text-xs text-slate-500">
                {getCodecDesc(codec)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-2">
        <button
          onClick={() => handleChange('hdr', !settings.hdr)}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
            settings.hdr
              ? 'bg-gradient-to-r from-slate-800 to-slate-800/50 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.1)]'
              : 'bg-slate-800 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${settings.hdr ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-400'}`}>
              <Eye className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className={`font-bold ${settings.hdr ? 'text-white' : 'text-slate-300'}`}>{t('hdr_label')}</div>
              <div className="text-xs text-slate-500">{t('hdr_desc')}</div>
            </div>
          </div>
          <div className={`w-12 h-6 rounded-full transition-colors relative ${settings.hdr ? 'bg-purple-600' : 'bg-slate-600'}`}>
            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.hdr ? 'translate-x-6' : 'translate-x-0'}`} />
          </div>
        </button>
      </div>
    </div>
  );
};