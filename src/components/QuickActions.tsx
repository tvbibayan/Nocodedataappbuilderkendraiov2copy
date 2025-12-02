import { Plus, FileJson, Cloud } from "lucide-react";

interface QuickActionsProps {
  onNewFlow: () => void;
  title?: string;
  variant?: "default" | "admin";
}

const primaryButtonByVariant = {
  default:
    "bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/30 hover:shadow-cyan-500/50",
  admin:
    "bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-violet-500/30 hover:shadow-violet-500/50",
};

export function QuickActions({
  onNewFlow,
  title = "Quick Actions",
  variant = "default",
}: QuickActionsProps) {
  const primaryButtonClasses = primaryButtonByVariant[variant] ?? primaryButtonByVariant.default;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-xl text-slate-100 mb-6">{title}</h2>
      <div className="space-y-4">
        {/* Primary Action */}
        <button
          onClick={onNewFlow}
          className={`w-full text-white px-6 py-4 rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg ${primaryButtonClasses}`}
        >
          <Plus className="w-6 h-6" />
          <span className="text-lg">New Flow</span>
        </button>

        {/* Secondary Actions */}
        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors border border-slate-700">
          <FileJson className="w-5 h-5" />
          <span>New Schema</span>
        </button>

        <button className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-lg flex items-center justify-center gap-3 transition-colors border border-slate-700">
          <Cloud className="w-5 h-5" />
          <span>Browse Cloud</span>
        </button>

        {/* Info Card */}
        <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-sm text-slate-300 mb-2">Getting Started</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Create your first flow by connecting data sources, transforming data, and automating workflows without writing code.
          </p>
        </div>
      </div>
    </div>
  );
}
