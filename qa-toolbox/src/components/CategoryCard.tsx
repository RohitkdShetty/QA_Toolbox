import React from 'react';
import { GeneratorCategory } from '../types';
import { useApp } from '../context/AppContext';
import { LucideIcon } from './LucideIcon';
import { motion } from 'motion/react';

interface CategoryCardProps {
  category: GeneratorCategory;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { setActiveCategory } = useApp();

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => setActiveCategory(category.key)}
      className="p-6 rounded-2xl border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-500/40 dark:hover:border-indigo-500/30 hover:shadow-lg dark:hover:shadow-indigo-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full group"
    >
      <div className="space-y-4">
        {/* Dynamic Icon */}
        <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-sm border border-gray-150/60 dark:border-white/10">
          <LucideIcon name={category.iconName} size={22} />
        </div>

        {/* Info */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-base flex items-center gap-2">
            {category.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-normal">
            {category.description}
          </p>
        </div>
      </div>

      {/* Item Counter Footer */}
      <div className="pt-5 mt-5 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        <span>{category.items.length} Data Generators</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
            Open Module
          </span>
          <LucideIcon name="ChevronRight" size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
