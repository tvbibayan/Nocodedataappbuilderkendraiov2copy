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
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center" 
      onClick={onClose}
    >
      <div
        className="bg-[#1a1b2e] border border-cyan-500/30 rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Add Block</h2>
            <p className="text-cyan-300 text-sm">Choose a block type to add to your canvas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-cyan-300 hover:text-white hover:bg-cyan-500/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Block types */}
        <div className="space-y-6">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Block Types</h3>
          <div className="grid grid-cols-3 gap-4">
            {blockTypes.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => handleAddBlock(type)}
                className="group flex flex-col items-center gap-3 p-5 bg-[#0f0f23] hover:bg-[#2d2e47] border border-cyan-500/20 hover:border-cyan-500/50 rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/20 hover:-translate-y-1 text-center"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 rounded-xl flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-cyan-500/10 transition-all">
                  <Icon className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Available components */}
        {availableComponents.length > 0 && (
          <div className="mt-8 space-y-6">
            <h3 className="text-sm font-semibold text-violet-400 uppercase tracking-wider">Components</h3>
            <div className="grid grid-cols-3 gap-4">
              {availableComponents.map((component) => (
                <button
                  key={component}
                  onClick={() => handleAddBlock("component", component)}
                  className="group flex flex-col items-center gap-3 p-5 bg-[#0f0f23] hover:bg-[#2d2e47] border border-violet-500/20 hover:border-violet-500/50 rounded-xl transition-all hover:shadow-lg hover:shadow-violet-500/20 hover:-translate-y-1 text-center"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500/20 to-violet-500/5 rounded-xl flex items-center justify-center group-hover:from-violet-500/30 group-hover:to-violet-500/10 transition-all">
                    <Plus className="w-7 h-7 text-violet-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-violet-300 transition-colors">{component}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
