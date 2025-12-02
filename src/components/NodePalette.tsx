import { Play, Zap, GitBranch, Shuffle } from 'lucide-react';

export function NodePalette() {
  const nodeCategories = [
    {
      category: 'Triggers',
      nodes: [
        { type: 'trigger', label: 'Webhook', icon: Zap },
        { type: 'trigger', label: 'Schedule', icon: Play },
      ],
    },
    {
      category: 'Actions',
      nodes: [
        { type: 'action', label: 'HTTP Request', icon: Zap },
        { type: 'action', label: 'Database', icon: Zap },
      ],
    },
    {
      category: 'Logic',
      nodes: [
        { type: 'logic', label: 'Condition', icon: GitBranch },
        { type: 'logic', label: 'Loop', icon: GitBranch },
      ],
    },
    {
      category: 'Mapping',
      nodes: [
        { type: 'mapping', label: 'Transform', icon: Shuffle },
        { type: 'mapping', label: 'Filter', icon: Shuffle },
      ],
    },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
      <h2 className="text-sm text-slate-400 mb-4">Node Library</h2>
      <div className="space-y-6">
        {nodeCategories.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-xs text-slate-500 mb-2 uppercase tracking-wider">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.nodes.map((node, nodeIdx) => {
                const Icon = node.icon;
                return (
                  <div
                    key={nodeIdx}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg p-3 cursor-move transition-colors"
                    draggable
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-slate-200">{node.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
