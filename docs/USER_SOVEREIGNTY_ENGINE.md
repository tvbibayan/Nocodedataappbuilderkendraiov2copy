# User Sovereignty Engine – Feature Specification

> **Version:** 1.0  
> **Date:** December 2025  
> **Status:** Draft  

---

## Executive Summary

The User Sovereignty Engine transforms Kendraio App from a static dashboard into a fully customizable, local-first workspace where users control every pixel. Inspired by **Notion's block system** and **Obsidian's theming architecture**, this module delivers:

1. **Living Canvas Dashboard** – Drag-drop-resize blocks on a responsive grid
2. **Theme Studio** – Atomic design token control + CSS injection
3. **Meta-Navigation** – Reorderable sidebar, folders, workspaces

All configuration is **JSON-first**, stored locally, and exportable.

---

## 1. User Stories

### Story 1: "The Data Analyst's Custom View"
> **Persona:** Priya, Data Analyst  
> **Scenario:** Priya opens Kendraio and drags the "Activity Timeline" block to span the full width. She shrinks the "Stats Cards" to a single column on the right. She saves this as "Analysis Mode" workspace and switches to it every morning.

**Acceptance Criteria:**
- [ ] Blocks can be resized from 1-column to 4-column width
- [ ] Layout persists after browser refresh
- [ ] Workspace can be named and saved
- [ ] Workspace switcher appears in header

---

### Story 2: "The Brand-Conscious Admin"
> **Persona:** Marcus, IT Admin  
> **Scenario:** Marcus opens Theme Studio, changes the primary color from cyan to his company's brand purple (#7C3AED), imports the corporate font "Inter", and sets border-radius to 0 for a sharp look. He exports this theme as JSON to share with his team.

**Acceptance Criteria:**
- [ ] Color picker for primary, secondary, accent, background tokens
- [ ] Font family selector with local font upload
- [ ] Border-radius slider (0–24px)
- [ ] Export/import theme JSON

---

### Story 3: "The Power User's CSS Hack"
> **Persona:** Leo, Developer  
> **Scenario:** Leo wants to add a subtle glow effect to focused inputs. He opens Theme Studio → Advanced → CSS Snippets, pastes his custom CSS, toggles it on, and sees the change instantly.

**Acceptance Criteria:**
- [ ] CSS snippet editor with syntax highlighting
- [ ] Toggle to enable/disable each snippet
- [ ] Snippets persist locally
- [ ] Live preview without page reload

---

### Story 4: "The Minimalist's Sidebar"
> **Persona:** Aisha, Music Manager  
> **Scenario:** Aisha only uses Flows and Dashboard. She hides Schemas, Adapters, and Settings from the sidebar by dragging them into a "More" folder. She pins her favorite flow "Spotify Sync" to the top of the sidebar.

**Acceptance Criteria:**
- [ ] Sidebar items are draggable
- [ ] Users can create folders/groups
- [ ] Items can be hidden (accessible via Cmd+K)
- [ ] Flows can be pinned to sidebar

---

## 2. Living Canvas Dashboard

### 2.1 Block System Architecture

Every UI element is a **Block**. Blocks are:
- **Draggable** – Click and drag to reposition
- **Resizable** – Drag edges to change column span (1–4)
- **Nestable** – Blocks can contain child blocks (future)
- **Focusable** – Double-click to expand, Esc to collapse

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (fixed)                               [Role ▼] [🔔] │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Stat 1   │ │ Stat 2   │ │ Stat 3   │ │ Stat 4   │       │
│  │ (1 col)  │ │ (1 col)  │ │ (1 col)  │ │ (1 col)  │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│  ┌─────────────────────────────────────┐ ┌──────────┐       │
│  │                                     │ │          │       │
│  │      Activity Timeline              │ │  Quick   │       │
│  │           (3 col)                   │ │ Actions  │       │
│  │                                     │ │ (1 col)  │       │
│  └─────────────────────────────────────┘ └──────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Grid Implementation

Using CSS Grid with 12-column base (collapsible to 4 for simplicity):

