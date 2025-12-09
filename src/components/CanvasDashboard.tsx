/**
 * Canvas Dashboard
 * Living Canvas-based dashboard with drag-drop blocks, theme studio, and workspaces
 */

import * as React from "react";
import { Search, Bell, Plus, Palette, Command } from "lucide-react";
import { LivingCanvas, BlockPalette } from "./canvas";
import { ThemeStudio } from "./theme-studio";
import { CommandPalette, WorkspaceSwitcher } from "./workspace";
import { StatsCard } from "./StatsCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { QuickActions } from "./QuickActions";
import { usePreferencesStore } from "../stores/preferences-store";
import { applyTheme } from "../utils/theme-injector";
import { mockDashboardDataSource } from "../data/mock-dashboard-data-source";
import type { DashboardData } from "../data/dashboard-data-source";
import type { DashboardRole } from "../config/dashboard";

interface CanvasDashboardProps {
  onNavigateToFlows: () => void;
  initialRole?: DashboardRole;
}

const componentRegistry: Record<string, React.ComponentType<any>> = {
  ActivityTimeline,
  QuickActions,
  StatsCard,
};

export function CanvasDashboard({ onNavigateToFlows, initialRole = "viewer" }: CanvasDashboardProps) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = React.useState(false);
  const [isThemeStudioOpen, setIsThemeStudioOpen] = React.useState(false);
  const [isBlockPaletteOpen, setIsBlockPaletteOpen] = React.useState(false);
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [role, setRole] = React.useState<DashboardRole>(initialRole);

  const globalTheme = usePreferencesStore((s) => s.globalTheme);
  const getCurrentWorkspace = usePreferencesStore((s) => s.getCurrentWorkspace);

  const workspace = getCurrentWorkspace();

  React.useEffect(() => {
    applyTheme(globalTheme);
  }, [globalTheme]);

  React.useEffect(() => {
    let isMounted = true;
    mockDashboardDataSource
      .getDashboardData()
      .then((result) => {
        if (isMounted) setData(result);
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const componentPropsMap: Record<string, Record<string, unknown>> = {
    ActivityTimeline: { activities: data?.activities ?? [] },
    QuickActions: { onNewFlow: onNavigateToFlows },
  };

  const enhancedRegistry: Record<string, React.ComponentType<any>> = {};
  for (const [name, Component] of Object.entries(componentRegistry)) {
    const extraProps = componentPropsMap[name] || {};
    enhancedRegistry[name] = (props: any) => <Component {...extraProps} {...props} />;
  }

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-slate-100">
              {workspace?.name || "Canvas Dashboard"}
            </h1>
            <WorkspaceSwitcher />
          </div>

          <div className="flex items-center gap-3">
            {/* Role selector */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as DashboardRole)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="viewer">Viewer</option>
              <option value="analyst">Analyst</option>
              <option value="admin">Admin</option>
            </select>

            {/* Command palette trigger */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm text-slate-400 transition-colors"
            >
              <Command className="w-4 h-4" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs bg-slate-700 rounded">⌘K</kbd>
            </button>

            {/* Add block button */}
            <button
              onClick={() => setIsBlockPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg text-sm text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Block</span>
            </button>

            {/* Theme studio trigger */}
            <button
              onClick={() => setIsThemeStudioOpen(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-violet-400 transition-colors"
              title="Theme Studio"
            >
              <Palette className="w-5 h-5" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <LivingCanvas
          componentRegistry={enhancedRegistry}
          editable={true}
          className="min-h-full"
        />
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenThemeStudio={() => {
          setIsCommandPaletteOpen(false);
          setIsThemeStudioOpen(true);
        }}
        onOpenBlockPalette={() => {
          setIsCommandPaletteOpen(false);
          setIsBlockPaletteOpen(true);
        }}
      />

      <ThemeStudio
        isOpen={isThemeStudioOpen}
        onClose={() => setIsThemeStudioOpen(false)}
      />

      <BlockPalette
        isOpen={isBlockPaletteOpen}
        onClose={() => setIsBlockPaletteOpen(false)}
        availableComponents={Object.keys(componentRegistry)}
      />
    </div>
  );
}
