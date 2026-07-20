import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export function useKeyboardShortcuts() {
  const { currentResult, setCurrentResult, showToast } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Ctrl + K -> Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
          searchInput.focus();
          (searchInput as HTMLInputElement).select();
        }
      }

      // 2. Ctrl + L -> Clear Console
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setCurrentResult(null);
        showToast('Console cleared', 'info');
      }

      // 3. Ctrl + C -> Copy current result if no normal text is selected
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const selection = window.getSelection()?.toString();
        // Only run copy shortcut if user is not selecting anything on page manually
        if (!selection && currentResult) {
          e.preventDefault();
          navigator.clipboard.writeText(currentResult.rawText);
          showToast('Copied output to clipboard (Ctrl+C)', 'success');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentResult, setCurrentResult, showToast]);
}
