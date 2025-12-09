/**
 * Block Palette
 * Panel for adding new blocks to the canvas
 */

import * as React from "react";
import { Plus, BarChart3, LayoutGrid, Type, Code, Box, X } from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import { createBlock, type BlockType } from "../../config/canvas-layout";

interface BlockPaletteProps {
  availableComponents: string[];
  isOpen: boolean;
  onClose: () => void;
}

const blockTypes: { type: BlockType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "stat", label: "Stat Card", icon: BarChart3 },
  { type: "component", label: "Component", icon: LayoutGrid },
  { type: "text", label: "Text Block", icon: Type },
  { type: "embed", label: "Embed", icon: Code },
  { type: "container", label: "Container", icon: Box },
];

export function BlockPalette({ availableComponents, isOpen, onClose }: BlockPaletteProps) {
  const addBlock = usePreferencesStore((s) => s.addBlock);
  const getCurrentWorkspace = usePreferencesStore((s) => s.getCurrentWorkspace);

  const handleAddBlock = (type: BlockType, componentType?: string) => {
    const workspace = getCurrentWorkspace();
    if (!workspace) return;

    const blocks = workspace.canvasLayout.blocks;
    const maxY = blocks.reduce((max, b) => Math.max(max, b.position.y + b.position.h), 0);

    const newBlock = createBlock(
      type,
      { x: 0, y: maxY, w: 6, h: 2 },
      { componentType, title: componentType || type }
    );

    addBlock(newBlock);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" 
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-100">Add Block</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Block types */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-slate-400">Block Types</h3>
          <div className="grid grid-cols-2 gap-2">
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-sm text-slate-200">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Available components */}
        {availableComponents.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-sm font-medium text-slate-400">Components</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableComponents.map((component) => (
                <button
                  key={component}
                  onClick={() => handleAddBlock("component", component)}
                  className="flex items-center gap-3 p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm text-slate-200">{component}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