| User Action | Result |
|-------------|--------|
| Drag block left/right | Changes `gridColumn` start position |
| Drag right edge | Increases column span |
| Drag bottom edge | Increases row span |
| Double-click header | Toggles full-width mode |

### 2.3 Focus Mode & Command Palette

- **Minimize**: Click "−" on any block → block shrinks to icon in Command Palette
- **Command Palette** (Cmd+K): Quick search to find hidden blocks, switch workspaces, or run actions
- **Hidden Blocks Tray**: Bottom of canvas shows minimized blocks as chips

---

## 3. Theme Studio

### 3.1 Design Token Panel

```
┌─────────────────────────────────────────────────────────┐
│  THEME STUDIO                              [Export JSON]│
├─────────────────────────────────────────────────────────┤
│  Colors                                                 │
│  ├─ Primary      [████████] #06B6D4  (cyan)            │
│  ├─ Secondary    [████████] #8B5CF6  (violet)          │
│  ├─ Accent       [████████] #10B981  (emerald)         │
│  ├─ Background   [████████] #0F172A  (slate-950)       │
│  └─ Surface      [████████] #1E293B  (slate-800)       │
│                                                         │
│  Typography                                             │
│  ├─ Font Family  [Inter          ▼]  [Upload...]       │
│  ├─ Base Size    [14px ────●────── 20px]               │
│  └─ Line Height  [1.4 ─────●───── 1.8]                 │
│                                                         │
│  Borders & Shadows                                      │
│  ├─ Border Radius [0 ─────●─────── 24] = 8px           │
│  └─ Shadow Intensity [None ●───── Heavy]               │
│                                                         │
│  [Advanced: CSS Snippets ↓]                             │
└─────────────────────────────────────────────────────────┘
```

### 3.2 CSS Injection System

```typescript
interface CSSSnippet {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  createdAt: string;
}
```

Snippets are injected via `<style>` tags with `data-snippet-id` attributes for easy toggle.

### 3.3 Icon Pack Swap

Users can upload a ZIP of SVGs or select from presets:
- **Lucide** (default)
- **Heroicons**
- **Phosphor**
- **Custom** (user-uploaded)

---

## 4. Meta-Navigation Customization

### 4.1 Sidebar Configuration

```
┌─────────────────────────┐
│  ≡  Kendraio            │
├─────────────────────────┤
│  ★ Spotify Sync (pinned)│
│  ─────────────────────  │
│  📊 Dashboard           │
│  🔀 Flows               │
│  📁 More ▼              │
│     │ 📄 Schemas        │
│     │ 🔌 Adapters       │
│     └ ⚙️ Settings       │
├─────────────────────────┤
│  [+ Add Item]           │
└─────────────────────────┘
```

### 4.2 Workspace System

| Workspace | Layout | Theme Override | Sidebar Config |
|-----------|--------|----------------|----------------|
| Default | 4-col grid | System theme | All visible |
| Analysis Mode | Timeline full-width | High contrast | Flows + Dashboard |
| Music Mode | Custom | Purple theme | Pinned: Spotify Sync |

---

## 5. JSON Schema Specification

### 5.1 Complete Canvas Layout Schema

```typescript
// src/config/canvas-layout.ts

export interface Position {
  x: number;      // Grid column start (0-11)
  y: number;      // Grid row start
  w: number;      // Width in columns (1-12)
  h: number;      // Height in rows
}

export interface CanvasBlock {
  id: string;
  type: 'stat' | 'component' | 'text' | 'embed' | 'container';
  componentType?: string;           // e.g., "ActivityTimeline"
  position: Position;
  isMinimized: boolean;
  isLocked: boolean;                // Prevent accidental moves
  children?: CanvasBlock[];         // For nested blocks
  props?: Record<string, unknown>;
  visibleTo?: string[];
}

export interface CanvasLayout {
  id: string;
  version: '1.0';
  gridColumns: 12;
  gap: number;                      // Gap between blocks in px
  blocks: CanvasBlock[];
}
```

### 5.2 Theme Schema

