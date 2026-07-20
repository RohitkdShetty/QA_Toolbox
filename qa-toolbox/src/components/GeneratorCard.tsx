import React, { useState } from 'react';
import { GeneratorItem } from '../types';
import { useApp } from '../context/AppContext';
import { LucideIcon } from './LucideIcon';
import { motion } from 'motion/react';

interface GeneratorCardProps {
  item: GeneratorItem;
}

export const GeneratorCard: React.FC<GeneratorCardProps> = ({ item }) => {
  const { generateData, favorites, toggleFavorite, isLoading, currentResult } = useApp();
  const [customParam, setCustomParam] = useState<string>('');
  const [showParamInput, setShowParamInput] = useState<boolean>(false);

  const isFavorited = favorites.includes(item.id);
  const isCurrentlyActive = currentResult?.generatorName === item.label;

  // Determine if generator supports parameter input (e.g. base64 encoding/hashing custom strings)
  const supportsParam =
    item.endpoint.includes('/dev/base64') ||
    item.endpoint.includes('/dev/sha256') ||
    item.endpoint.includes('/dev/md5') ||
    item.endpoint.includes('/dev/password') ||
    item.endpoint.includes('/boundary/char');

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (supportsParam && !showParamInput && customParam === '') {
      setShowParamInput(true);
      return;
    }
    await generateData(item, customParam);
  };

  const handleParamKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateData(item, customParam);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={`group p-5 rounded-2xl border flex flex-col justify-between h-full transition-all duration-200 ${
        isCurrentlyActive
          ? 'bg-indigo-50/40 dark:bg-indigo-500/10 border-indigo-500/50 dark:border-indigo-500/35 shadow-md shadow-indigo-500/5'
          : 'bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-indigo-500/30 shadow-sm'
      }`}
    >
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex justify-between items-start gap-3">
          <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.label}
          </h4>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-white/5 transition cursor-pointer"
            title={isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
          >
            <LucideIcon
              name="Star"
              size={15}
              className={isFavorited ? 'fill-amber-400 text-amber-500' : 'text-gray-450'}
            />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-normal">
          {item.description}
        </p>

        {/* Parameter configuration input (if applicable) */}
        {supportsParam && (
          <div className="pt-2">
            {!showParamInput ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowParamInput(true);
                }}
                className="text-[10px] flex items-center gap-1 font-medium text-gray-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <LucideIcon name="Wrench" size={10} />
                Configure custom text input...
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customParam}
                  onChange={(e) => setCustomParam(e.target.value)}
                  onKeyDown={handleParamKeyPress}
                  placeholder={
                    item.endpoint.includes('/dev/password')
                      ? 'Length (default 12)'
                      : item.endpoint.includes('/boundary/char')
                      ? 'Char (default A)'
                      : 'Enter text to hash/encode...'
                  }
                  className="flex-1 text-[11px] bg-gray-50 border border-gray-200 dark:bg-black/40 dark:border-white/10 rounded-lg px-2.5 py-1 text-gray-850 dark:text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  onClick={() => {
                    setCustomParam('');
                    setShowParamInput(false);
                  }}
                  className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
                  title="Reset custom input"
                >
                  <LucideIcon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Button footer */}
      <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5 mt-4">
        <span className="font-mono text-[9px] text-gray-400 dark:text-slate-500 truncate max-w-[120px]" title={item.endpoint}>
          {item.endpoint}
        </span>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-sm group-hover:shadow cursor-pointer ${
            isCurrentlyActive
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/10'
              : 'bg-gray-100 dark:bg-white/5 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white text-gray-700 dark:text-slate-300'
          }`}
        >
          <LucideIcon name="Zap" size={11} className={isCurrentlyActive ? 'animate-bounce' : ''} />
          {isCurrentlyActive ? 'RE-GENERATE' : 'GENERATE'}
        </button>
      </div>
    </motion.div>
  );
};
