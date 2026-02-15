import React from 'react';
import { CalculationResult } from '../types';
import { Wifi, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BitrateResultProps {
  result: CalculationResult;
}

export const BitrateResult: React.FC<BitrateResultProps> = ({ result }) => {
  const { t } = useLanguage();

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-moonlight-600 to-cyan-600 rounded-2xl opacity-75 blur group-hover:opacity-100 transition duration-500"></div>
      <div className="relative bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-800">
        
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wifi className="w-6 h-6 text-moonlight-400" />
                {t('result_title')}
            </h2>
        </div>

        <div className="text-center mb-8">
            <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
                {Math.round(result.optimalBitrate)}
            </div>
            <div className="text-moonlight-400 font-medium mt-2 text-lg">{t('optimal_target')}</div>
        </div>

        {/* Range Bar */}
        <div className="space-y-2 mb-6">
            <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
                <span>{t('min_acceptable')} ({Math.round(result.minBitrate)})</span>
                <span>{t('max_quality')} ({Math.round(result.maxBitrate)})</span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                {/* Visualizing the "Optimal" range */}
                <div 
                    className="absolute top-0 bottom-0 bg-gradient-to-r from-slate-600 via-moonlight-600 to-cyan-500 opacity-80"
                    style={{ 
                        left: '20%', 
                        right: '20%' 
                    }}
                />
                <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] left-1/2 -ml-0.5"></div>
            </div>
            <p className="text-xs text-center text-slate-500 pt-1">
                {t('set_instruction')}
            </p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <div className="flex gap-3">
                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300 leading-relaxed">
                    <p>
                        {t('result_info')}
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};