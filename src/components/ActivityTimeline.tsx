import { Workflow, FileJson, Clock, Cloud } from "lucide-react";
import type { ActivityEntry } from "../data/dashboard-data-source";

interface ActivityTimelineProps {
  activities: ActivityEntry[];
}

const iconMap = {
  flow: Workflow,
  schema: FileJson,
  adapter: Cloud,
} as const;

const colorClassMap = {
  flow: {
    bg: "bg-cyan-500/20",
    icon: "text-cyan-400",
  },
  schema: {
    bg: "bg-emerald-500/20",
    icon: "text-emerald-400",
  },
  adapter: {
    bg: "bg-violet-500/20",
    icon: "text-violet-400",
  },
} as const;

function formatRelativeTime(timestamp: string) {
  const target = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  if (!activities.length) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl text-slate-100 mb-6">Recent Activity</h2>
        <p className="text-sm text-slate-500">No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl text-slate-100 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.category] ?? Workflow;
          const colors = colorClassMap[activity.category] ?? colorClassMap.flow;
          const isLast = index === activities.length - 1;
          const timeLabel = formatRelativeTime(activity.timestamp);

          return (
            <div key={activity.id ?? index} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${colors.bg}`}
                >
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                {!isLast && (
                  <div className="w-px h-full bg-slate-800 mt-2"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="text-slate-200">{activity.title}</div>
                <div className="text-sm text-slate-500">{activity.action}</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-slate-600">
                  <Clock className="w-3 h-3" />
                  <span>{timeLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
