/**
 * Wapn theme constants.
 *
 * Color palette inspired by Mi'kma'ki — forest greens, earth tones,
 * ocean blues, and birchbark whites.
 */

import { Platform } from 'react-native';

/** Wapn brand green — forest canopy */
const brand = '#1a5c2e';
/** Accent gold — sweetgrass / sunrise */
const accent = '#d4a03c';

const tintColorLight = brand;
const tintColorDark = '#4ade80';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fafaf8',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    brand,
    accent,
    card: '#ffffff',
    border: '#e5e5e5',
    success: '#22c55e',
    error: '#ef4444',
    xp: accent,
  },
  dark: {
    text: '#ECEDEE',
    background: '#0f1512',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    brand: '#4ade80',
    accent: '#fbbf24',
    card: '#1c2420',
    border: '#2d3a33',
    success: '#4ade80',
    error: '#f87171',
    xp: '#fbbf24',
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
