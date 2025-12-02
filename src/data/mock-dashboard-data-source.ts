import type {
  DashboardDataSource,
  DashboardData,
  ActivityEntry,
} from "./dashboard-data-source";

const mockActivities: ActivityEntry[] = [
  {
    id: "act-spotify-flow",
    title: "Spotify Integration Flow",
    action: "Flow modified",
    timestamp: "2025-12-01T10:15:00Z",
    category: "flow",
  },
  {
    id: "act-user-schema",
    title: "User Profile Schema",
    action: "Schema updated",
    timestamp: "2025-12-01T07:05:00Z",
    category: "schema",
  },
  {
    id: "act-google-export",
    title: "Google Sheets Export",
    action: "Flow created",
    timestamp: "2025-11-30T16:41:00Z",
    category: "flow",
  },
  {
    id: "act-product-schema",
    title: "Product Data Schema",
    action: "Schema created",
    timestamp: "2025-11-29T18:22:00Z",
    category: "schema",
  },
  {
    id: "act-slack-adapter",
    title: "Slack Adapter",
    action: "Adapter re-authorized",
    timestamp: "2025-11-29T09:12:00Z",
    category: "adapter",
  },
];

const mockData: DashboardData = {
  stats: {
    "total-flows": { value: "24", change: "+3 this week" },
    "active-adapters": { value: "12", change: "8 connected" },
    "data-sync-health": {
      value: "98%",
      change: "All systems operational",
    },
  },
  activities: mockActivities,
};

class MockDashboardDataSource implements DashboardDataSource {
  async getDashboardData(): Promise<DashboardData> {
    // Simulate async latency for future parity with real adapters.
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockData;
  }
}

export const mockDashboardDataSource = new MockDashboardDataSource();
