export interface GeneratorItem {
  id: string;
  name: string;
  label: string;
  endpoint: string; // Endpoint to trigger, e.g. "/api/generate/user" or "/api/generate/boundary/char100"
  description: string;
  categoryKey: string;
  isQuickAction?: boolean;
}

export interface GeneratorCategory {
  key: string;
  title: string;
  description: string;
  iconName: string; // Mapping to Lucide icons
  items: GeneratorItem[];
}

export interface GeneratedResult {
  data: any;
  rawText: string;
  format: 'json' | 'xml' | 'yaml' | 'csv' | 'text';
  timestamp: string;
  generatorName: string;
  endpoint: string;
}

export interface HistoryItem {
  id: string;
  generatorName: string;
  categoryTitle: string;
  timestamp: string;
  data: any;
  rawText: string;
  format: 'json' | 'xml' | 'yaml' | 'csv' | 'text';
}
