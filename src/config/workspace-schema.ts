/**
 * Workspace Schema
 * Combines canvas layout, theme, and navigation into switchable workspaces
 */

import type { CanvasLayout } from "./canvas-layout";
import type { ThemeConfig } from "./theme-schema";
import type { SidebarConfig } from "./navigation-schema";

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  /** Emoji or icon name */
  icon?: string;
  createdAt: string;
  updatedAt: string;

  /** Dashboard layout for this workspace */
  canvasLayout: CanvasLayout;
  /** Optional theme overrides (merged with global theme) */
  themeOverride?: Partial<ThemeConfig>;
  /** Sidebar configuration for this workspace */
  sidebarConfig: SidebarConfig;

  /** Default role when entering this workspace */
  defaultRole: string;
  /** Whether focus mode is enabled */
  focusModeEnabled: boolean;
}

export interface UserPreferences {
  version: "1.0";
  /** Currently active workspace ID */
  activeWorkspaceId: string;
  /** All saved workspaces */
  workspaces: Workspace[];
  /** Global theme (workspaces can override) */
  globalTheme: ThemeConfig;
  /** Recent command palette searches */
  commandPaletteHistory: string[];
  /** Block IDs minimized to command palette */
  minimizedBlocks: string[];
}

/** Storage keys for localStorage */
export const STORAGE_KEYS = {
  PREFERENCES: "kendraio:preferences",
  THEME_GLOBAL: "kendraio:theme:global",
  WORKSPACE_PREFIX: "kendraio:workspace:",
  CSS_SNIPPETS: "kendraio:cssSnippets",
} as const;

/** Create a new workspace */
export const createWorkspace = (
  name: string,
  canvasLayout: CanvasLayout,
  sidebarConfig: SidebarConfig,
  overrides?: Partial<Workspace>
): Workspace => ({
  id: crypto.randomUUID(),
  name,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  canvasLayout,
  sidebarConfig,
  defaultRole: "viewer",
  focusModeEnabled: false,
  ...overrides,
});

/** Create empty user preferences */
export const createDefaultPreferences = (
  globalTheme: ThemeConfig,
  defaultWorkspace: Workspace
): UserPreferences => ({
  version: "1.0",
  activeWorkspaceId: defaultWorkspace.id,
  workspaces: [defaultWorkspace],
  globalTheme,
  commandPaletteHistory: [],
  minimizedBlocks: [],
});
