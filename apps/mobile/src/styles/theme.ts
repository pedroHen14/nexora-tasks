export const lightTheme = {
  dark: false,
  colors: {
    primary: '#6C63FF',
    primaryLight: '#8B85FF',
    primaryDark: '#4A43CC',
    background: '#F5F5F5',
    card: '#FFFFFF',
    text: '#212121',
    textMuted: '#757575',
    border: '#E0E0E0',
    notification: '#F44336',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#F44336',
    surface: '#FFFFFF',
    onSurface: '#212121',
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: '#8B85FF',
    primaryLight: '#ABA6FF',
    primaryDark: '#6C63FF',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textMuted: '#9E9E9E',
    border: '#333333',
    notification: '#F44336',
    success: '#66BB6A',
    warning: '#FFA726',
    danger: '#EF5350',
    surface: '#2C2C2C',
    onSurface: '#FFFFFF',
  },
};

export type Theme = typeof lightTheme;
