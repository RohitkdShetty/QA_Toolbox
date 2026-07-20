import React from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeCategory, setActiveCategory, favorites, history } = useApp();

  const totalGeneratorsCount = CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);

  const navigationItems = [
    {
      key: 'all',
      title: 'All Generators',
      iconName: 'Compass',
      count: totalGeneratorsCount,
      color: 'text-indigo-500'
    },
    {
      key: 'favorites',
      title: 'Starred Favorites',
      iconName: 'Star',
      count: favorites.length,
      color: 'text-amber-500'
    },
    {
      key: 'history',
      title: 'History Console',
      iconName: 'History',
      count: history.length,
      color: 'text-emerald-500'
    }
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-[#0F172A] border-r border-gray-200/80 dark:border-white/5">
      {/* Branding inside mobile sidebar */}
      <div className="h-16 flex lg:hidden items-center justify-between px-6 border-b border-gray-200/80 dark:border-white/5">
        <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <LucideIcon name="Terminal" size={18} className="text-indigo-500" />
          QA Toolbox
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 transition"
        >
          <LucideIcon name="X" size={18} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
        {/* Main Controls */}
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeCategory === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveCategory(item.key);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold border-l-4 border-indigo-600 dark:border-indigo-500 pl-2.5'
                    : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LucideIcon
                    name={item.iconName}
                    size={18}
                    className={isActive ? 'text-indigo-600 dark:text-indigo-400' : item.color}
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
                {item.count > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      isActive
                        ? 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-450'
                        : 'bg-gray-100 dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-500 dark:text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Categories Section */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest px-3.5">
            GENERATORS
          </h4>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold border-l-4 border-indigo-600 dark:border-indigo-500 pl-2.5'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LucideIcon
                      name={cat.iconName}
                      size={18}
                      className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-450 dark:text-slate-500'}
                    />
                    <span className="text-sm text-left">{cat.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-100 dark:border-white/10">
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Profile/About Footing */}
      <div className="p-4 border-t border-gray-200/80 dark:border-white/5 bg-gray-50/50 dark:bg-[#0B0F1A]/50">
        <div className="flex items-center gap-3 p-1.5">
          <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center border border-indigo-200/40 dark:border-indigo-500/20 text-sm shadow-md shadow-indigo-500/5">
            QA
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="text-xs font-bold text-gray-900 dark:text-white truncate">QA Toolbox Workspace</h5>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">V1.0.0 • Local Engine</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky and visible) */}
      <aside className="hidden lg:block w-72 h-[calc(100vh-4rem)] sticky top-16 shrink-0 z-10">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Floating slide-out drawer) */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Sidebar Slider */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-[85vw] h-full shadow-2xl z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
