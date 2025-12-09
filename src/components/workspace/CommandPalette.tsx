/**
 * Command Palette
 * Cmd+K modal for quick actions, search, and block restoration
 */

import * as React from "react";
import { Command } from "cmdk";
import {
  Search,
  LayoutDashboard,
  Palette,
  FolderOpen,
  Settings,
  Maximize2,
  Plus,
  Moon,
  Sun,
} from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
  onOpenThemeStudio?: () => void;
  onOpenBlockPalette?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onNavigate,
  onOpenThemeStudio,
  onOpenBlockPalette,
}: CommandPaletteProps) {
  const [search, setSearch] = React.useState("");

  const workspaces = usePreferencesStore((s) => s.workspaces);
  const activeWorkspaceId = usePreferencesStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = usePreferencesStore((s) => s.setActiveWorkspace);
  const getCurrentWorkspace = usePreferencesStore((s) => s.getCurrentWorkspace);
  const toggleBlockMinimized = usePreferencesStore((s) => s.toggleBlockMinimized);
  const addToCommandHistory = usePreferencesStore((s) => s.addToCommandHistory);
  const commandPaletteHistory = usePreferencesStore((s) => s.commandPaletteHistory);

  const workspace = getCurrentWorkspace();
  const minimizedBlocks = workspace?.canvasLayout.blocks.filter((b) => b.isMinimized) || [];

  // Handle keyboard shortcut
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (value: string) => {
    addToCommandHistory(value);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
    >
      <div>
        <Command
          className="w-full max-w-lg bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden"
          shouldFilter={true}
        >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-500" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 outline-none text-sm"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs text-slate-500 bg-slate-800 rounded">
            esc
          </kbd>
        </div>

        {/* Command list */}
        <Command.List className="max-h-[300px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-slate-500">
            No results found.
          </Command.Empty>

          {/* Recent searches */}
          {commandPaletteHistory.length > 0 && search === "" && (
            <Command.Group heading="Recent">
              {commandPaletteHistory.slice(0, 3).map((item) => (
                <Command.Item
                  key={item}
                  value={item}
                  onSelect={handleSelect}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{item}</span>
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Navigation */}
          <Command.Group heading="Navigation">
            <Command.Item
              value="dashboard"
              onSelect={() => {
                handleSelect("Go to Dashboard");
                onNavigate?.("/dashboard");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
            >
              <LayoutDashboard className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Go to Dashboard</span>
            </Command.Item>
            <Command.Item
              value="flows"
              onSelect={() => {
                handleSelect("Go to Flows");
                onNavigate?.("/flows");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
            >
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">Go to Flows</span>
            </Command.Item>
            <Command.Item
              value="settings"
              onSelect={() => {
                handleSelect("Open Settings");
                onNavigate?.("/settings");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="text-sm">Open Settings</span>
            </Command.Item>
          </Command.Group>

          {/* Actions */}
          <Command.Group heading="Actions">
            <Command.Item
              value="add block"
              onSelect={() => {
                handleSelect("Add Block");
                onOpenBlockPalette?.();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span className="text-sm">Add Block to Canvas</span>
            </Command.Item>
            <Command.Item
              value="theme studio"
              onSelect={() => {
                handleSelect("Open Theme Studio");
                onOpenThemeStudio?.();
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
            >
              <Palette className="w-4 h-4 text-violet-400" />
              <span className="text-sm">Open Theme Studio</span>
            </Command.Item>
          </Command.Group>

          {/* Workspaces */}
          {workspaces.length > 1 && (
            <Command.Group heading="Switch Workspace">
              {workspaces.map((ws) => (
                <Command.Item
                  key={ws.id}
                  value={`workspace ${ws.name}`}
                  onSelect={() => {
                    handleSelect(`Switch to ${ws.name}`);
                    setActiveWorkspace(ws.id);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
                >
                  <span className="text-lg">{ws.icon || "📁"}</span>
                  <span className="text-sm">{ws.name}</span>
                  {ws.id === activeWorkspaceId && (
                    <span className="ml-auto text-xs text-cyan-400">Active</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>
          )}

          {/* Minimized blocks */}
          {minimizedBlocks.length > 0 && (
            <Command.Group heading="Minimized Blocks">
              {minimizedBlocks.map((block) => (
                <Command.Item
                  key={block.id}
                  value={`restore ${block.title || block.componentType || block.type}`}
                  onSelect={() => {
                    handleSelect(`Restore ${block.title || block.componentType}`);
                    toggleBlockMinimized(block.id);
                  }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-slate-300 hover:bg-slate-800 aria-selected:bg-slate-800"
                >
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span className="text-sm">
                    Restore: {block.title || block.componentType || block.type}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          )}
        </Command.List>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-slate-700/50 text-xs text-slate-500 flex items-center gap-4">
          <span>
            <kbd className="px-1.5 py-0.5 bg-slate-800/80 rounded">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-slate-800/80 rounded">↵</kbd> select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 bg-slate-800/80 rounded">esc</kbd> close
          </span>
        </div>
        </Command>
      </div>
    </div>
  );
}
