/**
 * Workspace Switcher
 * Dropdown component for switching between workspaces
 */

import * as React from "react";
import {
  ChevronDown,
  Plus,
  Copy,
  Trash2,
  Check,
  FolderOpen,
} from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import { createWorkspace } from "../../config/workspace-schema";
import { createEmptyCanvasLayout } from "../../config/canvas-layout";
import { defaultSidebarConfig } from "../../config/navigation-schema";

interface WorkspaceSwitcherProps {
  className?: string;
}

export function WorkspaceSwitcher({ className = "" }: WorkspaceSwitcherProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const workspaces = usePreferencesStore((s) => s.workspaces);
  const activeWorkspaceId = usePreferencesStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = usePreferencesStore((s) => s.setActiveWorkspace);
  const addWorkspace = usePreferencesStore((s) => s.addWorkspace);
  const duplicateWorkspace = usePreferencesStore((s) => s.duplicateWorkspace);
  const deleteWorkspace = usePreferencesStore((s) => s.deleteWorkspace);

  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCreateWorkspace = () => {
    if (!newName.trim()) return;

    const newWorkspace = createWorkspace(
      newName.trim(),
      createEmptyCanvasLayout(),
      { ...defaultSidebarConfig, id: crypto.randomUUID() },
      { icon: "📁" }
    );

    addWorkspace(newWorkspace);
    setActiveWorkspace(newWorkspace.id);
    setNewName("");
    setIsCreating(false);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
      >
        <span className="text-lg">{activeWorkspace?.icon || "📁"}</span>
        <span className="text-sm text-slate-200 max-w-[120px] truncate">
          {activeWorkspace?.name || "Workspace"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Workspace list */}
          <div className="max-h-[240px] overflow-y-auto py-1">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className={`flex items-center gap-2 px-3 py-2 hover:bg-slate-800 cursor-pointer group ${
                  ws.id === activeWorkspaceId ? "bg-slate-800" : ""
                }`}
              >
                <button
                  onClick={() => {
                    setActiveWorkspace(ws.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <span className="text-lg">{ws.icon || "📁"}</span>
                  <span className="text-sm text-slate-200 truncate flex-1 text-left">
                    {ws.name}
                  </span>
                  {ws.id === activeWorkspaceId && (
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                  )}
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateWorkspace(ws.id);
                    }}
                    className="p-1 hover:bg-slate-700 rounded"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                  {workspaces.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteWorkspace(ws.id);
                      }}
                      className="p-1 hover:bg-red-900/50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700" />

          {/* Create new workspace */}
          {isCreating ? (
            <div className="p-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateWorkspace();
                  if (e.key === "Escape") setIsCreating(false);
                }}
                placeholder="Workspace name..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500"
                autoFocus
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={handleCreateWorkspace}
                  disabled={!newName.trim()}
                  className="flex-1 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 rounded text-sm text-white transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewName("");
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-slate-800 text-sm text-slate-300"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>New Workspace</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