```typescript
// src/config/theme-schema.ts

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  error: string;
  warning: string;
  success: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  baseFontSize: number;            // px
  lineHeight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightBold: number;
}

export interface ThemeBorders {
  radius: number;                  // px
  width: number;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
}

export interface CSSSnippet {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  createdAt: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  version: '1.0';
  colors: ThemeColors;
  typography: ThemeTypography;
  borders: ThemeBorders;
  shadows: ThemeShadows;
  cssSnippets: CSSSnippet[];
  iconPack: 'lucide' | 'heroicons' | 'phosphor' | 'custom';
  customIcons?: Record<string, string>;  // iconName -> SVG string
}
```

### 5.3 Sidebar/Navigation Schema

```typescript
// src/config/navigation-schema.ts

export interface NavItem {
  id: string;
  type: 'link' | 'folder' | 'separator' | 'pinned-flow';
  label: string;
  icon?: string;
  href?: string;
  flowId?: string;                 // For pinned flows
  children?: NavItem[];            // For folders
  isCollapsed?: boolean;
  isHidden?: boolean;              // Hidden but accessible via Cmd+K
  order: number;
}

export interface SidebarConfig {
  id: string;
  version: '1.0';
  items: NavItem[];
  showUserProfile: boolean;
  compactMode: boolean;
}
```

### 5.4 Workspace Schema (Combines All)

```typescript
// src/config/workspace-schema.ts

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  icon?: string;                   // Emoji or icon name
  createdAt: string;
  updatedAt: string;
  
  // References to saved configurations
  canvasLayout: CanvasLayout;
  themeOverride?: Partial<ThemeConfig>;  // Overrides global theme
  sidebarConfig: SidebarConfig;
  
  // Quick settings
  defaultRole: string;
  focusModeEnabled: boolean;
}

export interface UserPreferences {
  version: '1.0';
  activeWorkspaceId: string;
  workspaces: Workspace[];
  globalTheme: ThemeConfig;
  commandPaletteHistory: string[];
  minimizedBlocks: string[];       // Block IDs in command palette
}
```

### 5.5 Example JSON Instance

```json
{
  "version": "1.0",
  "activeWorkspaceId": "ws-analysis",
  "workspaces": [
    {
      "id": "ws-analysis",
      "name": "Analysis Mode",
      "icon": "📊",
      "createdAt": "2025-12-09T10:00:00Z",
      "updatedAt": "2025-12-09T10:00:00Z",
      "canvasLayout": {
        "id": "layout-1",
        "version": "1.0",
        "gridColumns": 12,
        "gap": 16,
        "blocks": [
          {
            "id": "stat-total-flows",
            "type": "stat",
            "position": { "x": 0, "y": 0, "w": 3, "h": 1 },
            "isMinimized": false,
            "isLocked": false,
            "props": {
              "label": "Total Flows",
              "value": "24",
              "change": "+3 this week",
              "color": "cyan"
            }
          },
          {
            "id": "timeline-main",
            "type": "component",
            "componentType": "ActivityTimeline",
            "position": { "x": 0, "y": 1, "w": 9, "h": 3 },
            "isMinimized": false,
            "isLocked": false
          },
          {
            "id": "quick-actions",
            "type": "component",
            "componentType": "QuickActions",
            "position": { "x": 9, "y": 1, "w": 3, "h": 3 },
            "isMinimized": false,
            "isLocked": true
          }
        ]
      },
      "sidebarConfig": {
        "id": "sidebar-1",
        "version": "1.0",
        "showUserProfile": true,
        "compactMode": false,
        "items": [
          {
            "id": "pinned-spotify",
            "type": "pinned-flow",
            "label": "Spotify Sync",
            "flowId": "flow-spotify-123",
            "icon": "🎵",
            "order": 0
          },
          {
            "id": "sep-1",
            "type": "separator",
            "label": "",
            "order": 1
          },
          {
            "id": "nav-dashboard",
            "type": "link",
            "label": "Dashboard",
            "icon": "LayoutDashboard",
            "href": "/dashboard",
            "order": 2
          },
          {
            "id": "nav-flows",
            "type": "link",
            "label": "Flows",
            "icon": "Workflow",
            "href": "/flows",
            "order": 3
          },
          {
            "id": "folder-more",
            "type": "folder",
            "label": "More",
            "icon": "Folder",
            "isCollapsed": true,
            "order": 4,
            "children": [
              {
                "id": "nav-schemas",
                "type": "link",
                "label": "Schemas",
                "icon": "FileJson",
                "href": "/schemas",
                "order": 0
              },
              {
                "id": "nav-adapters",
                "type": "link",
                "label": "Adapters",
                "icon": "Boxes",
                "href": "/adapters",
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
    "id": "theme-corporate",
    "name": "Corporate Purple",
    "version": "1.0",
    "colors": {
      "primary": "#7C3AED",
      "secondary": "#8B5CF6",
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
      "fontFamily": "Inter, system-ui, sans-serif",
      "fontFamilyMono": "JetBrains Mono, monospace",
      "baseFontSize": 14,
      "lineHeight": 1.5,
      "fontWeightNormal": 400,
      "fontWeightMedium": 500,
      "fontWeightBold": 700
    },
    "borders": {
      "radius": 8,
      "width": 1
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.3)",
      "md": "0 4px 6px rgba(0,0,0,0.3)",
      "lg": "0 10px 15px rgba(0,0,0,0.3)"
    },
    "cssSnippets": [
      {
        "id": "snippet-glow",
        "name": "Input Focus Glow",
        "code": "input:focus { box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.3); }",
        "enabled": true,
        "createdAt": "2025-12-09T10:00:00Z"
      }
    ],
    "iconPack": "lucide"
  },
  "commandPaletteHistory": ["switch workspace", "toggle dark mode"],
  "minimizedBlocks": []
}
```

