/**
 * Theme Injector Utility
 * Injects CSS variables and snippets into the document
 */

import type { ThemeConfig } from "../config/theme-schema";

const THEME_STYLE_ID = "kendraio-theme-variables";
const SNIPPETS_STYLE_PREFIX = "kendraio-snippet-";

/**
 * Convert theme config to CSS custom properties
 */
export function themeToCSSVariables(theme: ThemeConfig): string {
  return `
:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-background: ${theme.colors.background};
  --color-surface: ${theme.colors.surface};
  --color-text: ${theme.colors.text};
  --color-text-muted: ${theme.colors.textMuted};
  --color-border: ${theme.colors.border};
  --color-error: ${theme.colors.error};
  --color-warning: ${theme.colors.warning};
  --color-success: ${theme.colors.success};

  /* Typography */
  --font-family: ${theme.typography.fontFamily};
  --font-family-mono: ${theme.typography.fontFamilyMono};
  --font-size-base: ${theme.typography.baseFontSize}px;
  --line-height: ${theme.typography.lineHeight};
  --font-weight-normal: ${theme.typography.fontWeightNormal};
  --font-weight-medium: ${theme.typography.fontWeightMedium};
  --font-weight-bold: ${theme.typography.fontWeightBold};

  /* Borders */
  --border-radius: ${theme.borders.radius}px;
  --border-width: ${theme.borders.width}px;

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
}
`.trim();
}

/**
 * Inject theme CSS variables into the document
 */
export function injectTheme(theme: ThemeConfig): void {
  let styleElement = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = THEME_STYLE_ID;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = themeToCSSVariables(theme);
}

/**
 * Inject a CSS snippet into the document
 */
export function injectCSSSnippet(snippetId: string, code: string): void {
  const styleId = `${SNIPPETS_STYLE_PREFIX}${snippetId}`;
  let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.dataset.snippetId = snippetId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = code;
}

/**
 * Remove a CSS snippet from the document
 */
export function removeCSSSnippet(snippetId: string): void {
  const styleId = `${SNIPPETS_STYLE_PREFIX}${snippetId}`;
  const styleElement = document.getElementById(styleId);
  if (styleElement) {
    styleElement.remove();
  }
}

/**
 * Sync all CSS snippets with the document
 */
export function syncCSSSnippets(theme: ThemeConfig): void {
  // Remove all existing snippet styles
  const existingSnippets = document.querySelectorAll(`[id^="${SNIPPETS_STYLE_PREFIX}"]`);
  existingSnippets.forEach((el) => el.remove());

  // Add enabled snippets
  theme.cssSnippets
    .filter((snippet) => snippet.enabled)
    .forEach((snippet) => {
      injectCSSSnippet(snippet.id, snippet.code);
    });
}

/**
 * Remove all theme styles from the document
 */
export function removeAllThemeStyles(): void {
  const themeStyle = document.getElementById(THEME_STYLE_ID);
  if (themeStyle) {
    themeStyle.remove();
  }

  const snippetStyles = document.querySelectorAll(`[id^="${SNIPPETS_STYLE_PREFIX}"]`);
  snippetStyles.forEach((el) => el.remove());
}

/**
 * Apply full theme (variables + snippets)
 */
export function applyTheme(theme: ThemeConfig): void {
  injectTheme(theme);
  syncCSSSnippets(theme);
}
