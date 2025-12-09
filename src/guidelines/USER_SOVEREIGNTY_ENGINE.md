# User Sovereignty Engine - Feature Specification

## Executive Summary

The **User Sovereignty Engine** transforms Kendraio App from a static application into a fully customizable, user-owned interface. Inspired by Notion's block system and Obsidian's theming capabilities, this system gives users 100% control over their dashboard layout, visual styling, and navigation structure.

---

## 🎯 Core Design Principles

1. **JSON-First Architecture**: All customizations are stored as portable JSON, enabling export/import and version control
2. **Progressive Disclosure**: Simple defaults for beginners, deep customization for power users
3. **Non-Destructive**: Users can always reset to defaults; workspaces are sandboxed
4. **Local-First**: All preferences persist in localStorage with optional cloud sync

---

## 📚 User Stories

### Story 1: The Dashboard Designer
> **As a** music rights manager, **I want to** create a "Royalty Dashboard" workspace **so that** I can monitor streaming revenue, catalog size, and recent payouts at a glance without seeing developer tools.

**Acceptance Criteria:**
- User can drag the "Revenue Stats" block to span the full width
- User can minimize the "Quick Actions" block to the command palette
- User can save this layout as "Music Management Mode"
- Layout persists across browser sessions

### Story 2: The Brand Manager
> **As a** design-conscious user, **I want to** customize the app's colors to match my company's brand guidelines **so that** screenshots and presentations look professional.

