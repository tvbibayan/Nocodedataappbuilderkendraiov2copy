import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Workflow,
  Settings,
  Zap,
  Database,
  TrendingUp,
  Activity,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Save,
  Plus,
  Download,
  Upload,
  Bell,
  User,
  Lock,
  Palette,
  Globe,
  Shield,
  Code,
  Check,
  X,
  ChevronRight,
  BarChart3,
  Clock,
  Trash2,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { toast, Toaster } from 'sonner@2.0.3';

// Types
type View = 'dashboard' | 'flow-builder' | 'settings';

interface Node {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  inputs: number;
  outputs: number;
  icon: any;
  color: string;
}

interface Connection {
  from: string;
  to: string;
  fromOutput: number;
  toInput: number;
}

interface Flow {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'stopped';
  lastRun: string;
  nodes: number;
}

// Initial Nodes and Connections
const initialNodes: Node[] = [
  { id: 'node-1', type: 'input', label: 'Data Source', x: 100, y: 200, inputs: 0, outputs: 1, icon: Database, color: '#22d3ee' },
  { id: 'node-2', type: 'transform', label: 'Transform', x: 350, y: 150, inputs: 1, outputs: 2, icon: Zap, color: '#a78bfa' },
  { id: 'node-3', type: 'filter', label: 'Filter', x: 350, y: 280, inputs: 1, outputs: 1, icon: Activity, color: '#f472b6' },
  { id: 'node-4', type: 'output', label: 'Output', x: 600, y: 200, inputs: 2, outputs: 0, icon: TrendingUp, color: '#34d399' },
];

