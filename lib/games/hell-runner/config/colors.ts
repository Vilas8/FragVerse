/**
 * Modern Color Theme for Hell Runner
 * Features: Neon aesthetic with deep purples and cyan accents
 */

export const THEME = {
  // Core background
  background: '#0A0410',      // Deep dark purple-black
  surface: '#1A0F2E',         // Dark blue-purple
  primary: '#2A1B3D',         // Medium purple
  secondary: '#1F1633',       // Slightly lighter dark

  // Neon accent colors
  cyan: '#00D9FF',            // Bright cyan
  pink: '#FF006E',            // Hot pink
  green: '#00F5A0',           // Neon green
  orange: '#FF8C42',          // Warm orange
  purple: '#A855F7',          // Vibrant purple
  blue: '#3B82F6',            // Bright blue

  // UI Text
  text: '#F0F0F0',            // Off-white
  textSecondary: '#B0B0B0',   // Medium gray
  textTertiary: '#707070',    // Dark gray

  // UI Elements
  border: '#2A1B3D',          // Subtle borders
  borderLight: '#3A2B4D',     // Light borders
  shadow: 'rgba(0, 0, 0, 0.5)',

  // Status indicators
  success: '#00F5A0',         // Green success
  danger: '#FF006E',          // Pink danger
  warning: '#FF8C42',         // Orange warning
  info: '#00D9FF',            // Cyan info

  // Platform colors (visual variety)
  platformDefault: '#2A1B3D',
  platformHover: '#3A2B4D',
  platformActive: '#4A3B5D',

  // Entity colors
  player: '#00D9FF',
  enemy: '#FF006E',
  powerup: '#00F5A0',
  obstacle: '#FF8C42',
  door: '#A855F7',

  // UI Panel backgrounds
  panelBg: 'rgba(26, 15, 46, 0.8)',
  panelBorder: 'rgba(42, 27, 61, 0.5)',
} as const;

// Utility function for RGB values (for opacity control)
export const getRGB = (hexColor: string): [number, number, number] => {
  const hex = hexColor.replace('#', '');
  return [
    parseInt(hex.substring(0, 2), 16),
    parseInt(hex.substring(2, 4), 16),
    parseInt(hex.substring(4, 6), 16),
  ];
};

// Gradient definitions
export const GRADIENTS = {
  buttonPrimary: {
    start: '#00D9FF',
    end: '#00B8CC',
  },
  buttonDanger: {
    start: '#FF006E',
    end: '#CC0058',
  },
  panelBg: {
    start: 'rgba(26, 15, 46, 0.95)',
    end: 'rgba(42, 27, 61, 0.85)',
  },
} as const;