---

## 6. New React Components Required

### 6.1 Canvas System

| Component | Purpose | Props |
|-----------|---------|-------|
| `<LivingCanvas />` | Root container for draggable grid | `layout`, `onLayoutChange`, `editable` |
| `<CanvasBlock />` | Individual draggable/resizable block | `block`, `onMove`, `onResize`, `onMinimize` |
| `<BlockHandle />` | Resize handles (corners/edges) | `position`, `onDrag` |
| `<BlockToolbar />` | Hover toolbar (lock, minimize, delete) | `blockId`, `isLocked`, `onAction` |
| `<MinimizedBlocksTray />` | Shows minimized blocks as chips | `blocks`, `onRestore` |
| `<CommandPalette />` | Cmd+K modal for search/actions | `isOpen`, `onSelect`, `items` |

### 6.2 Theme Studio

| Component | Purpose | Props |
|-----------|---------|-------|
| `<ThemeStudio />` | Main theme editor panel | `theme`, `onThemeChange` |
| `<ColorPicker />` | Inline color picker with presets | `value`, `onChange`, `presets` |
| `<FontSelector />` | Dropdown + local font upload | `value`, `onChange` |
| `<SliderControl />` | Labeled slider for numbers | `label`, `min`, `max`, `value`, `onChange` |
| `<CSSSnippetEditor />` | Monaco/CodeMirror for CSS | `snippets`, `onSave`, `onToggle` |
| `<IconPackSelector />` | Grid of icon pack options | `selected`, `onChange` |
| `<ThemePreview />` | Live preview of theme changes | `theme` |

### 6.3 Navigation Customization

| Component | Purpose | Props |
|-----------|---------|-------|
| `<CustomizableSidebar />` | Replaces static Sidebar | `config`, `onConfigChange` |
| `<DraggableNavItem />` | Single draggable menu item | `item`, `onDrop` |
| `<NavFolder />` | Collapsible folder in sidebar | `folder`, `onToggle` |
| `<PinnedFlowItem />` | Special item for pinned flows | `flowId`, `onUnpin` |
| `<SidebarEditMode />` | Toggle to enable drag mode | `isEditing`, `onToggle` |

### 6.4 Workspace Management

