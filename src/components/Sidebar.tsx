import { LayoutDashboard, Workflow, FileJson, Boxes, Settings, User } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'flows';
  onViewChange: (view: 'dashboard' | 'flows') => void;
}

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flows', label: 'Flows', icon: Workflow },
    { id: 'schemas', label: 'Schemas', icon: FileJson },
    { id: 'adapters', label: 'Adapters', icon: Boxes },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-white">K</span>
          </div>
          <span className="text-xl tracking-tight text-slate-100">Kendraio</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'dashboard' || item.id === 'flows') {
                  onViewChange(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-200">Alex Morgan</div>
            <div className="text-xs text-slate-500">alex@kendraio.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
