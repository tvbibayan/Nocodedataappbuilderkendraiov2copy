interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  color: 'cyan' | 'emerald' | 'violet';
}

export function StatsCard({ label, value, change, color }: StatsCardProps) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
    emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
  };

  const textColorClasses = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    violet: 'text-violet-400',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="text-sm text-slate-400 mb-2">{label}</div>
      <div className={`text-4xl mb-2 ${textColorClasses[color]}`}>{value}</div>
      <div className="text-xs text-slate-500">{change}</div>
    </div>
  );
}
