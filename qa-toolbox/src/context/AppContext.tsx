import React, { createContext, useContext, useState, useEffect } from 'react';
import { GeneratorItem, GeneratedResult, HistoryItem } from '../types';
import { CATEGORIES } from '../data';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  activeCategory: string; // 'all' | 'favorites' | 'history' | categoryKey
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[]; // generator IDs
  toggleFavorite: (id: string) => void;
  recentlyUsed: string[]; // generator IDs
  addRecentlyUsed: (id: string) => void;
  clearRecentlyUsed: () => void;
  currentResult: GeneratedResult | null;
  setCurrentResult: (result: GeneratedResult | null) => void;
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  generateData: (item: GeneratorItem, param?: string) => Promise<any>;
  isLoading: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state (default 'dark' is great for QA dashboard, but let's toggle beautifully)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('qa-toolbox-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<GeneratedResult | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('qa-toolbox-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Recently used state
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>(() => {
    const saved = localStorage.getItem('qa-toolbox-recent');
    return saved ? JSON.parse(saved) : [];
  });

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('qa-toolbox-history');
    return saved ? JSON.parse(saved) : [];
  });

  // Custom Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('qa-toolbox-theme', theme);
  }, [theme]);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('qa-toolbox-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Sync recently used
  useEffect(() => {
    localStorage.setItem('qa-toolbox-recent', JSON.stringify(recentlyUsed));
  }, [recentlyUsed]);

  // Sync history
  useEffect(() => {
    localStorage.setItem('qa-toolbox-history', JSON.stringify(history));
  }, [history]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const updated = isFav ? prev.filter(item => item !== id) : [...prev, id];
      const name = CATEGORIES.flatMap(c => c.items).find(i => i.id === id)?.label || 'Generator';
      showToast(isFav ? `Removed ${name} from Favorites` : `Added ${name} to Favorites`, 'success');
      return updated;
    });
  };

  const addRecentlyUsed = (id: string) => {
    setRecentlyUsed(prev => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 8); // Keep last 8
    });
  };

  const clearRecentlyUsed = () => {
    setRecentlyUsed([]);
    showToast('Recently executed list cleared', 'info');
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50 entries
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Generation history cleared', 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Main data generation function
  const generateData = async (item: GeneratorItem, param?: string) => {
    setIsLoading(true);
    try {
      let url = item.endpoint;
      if (param) {
        // Handle parameters like hashes/base64 where search terms or text can be appended
        url += `?param=${encodeURIComponent(param)}`;
      }

      // Fetch from Express Server
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Server returned code ${response.status}`);
      }

      const data = await response.json();

      // Format result beautifully
      let format: 'json' | 'xml' | 'yaml' | 'csv' | 'text' = 'json';
      let rawText = '';

      if (item.endpoint.includes('/api/generate/api/yaml')) {
        format = 'yaml';
        rawText = typeof data === 'string' ? data : data.value || JSON.stringify(data, null, 2);
      } else if (item.endpoint.includes('/api/generate/api/xml') || item.endpoint.includes('/api/generate/api/invalid_xml')) {
        format = 'xml';
        rawText = typeof data === 'string' ? data : data.value || JSON.stringify(data, null, 2);
      } else if (item.endpoint.includes('/api/generate/api/csv')) {
        format = 'csv';
        rawText = typeof data === 'string' ? data : data.value || JSON.stringify(data, null, 2);
      } else if (item.endpoint.includes('/api/generate/api/multipart') || item.endpoint.includes('/api/generate/api/invalid_json')) {
        format = 'text';
        rawText = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      } else if (typeof data === 'string') {
        format = 'text';
        rawText = data;
      } else {
        format = 'json';
        rawText = JSON.stringify(data, null, 2);
      }

      const result: GeneratedResult = {
        data,
        rawText,
        format,
        timestamp: new Date().toLocaleTimeString(),
        generatorName: item.label,
        endpoint: item.endpoint
      };

      setCurrentResult(result);
      addRecentlyUsed(item.id);
      
      // Find category title
      const cat = CATEGORIES.find(c => c.key === item.categoryKey);
      addToHistory({
        generatorName: item.label,
        categoryTitle: cat ? cat.title : 'General',
        data,
        rawText,
        format
      });

      showToast(`Generated: ${item.label}`, 'success');
      return data;
    } catch (err: any) {
      console.error(err);
      showToast(`Generation failed: ${err.message || 'Server error'}`, 'error');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        recentlyUsed,
        addRecentlyUsed,
        clearRecentlyUsed,
        currentResult,
        setCurrentResult,
        history,
        addToHistory,
        clearHistory,
        generateData,
        isLoading,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
