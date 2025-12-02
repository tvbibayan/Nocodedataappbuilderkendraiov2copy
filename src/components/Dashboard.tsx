import { Search, Bell } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { ActivityTimeline } from './ActivityTimeline';
import { QuickActions } from './QuickActions';

interface DashboardProps {
  onNavigateToFlows: () => void;
}

export function Dashboard({ onNavigateToFlows }: DashboardProps) {
  const stats = [
    { label: 'Total Flows', value: '24', change: '+3 this week', color: 'cyan' },
    { label: 'Active Adapters', value: '12', change: '8 connected', color: 'emerald' },
    { label: 'Data Sync Health', value: '98%', change: 'All systems operational', color: 'violet' },
  ];

  return (
    <div className="h-full bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl text-slate-100">My Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search flows, schemas..."
                className="pl-10 pr-4 py-2 w-80 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            {/* Notification Bell */}
            <button className="relative p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">
          <ActivityTimeline />
          <QuickActions onNewFlow={onNavigateToFlows} />
        </div>
      </div>
    </div>
  );
}
