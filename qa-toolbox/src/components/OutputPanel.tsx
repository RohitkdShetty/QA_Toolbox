import React from 'react';
import { useApp } from '../context/AppContext';
import { LucideIcon } from './LucideIcon';
import { RealWorldIntegrationGuide } from './RealWorldIntegrationGuide';
import { motion, AnimatePresence } from 'motion/react';

// ============================================================================
// Robust Client-Side Format Converters
// ============================================================================

const convertToXML = (obj: any, rootName = 'root', indent = 0): string => {
  const spaces = ' '.repeat(indent);
  const escapeXml = (unsafe: string): string => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  if (obj === null || obj === undefined) {
    return `${spaces}<${rootName} />`;
  }

  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
      return obj; // Already XML
    }
    try {
      const parsed = JSON.parse(trimmed);
      return convertToXML(parsed, rootName, indent);
    } catch {
      return `${spaces}<${rootName}>${escapeXml(obj)}</${rootName}>`;
    }
  }

  if (typeof obj !== 'object') {
    return `${spaces}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return `${spaces}<${rootName} />`;
    }
    const itemTagName = rootName.endsWith('s') ? rootName.slice(0, -1) : 'item';
    let xml = '';
    obj.forEach(item => {
      xml += convertToXML(item, itemTagName, indent + 2) + '\n';
    });
    return `${spaces}<${rootName}>\n${xml}${spaces}</${rootName}>`;
  }

  let xml = '';
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const val = obj[key];
      const cleanKey = key.replace(/[^a-zA-Z0-9_.-]/g, '_');
      if (Array.isArray(val)) {
        if (val.length === 0) {
          xml += `${spaces}  <${cleanKey} />\n`;
        } else {
          xml += `${spaces}  <${cleanKey}>\n`;
          val.forEach(item => {
            xml += convertToXML(item, 'item', indent + 4) + '\n';
          });
          xml += `${spaces}  </${cleanKey}>\n`;
        }
      } else if (typeof val === 'object' && val !== null) {
        xml += convertToXML(val, cleanKey, indent + 2) + '\n';
      } else {
        xml += `${spaces}  <${cleanKey}>${escapeXml(String(val))}</${cleanKey}>\n`;
      }
    }
  }

  const cleanedXml = xml ? '\n' + xml + spaces : '';
  return `${spaces}<${rootName}>${cleanedXml}</${rootName}>`;
};

const convertToHTML = (obj: any): string => {
  if (obj === null || obj === undefined) return '';

  const escapeHtml = (unsafe: string): string => {
    return unsafe.replace(/[&<>"']/g, (m) => {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  };

  if (typeof obj === 'string') {
    const trimmed = obj.trim();
    if ((trimmed.startsWith('<table') || trimmed.startsWith('<div') || trimmed.startsWith('<p')) && trimmed.endsWith('>')) {
      return obj; // Already HTML
    }
    try {
      const parsed = JSON.parse(trimmed);
      return convertToHTML(parsed);
    } catch {
      return `<div class="p-4 bg-slate-900 rounded border border-white/5 font-mono text-xs text-slate-300">${escapeHtml(obj)}</div>`;
    }
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return '<p class="text-slate-500 italic p-4">Empty dataset</p>';
    }
    const first = obj[0];
    if (typeof first === 'object' && first !== null) {
      const keys = Object.keys(first);
      let html = '<div class="overflow-x-auto rounded-xl border border-white/10 my-2">\n';
      html += '  <table class="min-w-full divide-y divide-white/5 text-left text-[11px] font-sans">\n';
      html += '    <thead class="bg-white/5 text-slate-400 font-semibold">\n      <tr>\n';
      keys.forEach(k => {
        html += `        <th class="px-3 py-2 border-b border-white/10 text-slate-200">${escapeHtml(k)}</th>\n`;
      });
      html += '      </tr>\n    </thead>\n    <tbody class="divide-y divide-white/5">\n';
      obj.forEach((item: any, idx: number) => {
        html += `      <tr class="${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}">\n`;
        keys.forEach(k => {
          const val = item[k];
          const valStr = typeof val === 'object' ? JSON.stringify(val) : String(val);
          html += `        <td class="px-3 py-2 text-slate-300 font-mono">${escapeHtml(valStr)}</td>\n`;
        });
        html += '      </tr>\n';
      });
      html += '    </tbody>\n  </table>\n</div>';
      return html;
    } else {
      let html = '<ul class="list-disc pl-5 space-y-1 font-sans text-slate-300 my-2">\n';
      obj.forEach(item => {
        html += `  <li>${escapeHtml(String(item))}</li>\n`;
      });
      html += '</ul>';
      return html;
    }
  } else if (typeof obj === 'object') {
    let html = '<div class="overflow-x-auto rounded-xl border border-white/10 my-2">\n';
    html += '  <table class="min-w-full divide-y divide-white/5 text-left text-[11px] font-sans">\n';
    html += '    <thead class="bg-white/5 text-slate-400 font-semibold">\n      <tr>\n';
    html += '        <th class="px-3 py-2 border-b border-white/10 w-1/3 text-slate-200">Field</th>\n';
    html += '        <th class="px-3 py-2 border-b border-white/10 text-slate-200">Value</th>\n';
    html += '      </tr>\n    </thead>\n    <tbody class="divide-y divide-white/5">\n';
    let idx = 0;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        const valStr = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
        html += `      <tr class="${idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}">\n`;
        html += `        <td class="px-3 py-2 font-semibold text-slate-400">${escapeHtml(key)}</td>\n`;
        html += `        <td class="px-3 py-2 text-slate-300 font-mono whitespace-pre-wrap">${escapeHtml(valStr)}</td>\n`;
        html += '      </tr>\n';
        idx++;
      }
    }
    html += '  </tbody>\n</table>\n</div>';
    return html;
  }

  return `<p class="font-sans text-slate-300 p-4">${escapeHtml(String(obj))}</p>`;
};

const convertToText = (obj: any): string => {
  if (obj === null || obj === undefined) return '';

  if (typeof obj === 'string') {
    try {
      const parsed = JSON.parse(obj);
      return convertToText(parsed);
    } catch {
      return obj;
    }
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return 'Empty dataset';
    return obj.map((item, index) => {
      const header = `=== ITEM ${index + 1} ===`;
      const body = typeof item === 'object' && item !== null
        ? Object.entries(item).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`).join('\n')
        : String(item);
      return `${header}\n${body}`;
    }).join('\n\n');
  } else if (typeof obj === 'object') {
    return Object.entries(obj).map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v, null, 2) : v}`).join('\n');
  }

  return String(obj);
};

// ============================================================================
// OutputPanel React Component
// ============================================================================

export const OutputPanel: React.FC = () => {
  const { currentResult, setCurrentResult, isLoading, history, clearHistory, generateData, showToast } = useApp();

  const [selectedFormat, setSelectedFormat] = React.useState<'json' | 'xml' | 'html' | 'text'>('json');
  const [htmlMode, setHtmlMode] = React.useState<'rendered' | 'code'>('rendered');

  // Automatically reset/sync format when a new currentResult is set
  React.useEffect(() => {
    if (currentResult) {
      if (['json', 'xml', 'html', 'text'].includes(currentResult.format)) {
        setSelectedFormat(currentResult.format as any);
      } else {
        setSelectedFormat('json');
      }
    }
  }, [currentResult]);

  const getFormattedContent = () => {
    if (!currentResult) return '';
    const data = currentResult.data;
    if (!data) return currentResult.rawText;

    switch (selectedFormat) {
      case 'json':
        return typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
      case 'xml':
        return convertToXML(data, 'root');
      case 'html':
        return convertToHTML(data);
      case 'text':
        return convertToText(data);
      default:
        return currentResult.rawText;
    }
  };

  const handleCopy = () => {
    if (!currentResult) return;
    const content = getFormattedContent();
    navigator.clipboard.writeText(content);
    showToast(`Copied ${selectedFormat.toUpperCase()} to clipboard!`, 'success');
  };

  const handleDownloadActiveFormat = () => {
    if (!currentResult) return;
    
    const content = getFormattedContent();
    const ext = selectedFormat === 'text' ? 'txt' : selectedFormat;
    const mimeMap = {
      json: 'application/json',
      xml: 'application/xml',
      html: 'text/html',
      text: 'text/plain'
    };
    const mime = mimeMap[selectedFormat] || 'text/plain';
    const filename = `${currentResult.generatorName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_payload.${ext}`;

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'success');
  };

  const handleReloadHistory = (historyItem: typeof history[0]) => {
    setCurrentResult({
      data: historyItem.data,
      rawText: historyItem.rawText,
      format: historyItem.format,
      timestamp: new Date().toLocaleTimeString(),
      generatorName: historyItem.generatorName,
      endpoint: ''
    });
    showToast(`Loaded ${historyItem.generatorName} from history`, 'info');
  };

  const getFormatBadgeColor = (format: string) => {
    switch (format) {
      case 'json': return 'bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20';
      case 'xml': return 'bg-blue-100 dark:bg-indigo-500/10 text-blue-800 dark:text-indigo-400 border-blue-200/50 dark:border-indigo-500/20';
      case 'yaml': return 'bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-400 border-purple-200/50 dark:border-purple-500/20';
      case 'csv': return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20';
      default: return 'bg-gray-100 dark:bg-white/5 text-gray-850 dark:text-slate-300 border-gray-200/60 dark:border-white/10';
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      {/* 1. Terminal Console Panel */}
      <div className="flex-1 min-h-[350px] lg:h-0 bg-[#050810] text-slate-300 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
        {/* Console Header Bar */}
        <div className="px-4 py-3 bg-[#0B0F1A] border-b border-white/5 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/85"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/85"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/85"></span>
            <span className="text-[10px] text-slate-500 font-bold ml-2 tracking-wide uppercase">
              {currentResult ? currentResult.generatorName : 'CONSOLE OUTPUT'}
            </span>
          </div>

          {currentResult && (
            <div className="flex items-center gap-2">
              <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold ${getFormatBadgeColor(currentResult.format)}`}>
                {currentResult.format}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentResult.timestamp}
              </span>
            </div>
          )}
        </div>

        {/* Dynamic Format Selector Sub-Header */}
        {currentResult && (
          <div className="px-4 py-2 bg-[#0B0F1A]/80 border-b border-white/5 flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between text-[11px] select-none text-slate-400 font-sans shrink-0">
            <div className="flex gap-1 overflow-x-auto py-0.5 w-full sm:w-auto">
              {(['json', 'xml', 'html', 'text'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {
                    setSelectedFormat(fmt);
                    if (fmt === 'html') {
                      setHtmlMode('rendered');
                    }
                  }}
                  className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] tracking-wider transition cursor-pointer ${
                    selectedFormat === fmt
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/25'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {selectedFormat === 'html' && (
              <div className="flex bg-white/5 p-0.5 rounded-lg border border-white/5 font-bold text-[9px] uppercase tracking-wider">
                <button
                  onClick={() => setHtmlMode('rendered')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    htmlMode === 'rendered'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Rendered
                </button>
                <button
                  onClick={() => setHtmlMode('code')}
                  className={`px-2 py-0.5 rounded-md transition cursor-pointer ${
                    htmlMode === 'code'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Code
                </button>
              </div>
            )}
          </div>
        )}

        {/* Console Main Workspace */}
        <div className="flex-1 p-4 overflow-y-auto relative bg-[#050810]/95 custom-scrollbar min-h-[220px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-[#050810]/80 z-10"
              >
                <div className="flex flex-col items-center gap-3 font-mono">
                  <div className="w-7 h-7 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
                  <span className="text-[11px] text-slate-450 tracking-widest animate-pulse">GENERATING REAL-TIME DATA...</span>
                </div>
              </motion.div>
            ) : null}

            {!currentResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 shadow-lg">
                  <LucideIcon name="Terminal" size={26} className="text-indigo-400/80" />
                </div>
                <div className="space-y-1 max-w-xs">
                  <h5 className="font-bold text-slate-300 text-sm">No Active Output</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                    Select any generator from the left and click <b>Generate</b> to see formatted mock testing data instantly.
                  </p>
                </div>
                <button
                  onClick={() => generateData({
                    id: 'user-profile',
                    name: 'user-profile',
                    label: 'Generate User Profile',
                    endpoint: '/api/generate/user',
                    description: '',
                    categoryKey: 'user-data'
                  })}
                  className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[11px] rounded-xl border border-indigo-500/30 transition shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  ⚡ Generate Quick Profile
                </button>
              </motion.div>
            ) : selectedFormat === 'html' && htmlMode === 'rendered' ? (
              <motion.div
                key="rendered-html"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] leading-relaxed text-slate-300 h-full overflow-auto selection:bg-indigo-900/60 selection:text-white"
                dangerouslySetInnerHTML={{ __html: getFormattedContent() }}
              />
            ) : (
              <motion.pre
                key="output"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap select-text h-full selection:bg-indigo-900/60 selection:text-white"
              >
                {getFormattedContent()}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>

        {/* Console Action Bar */}
        <div className="px-4 py-2.5 bg-[#0B0F1A] border-t border-white/5 flex items-center justify-between shrink-0 select-none">
          {currentResult ? (
            <div className="flex gap-1.5 w-full justify-between items-center">
              <div className="flex gap-1.5">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg flex items-center gap-1.5 border border-white/5 transition cursor-pointer font-bold text-[10px]"
                  title={`Copy formatted ${selectedFormat.toUpperCase()} text (Ctrl+C)`}
                >
                  <LucideIcon name="Copy" size={12} />
                  COPY
                </button>
                <button
                  onClick={handleDownloadActiveFormat}
                  className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-lg flex items-center gap-1.5 border border-white/5 transition cursor-pointer font-bold text-[10px]"
                  title={`Download as .${selectedFormat === 'text' ? 'txt' : selectedFormat} file`}
                >
                  <LucideIcon name="Download" size={12} className={
                    selectedFormat === 'json' ? 'text-amber-500' :
                    selectedFormat === 'xml' ? 'text-blue-400' :
                    selectedFormat === 'html' ? 'text-emerald-400' : 'text-indigo-400'
                  } />
                  DOWNLOAD .{selectedFormat === 'text' ? 'TXT' : selectedFormat.toUpperCase()}
                </button>
              </div>

              <button
                onClick={() => setCurrentResult(null)}
                className="px-2.5 py-1.5 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg flex items-center gap-1.5 border border-white/5 transition cursor-pointer font-bold text-[10px]"
                title="Clear terminal (Ctrl+L)"
              >
                <LucideIcon name="Trash2" size={12} />
                CLEAR
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center w-full text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <LucideIcon name="Keyboard" size={12} /> Keyboard driven workflow
              </span>
              <span className="font-mono text-[9px] text-slate-600">v1.0.0</span>
            </div>
          )}
        </div>
      </div>

      {/* Integration recipes showcasing dynamic real-world examples */}
      {currentResult && (
        <RealWorldIntegrationGuide
          format={selectedFormat}
          generatorName={currentResult.generatorName}
        />
      )}

      {/* 2. History logs (Bottom Panel) */}
      <div className="bg-white dark:bg-[#0F172A] border border-gray-200/80 dark:border-white/5 rounded-2xl p-4 shadow-sm flex flex-col h-[280px]">
        <div className="flex justify-between items-center mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border dark:border-emerald-500/20">
              <LucideIcon name="History" size={14} />
            </div>
            <h5 className="font-bold text-sm text-gray-900 dark:text-white">Recent Console Runs</h5>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] font-bold text-gray-400 hover:text-rose-500 transition flex items-center gap-1 cursor-pointer"
            >
              <LucideIcon name="Trash2" size={11} />
              CLEAR RUNS
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <p className="text-[11px] text-gray-400 dark:text-slate-500 font-medium">Runs record empty</p>
              <p className="text-[9px] text-gray-450 dark:text-slate-600">Generated payloads are cached in session history here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/5">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleReloadHistory(item)}
                  className="py-2.5 px-1.5 flex items-center justify-between text-[11px] hover:bg-gray-50/60 dark:hover:bg-white/5 rounded-lg transition cursor-pointer group"
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="font-semibold text-gray-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.generatorName}
                    </span>
                    <span className="text-[9px] text-gray-400 dark:text-slate-500 truncate mt-0.5">
                      {item.categoryTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border uppercase font-bold scale-90 ${getFormatBadgeColor(item.format)}`}>
                      {item.format}
                    </span>
                    <span className="font-mono text-[9px] text-gray-400 dark:text-slate-500">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
