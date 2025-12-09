/**
 * Theme Schema
 * Defines design tokens for the Theme Studio
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  /** Base font size in pixels */
  baseFontSize: number;
  lineHeight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightBold: number;
}

export interface ThemeBorders {
  /** Border radius in pixels */
  radius: number;
  /** Border width in pixels */
  width: number;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface CSSSnippet {
  id: string;
  name: string;
  /** Raw CSS code */
  code: string;
  enabled: boolean;
  createdAt: string;
}

export type IconPack = "lucide" | "heroicons" | "phosphor" | "custom";

export interface ThemeConfig {
  id: string;
  name: string;
  version: "1.0";
  colors: ThemeColors;
  typography: ThemeTypography;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  cssSnippets: CSSSnippet[];
  iconPack: IconPack;
  /** Custom icon SVGs keyed by icon name */
  customIcons?: Record<string, string>;
}

/** Default dark theme matching current Kendraio styling */
export const defaultTheme: ThemeConfig = {
  id: "default-dark",
  name: "Kendraio Dark",
  version: "1.0",
  colors: {
    primary: "#06B6D4",      // cyan-500
    secondary: "#8B5CF6",    // violet-500
    accent: "#10B981",       // emerald-500
    background: "#0F172A",   // slate-950
    surface: "#1E293B",      // slate-800
    text: "#F1F5F9",         // slate-100
    textMuted: "#94A3B8",    // slate-400
    border: "#334155",       // slate-700
    error: "#EF4444",        // red-500
    warning: "#F59E0B",      // amber-500
    success: "#10B981",      // emerald-500
  },
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
    fontFamilyMono: "JetBrains Mono, Menlo, monospace",
    baseFontSize: 14,
    lineHeight: 1.5,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  borders: {
    radius: 8,
    width: 1,
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.3)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
  },
  cssSnippets: [],
  iconPack: "lucide",
};

/** Create a new CSS snippet */
export const createCSSSnippet = (
  name: string,
  code: string
): CSSSnippet => ({
  id: crypto.randomUUID(),
  name,
  code,
  enabled: true,
  createdAt: new Date().toISOString(),
});
