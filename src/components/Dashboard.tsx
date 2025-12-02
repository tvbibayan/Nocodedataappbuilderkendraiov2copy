import { Search, Bell } from "lucide-react";
import * as React from "react";
import { StatsCard } from "./StatsCard";
import { ActivityTimeline } from "./ActivityTimeline";
import { QuickActions } from "./QuickActions";
import {
  defaultDashboardSchema,
  type DashboardComponentType,
  type DashboardRole,
} from "../config/dashboard";
import { mockDashboardDataSource } from "../data/mock-dashboard-data-source";
import type { DashboardData } from "../data/dashboard-data-source";

interface DashboardProps {
  onNavigateToFlows: () => void;
  initialRole?: DashboardRole;
}

const componentRegistry: Record<DashboardComponentType, React.ComponentType<any>> = {
  ActivityTimeline,
  QuickActions,
};

const columnClassMap: Record<1 | 2 | 3 | 4, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

const colSpanClassMap: Record<1 | 2 | 3 | 4, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
};

function isVisible(item: { visibleTo?: DashboardRole[] }, role: DashboardRole) {
  if (!item.visibleTo || item.visibleTo.length === 0) {
    return true;
  }
  return item.visibleTo.includes(role);
}

export function Dashboard({ onNavigateToFlows, initialRole }: DashboardProps) {
  const { header, stats, sections } = defaultDashboardSchema;
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [role, setRole] = React.useState<DashboardRole>(
    initialRole ?? defaultDashboardSchema.defaultRole,
  );

  React.useEffect(() => {
    let isMounted = true;
    mockDashboardDataSource
      .getDashboardData()
      .then((result) => {
        if (isMounted) {
          setData(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          // handle errors later
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const activityItems = data?.activities ?? [];

  return (
    <div className="h-full bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-slate-100">{header.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <label htmlFor="dashboard-role" className="text-slate-400">
                Role
              </label>
              <select
                id="dashboard-role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as DashboardRole)
                }
                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="viewer">Viewer</option>
                <option value="analyst">Analyst</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder={header.searchPlaceholder}
                className="pl-10 pr-4 py-2 w-80 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            {/* Notification Bell */}
            {header.showNotifications ? (
              <button className="relative p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats
            .filter((stat) => isVisible(stat, role))
            .map((stat) => (
              <StatsCard
                key={stat.id}
                {...stat}
                value={data?.stats[stat.id]?.value ?? stat.value}
                change={data?.stats[stat.id]?.change ?? stat.change}
              />
            ))}
        </div>

        {/* Main Content */}
        {sections
          .filter((section) => isVisible(section, role))
          .map((section) => {
            const sectionColumnsClass = columnClassMap[section.columns];
            const visibleWidgets = section.widgets.filter((widget) =>
              isVisible(widget, role),
            );

            if (visibleWidgets.length === 0) {
              return null;
            }

            return (
              <div
                key={section.id}
                className={`grid gap-6 ${sectionColumnsClass}`}
              >
                {visibleWidgets.map((widget) => {
                  if (widget.type !== "component") {
                    return null;
                  }

                  const Component = componentRegistry[widget.component];
                  if (!Component) {
                    return null;
                  }

                  const resolvedProps = {
                    ...(widget.props ?? {}),
                    ...(widget.component === "QuickActions"
                      ? { onNewFlow: onNavigateToFlows }
                      : {}),
                    ...(widget.component === "ActivityTimeline"
                      ? { activities: activityItems }
                      : {}),
                  };

                  const colSpanClass = widget.colSpan
                    ? colSpanClassMap[widget.colSpan]
                    : undefined;

                  return (
                    <div key={widget.id} className={colSpanClass}>
                      <Component {...resolvedProps} />
                    </div>
                  );
                })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
