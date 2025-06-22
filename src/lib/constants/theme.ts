//tema de cores da aplicação
export const colors = {
  primary: {
    50: '#F0F7FF',
    100: '#C2E0FF',
    200: '#99CCF3',
    300: '#66B2FF',
    400: '#3399FF',
    500: '#0D84FF', //main color 
    600: '#0066CC',
    700: '#0052A3',
    800: '#003380',
    900: '#001F4D',
  },
  secondary: {
    50: '#F5F5F5',
    100: '#EBEBEB',
    200: '#D6D6D6',
    300: '#C2C2C2',
    400: '#ADADAD',
    500: '#999999',
    600: '#757575',
    700: '#666666',
    800: '#333333',
    900: '#1A1A1A',
  },
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    800: '#FF8F00',
    900: '#FF6F00',
  },
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
  success: `linear-gradient(135deg, ${colors.success[400]} 0%, ${colors.success[600]} 100%)`,
  warning: `linear-gradient(135deg, ${colors.warning[400]} 0%, ${colors.warning[600]} 100%)`,
  error: `linear-gradient(135deg, ${colors.error[400]} 0%, ${colors.error[600]} 100%)`,
  dark: `linear-gradient(135deg, ${colors.neutral[700]} 0%, ${colors.neutral[900]} 100%)`,
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
};

export const spacing = {
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

export const fonts = {
  sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  display: 'var(--font-poppins), var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export const fontSizes = {
  xs: '0.75rem',
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
  '9xl': '8rem',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};

import { BadgeType } from "@prisma/client";

export const badgeTypes = {
  [BadgeType.STREAK]: {
    color: '#D97706', // Amber-600
    bg: '#FEF3C7',    // Amber-100
    iconBg: '#FDE68A', // Amber-200
    title: 'Conquistas de Sequência',
    emoji: '🔥',
    description: 'Desbloqueie estas conquistas mantendo sua presença por dias consecutivos'
  },
  [BadgeType.TOTAL_DAYS]: {
    color: '#059669', // Emerald-600
    bg: '#D1FAE5',    // Emerald-100
    iconBg: '#A7F3D0', // Emerald-200
    title: 'Conquistas de Total de Dias',
    emoji: '📆',
    description: 'Acumule dias de presença para ganhar estas conquistas'
  },
  [BadgeType.CONSISTENCY]: {
    color: '#7C3AED', // Violet-600
    bg: '#EDE9FE',    // Violet-100
    iconBg: '#DDD6FE', // Violet-200
    title: 'Conquistas de Consistência',
    emoji: '⏱️',
    description: 'Mantenha uma rotina consistente para desbloquear estas conquistas'
  },
  [BadgeType.SPECIAL]: {
    color: '#DB2777', // Pink-600
    bg: '#FCE7F3',    // Pink-100
    iconBg: '#FBCFE8', // Pink-200
    title: 'Conquistas Especiais',
    emoji: '✨',
    description: 'Conquistas únicas por ações e momentos especiais'
  }
} as const; 