import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LucideIcon } from './LucideIcon';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { searchQuery, setSearchQuery } = useApp();
  const [showShortcutModal, setShowShortcutModal] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-white/5 bg-white/70 dark:bg-[#0F172A]/50 backdrop-blur-md px-4 lg:px-6 h-16 flex items-center justify-between">
      {/* Left side: Mobile Toggle & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 transition"
          aria-label="Toggle Sidebar"
          id="btn-mobile-toggle"
        >
          <LucideIcon name="Menu" size={20} />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#6366F1] rounded-xl shadow-lg shadow-indigo-500/20 text-white flex items-center justify-center">
            <LucideIcon name="Terminal" size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5 text-base lg:text-lg">
              QA Toolbox
              <span className="text-xs py-0.5 px-2 font-medium bg-indigo-100 dark:bg-indigo-500/10 text-indigo-800 dark:text-indigo-400 rounded-full border border-indigo-200/55 dark:border-indigo-500/20">
                PRO
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Search Bar (Hidden on ultra-small screens, responsive on larger) */}
      <div className="flex-1 max-w-lg mx-6 hidden sm:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
            <LucideIcon name="Search" size={16} />
          </div>
          <input
            type="text"
            id="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 75+ QA test data generators... (Ctrl+K)"
            className="w-full bg-gray-50 hover:bg-gray-100/80 dark:bg-[#0B0F1A] dark:hover:bg-[#0B0F1A]/80 focus:bg-white dark:focus:bg-[#0B0F1A] pl-10 pr-12 py-1.5 text-sm rounded-xl border border-gray-200 dark:border-white/10 focus:border-indigo-500 dark:focus:border-indigo-500/85 focus:outline-none transition duration-200 text-gray-900 dark:text-slate-200 placeholder-gray-400 dark:placeholder-slate-500 shadow-inner"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <LucideIcon name="X" size={14} />
            </button>
          ) : (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-slate-500 bg-gray-150 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                ⌘K
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Tools & Actions */}
      <div className="flex items-center gap-2">
        {/* Shortcut Legend Button */}
        <button
          onClick={() => setShowShortcutModal(true)}
          className="p-2 rounded-xl text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition"
          title="Keyboard Shortcuts"
          id="btn-shortcuts-guide"
        >
          <LucideIcon name="Keyboard" size={18} />
        </button>

        {/* Live Dev Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-[#0F172A] text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-white/5 rounded-xl text-xs font-semibold select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          SERVER ACTIVE
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <AnimatePresence>
        {showShortcutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShortcutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/10 rounded-2xl max-w-md w-full shadow-2xl p-6 text-gray-900 dark:text-slate-200 pointer-events-auto"
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-500/20">
                    <LucideIcon name="Keyboard" size={18} />
                  </div>
                  <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
                </div>
                <button
                  onClick={() => setShowShortcutModal(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
                >
                  <LucideIcon name="X" size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Focus Search Bar</span>
                  <kbd className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-mono text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                    Ctrl + K
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Clear Console Output</span>
                  <kbd className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-mono text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                    Ctrl + L
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5">
                  <span className="text-sm font-medium text-gray-600 dark:text-slate-400">Copy Console Text</span>
                  <kbd className="inline-flex items-center gap-0.5 px-2 py-1 text-xs font-mono text-gray-500 dark:text-slate-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-md">
                    Ctrl + C
                  </kbd>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                <button
                  onClick={() => setShowShortcutModal(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition shadow-md hover:shadow-lg shadow-indigo-500/10 cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
