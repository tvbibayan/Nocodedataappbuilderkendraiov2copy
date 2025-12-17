/**
 * Canvas Block Component
 * Individual draggable/resizable block with toolbar and settings panel
 */

import * as React from "react";
import { GripVertical, Minimize2, Lock, Unlock, Trash2, Maximize2, Settings, Copy } from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import type { CanvasBlock } from "../../config/canvas-layout";
import { cn } from "../ui/utils";
import { TextBlock } from "./TextBlock";
import { EmbedBlock } from "./EmbedBlock";
import { BlockSettingsPanel } from "./BlockSettingsPanel";

interface CanvasBlockComponentProps {
  block: CanvasBlock;
  componentRegistry: Record<string, React.ComponentType<any>>;
  editable?: boolean;
  onClick?: () => void;
}

export function CanvasBlockComponent({
  block,
  componentRegistry,
  editable = true,
  onClick,
}: CanvasBlockComponentProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const toggleBlockMinimized = usePreferencesStore((s) => s.toggleBlockMinimized);
  const toggleBlockLocked = usePreferencesStore((s) => s.toggleBlockLocked);
  const removeBlock = usePreferencesStore((s) => s.removeBlock);
  const updateBlock = usePreferencesStore((s) => s.updateBlock);
  const duplicateBlock = usePreferencesStore((s) => s.duplicateBlock);

  // Render block content based on type
  const renderContent = () => {
    switch (block.type) {
      case "component": {
        const Component = block.componentType
          ? componentRegistry[block.componentType]
          : null;
        if (Component) {
          return <Component {...(block.props || {})} />;
        }
        return (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            Unknown component: {block.componentType}
          </div>
        );
      }
      case "stat":
        return (
          <div className="p-4 h-full flex flex-col justify-center">
            <div className="text-slate-400 text-sm mb-1">
              {(block.props?.label as string) || "Stat"}
            </div>
            <div className="text-2xl font-bold text-slate-100">
              {(block.props?.value as string) || "—"}
            </div>
            {block.props?.change ? (
              <div className={cn(
                "text-sm mt-1",
                String(block.props.change).startsWith("+") ? "text-emerald-400" : "text-slate-500"
              )}>
                {String(block.props.change)}
              </div>
            ) : null}
          </div>
        );
      case "text":
        return (
          <TextBlock
            content={(block.props?.content as string) || ""}
            onChange={(content) => updateBlock(block.id, { props: { ...block.props, content } })}
            editable={editable && !block.isLocked}
          />
        );
      case "embed":
        return (
          <EmbedBlock
            url={(block.props?.url as string) || ""}
            title={block.title}
            onUrlChange={(url) => updateBlock(block.id, { props: { ...block.props, url } })}
            editable={editable && !block.isLocked}
          />
        );
      case "container":
        return (
          <div className="p-4 text-slate-500 text-sm h-full flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg m-2">
            Drop blocks here
          </div>
        );
      default:
        return <div className="text-slate-500 p-4">Unknown block type</div>;
    }
  };

  // Color accent based on block type or props
  const accentColor = (block.props?.color as string) || "cyan";
  const accentClasses: Record<string, string> = {
    cyan: "border-l-cyan-500",
    emerald: "border-l-emerald-500",
    violet: "border-l-violet-500",
    amber: "border-l-amber-500",
    rose: "border-l-rose-500",
    blue: "border-l-blue-500",
  };

  // Shadow classes mapping
  const shadowClasses: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  // Compute custom styles from block.styles
  const styles = block.styles || {};
  const customStyle: React.CSSProperties = {
    ...(styles.backgroundColor && {
      backgroundColor: styles.backgroundColor,
      opacity: styles.backgroundOpacity !== undefined ? styles.backgroundOpacity / 100 : undefined,
    }),
    ...(styles.borderWidth !== undefined && { borderWidth: `${styles.borderWidth}px` }),
    ...(styles.borderColor && { borderColor: styles.borderColor }),
    ...(styles.borderRadius !== undefined && { borderRadius: `${styles.borderRadius}px` }),
    ...(styles.padding && {
      padding: `${styles.padding.top}px ${styles.padding.right}px ${styles.padding.bottom}px ${styles.padding.left}px`,
    }),
  };

  const shadowClass = shadowClasses[styles.shadow || "lg"] || "shadow-lg";

  return (
    <>
      <div
        className={cn(
          "canvas-block h-full rounded-xl border-l-4 border border-slate-600 bg-slate-800 relative overflow-hidden",
          shadowClass,
          accentClasses[accentColor] || "border-l-cyan-500",
          block.isLocked && "opacity-80",
          isExpanded && "fixed inset-4 z-50"
        )}
        style={customStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Block toolbar - inside the block at top */}
        {editable && isHovered && (
          <div
            className="absolute top-0 left-0 right-0 flex items-center gap-1 px-3 py-2 bg-slate-900 border-b border-slate-700 z-[1000]"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Drag handle */}
            <div className="block-drag-handle cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-700 rounded">
              <GripVertical className="w-4 h-4 text-slate-400" />
            </div>

            {/* Block title */}
            <span className="flex-1 text-sm text-slate-300 font-medium truncate px-2">
              {block.title || block.componentType || block.type}
            </span>

            {/* Toolbar buttons - larger and more visible */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsSettingsOpen(true); }}
              className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-slate-700 rounded transition-colors"
              title="Block Settings"
              type="button"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); duplicateBlock(block.id); }}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
              title="Duplicate"
              type="button"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}
              type="button"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBlockLocked(block.id); }}
              className={cn(
                "p-1.5 hover:bg-slate-700 rounded transition-colors",
                block.isLocked ? "text-amber-400 hover:text-amber-300" : "text-slate-400 hover:text-slate-200"
              )}
              title={block.isLocked ? "Unlock" : "Lock position"}
              type="button"
            >
              {block.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleBlockMinimized(block.id); }}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
              title="Minimize"
              type="button"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeBlock(block.id); }}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-colors"
              title="Delete"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Block content */}
        <div className={cn("h-full overflow-auto", isHovered && editable && "pt-10")}>{renderContent()}</div>

        {/* Locked indicator */}
        {block.isLocked && !isHovered && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-amber-500/20 rounded">
            <Lock className="w-3 h-3 text-amber-400" />
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Settings Panel */}
      <BlockSettingsPanel
        isOpen={isSettingsOpen}
        block={block}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={(updates) => updateBlock(block.id, updates)}
      />
    </>
  );
}
