/**
 * Minimized Blocks Tray
 * Shows minimized blocks as chips at the bottom of the canvas
 */

import * as React from "react";
import { Maximize2, LayoutGrid, BarChart3, Type, Code, Box } from "lucide-react";
import type { BlockType } from "../../config/canvas-layout";

interface MinimizedBlock {
  id: string;
  title: string;
  type: BlockType;
}

interface MinimizedBlocksTrayProps {
  blocks: MinimizedBlock[];
  onRestore: (blockId: string) => void;
}

const typeIcons: Record<BlockType, React.ComponentType<{ className?: string }>> = {
  stat: BarChart3,
  component: LayoutGrid,
  text: Type,
  embed: Code,
  container: Box,
};

export function MinimizedBlocksTray({ blocks, onRestore }: MinimizedBlocksTrayProps) {
  if (blocks.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700 shadow-lg">
        <span className="text-xs text-slate-500 mr-2">Minimized:</span>
        {blocks.map((block) => {
          const Icon = typeIcons[block.type] || Box;
          return (
            <button
              key={block.id}
              onClick={() => onRestore(block.id)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-sm text-slate-300 transition-colors group"
              title={`Restore "${block.title}"`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span className="max-w-[100px] truncate">{block.title}</span>
              <Maximize2 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