const initialConnections: Connection[] = [
  { from: 'node-1', to: 'node-2', fromOutput: 0, toInput: 0 },
  { from: 'node-1', to: 'node-3', fromOutput: 0, toInput: 0 },
  { from: 'node-2', to: 'node-4', fromOutput: 0, toInput: 0 },
  { from: 'node-3', to: 'node-4', fromOutput: 0, toInput: 1 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [connections] = useState<Connection[]>(initialConnections);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [flows, setFlows] = useState<Flow[]>([
    { id: '1', name: 'Data Pipeline A', status: 'running', lastRun: '2m ago', nodes: 4 },
    { id: '2', name: 'Transform Job B', status: 'completed', lastRun: '15m ago', nodes: 6 },
    { id: '3', name: 'Export Task C', status: 'running', lastRun: '1h ago', nodes: 3 },
  ]);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [apiKey, setApiKey] = useState('sk_live_****************************');
  const canvasRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const handleNodeMouseDown = (e: React.MouseEvent, node: Node) => {
    e.stopPropagation();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDraggedNode(node.id);
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - node.x,
        y: (e.clientY - rect.top) / zoom - node.y,
      });
      setSelectedNode(node);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
      const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggedNode ? { ...node, x: newX, y: newY } : node
        )
      );
    }
  };

  const handleMouseUp = () => {
    if (draggedNode && autoSave) {
      toast.success('Node position saved');
    }
    setDraggedNode(null);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((z) => Math.min(z + 0.1, 2));
    toast.success('Zoomed in');
  };
  
  const handleZoomOut = () => {
    setZoom((z) => Math.max(z - 0.1, 0.5));
    toast.success('Zoomed out');
  };
  
  const handleFitToScreen = () => {
    setZoom(1);
    toast.success('Reset to 100%');
  };

  // Flow actions
  const handleCreateFlow = () => {
    const newFlow: Flow = {
      id: String(flows.length + 1),
      name: `New Flow ${flows.length + 1}`,
      status: 'stopped',
      lastRun: 'Never',
      nodes: Math.floor(Math.random() * 5) + 2,
    };
    setFlows([...flows, newFlow]);
    toast.success('New flow created successfully!');
  };

  const handleRunAllFlows = () => {
    setFlows(flows.map(f => ({ ...f, status: 'running' as const, lastRun: 'Just now' })));
    toast.success('All flows are now running!');
  };

  const handleExportData = () => {
    toast.success('Data exported successfully!');
    // Simulate download
    setTimeout(() => {
      toast.info('Download started: kendraio_export.json');
    }, 500);
  };

  const handleRunFlow = (id: string) => {
    setFlows(flows.map(f => 
      f.id === id ? { ...f, status: 'running' as const, lastRun: 'Just now' } : f
    ));
    toast.success('Flow started successfully!');
  };

  const handleStopFlow = (id: string) => {
    setFlows(flows.map(f => 
      f.id === id ? { ...f, status: 'stopped' as const } : f
    ));
    toast.info('Flow stopped');
  };

  const handleDeleteFlow = (id: string) => {
    setFlows(flows.filter(f => f.id !== id));
    toast.success('Flow deleted');
  };

  const handleDuplicateFlow = (id: string) => {
    const flow = flows.find(f => f.id === id);
    if (flow) {
      const newFlow: Flow = {
        ...flow,
        id: String(flows.length + 1),
        name: `${flow.name} (Copy)`,
        status: 'stopped',
      };
      setFlows([...flows, newFlow]);
      toast.success('Flow duplicated!');
    }
  };

  // Generate SVG path for connections
  const getConnectionPath = (from: Node, to: Node): string => {
    const startX = from.x + 120;
    const startY = from.y + 40;
    const endX = to.x;
    const endY = to.y + 40;
    const controlPointOffset = Math.abs(endX - startX) / 2;
    return `M ${startX} ${startY} C ${startX + controlPointOffset} ${startY}, ${endX - controlPointOffset} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 overflow-hidden">
      <Toaster position="top-right" theme="dark" />
      
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-white/10 bg-slate-950/50 backdrop-blur-md flex flex-col"
      >
        <div className="p-6 border-b border-white/10">
          <h1 className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="tracking-tight">Kendraio</span>
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavButton
            icon={LayoutDashboard}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => {
              setCurrentView('dashboard');
              toast.success('Switched to Dashboard');
            }}
          />
          <NavButton
            icon={Workflow}
            label="Flow Builder"
            active={currentView === 'flow-builder'}
            onClick={() => {
              setCurrentView('flow-builder');
              toast.success('Opened Flow Builder');
            }}
          />
          <NavButton
            icon={Settings}
            label="Settings"
            active={currentView === 'settings'}
            onClick={() => {
              setCurrentView('settings');
              toast.success('Opened Settings');
            }}
          />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-cyan-400">System Status</span>
            </div>
            <p className="text-xs text-slate-400">All systems operational</p>
            <div className="mt-2 flex gap-1">
              <div className="h-1 flex-1 bg-cyan-500/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <Dashboard
              key="dashboard"
              flows={flows}
              selectedStat={selectedStat}
              onStatClick={setSelectedStat}
              onCreateFlow={handleCreateFlow}
              onRunAllFlows={handleRunAllFlows}
              onExportData={handleExportData}
              onRunFlow={handleRunFlow}
              onStopFlow={handleStopFlow}
              onDeleteFlow={handleDeleteFlow}
              onDuplicateFlow={handleDuplicateFlow}
            />
          )}
          {currentView === 'flow-builder' && (
            <FlowBuilder
              key="flow-builder"
              nodes={nodes}
              connections={connections}
              selectedNode={selectedNode}
              zoom={zoom}
              canvasRef={canvasRef}
              onNodeMouseDown={handleNodeMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onFitToScreen={handleFitToScreen}
              getConnectionPath={getConnectionPath}
            />
          )}
          {currentView === 'settings' && (
            <SettingsView
              key="settings"
              notifications={notifications}
              setNotifications={setNotifications}
              autoSave={autoSave}
              setAutoSave={setAutoSave}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              apiKey={apiKey}
              setApiKey={setApiKey}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Navigation Button Component
function NavButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/20'
          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </motion.button>
  );
}

// Dashboard Component
function Dashboard({
  flows,
  selectedStat,
  onStatClick,
  onCreateFlow,
  onRunAllFlows,
  onExportData,
  onRunFlow,
  onStopFlow,
  onDeleteFlow,
  onDuplicateFlow,
}: any) {
  const stats = [
    { id: 'flows', label: 'Active Flows', value: String(flows.filter((f: Flow) => f.status === 'running').length), change: '+12%', icon: Workflow, color: 'cyan' },
    { id: 'data', label: 'Data Processed', value: '1.2M', change: '+8%', icon: Database, color: 'purple' },
    { id: 'performance', label: 'Performance', value: '98%', change: '+2%', icon: TrendingUp, color: 'green' },
    { id: 'connections', label: 'Connections', value: '156', change: '+24%', icon: Activity, color: 'pink' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 overflow-auto p-8"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2">Dashboard Overview</h2>
            <p className="text-slate-400">Monitor your data flows and system performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              toast.info('Refreshing dashboard data...');
              setTimeout(() => toast.success('Dashboard refreshed!'), 800);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group cursor-pointer"
              onClick={() => {
                onStatClick(stat.id);
                toast.info(`Viewing ${stat.label} details`);
              }}
            >
              <StatCard {...stat} isSelected={selectedStat === stat.id} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityCard
            flows={flows}
            onRunFlow={onRunFlow}
            onStopFlow={onStopFlow}
            onDeleteFlow={onDeleteFlow}
            onDuplicateFlow={onDuplicateFlow}
          />
          <QuickActionsCard
            onCreateFlow={onCreateFlow}
            onRunAllFlows={onRunAllFlows}
            onExportData={onExportData}
          />
        </div>

        {selectedStat && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-md border border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                Detailed Analytics: {stats.find(s => s.id === selectedStat)?.label}
              </h3>
              <button
                onClick={() => onStatClick(null)}
                className="p-1 rounded hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-slate-400">Today</span>
                <span>{stats.find(s => s.id === selectedStat)?.value}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-slate-400">This Week</span>
                <span className="text-green-400">+{stats.find(s => s.id === selectedStat)?.change}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-slate-400">This Month</span>
                <span className="text-cyan-400">+32%</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Stat Card Component
function StatCard({ label, value, change, icon: Icon, color, isSelected }: any) {
  const colorMap: any = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400 shadow-cyan-500/20',
    purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400 shadow-purple-500/20',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400 shadow-green-500/20',
    pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-400 shadow-pink-500/20',
  };

  return (
    <div
      className={`relative p-6 rounded-xl bg-gradient-to-br backdrop-blur-md border transition-all group-hover:shadow-lg ${colorMap[color]} ${
        isSelected ? 'ring-2 ring-offset-2 ring-offset-slate-950 ring-cyan-500' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs text-green-400">{change}</span>
      </div>
      <div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-3xl">{value}</p>
      </div>
      {isSelected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-cyan-500 rounded-full"
        />
      )}
    </div>
  );
}

