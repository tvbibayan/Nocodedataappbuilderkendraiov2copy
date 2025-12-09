/**
 * Navigation Schema
 * Defines the customizable sidebar structure
 */

export type NavItemType = "link" | "folder" | "separator" | "pinned-flow";

export interface NavItem {
  id: string;
  type: NavItemType;
  label: string;
  /** Lucide icon name or emoji */
  icon?: string;
  /** Route path for 'link' type */
  href?: string;
  /** Flow ID for 'pinned-flow' type */
  flowId?: string;
  /** Child items for 'folder' type */
  children?: NavItem[];
  /** Whether folder is collapsed */
  isCollapsed?: boolean;
  /** Hidden from sidebar but accessible via Cmd+K */
  isHidden?: boolean;
  /** Display order (lower = higher) */
  order: number;
}

export interface SidebarConfig {
  id: string;
  version: "1.0";
  items: NavItem[];
  showUserProfile: boolean;
  compactMode: boolean;
}

/** Default sidebar configuration */
export const defaultSidebarConfig: SidebarConfig = {
  id: "default-sidebar",
  version: "1.0",
  showUserProfile: true,
  compactMode: false,
  items: [
    {
      id: "nav-dashboard",
      type: "link",
      label: "Dashboard",
      icon: "LayoutDashboard",
      href: "/dashboard",
      order: 0,
    },
    {
      id: "nav-flows",
      type: "link",
      label: "Flows",
      icon: "Workflow",
      href: "/flows",
      order: 1,
    },
    {
      id: "nav-schemas",
      type: "link",
      label: "Schemas",
      icon: "FileJson",
      href: "/schemas",
      order: 2,
    },
    {
      id: "nav-adapters",
      type: "link",
      label: "Adapters",
      icon: "Boxes",
      href: "/adapters",
      order: 3,
    },
    {
      id: "sep-1",
      type: "separator",
      label: "",
      order: 4,
    },
    {
      id: "nav-settings",
      type: "link",
      label: "Settings",
      icon: "Settings",
      href: "/settings",
      order: 5,
    },
  ],
};

/** Create a nav link item */
export const createNavLink = (
  label: string,
  href: string,
  icon?: string,
  order = 99
): NavItem => ({
  id: crypto.randomUUID(),
  type: "link",
  label,
  icon,
  href,
  order,
});

/** Create a nav folder */
export const createNavFolder = (
  label: string,
  children: NavItem[] = [],
  icon = "Folder"
): NavItem => ({
  id: crypto.randomUUID(),
  type: "folder",
  label,
  icon,
  children,
  isCollapsed: false,
  order: 99,
});

/** Create a pinned flow item */
export const createPinnedFlow = (
  label: string,
  flowId: string,
  icon = "🔗"
): NavItem => ({
  id: crypto.randomUUID(),
  type: "pinned-flow",
  label,
  icon,
  flowId,
  order: 0,
});
