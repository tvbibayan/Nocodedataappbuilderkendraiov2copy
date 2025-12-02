import type { StatsCardProps } from "../components/StatsCard";

export type ActivityCategory = "flow" | "schema" | "adapter";

export interface ActivityEntry {
  id: string;
  title: string;
  action: string;
  timestamp: string;
  category: ActivityCategory;
}

export type StatSnapshot = Pick<StatsCardProps, "value" | "change">;

export interface DashboardData {
  stats: Record<string, StatSnapshot>;
  activities: ActivityEntry[];
}

export interface DashboardDataSource {
  getDashboardData(): Promise<DashboardData>;
}
