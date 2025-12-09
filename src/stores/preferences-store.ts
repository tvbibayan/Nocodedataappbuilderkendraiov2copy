/**
 * Preferences Store
 * Zustand store for managing user preferences, workspaces, and theme
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { CanvasLayout, CanvasBlock, Position } from "../config/canvas-layout";
import { createEmptyCanvasLayout } from "../config/canvas-layout";
import type { ThemeConfig } from "../config/theme-schema";
import { defaultTheme } from "../config/theme-schema";
import type { SidebarConfig, NavItem } from "../config/navigation-schema";
import { defaultSidebarConfig } from "../config/navigation-schema";
import type { Workspace, UserPreferences } from "../config/workspace-schema";
import { createWorkspace, STORAGE_KEYS } from "../config/workspace-schema";

interface PreferencesState extends UserPreferences {
  // Actions for workspaces
  setActiveWorkspace: (workspaceId: string) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => void;
  deleteWorkspace: (workspaceId: string) => void;
  duplicateWorkspace: (workspaceId: string) => void;

  // Actions for canvas layout
  updateCanvasLayout: (layout: CanvasLayout) => void;
  addBlock: (block: CanvasBlock) => void;
  updateBlock: (blockId: string, updates: Partial<CanvasBlock>) => void;
  removeBlock: (blockId: string) => void;
  moveBlock: (blockId: string, position: Position) => void;
  toggleBlockMinimized: (blockId: string) => void;
  toggleBlockLocked: (blockId: string) => void;

  // Actions for theme
  setGlobalTheme: (theme: ThemeConfig) => void;
  updateThemeColors: (colors: Partial<ThemeConfig["colors"]>) => void;
  updateThemeTypography: (typography: Partial<ThemeConfig["typography"]>) => void;
  addCSSSnippet: (name: string, code: string) => void;
  toggleCSSSnippet: (snippetId: string) => void;
  removeCSSSnippet: (snippetId: string) => void;

  // Actions for sidebar
  updateSidebarConfig: (config: SidebarConfig) => void;
  reorderSidebarItems: (items: NavItem[]) => void;
  toggleSidebarItem: (itemId: string, hidden: boolean) => void;
  addSidebarItem: (item: NavItem) => void;
  removeSidebarItem: (itemId: string) => void;

  // Actions for command palette
  addToCommandHistory: (query: string) => void;
  clearCommandHistory: () => void;

  // Minimized blocks
  minimizeBlock: (blockId: string) => void;
  restoreBlock: (blockId: string) => void;

  // Utilities
  getCurrentWorkspace: () => Workspace | undefined;
  exportPreferences: () => string;
  importPreferences: (json: string) => boolean;
  resetToDefaults: () => void;
}

// Create default workspace with starter blocks
const defaultCanvasLayout: CanvasLayout = {
  id: "default-layout",
  version: "1.0",
  gridColumns: 12,
  gap: 16,
  blocks: [
    // Stats row
    {
      id: "stat-1",
      type: "stat",
      position: { x: 0, y: 0, w: 3, h: 2 },
      isMinimized: false,
      isLocked: false,
      title: "Active Flows",
      props: { label: "Active Flows", value: "24", change: "+12% this week", color: "cyan" },
    },
    {
      id: "stat-2",
      type: "stat",
      position: { x: 3, y: 0, w: 3, h: 2 },
      isMinimized: false,
      isLocked: false,
      title: "Data Processed",
      props: { label: "Data Processed", value: "1.2M", change: "+8% this month", color: "emerald" },
    },
    {
      id: "stat-3",
      type: "stat",
      position: { x: 6, y: 0, w: 3, h: 2 },
      isMinimized: false,
      isLocked: false,
      title: "Performance",
      props: { label: "Performance", value: "98%", change: "+2% improvement", color: "violet" },
    },
    {
      id: "stat-4",
      type: "stat",
      position: { x: 9, y: 0, w: 3, h: 2 },
      isMinimized: false,
      isLocked: false,
      title: "Connections",
      props: { label: "Connections", value: "156", change: "+24 new", color: "amber" },
    },
    // Activity Timeline - spans 8 columns
    {
      id: "timeline-1",
      type: "component",
      componentType: "ActivityTimeline",
      position: { x: 0, y: 2, w: 8, h: 4 },
      isMinimized: false,
      isLocked: false,
      title: "Recent Activity",
      props: { color: "cyan" },
    },
    // Quick Actions - spans 4 columns
    {
      id: "actions-1",
      type: "component",
      componentType: "QuickActions",
      position: { x: 8, y: 2, w: 4, h: 4 },
      isMinimized: false,
      isLocked: false,
      title: "Quick Actions",
      props: { color: "violet" },
    },
  ],
};

const defaultWorkspace = createWorkspace(
  "My Workspace",
  defaultCanvasLayout,
  defaultSidebarConfig,
  { icon: "🚀", defaultRole: "viewer", description: "Your customizable dashboard" }
);

const initialState: UserPreferences = {
  version: "1.0",
  activeWorkspaceId: defaultWorkspace.id,
  workspaces: [defaultWorkspace],
  globalTheme: defaultTheme,
  commandPaletteHistory: [],
  minimizedBlocks: [],
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      // Workspace actions
      setActiveWorkspace: (workspaceId) =>
        set((state) => {
          state.activeWorkspaceId = workspaceId;
        }),

      addWorkspace: (workspace) =>
        set((state) => {
          state.workspaces.push(workspace);
        }),

      updateWorkspace: (workspaceId, updates) =>
        set((state) => {
          const index = state.workspaces.findIndex((w) => w.id === workspaceId);
          if (index !== -1) {
            state.workspaces[index] = {
              ...state.workspaces[index],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        }),

      deleteWorkspace: (workspaceId) =>
        set((state) => {
          if (state.workspaces.length > 1) {
            state.workspaces = state.workspaces.filter((w) => w.id !== workspaceId);
            if (state.activeWorkspaceId === workspaceId) {
              state.activeWorkspaceId = state.workspaces[0].id;
            }
          }
        }),

      duplicateWorkspace: (workspaceId) =>
        set((state) => {
          const original = state.workspaces.find((w) => w.id === workspaceId);
          if (original) {
            const duplicate = createWorkspace(
              `${original.name} (Copy)`,
              { ...original.canvasLayout, id: crypto.randomUUID() },
              { ...original.sidebarConfig, id: crypto.randomUUID() },
              {
                icon: original.icon,
                description: original.description,
                themeOverride: original.themeOverride,
                defaultRole: original.defaultRole,
                focusModeEnabled: original.focusModeEnabled,
              }
            );
            state.workspaces.push(duplicate);
          }
        }),

      // Canvas layout actions
      updateCanvasLayout: (layout) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.canvasLayout = layout;
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      addBlock: (block) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.canvasLayout.blocks.push(block);
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      updateBlock: (blockId, updates) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            const block = workspace.canvasLayout.blocks.find((b) => b.id === blockId);
            if (block) {
              Object.assign(block, updates);
              workspace.updatedAt = new Date().toISOString();
            }
          }
        }),

      removeBlock: (blockId) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.canvasLayout.blocks = workspace.canvasLayout.blocks.filter(
              (b) => b.id !== blockId
            );
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      moveBlock: (blockId, position) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            const block = workspace.canvasLayout.blocks.find((b) => b.id === blockId);
            if (block && !block.isLocked) {
              block.position = position;
              workspace.updatedAt = new Date().toISOString();
            }
          }
        }),

      toggleBlockMinimized: (blockId) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            const block = workspace.canvasLayout.blocks.find((b) => b.id === blockId);
            if (block) {
              block.isMinimized = !block.isMinimized;
              if (block.isMinimized) {
                state.minimizedBlocks.push(blockId);
              } else {
                state.minimizedBlocks = state.minimizedBlocks.filter(
                  (id) => id !== blockId
                );
              }
              workspace.updatedAt = new Date().toISOString();
            }
          }
        }),

      toggleBlockLocked: (blockId) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            const block = workspace.canvasLayout.blocks.find((b) => b.id === blockId);
            if (block) {
              block.isLocked = !block.isLocked;
              workspace.updatedAt = new Date().toISOString();
            }
          }
        }),

      // Theme actions
      setGlobalTheme: (theme) =>
        set((state) => {
          state.globalTheme = theme;
        }),

      updateThemeColors: (colors) =>
        set((state) => {
          state.globalTheme.colors = { ...state.globalTheme.colors, ...colors };
        }),

      updateThemeTypography: (typography) =>
        set((state) => {
          state.globalTheme.typography = {
            ...state.globalTheme.typography,
            ...typography,
          };
        }),

      addCSSSnippet: (name, code) =>
        set((state) => {
          state.globalTheme.cssSnippets.push({
            id: crypto.randomUUID(),
            name,
            code,
            enabled: true,
            createdAt: new Date().toISOString(),
          });
        }),

      toggleCSSSnippet: (snippetId) =>
        set((state) => {
          const snippet = state.globalTheme.cssSnippets.find(
            (s) => s.id === snippetId
          );
          if (snippet) {
            snippet.enabled = !snippet.enabled;
          }
        }),

      removeCSSSnippet: (snippetId) =>
        set((state) => {
          state.globalTheme.cssSnippets = state.globalTheme.cssSnippets.filter(
            (s) => s.id !== snippetId
          );
        }),

      // Sidebar actions
      updateSidebarConfig: (config) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.sidebarConfig = config;
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      reorderSidebarItems: (items) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.sidebarConfig.items = items;
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      toggleSidebarItem: (itemId, hidden) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            const item = workspace.sidebarConfig.items.find((i) => i.id === itemId);
            if (item) {
              item.isHidden = hidden;
              workspace.updatedAt = new Date().toISOString();
            }
          }
        }),

      addSidebarItem: (item) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.sidebarConfig.items.push(item);
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      removeSidebarItem: (itemId) =>
        set((state) => {
          const workspace = state.workspaces.find(
            (w) => w.id === state.activeWorkspaceId
          );
          if (workspace) {
            workspace.sidebarConfig.items = workspace.sidebarConfig.items.filter(
              (i) => i.id !== itemId
            );
            workspace.updatedAt = new Date().toISOString();
          }
        }),

      // Command palette actions
      addToCommandHistory: (query) =>
        set((state) => {
          if (!state.commandPaletteHistory.includes(query)) {
            state.commandPaletteHistory = [
              query,
              ...state.commandPaletteHistory.slice(0, 9),
            ];
          }
        }),

      clearCommandHistory: () =>
        set((state) => {
          state.commandPaletteHistory = [];
        }),

      // Minimized blocks
      minimizeBlock: (blockId) =>
        set((state) => {
          if (!state.minimizedBlocks.includes(blockId)) {
            state.minimizedBlocks.push(blockId);
          }
        }),

      restoreBlock: (blockId) =>
        set((state) => {
          state.minimizedBlocks = state.minimizedBlocks.filter(
            (id) => id !== blockId
          );
        }),

      // Utilities
      getCurrentWorkspace: () => {
        const state = get();
        return state.workspaces.find((w) => w.id === state.activeWorkspaceId);
      },

      exportPreferences: () => {
        const state = get();
        return JSON.stringify(
          {
            version: state.version,
            activeWorkspaceId: state.activeWorkspaceId,
            workspaces: state.workspaces,
            globalTheme: state.globalTheme,
            commandPaletteHistory: state.commandPaletteHistory,
            minimizedBlocks: state.minimizedBlocks,
          },
          null,
          2
        );
      },

      importPreferences: (json) => {
        try {
          const parsed = JSON.parse(json) as UserPreferences;
          if (parsed.version === "1.0") {
            set((state) => {
              state.activeWorkspaceId = parsed.activeWorkspaceId;
              state.workspaces = parsed.workspaces;
              state.globalTheme = parsed.globalTheme;
              state.commandPaletteHistory = parsed.commandPaletteHistory;
              state.minimizedBlocks = parsed.minimizedBlocks;
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      resetToDefaults: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),
    })),
    {
      name: STORAGE_KEYS.PREFERENCES,
    }
  )
);