// Activity Card
function ActivityCard({ flows, onRunFlow, onStopFlow, onDeleteFlow, onDuplicateFlow }: any) {
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10">
      <h3 className="mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Active Flows ({flows.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {flows.map((flow: Flow, i: number) => (
          <motion.div
            key={flow.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg bg-white/5 border border-white/5 overflow-hidden"
          >
            <div
              className="flex items-center justify-between p-3 hover:bg-white/10 transition-all cursor-pointer"
              onClick={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
            >
              <div className="flex-1">
                <p className="text-sm">{flow.name}</p>
                <p className="text-xs text-slate-500">{flow.lastRun} • {flow.nodes} nodes</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    flow.status === 'running'
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : flow.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-500/20 text-slate-400'
                  }`}
                >
                  {flow.status}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    expandedFlow === flow.id ? 'rotate-90' : ''
                  }`}
                />
              </div>
            </div>
            
            <AnimatePresence>
              {expandedFlow === flow.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        flow.status === 'running' ? onStopFlow(flow.id) : onRunFlow(flow.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
                    >
                      {flow.status === 'running' ? (
                        <>
                          <X className="w-4 h-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateFlow(flow.id);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFlow(flow.id);
                      }}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Quick Actions Card
function QuickActionsCard({ onCreateFlow, onRunAllFlows, onExportData }: any) {
  const actions = [
    { label: 'Create New Flow', icon: Plus, action: onCreateFlow, color: 'cyan' },
    { label: 'Run All Flows', icon: Play, action: onRunAllFlows, color: 'green' },
    { label: 'Export Data', icon: Download, action: onExportData, color: 'purple' },
    { label: 'Import Configuration', icon: Upload, action: () => toast.info('Import dialog opened'), color: 'pink' },
  ];

  return (
    <div className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10">
      <h3 className="mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-cyan-400" />
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-${action.color}-500/20 hover:border-${action.color}-500/30 border border-transparent transition-all`}
          >
            <action.icon className={`w-6 h-6 text-${action.color}-400`} />
            <span className="text-sm text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Flow Builder Component
function FlowBuilder({
  nodes,
  connections,
  selectedNode,
  zoom,
  canvasRef,
  onNodeMouseDown,
  onMouseMove,
  onMouseUp,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  getConnectionPath,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex overflow-hidden"
    >
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(34, 211, 238, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(34, 211, 238, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Particle Effect */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * 1000,
                  y: Math.random() * 800,
                  opacity: 0,
                }}
                animate={{
                  y: [null, Math.random() * 800],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="absolute inset-0 cursor-move"
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              width: '100%',
              height: '100%',
            }}
          >
            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {connections.map((conn: Connection, i: number) => {
                const fromNode = nodes.find((n: Node) => n.id === conn.from);
                const toNode = nodes.find((n: Node) => n.id === conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <motion.path
                    key={i}
                    d={getConnectionPath(fromNode, toNode)}
                    stroke="rgba(34, 211, 238, 0.4)"
                    strokeWidth="2"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node: Node) => (
              <FlowNode
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onMouseDown={(e: React.MouseEvent) => onNodeMouseDown(e, node)}
              />
            ))}
          </div>
        </div>

        {/* Floating Toolbar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10">
          <ToolbarButton icon={ZoomOut} onClick={onZoomOut} label="Zoom Out" />
          <div className="px-3 py-2 text-sm text-slate-400">{Math.round(zoom * 100)}%</div>
          <ToolbarButton icon={ZoomIn} onClick={onZoomIn} label="Zoom In" />
          <div className="w-px bg-white/10 mx-1" />
          <ToolbarButton icon={Maximize2} onClick={onFitToScreen} label="Fit to Screen" />
          <div className="w-px bg-white/10 mx-1" />
          <ToolbarButton
            icon={Save}
            onClick={() => toast.success('Flow saved successfully!')}
            label="Save"
          />
          <ToolbarButton
            icon={Play}
            onClick={() => toast.success('Flow execution started!')}
            label="Run Flow"
          />
        </div>
      </div>

      {/* Configuration Panel */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 border-l border-white/10 bg-slate-950/50 backdrop-blur-md p-6 overflow-auto"
      >
        <h3 className="mb-4">Configuration</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Node Type</label>
              <p className="mt-1 text-cyan-400">{selectedNode.type}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">Label</label>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) => {
                  // Update would happen here
                  toast.info('Label updated');
                }}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-400">Inputs</label>
                <p className="mt-1">{selectedNode.inputs}</p>
              </div>
              <div>
                <label className="text-sm text-slate-400">Outputs</label>
                <p className="mt-1">{selectedNode.outputs}</p>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400">Position</label>
              <div className="mt-1 text-xs text-slate-500">
                X: {Math.round(selectedNode.x)}, Y: {Math.round(selectedNode.y)}
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <label className="text-sm text-slate-400 block mb-2">Actions</label>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success('Node duplicated!')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Node
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.error('Node deleted')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Node
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Workflow className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">Select a node to view configuration</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Flow Node Component
function FlowNode({ node, isSelected, onMouseDown }: any) {
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ left: node.x, top: node.y }}
      onMouseDown={onMouseDown}
    >
      <div
        className={`w-32 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border transition-all ${
          isSelected
            ? 'border-cyan-500 shadow-lg shadow-cyan-500/50'
            : 'border-white/20 hover:border-white/40'
        }`}
        style={{
          boxShadow: isSelected ? `0 0 20px ${node.color}80` : undefined,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${node.color}20` }}
          >
            <Icon className="w-4 h-4" style={{ color: node.color }} />
          </div>
        </div>
        <p className="text-sm">{node.label}</p>

        {/* Input/Output Ports */}
        {node.inputs > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
          </div>
        )}
        {node.outputs > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <div className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-900" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Toolbar Button
function ToolbarButton({ icon: Icon, onClick, label }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-all"
      title={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}

// Settings View Component
function SettingsView({
  notifications,
  setNotifications,
  autoSave,
  setAutoSave,
  darkMode,
  setDarkMode,
  apiKey,
  setApiKey,
}: any) {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Code },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 overflow-auto p-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="mb-2">Settings</h2>
          <p className="text-slate-400">Manage your application preferences and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Tabs */}
          <div className="space-y-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  toast.success(`Switched to ${tab.label} settings`);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard
                    title="Auto-Save"
                    description="Automatically save changes as you work"
                    icon={Save}
                  >
                    <ToggleSwitch
                      enabled={autoSave}
                      onChange={(val) => {
                        setAutoSave(val);
                        toast.success(val ? 'Auto-save enabled' : 'Auto-save disabled');
                      }}
                    />
                  </SettingCard>

                  <SettingCard
                    title="Language & Region"
                    description="Set your preferred language and region"
                    icon={Globe}
                  >
                    <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all">
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </SettingCard>

                  <SettingCard
                    title="Time Zone"
                    description="Configure your local time zone"
                    icon={Clock}
                  >
                    <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all">
                      <option>UTC-8 (Pacific)</option>
                      <option>UTC-5 (Eastern)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+1 (CET)</option>
                    </select>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard title="Profile Information" icon={User}>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Full Name</label>
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-slate-400 block mb-1">Email</label>
                        <input
                          type="email"
                          defaultValue="john@kendraio.com"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success('Profile updated successfully!')}
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                      >
                        Update Profile
                      </motion.button>
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard title="API Key" description="Manage your API authentication" icon={Lock}>
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toast.success('API key regenerated!')}
                          className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
                        >
                          Regenerate Key
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            navigator.clipboard.writeText(apiKey);
                            toast.success('API key copied to clipboard!');
                          }}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm"
                        >
                          Copy
                        </motion.button>
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard title="Two-Factor Authentication" description="Add an extra layer of security" icon={Shield}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toast.info('2FA setup wizard opened')}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all"
                    >
                      Enable 2FA
                    </motion.button>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard title="Dark Mode" description="Toggle dark mode theme" icon={Palette}>
                    <ToggleSwitch
                      enabled={darkMode}
                      onChange={(val) => {
                        setDarkMode(val);
                        toast.success(val ? 'Dark mode enabled' : 'Light mode enabled');
                      }}
                    />
                  </SettingCard>

                  <SettingCard title="Accent Color" description="Customize your accent color" icon={Palette}>
                    <div className="grid grid-cols-6 gap-3">
                      {['#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fb923c', '#fbbf24'].map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast.success(`Accent color changed to ${color}`)}
                          className="w-12 h-12 rounded-lg border-2 border-white/20 hover:border-white/60 transition-all"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'integrations' && (
                <motion.div
                  key="integrations"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard title="Webhook URL" description="Configure webhook endpoint" icon={Code}>
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="https://api.example.com/webhook"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:outline-none transition-all"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success('Webhook URL saved!')}
                        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                      >
                        Save Webhook
                      </motion.button>
                    </div>
                  </SettingCard>

                  <SettingCard title="Connected Services" icon={Globe}>
                    <div className="space-y-2">
                      {['GitHub', 'Slack', 'Discord', 'Zapier'].map((service) => (
                        <div key={service} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span>{service}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.success(`Connected to ${service}!`)}
                            className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all text-sm"
                          >
                            Connect
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  </SettingCard>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <SettingCard title="Email Notifications" description="Receive updates via email" icon={Bell}>
                    <ToggleSwitch
                      enabled={notifications}
                      onChange={(val) => {
                        setNotifications(val);
                        toast.success(val ? 'Notifications enabled' : 'Notifications disabled');
                      }}
                    />
                  </SettingCard>

                  <SettingCard title="Notification Preferences" icon={Bell}>
                    <div className="space-y-3">
                      {['Flow completions', 'System alerts', 'Weekly reports', 'Security updates'].map((pref) => (
                        <div key={pref} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                          <span className="text-sm">{pref}</span>
                          <ToggleSwitch enabled={true} onChange={() => toast.info(`${pref} toggled`)} />
                        </div>
                      ))}
                    </div>
                  </SettingCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Setting Card Component
function SettingCard({ title, description, icon: Icon, children }: any) {
  return (
    <div className="p-6 rounded-xl bg-slate-900/50 backdrop-blur-md border border-white/10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
            <h4>{title}</h4>
          </div>
          {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange }: any) {
  return (
    <motion.button
      onClick={() => onChange(!enabled)}
      className={`relative w-14 h-7 rounded-full transition-all ${
        enabled ? 'bg-cyan-500' : 'bg-slate-700'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-lg"
        animate={{ x: enabled ? 28 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}