| Component | Purpose | Props |
|-----------|---------|-------|
| `<WorkspaceSwitcher />` | Dropdown in header | `workspaces`, `activeId`, `onChange` |
| `<WorkspaceManager />` | Full modal to manage workspaces | `workspaces`, `onCreate`, `onDelete` |
| `<WorkspaceCard />` | Preview card for a workspace | `workspace`, `onSelect`, `onEdit` |
| `<SaveWorkspaceModal />` | Dialog to name/save workspace | `currentLayout`, `onSave` |

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Implement JSON schemas in TypeScript
- [ ] Create `useCanvasLayout` hook for state management
- [ ] Build `<LivingCanvas />` with basic drag-drop (use `react-grid-layout`)
- [ ] Add `<BlockToolbar />` with lock/minimize

### Phase 2: Theme Studio (Week 3)
- [ ] Build `<ThemeStudio />` panel
- [ ] Implement CSS variable injection via React context
- [ ] Add `<CSSSnippetEditor />` with CodeMirror
- [ ] Create theme export/import

### Phase 3: Navigation (Week 4)
- [ ] Refactor `<Sidebar />` to `<CustomizableSidebar />`
- [ ] Add drag-drop reordering (use `@dnd-kit/sortable`)
- [ ] Implement folder creation and pinned flows

### Phase 4: Workspaces (Week 5)
- [ ] Build `<WorkspaceManager />` modal
- [ ] Implement workspace switching
- [ ] Add `<CommandPalette />` (use `cmdk`)
- [ ] LocalStorage persistence with JSON export

---

## 8. Dependencies to Add

```json
{
  "dependencies": {
    "react-grid-layout": "^1.4.4",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "cmdk": "^1.0.0",
    "@uiw/react-codemirror": "^4.21.0",
    "@codemirror/lang-css": "^6.2.0",
    "zustand": "^4.5.0",
    "immer": "^10.0.0"
  }
}
```

---

## 9. Data Persistence Strategy

| Layer | Storage | Purpose |
|-------|---------|---------|
| **Ephemeral** | React State (Zustand) | Current session layout |
| **Local** | LocalStorage | User preferences, workspaces |
| **Export** | JSON File | Share themes/workspaces |
| **Future** | IndexedDB | Large assets (custom fonts, icons) |

### Storage Keys
```
kendraio:preferences     → UserPreferences JSON
kendraio:theme:global    → ThemeConfig JSON
kendraio:workspace:{id}  → Workspace JSON
kendraio:cssSnippets     → CSSSnippet[] JSON
```

---

## 10. Accessibility Considerations

- All draggable elements have `aria-grabbed`, `aria-dropeffect`
- Command Palette supports full keyboard navigation
- Color pickers include contrast ratio warnings
- Focus visible states for all interactive elements
- Screen reader announcements for layout changes

---

## Appendix: File Structure

```
src/
├── config/
│   ├── canvas-layout.ts       # CanvasLayout types
│   ├── theme-schema.ts        # ThemeConfig types
│   ├── navigation-schema.ts   # SidebarConfig types
│   ├── workspace-schema.ts    # Workspace types
│   └── defaults/
│       ├── default-theme.ts
│       ├── default-layout.ts
│       └── default-sidebar.ts
├── components/
│   ├── canvas/
│   │   ├── LivingCanvas.tsx
│   │   ├── CanvasBlock.tsx
│   │   ├── BlockToolbar.tsx
│   │   └── MinimizedBlocksTray.tsx
│   ├── theme-studio/
│   │   ├── ThemeStudio.tsx
│   │   ├── ColorPicker.tsx
│   │   ├── FontSelector.tsx
│   │   └── CSSSnippetEditor.tsx
│   ├── navigation/
│   │   ├── CustomizableSidebar.tsx
│   │   ├── DraggableNavItem.tsx
│   │   └── NavFolder.tsx
│   └── workspace/
│       ├── WorkspaceSwitcher.tsx
│       ├── WorkspaceManager.tsx
│       └── CommandPalette.tsx
├── hooks/
│   ├── useCanvasLayout.ts
│   ├── useTheme.ts
│   ├── useWorkspace.ts
│   └── useCommandPalette.ts
├── stores/
│   └── preferences-store.ts   # Zustand store
└── utils/
    ├── theme-injector.ts      # CSS variable injection
    └── storage.ts             # LocalStorage helpers
```

---

*End of Specification*
