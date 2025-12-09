/**
 * Block Context Menu
 * Right-click menu for canvas blocks with common actions
 */

import * as React from "react";
import {
  Lock,
  Unlock,
  Minimize2,
  Maximize2,
  Trash2,
  Copy,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";

interface ContextMenuPosition {
  x: number;
  y: number;
}

interface BlockContextMenuProps {
  isOpen: boolean;
  position: ContextMenuPosition;
  blockId: string;
  blockTitle: string;
  isLocked: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onLockToggle: () => void;
  onMinimizeToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSettings?: () => void;
}

export function BlockContextMenu({
  isOpen,
  position,
  blockTitle,
  isLocked,
  isMinimized,
  onClose,
  onLockToggle,
  onMinimizeToggle,
  onDuplicate,
  onDelete,
  onSettings,
}: BlockContextMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Adjust position to stay within viewport
  const adjustedPosition = React.useMemo(() => {
    const menuWidth = 200;
    const menuHeight = 260;
    const padding = 8;

    let x = position.x;
    let y = position.y;

    if (typeof window !== "undefined") {
      if (x + menuWidth > window.innerWidth - padding) {
        x = window.innerWidth - menuWidth - padding;
      }
      if (y + menuHeight > window.innerHeight - padding) {
        y = window.innerHeight - menuHeight - padding;
      }
    }

    return { x, y };
  }, [position]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl py-2 min-w-[200px]"
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
    >
      {/* Header */}
      <div className="px-3 py-2 border-b border-slate-700/50">
        <p className="text-xs text-slate-400 uppercase tracking-wider">Block</p>
        <p className="text-sm text-slate-200 font-medium truncate">{blockTitle}</p>
      </div>

      {/* Actions */}
      <div className="py-1">
        <ContextMenuItem
          icon={isLocked ? Unlock : Lock}
          label={isLocked ? "Unlock Block" : "Lock Block"}
          shortcut="⌘L"
          onClick={() => {
            onLockToggle();
            onClose();
          }}
        />

        <ContextMenuItem
          icon={isMinimized ? Maximize2 : Minimize2}
          label={isMinimized ? "Restore Block" : "Minimize Block"}
          shortcut="⌘M"
          onClick={() => {
            onMinimizeToggle();
            onClose();
          }}
        />

        <div className="h-px bg-slate-700/50 my-1" />

        <ContextMenuItem
          icon={Copy}
          label="Duplicate"
          shortcut="⌘D"
          onClick={() => {
            onDuplicate();
            onClose();
          }}
        />

        {onSettings && (
          <ContextMenuItem
            icon={Settings}
            label="Block Settings"
            hasSubmenu
            onClick={() => {
              onSettings();
              onClose();
            }}
          />
        )}

        <div className="h-px bg-slate-700/50 my-1" />

        <ContextMenuItem
          icon={Trash2}
          label="Delete Block"
          shortcut="⌫"
          destructive
          onClick={() => {
            onDelete();
            onClose();
          }}
        />
      </div>
    </div>
  );
}

// Helper component for menu items
interface ContextMenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut?: string;
  hasSubmenu?: boolean;
  destructive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function ContextMenuItem({
  icon: Icon,
  label,
  shortcut,
  hasSubmenu,
  destructive,
  disabled,
  onClick,
}: ContextMenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
        destructive
          ? "text-red-400 hover:bg-red-500/10"
          : "text-slate-300 hover:bg-slate-800",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left">{label}</span>
      {shortcut && (
        <span className="text-xs text-slate-500">{shortcut}</span>
      )}
      {hasSubmenu && (
        <ChevronRight className="w-4 h-4 text-slate-500" />
      )}
    </button>
  );
}

// Hook for managing context menu state
export function useContextMenu() {
  const [contextMenu, setContextMenu] = React.useState<{
    isOpen: boolean;
    position: ContextMenuPosition;
    blockId: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    blockId: "",
  });

  const openContextMenu = React.useCallback(
    (e: React.MouseEvent, blockId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        isOpen: true,
        position: { x: e.clientX, y: e.clientY },
        blockId,
      });
    },
    []
  );

  const closeContextMenu = React.useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    contextMenu,
    openContextMenu,
    closeContextMenu,
  };
}
