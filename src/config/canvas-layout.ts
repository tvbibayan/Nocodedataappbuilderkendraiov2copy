/**
 * Canvas Layout Schema
 * Defines the structure for the Living Canvas dashboard
 */

export interface Position {
  /** Grid column start (0-11 for 12-column grid) */
  x: number;
  /** Grid row start */
  y: number;
  /** Width in columns (1-12) */
  w: number;
  /** Height in rows */
  h: number;
}

export type BlockType = "stat" | "component" | "text" | "embed" | "container";

export interface CanvasBlock {
  id: string;
  type: BlockType;
  /** Component name for 'component' type blocks */
  componentType?: string;
  position: Position;
  /** Whether the block is minimized to the command palette */
  isMinimized: boolean;
  /** Prevents accidental moves/resizes */
  isLocked: boolean;
  /** Nested blocks (for container type) */
  children?: CanvasBlock[];
  /** Props passed to the rendered component */
  props?: Record<string, unknown>;
  /** Role-based visibility */
  visibleTo?: string[];
  /** Optional custom title for the block */
  title?: string;
}

export interface CanvasLayout {
  id: string;
  version: "1.0";
  /** Number of grid columns (default: 12) */
  gridColumns: 12;
  /** Gap between blocks in pixels */
  gap: number;
  /** All blocks in this layout */
  blocks: CanvasBlock[];
}

/** Default empty canvas layout */
export const createEmptyCanvasLayout = (): CanvasLayout => ({
  id: crypto.randomUUID(),
  version: "1.0",
  gridColumns: 12,
  gap: 16,
  blocks: [],
});

/** Create a new block with default values */
export const createBlock = (
  type: BlockType,
  position: Position,
  overrides?: Partial<CanvasBlock>
): CanvasBlock => ({
  id: crypto.randomUUID(),
  type,
  position,
  isMinimized: false,
  isLocked: false,
  ...overrides,
});
