import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Save, Trash2 } from 'lucide-react';
import { useApiKey } from '../contexts/ApiKeyContext';
import { useLanguage } from '../contexts/LanguageContext';

export const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey, isModalOpen, setModalOpen } = useApiKey();
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      setInputValue(apiKey);
    }
  }, [isModalOpen, apiKey]);

  if (!isModalOpen) return null;

  const handleSave = () => {
    setApiKey(inputValue.trim());
    setModalOpen(false);
  };

  const handleRemove = () => {
    setApiKey('');
    setInputValue('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-moonlight-600/20 rounded-lg">
              <Key className="w-5 h-5 text-moonlight-500" />
            </div>
            <h3 className="text-xl font-bold text-white">{t('apikey_title')}</h3>
          </div>
          <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {t('apikey_desc')}
        </p>

        <div className="space-y-4">
          <input
            type="password"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('apikey_placeholder')}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-moonlight-500 focus:ring-1 focus:ring-moonlight-500 transition-all placeholder:text-slate-600"
          />

          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-moonlight-400 hover:text-moonlight-300 transition-colors"
          >
            <span>{t('apikey_link_text')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-moonlight-600 hover:bg-moonlight-500 text-white font-semibold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t('apikey_save')}
            </button>
            {apiKey && (
              <button
                onClick={handleRemove}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 font-semibold px-4 rounded-lg transition-all flex items-center justify-center"
                title={t('apikey_remove')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};