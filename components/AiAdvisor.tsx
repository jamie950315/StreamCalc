import React, { useState } from 'react';
import { StreamSettings, CalculationResult } from '../types';
import { getNetworkAdvice } from '../services/geminiService';
import { Bot, Send, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApiKey } from '../contexts/ApiKeyContext';
import { LANGUAGES } from '../translations';

interface AiAdvisorProps {
  settings: StreamSettings;
  result: CalculationResult;
}

export const AiAdvisor: React.FC<AiAdvisorProps> = ({ settings, result }) => {
  const { t, language } = useLanguage();
  const { apiKey, setModalOpen } = useApiKey();
  const [networkContext, setNetworkContext] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAskAi = async () => {
    if (!networkContext.trim()) return;
    
    // Check if key exists (either user input or env fallback check in service - but here we check UI state)
    // If we want to strictly enforce user input when no env key is present, we should rely on apiKey context
    // or handle the specific error from service. 
    // For better UX, we prompt if apiKey context is empty and let the service fail if env is also empty.
    if (!apiKey && !process.env.API_KEY) {
        setModalOpen(true);
        return;
    }

    setLoading(true);
    setAdvice(null);
    try {
      const promptName = LANGUAGES[language].promptName;
      const response = await getNetworkAdvice(settings, result, networkContext, promptName, apiKey);
      setAdvice(response);
    } catch (error) {
        setAdvice(t('ai_error_api')); // Or ai_error_generic
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t border-slate-800 pt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg text-white">
            <Bot className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">{t('ai_title')}</h3>
      </div>
      
      <p className="text-slate-400 text-sm mb-4">
        {t('ai_desc')}
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={networkContext}
          onChange={(e) => setNetworkContext(e.target.value)}
          placeholder={t('ai_placeholder')}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
          onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
        />
        <button
          onClick={handleAskAi}
          disabled={loading || !networkContext.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">
            {loading ? t('ai_button_analyzing') : t('ai_button_analyze')}
          </span>
        </button>
      </div>

      {advice && (
        <div className="mt-6 bg-slate-800/50 border border-indigo-500/30 rounded-xl p-6 relative animate-in fade-in slide-in-from-bottom-2">
          <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl opacity-50"></div>
          <h4 className="text-indigo-300 font-semibold mb-2 text-sm uppercase tracking-wide">{t('ai_result_title')}</h4>
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
             {/* Simple markdown rendering replacement for safety/speed */}
             {advice.split('\n').map((line, i) => (
                 <p key={i} className={`mb-2 ${line.startsWith('-') || line.startsWith('*') ? 'pl-4' : ''}`}>
                    {line.replace(/^[-*]\s/, '• ')}
                 </p>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};