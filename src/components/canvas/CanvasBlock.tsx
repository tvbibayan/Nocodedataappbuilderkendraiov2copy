/**
 * Canvas Block Component
 * Individual draggable/resizable block with toolbar
 */

import * as React from "react";
import { GripVertical, Minimize2, Lock, Unlock, Trash2, Maximize2 } from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import type { CanvasBlock } from "../../config/canvas-layout";
import { cn } from "../ui/utils";
import { TextBlock } from "./TextBlock";
import { EmbedBlock } from "./EmbedBlock";

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

  const toggleBlockMinimized = usePreferencesStore((s) => s.toggleBlockMinimized);
  const toggleBlockLocked = usePreferencesStore((s) => s.toggleBlockLocked);
  const removeBlock = usePreferencesStore((s) => s.removeBlock);
  const updateBlock = usePreferencesStore((s) => s.updateBlock);

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

  return (
    <>
      <div
        className={cn(
          "canvas-block h-full rounded-xl border-l-4 border border-slate-700 bg-slate-900",
          accentClasses[accentColor] || "border-l-cyan-500",
          block.isLocked && "opacity-80",
          isExpanded && "fixed inset-4 z-50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Block toolbar */}
        {editable && isHovered && (
          <div className="absolute -top-8 left-2 right-2 flex items-center gap-1 px-2 py-1 bg-slate-800 rounded-t-lg border border-slate-700 border-b-0 z-20">
            {/* Drag handle */}
            <div className="block-drag-handle cursor-grab active:cursor-grabbing p-1 hover:bg-slate-700 rounded">
              <GripVertical className="w-4 h-4 text-slate-400" />
            </div>

            {/* Block title */}
            <span className="flex-1 text-xs text-slate-400 truncate px-2">
              {block.title || block.componentType || block.type}
            </span>

            {/* Toolbar buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded"
              title={isExpanded ? "Collapse" : "Expand"}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleBlockLocked(block.id); }}
              className={cn(
                "p-1 hover:bg-slate-700 rounded",
                block.isLocked ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
              )}
              title={block.isLocked ? "Unlock" : "Lock position"}
            >
              {block.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleBlockMinimized(block.id); }}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded"
              title="Minimize"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
              className="p-1 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Block content */}
        <div className="h-full overflow-auto rounded-xl">{renderContent()}</div>

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
    </>
  );
}
