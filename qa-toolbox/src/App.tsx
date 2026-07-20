/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GeneratorCard } from './components/GeneratorCard';
import { CategoryCard } from './components/CategoryCard';
import { OutputPanel } from './components/OutputPanel';
import { ToastNotification } from './components/ToastNotification';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { CATEGORIES } from './data';
import { LucideIcon } from './components/LucideIcon';
import { ExploreModuleGuide } from './components/ExploreModuleGuide';
import { motion } from 'motion/react';

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  useKeyboardShortcuts();
  const { activeCategory, setActiveCategory, searchQuery, setSearchQuery, favorites, recentlyUsed, generateData, clearRecentlyUsed } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Filter items globally based on search query
  const allGenerators = CATEGORIES.flatMap(cat => cat.items);
  
  const searchResults = searchQuery
    ? allGenerators.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const activeCategoryData = CATEGORIES.find(c => c.key === activeCategory);

  // Filter items by selected category
  const getCategoryItems = () => {
    if (activeCategory === 'favorites') {
      return allGenerators.filter(item => favorites.includes(item.id));
    }
    if (activeCategoryData) {
      return activeCategoryData.items;
    }
    return [];
  };

  const categoryItems = getCategoryItems();

  // Get recently used generator details
  const recentGenerators = allGenerators.filter(item => recentlyUsed.includes(item.id));

  return (
    <div className="min-h-screen bg-gray-50/55 dark:bg-[#0B0F1A] text-gray-900 dark:text-slate-200 flex flex-col transition-colors duration-250 font-sans selection:bg-indigo-600/10 selection:text-indigo-600 dark:selection:bg-indigo-500/20">
      {/* Dynamic Toast Layer */}
      <ToastNotification />

      {/* Navigation Header */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

      {/* Main Page Layout Container */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto relative min-h-0">
        
        {/* Sidebar Left Component */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Center Grid + Console Right Layout */}
        <main className="flex-1 p-4 lg:p-7 overflow-y-auto max-h-[calc(100vh-4rem)] custom-scrollbar">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-7 items-start">
            
            {/* Left/Middle Column - Generators Selection (8 columns on XL) */}
            <div className="xl:col-span-7 space-y-6 lg:space-y-7">
              
              {/* Search Results Override */}
              {searchQuery ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Search Results
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                        Found {searchResults.length} matching generators for "{searchQuery}"
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>

                  {searchResults.length === 0 ? (
                    <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center border dark:border-white/5">
                        <LucideIcon name="Search" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-950 dark:text-white">No matches found</h4>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                          Try searching for keywords like "sql", "xss", "uuid", "password", "xml", "json", "visa", or "address".
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {searchResults.map(item => (
                        <GeneratorCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Navigation Views */
                <>
                  {/* CASE 1: HomePage / All Generators */}
                  {activeCategory === 'all' && (
                    <div className="space-y-6 lg:space-y-8">
                      {/* Hero banner */}
                      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 lg:p-8 shadow-xl border border-indigo-500/20">
                        {/* Decorative background grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/20 rounded-full filter blur-2xl"></div>
                        
                        <div className="relative space-y-4 max-w-lg">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm">
                            <LucideIcon name="Sparkles" size={10} /> Live sandbox environment
                          </span>
                          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                            QA Toolbox
                          </h1>
                          <p className="text-xs lg:text-sm text-indigo-100/90 leading-relaxed font-normal">
                            Generate realistic, high-quality testing datasets, extreme boundary values, and active security payload lists instantly with one click. 
                          </p>
                          <div className="flex gap-4 pt-2 text-[11px] font-semibold text-indigo-100">
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> 75+ Generators</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 8 Categories</span>
                            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> No DB Required</span>
                          </div>
                        </div>
                      </div>

                      {/* Recently Used Widgets */}
                      {recentGenerators.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                              <LucideIcon name="History" size={15} className="text-indigo-500" />
                              <h3 className="font-bold text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                                Recently Executed
                              </h3>
                            </div>
                            <button
                              onClick={clearRecentlyUsed}
                              className="text-[10px] text-gray-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-450 font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Clear recently executed list"
                            >
                              <LucideIcon name="Trash2" size={12} />
                              Clear
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {recentGenerators.map(item => (
                              <button
                                key={item.id}
                                onClick={() => generateData(item)}
                                className="p-3 bg-white hover:bg-gray-50 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10 rounded-xl text-left cursor-pointer transition flex items-center justify-between group"
                              >
                                <span className="text-xs font-semibold text-gray-800 dark:text-slate-300 truncate group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors pr-2">
                                  {item.label}
                                </span>
                                <LucideIcon name="ChevronRight" size={12} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bento categories grid */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                          <LucideIcon name="Compass" size={15} className="text-indigo-500" />
                          <h3 className="font-bold text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                            Explore Modules
                          </h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
                          {CATEGORIES.map(category => (
                            <CategoryCard key={category.key} category={category} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: Starred Favorites Page */}
                  {activeCategory === 'favorites' && (
                    <div className="space-y-6">
                      <div className="pb-3 border-b border-gray-200 dark:border-white/10">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                          <LucideIcon name="Star" className="text-amber-500 fill-amber-500/10" size={20} />
                          Starred Favorites
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Your custom selected generator shortcuts for instant dashboard access
                        </p>
                      </div>

                      {favorites.length === 0 ? (
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4">
                          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-white/5 text-amber-500 dark:text-amber-400/80 flex items-center justify-center border border-amber-150/30 dark:border-white/5">
                            <LucideIcon name="Star" size={24} className="fill-amber-500/10" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-gray-950 dark:text-white">Favorites list is empty</h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
                              Star any generator tile throughout the modules to see it pop up here for easy access.
                            </p>
                          </div>
                          <button
                            onClick={() => setActiveCategory('all')}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition"
                          >
                            Explore Generators
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {categoryItems.map(item => (
                            <GeneratorCard key={item.id} item={item} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CASE 3: History Log Page */}
                  {activeCategory === 'history' && (
                    <div className="space-y-6">
                      <div className="pb-3 border-b border-gray-200 dark:border-white/10">
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                          <LucideIcon name="History" className="text-emerald-500" size={20} />
                          Generation Session Logs
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                          Audit history of generated test data from your current session (caches up to 50 runs)
                        </p>
                      </div>

                      <div className="bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-white/5 rounded-2xl p-6">
                        <OutputPanel />
                      </div>
                    </div>
                  )}

                  {/* CASE 4: Standard Categories (e.g. User Data, Security) */}
                  {activeCategoryData && (
                    <div className="space-y-6">
                      <div className="pb-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border dark:border-indigo-500/20">
                              <LucideIcon name={activeCategoryData.iconName} size={18} />
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                              {activeCategoryData.title}
                            </h2>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
                            {activeCategoryData.description}
                          </p>
                        </div>
                        <span className="text-xs font-bold bg-gray-100 dark:bg-indigo-500/10 px-3 py-1 rounded-xl text-gray-500 dark:text-indigo-400 border border-gray-200/40 dark:border-indigo-500/20 select-none">
                          {categoryItems.length} Generators
                        </span>
                      </div>

                      {/* Dynamic use cases & circumstances guide */}
                      <ExploreModuleGuide categoryKey={activeCategoryData.key} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoryItems.map(item => (
                          <GeneratorCard key={item.id} item={item} />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right Column - Output Console (5 columns on XL) */}
            <div className="xl:col-span-5 sticky top-24 self-start">
              {/* Output terminal container only visible if we are not on the full history page to avoid redundancy */}
              {activeCategory !== 'history' && (
                <OutputPanel />
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Modern high contrast footer */}
      <footer className="shrink-0 bg-white dark:bg-[#0F172A] border-t border-gray-200/80 dark:border-white/5 py-5 px-6 text-center text-xs text-gray-450 dark:text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 dark:text-slate-400">QA Toolbox</span>
          <span>•</span>
          <span>Designed with absolute layout precision</span>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><kbd className="px-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 rounded font-mono text-[10px]">Ctrl+K</kbd> Search</span>
          <span className="flex items-center gap-1"><kbd className="px-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 rounded font-mono text-[10px]">Ctrl+L</kbd> Clear</span>
          <span className="flex items-center gap-1"><kbd className="px-1 bg-gray-100 dark:bg-white/5 border dark:border-white/10 rounded font-mono text-[10px]">Ctrl+C</kbd> Copy</span>
        </div>
      </footer>
    </div>
  );
}
