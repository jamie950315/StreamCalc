import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const CalculationFormula: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-800/50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-moonlight-500" />
          <h3 className="text-lg font-bold text-white group-hover:text-moonlight-100 transition-colors">{t('formula_title')}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-6 pt-0 space-y-4 text-sm text-slate-400 animate-in slide-in-from-top-2 duration-200">
          <div className="h-px bg-slate-800/50 mb-4" />
          <p dangerouslySetInnerHTML={{ __html: t('formula_intro') }}></p>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-moonlight-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <code className="font-mono text-xs sm:text-sm text-moonlight-300 block overflow-x-auto whitespace-nowrap">
              {t('formula_code')}
              </code>
          </div>

          <ul className="space-y-3">
            <li className="flex gap-3">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
               <div>
                  <strong className="text-slate-200 block mb-0.5">{t('res_factor_title')}</strong>
                  <span>{t('res_factor_desc')}</span>
               </div>
            </li>
            <li className="flex gap-3">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
               <div>
                  <strong className="text-slate-200 block mb-0.5">{t('fps_factor_title')}</strong>
                  <span>{t('fps_factor_desc')}</span>
               </div>
            </li>
            <li className="flex gap-3">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
               <div>
                  <strong className="text-slate-200 block mb-0.5">{t('codec_eff_title')}</strong>
                  <span>{t('codec_eff_desc')}</span>
               </div>
            </li>
            <li className="flex gap-3">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0"></span>
               <div>
                  <strong className="text-slate-200 block mb-0.5">{t('hdr_overhead_title')}</strong>
                  <span>{t('hdr_overhead_desc')}</span>
               </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};