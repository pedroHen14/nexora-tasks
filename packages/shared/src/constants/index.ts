export const APP_NAME = 'Nexora Tasks';
export const APP_VERSION = '1.0.0';

export const COLORS = {
  primary: '#6C63FF',
  primaryLight: '#8B85FF',
  primaryDark: '#4A43CC',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  info: '#2196F3',
  background: '#F5F5F5',
  backgroundDark: '#121212',
  card: '#FFFFFF',
  cardDark: '#1E1E1E',
  text: '#212121',
  textDark: '#FFFFFF',
  textMuted: '#757575',
  textMutedDark: '#9E9E9E',
  border: '#E0E0E0',
  borderDark: '#333333',
} as const;

export const CATEGORY_COLORS = [
  '#6C63FF',
  '#F44336',
  '#4CAF50',
  '#FF9800',
  '#2196F3',
  '#9C27B0',
  '#00BCD4',
  '#FF5722',
  '#795548',
  '#607D8B',
] as const;

export const DEFAULT_CATEGORIES = [
  { name: 'Trabalho', color: '#2196F3', icon: 'briefcase' },
  { name: 'Casa', color: '#4CAF50', icon: 'home' },
  { name: 'Estudos', color: '#9C27B0', icon: 'book' },
  { name: 'Pessoal', color: '#FF9800', icon: 'person' },
] as const;

export const REMINDER_OPTIONS = [
  { value: 'none', label: 'Sem lembrete' },
  { value: '5min', label: '5 minutos antes' },
  { value: '15min', label: '15 minutos antes' },
  { value: '30min', label: '30 minutos antes' },
  { value: '1hour', label: '1 hora antes' },
  { value: '1day', label: '1 dia antes' },
] as const;
