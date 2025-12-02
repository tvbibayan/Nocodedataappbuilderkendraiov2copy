import { Workflow, FileJson, Clock } from 'lucide-react';

export function ActivityTimeline() {
  const activities = [
    {
      type: 'flow',
      title: 'Spotify Integration Flow',
      action: 'Flow modified',
      time: '2 hours ago',
      icon: Workflow,
      color: 'cyan',
    },
    {
      type: 'schema',
      title: 'User Profile Schema',
      action: 'Schema updated',
      time: '5 hours ago',
      icon: FileJson,
      color: 'emerald',
    },
    {
      type: 'flow',
      title: 'Google Sheets Export',
      action: 'Flow created',
      time: '1 day ago',
      icon: Workflow,
      color: 'cyan',
    },
    {
      type: 'schema',
      title: 'Product Data Schema',
      action: 'Schema created',
      time: '2 days ago',
      icon: FileJson,
      color: 'emerald',
    },
    {
      type: 'flow',
      title: 'Twitter API Sync',
      action: 'Flow executed',
      time: '3 days ago',
      icon: Workflow,
      color: 'cyan',
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl text-slate-100 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const isLast = index === activities.length - 1;

          return (
            <div key={index} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.color === 'cyan' ? 'bg-cyan-500/20' : 'bg-emerald-500/20'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    activity.color === 'cyan' ? 'text-cyan-400' : 'text-emerald-400'
                  }`} />
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
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