**Acceptance Criteria:**
- User opens Theme Studio via Cmd+K → "Open Theme Studio"
- User changes primary color from cyan (#06B6D4) to company purple (#7C3AED)
- User adjusts font to "Poppins" and border radius to 12px
- Changes apply instantly with live preview
- User can export theme as JSON for team sharing

### Story 3: The Power User
> **As a** developer using Kendraio for data pipelines, **I want to** inject custom CSS **so that** I can style specific components exactly how I need them.

**Acceptance Criteria:**
- User navigates to Theme Studio → CSS Snippets tab
- User creates snippet: "Hide breadcrumbs" with `.breadcrumb { display: none; }`
- User can toggle snippets on/off without deleting
- Snippets persist and apply on reload

### Story 4: The Multi-Project Manager
> **As a** consultant managing multiple clients, **I want to** switch between different workspace configurations **so that** each client dashboard shows only relevant flows and data.

**Acceptance Criteria:**
- User creates "Client A - Finance" workspace with specific blocks
- User creates "Client B - Media" workspace with different layout
- User switches via Cmd+K → "Switch Workspace" instantly
- Each workspace remembers its own sidebar arrangement

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER SOVEREIGNTY ENGINE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Living Canvas  │  │  Theme Studio   │  │ Meta-Navigation │  │
│  │                 │  │                 │  │                 │  │
│  │ • Block System  │  │ • Color Tokens  │  │ • Drag Sidebar  │  │
│  │ • Grid Layout   │  │ • Typography    │  │ • Folders       │  │
│  │ • Focus Mode    │  │ • CSS Snippets  │  │ • Workspaces    │  │
│  │ • Nesting       │  │ • Icon Packs    │  │ • Pinned Flows  │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│           └────────────────────┼────────────────────┘           │
│                                │                                │
│                    ┌───────────▼───────────┐                    │
│                    │   Preferences Store   │                    │
│                    │   (Zustand + Immer)   │                    │
│                    │                       │                    │
│                    │  • UserPreferences    │                    │
│                    │  • Workspaces[]       │                    │
│                    │  • GlobalTheme        │                    │
│                    │  • MinimizedBlocks    │                    │
│                    └───────────┬───────────┘                    │
│                                │                                │
│                    ┌───────────▼───────────┐                    │
│                    │     localStorage      │                    │
│                    │  kendraio:preferences │                    │
│                    └───────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Feature 1: Living Canvas Dashboard

### 1.1 Block System

Every UI element is a **Block** with these properties:

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (UUID) |
| `type` | BlockType | `stat`, `component`, `text`, `embed`, `container` |
| `componentType` | string? | React component name for `component` blocks |
| `position` | Position | Grid coordinates `{ x, y, w, h }` |
| `isMinimized` | boolean | Hidden from canvas, accessible via Cmd+K |
| `isLocked` | boolean | Prevents accidental moves |
| `children` | Block[]? | Nested blocks for `container` type |
| `props` | object? | Props passed to rendered component |
| `visibleTo` | string[]? | Role-based visibility |
| `title` | string? | Custom display name |

### 1.2 Grid Layout

- **12-column responsive grid** using `react-grid-layout`
- Blocks snap to grid with configurable gap (default: 16px)
- Minimum size: 2×2 grid units
- Blocks can span 1-12 columns
- Row height adapts to content

### 1.3 Focus Mode

Minimized blocks are stored in `minimizedBlocks[]` and accessible via:
- **Command Palette** (Cmd+K → "Restore [Block Name]")
- **Minimized Blocks Tray** (floating bottom panel)
- **Right-click context menu** on empty canvas area

### 1.4 Block Types

| Type | Description | Example |
|------|-------------|---------|
| `stat` | Key metric card | "Active Flows: 24" |
| `component` | React component | ActivityTimeline, QuickActions |
| `text` | Rich text/markdown | Notes, documentation |
| `embed` | External iframe | Grafana panel, YouTube |
| `container` | Parent for nesting | Grouping related blocks |

---

## 📋 Feature 2: Theme Studio

### 2.1 Design Tokens

```typescript
interface ThemeConfig {
  colors: {
    primary: string;      // Main brand color
    secondary: string;    // Supporting color
    accent: string;       // Highlights
    background: string;   // Page background
    surface: string;      // Card backgrounds
    text: string;         // Primary text
    textMuted: string;    // Secondary text
    border: string;       // Dividers
    error: string;
    warning: string;
    success: string;
  };
  typography: {
    fontFamily: string;
    fontFamilyMono: string;
    baseFontSize: number;
    lineHeight: number;
    fontWeightNormal: number;
    fontWeightMedium: number;
    fontWeightBold: number;
  };
  borders: {
    radius: number;
    width: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
```

### 2.2 CSS Snippets (Advanced)

Power users can inject custom CSS:

```typescript
interface CSSSnippet {
  id: string;
  name: string;        // "Hide Breadcrumbs"
  code: string;        // ".breadcrumb { display: none; }"
  enabled: boolean;    // Toggle without delete
  createdAt: string;
}
```

**Injection Method:**
- Snippets are injected into a `<style id="kendraio-custom-css">` element
- Order matters: snippets apply in creation order
- Disabled snippets are commented out, not removed

### 2.3 Icon Packs

```typescript
type IconPack = "lucide" | "heroicons" | "phosphor" | "custom";

interface ThemeConfig {
  // ...
  iconPack: IconPack;
  customIcons?: Record<string, string>; // SVG strings
}
```

---

## 📋 Feature 3: Meta-Navigation

### 3.1 Customizable Sidebar

```typescript
interface NavItem {
  id: string;
  type: "link" | "folder" | "separator" | "pinned-flow";
  label: string;
  icon?: string;         // Lucide icon name or emoji
  href?: string;         // For 'link' type
  flowId?: string;       // For 'pinned-flow' type
  children?: NavItem[];  // For 'folder' type
  isCollapsed?: boolean;
  isHidden?: boolean;    // Hidden but accessible via Cmd+K
  order: number;
}
```

### 3.2 Workspaces

```typescript
interface Workspace {
  id: string;
  name: string;          // "Music Management Mode"
  description?: string;
  icon?: string;         // Emoji or icon
  createdAt: string;
  updatedAt: string;
  
  canvasLayout: CanvasLayout;
  themeOverride?: Partial<ThemeConfig>;
  sidebarConfig: SidebarConfig;
  defaultRole: string;
  focusModeEnabled: boolean;
}
```

---

## 🧩 React Components

### Existing Components (Enhanced)

| Component | Location | Purpose |
|-----------|----------|---------|
| `<LivingCanvas />` | `src/components/canvas/LivingCanvas.tsx` | Grid container with react-grid-layout |
| `<CanvasBlock />` | `src/components/canvas/CanvasBlock.tsx` | Individual draggable block |
| `<BlockPalette />` | `src/components/canvas/BlockPalette.tsx` | Modal to add new blocks |
| `<MinimizedBlocksTray />` | `src/components/canvas/MinimizedBlocksTray.tsx` | Floating tray for hidden blocks |
| `<ThemeStudio />` | `src/components/theme-studio/ThemeStudio.tsx` | Full theme editor modal |
| `<CommandPalette />` | `src/components/workspace/CommandPalette.tsx` | Cmd+K quick actions |
| `<WorkspaceSwitcher />` | `src/components/workspace/WorkspaceSwitcher.tsx` | Dropdown to switch workspaces |
| `<CustomizableSidebar />` | `src/components/navigation/CustomizableSidebar.tsx` | Drag-drop sidebar |

### New Components Needed

| Component | Purpose |
|-----------|---------|
| `<BlockContextMenu />` | Right-click menu for blocks (minimize, lock, delete) |
| `<ContainerBlock />` | Special block that can hold nested blocks |
| `<TextBlock />` | Rich text editor block (markdown support) |
| `<EmbedBlock />` | iframe wrapper with URL input |
| `<FontPicker />` | Google Fonts / local font selector |
| `<IconPackPicker />` | Switch between icon libraries |
| `<WorkspaceManager />` | Full page for managing all workspaces |
| `<ExportImportPanel />` | Bulk export/import preferences |

---

## 📦 JSON Schema Example

### Complete User Preferences

```json
{
  "version": "1.0",
  "activeWorkspaceId": "ws-music-123",
  "workspaces": [
    {
      "id": "ws-music-123",
      "name": "Music Management Mode",
      "description": "Dashboard for royalty tracking",
      "icon": "🎵",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:45:00Z",
      "canvasLayout": {
        "id": "layout-abc",
        "version": "1.0",
        "gridColumns": 12,
        "gap": 16,
        "blocks": [
          {
            "id": "block-revenue",
            "type": "stat",
            "position": { "x": 0, "y": 0, "w": 4, "h": 2 },
            "isMinimized": false,
            "isLocked": true,
            "title": "Monthly Revenue",
            "props": {
              "label": "Monthly Revenue",
              "value": "$45,230",
              "change": "+12.5%",
              "color": "emerald"
            }
          },
          {
            "id": "block-streams",
            "type": "stat",
            "position": { "x": 4, "y": 0, "w": 4, "h": 2 },
            "isMinimized": false,
            "isLocked": false,
            "title": "Total Streams",
            "props": {
              "label": "Total Streams",
              "value": "2.4M",
              "change": "+8.3%",
              "color": "cyan"
            }
          },
          {
            "id": "block-timeline",
            "type": "component",
            "componentType": "ActivityTimeline",
            "position": { "x": 0, "y": 2, "w": 8, "h": 4 },
            "isMinimized": false,
            "isLocked": false,
            "title": "Recent Activity"
          },
          {
            "id": "block-actions",
            "type": "component",
            "componentType": "QuickActions",
            "position": { "x": 8, "y": 2, "w": 4, "h": 4 },
            "isMinimized": true,
            "isLocked": false,
            "title": "Quick Actions"
          }
        ]
      },
      "sidebarConfig": {
        "id": "sidebar-music",
        "version": "1.0",
        "showUserProfile": true,
        "compactMode": false,
        "items": [
          {
            "id": "nav-dashboard",
            "type": "link",
            "label": "Dashboard",
            "icon": "LayoutDashboard",
            "href": "/dashboard",
            "order": 0
          },
          {
            "id": "folder-royalties",
            "type": "folder",
            "label": "Royalties",
            "icon": "💰",
            "order": 1,
            "isCollapsed": false,
            "children": [
              {
                "id": "nav-spotify",
                "type": "pinned-flow",
                "label": "Spotify Import",
                "flowId": "flow-spotify-123",
                "icon": "Music",
                "order": 0
              },
              {
                "id": "nav-apple",
                "type": "pinned-flow",
                "label": "Apple Music",
                "flowId": "flow-apple-456",
                "icon": "Music2",
                "order": 1
              }
            ]
          }
        ]
      },
      "defaultRole": "analyst",
      "focusModeEnabled": false
    }
  ],
  "globalTheme": {
    "id": "theme-custom",
    "name": "Music Brand Theme",
    "version": "1.0",
    "colors": {
      "primary": "#8B5CF6",
      "secondary": "#EC4899",
      "accent": "#10B981",
      "background": "#0F172A",
      "surface": "#1E293B",
      "text": "#F1F5F9",
      "textMuted": "#94A3B8",
      "border": "#334155",
      "error": "#EF4444",
      "warning": "#F59E0B",
      "success": "#10B981"
    },
    "typography": {
      "fontFamily": "Poppins, system-ui, sans-serif",
      "fontFamilyMono": "JetBrains Mono, monospace",
      "baseFontSize": 14,
      "lineHeight": 1.6,
      "fontWeightNormal": 400,
      "fontWeightMedium": 500,
      "fontWeightBold": 600
    },
    "borders": {
      "radius": 12,
      "width": 1
    },
    "shadows": {
      "sm": "0 1px 2px 0 rgb(0 0 0 / 0.3)",
      "md": "0 4px 6px -1px rgb(0 0 0 / 0.3)",
      "lg": "0 10px 15px -3px rgb(0 0 0 / 0.3)"
    },
    "cssSnippets": [
      {
        "id": "snippet-glow",
        "name": "Button Glow Effect",
        "code": ".btn-primary:hover { box-shadow: 0 0 20px var(--color-primary); }",
        "enabled": true,
        "createdAt": "2024-01-18T09:00:00Z"
      }
    ],
    "iconPack": "lucide"
  },
  "commandPaletteHistory": [
    "Switch to Music Mode",
    "Open Theme Studio",
    "Add new stat block"
  ],
  "minimizedBlocks": ["block-actions"]
}
```

---

## 🔧 Technical Implementation Notes

### State Management
- **Zustand** with `immer` middleware for immutable updates
- **persist** middleware for localStorage synchronization
- Store key: `kendraio:preferences`

### Theme Injection
```typescript
// src/utils/theme-injector.ts
export function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  
  // CSS Variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Typography
  root.style.setProperty('--font-family', theme.typography.fontFamily);
  root.style.setProperty('--font-size-base', `${theme.typography.baseFontSize}px`);
  
  // CSS Snippets
  let styleEl = document.getElementById('kendraio-custom-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'kendraio-custom-css';
    document.head.appendChild(styleEl);
  }
  
  const enabledSnippets = theme.cssSnippets
    .filter(s => s.enabled)
    .map(s => `/* ${s.name} */\n${s.code}`)
    .join('\n\n');
  
  styleEl.textContent = enabledSnippets;
}
```

### Grid Layout Integration
```typescript
// Using react-grid-layout
import GridLayout from 'react-grid-layout';

<GridLayout
  cols={12}
  rowHeight={80}
  width={containerWidth}
  onLayoutChange={handleLayoutChange}
  draggableHandle=".block-drag-handle"
  isResizable={editable}
  isDraggable={editable}
>
  {blocks.map(block => (
    <div key={block.id} data-grid={positionToLayout(block)}>
      <CanvasBlock block={block} />
    </div>
  ))}
</GridLayout>
```

---

## 🚀 Implementation Phases

### Phase 1: Foundation ✅
- [x] JSON schemas for canvas, theme, navigation, workspace
- [x] Zustand preferences store with persistence
- [x] Basic LivingCanvas with react-grid-layout
- [x] CanvasBlock component with toolbar
- [x] Theme Studio with color/typography editors
- [x] CSS Snippets support
- [x] Command Palette (Cmd+K)
- [x] Customizable Sidebar with drag-drop

### Phase 2: Enhancement (Current)
- [ ] Block context menu (right-click)
- [ ] Container blocks for nesting
- [ ] Text/Markdown blocks
- [ ] Embed blocks (iframes)
- [ ] Font picker with Google Fonts
- [ ] Icon pack switcher

### Phase 3: Polish
- [ ] Keyboard shortcuts for block manipulation
- [ ] Undo/redo for layout changes
- [ ] Workspace templates library
- [ ] Theme preset gallery
- [ ] Export to standalone HTML dashboard

---

## 📐 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `Cmd+Shift+T` | Open Theme Studio |
| `Cmd+Shift+B` | Open Block Palette |
| `Delete` | Remove selected block |
| `Cmd+D` | Duplicate selected block |
| `Cmd+L` | Lock/unlock selected block |
| `Cmd+M` | Minimize selected block |
| `Cmd+1-9` | Switch to workspace 1-9 |

---

## 🎨 Visual Design Guidelines

### Block States
- **Default**: Subtle border, transparent background
- **Hover**: Elevated shadow, visible drag handles
- **Selected**: Cyan border glow
- **Locked**: Lock icon badge, reduced opacity handles
- **Dragging**: Strong shadow, slight scale up

### Theme Studio Layout
- Left sidebar: Token category tabs (Colors, Typography, etc.)
- Main area: Live preview of changes
- Right panel: CSS snippet editor (when active)

### Command Palette
- Centered modal with search input
- Groups: Navigation, Blocks, Theme, Workspaces
- Recent commands at top
- Keyboard navigable

---

*Last Updated: December 2024*
*Version: 1.0*
