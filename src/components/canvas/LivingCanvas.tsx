/**
 * Living Canvas
 * A flexible, draggable grid layout system for dashboard blocks
 */

import * as React from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { Plus, Sparkles } from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import type { CanvasBlock, Position } from "../../config/canvas-layout";
import { CanvasBlockComponent } from "./CanvasBlock";
import { MinimizedBlocksTray } from "./MinimizedBlocksTray";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

interface LivingCanvasProps {
  componentRegistry: Record<string, React.ComponentType<any>>;
  editable?: boolean;
  className?: string;
  onBlockClick?: (block: CanvasBlock) => void;
}

function positionToLayout(block: CanvasBlock): Layout {
  return {
    i: block.id,
    x: block.position.x,
    y: block.position.y,
    w: block.position.w,
    h: block.position.h,
    static: block.isLocked,
    minW: 2,
    minH: 2,
  };
}

function layoutToPosition(layout: Layout): Position {
  return {
    x: layout.x,
    y: layout.y,
    w: layout.w,
    h: layout.h,
  };
}

export function LivingCanvas({
  componentRegistry,
  editable = true,
  className = "",
  onBlockClick,
}: LivingCanvasProps) {
  const [containerWidth, setContainerWidth] = React.useState(1200);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getCurrentWorkspace = usePreferencesStore((s) => s.getCurrentWorkspace);
  const updateBlock = usePreferencesStore((s) => s.updateBlock);
  const toggleBlockMinimized = usePreferencesStore((s) => s.toggleBlockMinimized);

  const workspace = getCurrentWorkspace();
  const canvasLayout = workspace?.canvasLayout;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleLayoutChange = React.useCallback(
    (layout: Layout[]) => {
      if (!editable) return;
      layout.forEach((item) => {
        updateBlock(item.i, { position: layoutToPosition(item) });
      });
    },
    [editable, updateBlock]
  );

  const handleRestoreBlock = React.useCallback(
    (blockId: string) => {
      toggleBlockMinimized(blockId);
    },
    [toggleBlockMinimized]
  );

  if (!canvasLayout) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <p>No workspace selected</p>
        </div>
      </div>
    );
  }

  const visibleBlocks = canvasLayout.blocks.filter((block) => !block.isMinimized);

  const minimizedBlockInfo = canvasLayout.blocks
    .filter((block) => block.isMinimized)
    .map((block) => ({
      id: block.id,
      title: block.title || block.componentType || block.type,
      type: block.type,
    }));

  const gridLayout = visibleBlocks.map(positionToLayout);

  if (visibleBlocks.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`relative h-full flex items-center justify-center ${className}`}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <Plus className="w-16 h-16 mx-auto mb-6 text-cyan-500/50" />
          <h3 className="text-xl font-semibold text-slate-200 mb-2">
            Your canvas is empty
          </h3>
          <p className="text-slate-400 mb-6">
            Click "Add Block" to start building your custom dashboard.
          </p>
        </div>

        {minimizedBlockInfo.length > 0 && (
          <MinimizedBlocksTray
            blocks={minimizedBlockInfo}
            onRestore={handleRestoreBlock}
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ minHeight: "500px" }}
    >
      <GridLayout
        className="layout"
        layout={gridLayout}
        cols={12}
        rowHeight={80}
        width={containerWidth > 0 ? containerWidth : 1200}
        margin={[16, 16]}
        containerPadding={[16, 16]}
        isDraggable={editable}
        isResizable={editable}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".block-drag-handle"
        useCSSTransforms
        compactType="vertical"
      >
        {visibleBlocks.map((block) => (
          <div key={block.id} className="h-full">
            <CanvasBlockComponent
              block={block}
              componentRegistry={componentRegistry}
              editable={editable}
              onClick={() => onBlockClick?.(block)}
            />
          </div>
        ))}
      </GridLayout>

      {minimizedBlockInfo.length > 0 && (
        <MinimizedBlocksTray
          blocks={minimizedBlockInfo}
          onRestore={handleRestoreBlock}
        />
      )}
    </div>
  );
}
