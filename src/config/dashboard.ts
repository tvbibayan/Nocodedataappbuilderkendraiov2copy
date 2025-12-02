import type { StatsCardProps } from "../components/StatsCard";

export type DashboardComponentType = "ActivityTimeline" | "QuickActions";
export type DashboardRole = "viewer" | "analyst" | "admin";

type VisibilityConfig = {
  visibleTo?: DashboardRole[];
};

export interface DashboardHeaderConfig {
  title: string;
  searchPlaceholder: string;
  showNotifications: boolean;
}

export interface DashboardStatCard extends StatsCardProps, VisibilityConfig {
  id: string;
}

export interface DashboardComponentWidget extends VisibilityConfig {
  id: string;
  type: "component";
  component: DashboardComponentType;
  colSpan?: 1 | 2 | 3 | 4;
  props?: Record<string, unknown>;
}

export interface DashboardSection extends VisibilityConfig {
  id: string;
  columns: 1 | 2 | 3 | 4;
  widgets: DashboardComponentWidget[];
}

export interface DashboardSchema {
  header: DashboardHeaderConfig;
  stats: DashboardStatCard[];
  sections: DashboardSection[];
  defaultRole: DashboardRole;
}

export const defaultDashboardSchema: DashboardSchema = {
  header: {
    title: "My Dashboard",
    searchPlaceholder: "Search flows, schemas...",
    showNotifications: true,
  },
  defaultRole: "viewer",
  stats: [
    {
      id: "total-flows",
      label: "Total Flows",
      value: "24",
      change: "+3 this week",
      color: "cyan",
    },
    {
      id: "active-adapters",
      label: "Active Adapters",
      value: "12",
      change: "8 connected",
      color: "emerald",
      visibleTo: ["analyst", "admin"],
    },
    {
      id: "data-sync-health",
      label: "Data Sync Health",
      value: "98%",
      change: "All systems operational",
      color: "violet",
      visibleTo: ["admin"],
    },
  ],
  sections: [
    {
      id: "primary",
      columns: 2,
      widgets: [
        {
          id: "timeline",
          type: "component",
          component: "ActivityTimeline",
          visibleTo: ["viewer", "analyst", "admin"],
        },
        {
          id: "quick-actions",
          type: "component",
          component: "QuickActions",
          visibleTo: ["analyst", "admin"],
          props: {
            variant: "primary",
          },
        },
      ],
    },
    {
      id: "admin-panel",
      columns: 1,
      visibleTo: ["admin"],
      widgets: [
        {
          id: "admin-quick-actions",
          type: "component",
          component: "QuickActions",
          props: {
            title: "Admin Actions",
          },
          colSpan: 1,
        },
      ],
    },
  ],
};
