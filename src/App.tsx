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
  ToggleLeft,
  ToggleRight,
  Layers,
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { CanvasDashboard } from './components/CanvasDashboard';

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

// Warm Palette Color Constants
const COLORS = {
  background: '#3a3238',      // Warm Charcoal - Main canvas
  surface: '#3c1627',         // Deep Plum - Sidebars, Cards, Modals
  primary: '#8b3b2d',         // Rust Red - CTA buttons, Active states
  secondary: '#6d222d',       // Deep Maroon - Hover states, secondary headers
  highlight: '#c19aa9',       // Muted Rose - Borders, Icons, Selected text
  text: '#FFF5F7',            // Warm Off-White - Main text
  textMuted: '#c19aa9',       // Muted Rose - Subtitles, metadata
};

// Initial Nodes and Connections with Warm Palette
const initialNodes: Node[] = [
  { id: 'node-1', type: 'trigger', label: 'Data Source', x: 100, y: 200, inputs: 0, outputs: 1, icon: Database, color: '#8b3b2d' },
  { id: 'node-2', type: 'process', label: 'Transform', x: 350, y: 150, inputs: 1, outputs: 2, icon: Zap, color: '#6d222d' },
  { id: 'node-3', type: 'api', label: 'API Call', x: 350, y: 280, inputs: 1, outputs: 1, icon: Activity, color: '#c19aa9' },
  { id: 'node-4', type: 'output', label: 'Save Output', x: 600, y: 200, inputs: 2, outputs: 0, icon: TrendingUp, color: '#8b3b2d' },
];

const initialConnections: Connection[] = [
  { from: 'node-1', to: 'node-2', fromOutput: 0, toInput: 0 },
  { from: 'node-1', to: 'node-3', fromOutput: 0, toInput: 0 },
  { from: 'node-2', to: 'node-4', fromOutput: 0, toInput: 0 },
  { from: 'node-3', to: 'node-4', fromOutput: 0, toInput: 1 },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [canvasMode, setCanvasMode] = useState(false);
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
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.background, color: COLORS.text }}>
      <Toaster position="top-right" theme="dark" richColors />
      
      {/* Sidebar - Warm Glassmorphism */}
      <aside className="w-64 flex flex-col" style={{ backgroundColor: `${COLORS.surface}e6`, borderRight: `1px solid ${COLORS.highlight}33`, backdropFilter: 'blur(12px)' }}>
        <div className="p-5" style={{ borderBottom: `1px solid ${COLORS.highlight}33` }}>
          <h1 className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: COLORS.primary, boxShadow: `0 4px 20px ${COLORS.primary}40` }}>
              <Zap className="w-5 h-5" style={{ color: COLORS.text }} />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: COLORS.text }}>Kendraio</span>
          </h1>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavButton
            icon={LayoutDashboard}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => {
              setCurrentView('dashboard');
            }}
          />
          <NavButton
            icon={Workflow}
            label="Flow Builder"
            active={currentView === 'flow-builder'}
            onClick={() => {
              setCurrentView('flow-builder');
            }}
          />
          <NavButton
            icon={Settings}
            label="Settings"
            active={currentView === 'settings'}
            onClick={() => {
              setCurrentView('settings');
            }}
          />
        </nav>

        <div className="p-4" style={{ borderTop: `1px solid ${COLORS.highlight}33` }}>
          <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33` }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COLORS.primary }} />
              <span className="text-xs font-semibold" style={{ color: COLORS.textMuted }}>System Status</span>
            </div>
            <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>All systems operational</p>
            <div className="flex gap-1.5">
              <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.background }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-medium" style={{ color: COLORS.primary }}>78%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            canvasMode ? (
              <CanvasDashboard
                key="canvas-dashboard"
                onNavigateToFlows={() => setCurrentView('flow-builder')}
              />
            ) : (
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
                canvasMode={canvasMode}
                onToggleCanvasMode={() => setCanvasMode(!canvasMode)}
              />
            )
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

// Navigation Button Component - Warm Vintage Style
function NavButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
      style={{
        backgroundColor: active ? `${COLORS.primary}33` : 'transparent',
        color: active ? COLORS.text : COLORS.textMuted,
        fontWeight: active ? 600 : 400,
        border: active ? `1px solid ${COLORS.primary}50` : '1px solid transparent',
      }}
    >
      <Icon className="w-4.5 h-4.5" style={{ color: active ? COLORS.highlight : COLORS.textMuted }} />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="ml-auto w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: COLORS.highlight }}
        />
      )}
    </motion.button>
  );
}

// Dashboard Component - Warm Vintage Bento Layout
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
  canvasMode,
  onToggleCanvasMode,
}: any) {
  // Warm Palette Stats
  const stats = [
    { id: 'flows', label: 'Active Flows', value: String(flows.filter((f: Flow) => f.status === 'running').length), change: '+12%', icon: Workflow, description: 'Running pipelines' },
    { id: 'data', label: 'Data Processed', value: '1.2M', change: '+8%', icon: Database, description: 'Records transformed' },
    { id: 'performance', label: 'System Health', value: '98%', change: '+2%', icon: TrendingUp, description: 'Uptime status' },
    { id: 'errors', label: 'Error Rate', value: '0.2%', change: '-5%', icon: Activity, description: 'Failed operations' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-auto p-8"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: COLORS.text }}>Dashboard</h2>
            <p style={{ color: COLORS.textMuted }}>Monitor your data flows and system performance</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onToggleCanvasMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
              style={{
                backgroundColor: canvasMode ? `${COLORS.primary}33` : `${COLORS.surface}cc`,
                border: `1px solid ${canvasMode ? COLORS.primary : COLORS.highlight}33`,
                color: canvasMode ? COLORS.text : COLORS.textMuted,
              }}
            >
              <Layers className="w-4 h-4" />
              <span className="text-sm font-medium">Canvas Mode</span>
              {canvasMode ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                toast.info('Refreshing dashboard data...');
                setTimeout(() => toast.success('Dashboard refreshed!'), 800);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium shadow-lg transition-shadow"
              style={{ backgroundColor: COLORS.primary, color: COLORS.text, boxShadow: `0 4px 20px ${COLORS.primary}40` }}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </motion.button>
          </div>
        </div>

        {/* Bento Grid - Semantic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="cursor-pointer"
              onClick={() => {
                onStatClick(stat.id);
                toast.info(`Viewing ${stat.label} details`);
              }}
            >
              <BentoStatCard {...stat} isSelected={selectedStat === stat.id} />
            </motion.div>
          ))}
        </div>

        {/* Bento Grid - Activity & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ActivityCard
              flows={flows}
              onRunFlow={onRunFlow}
              onStopFlow={onStopFlow}
              onDeleteFlow={onDeleteFlow}
              onDuplicateFlow={onDuplicateFlow}
            />
          </div>
          <QuickActionsCard
            onCreateFlow={onCreateFlow}
            onRunAllFlows={onRunAllFlows}
            onExportData={onExportData}
          />
        </div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {selectedStat && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div 
                className="p-6 rounded-2xl"
                style={{ backgroundColor: `${COLORS.surface}e6`, backdropFilter: 'blur(8px)', border: `1px solid ${COLORS.highlight}33` }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="flex items-center gap-3 font-semibold text-lg" style={{ color: COLORS.text }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.primary}33` }}>
                      <BarChart3 className="w-5 h-5" style={{ color: COLORS.highlight }} />
                    </div>
                    Detailed Analytics: {stats.find(s => s.id === selectedStat)?.label}
                  </h3>
                  <button
                    onClick={() => onStatClick(null)}
                    className="p-2 rounded-lg transition-colors"
                    style={{ color: COLORS.textMuted }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}>
                    <span className="text-sm" style={{ color: COLORS.textMuted }}>Today</span>
                    <p className="text-2xl font-bold mt-1" style={{ color: COLORS.text }}>{stats.find(s => s.id === selectedStat)?.value}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.primary}20`, border: `1px solid ${COLORS.primary}40` }}>
                    <span className="text-sm" style={{ color: COLORS.highlight }}>This Week</span>
                    <p className="text-2xl font-bold mt-1" style={{ color: COLORS.text }}>+{stats.find(s => s.id === selectedStat)?.change}</p>
                  </div>
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.secondary}20`, border: `1px solid ${COLORS.secondary}40` }}>
                    <span className="text-sm" style={{ color: COLORS.highlight }}>This Month</span>
                    <p className="text-2xl font-bold mt-1" style={{ color: COLORS.text }}>+32%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Bento Stat Card - Warm Vintage Style
function BentoStatCard({ label, value, change, icon: Icon, description, isSelected }: any) {
  const isPositive = change.startsWith('+');

  return (
    <div
      className="relative p-5 rounded-2xl transition-all duration-300 overflow-hidden"
      style={{
        backgroundColor: `${COLORS.surface}e6`,
        backdropFilter: 'blur(8px)',
        border: `1px solid ${isSelected ? COLORS.highlight : COLORS.highlight}33`,
        boxShadow: isSelected ? `0 0 20px ${COLORS.highlight}20` : 'none',
      }}
    >
      {/* Subtle gradient background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{ background: `linear-gradient(135deg, ${COLORS.secondary}20 0%, transparent 60%)` }}
      />
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2"
        style={{ background: `linear-gradient(135deg, ${COLORS.highlight}10 0%, transparent 60%)` }}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="p-2.5 rounded-xl"
            style={{ backgroundColor: `${COLORS.primary}33`, border: `1px solid ${COLORS.primary}50` }}
          >
            <Icon className="w-5 h-5" style={{ color: COLORS.highlight }} />
          </div>
          <span 
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{ 
              backgroundColor: isPositive ? `${COLORS.primary}33` : `${COLORS.secondary}33`,
              color: isPositive ? COLORS.text : COLORS.textMuted
            }}
          >
            {change}
          </span>
        </div>
        <div>
          <p className="text-sm mb-1" style={{ color: COLORS.textMuted }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: COLORS.text }}>
            {value}
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{description}</p>
        </div>
      </div>
    </div>
  );
}

// Activity Card - Warm Glassmorphism Style
function ActivityCard({ flows, onRunFlow, onStopFlow, onDeleteFlow, onDuplicateFlow }: any) {
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return { bg: `${COLORS.primary}33`, text: COLORS.text, dot: COLORS.primary };
      case 'completed': return { bg: `${COLORS.highlight}33`, text: COLORS.highlight, dot: COLORS.highlight };
      default: return { bg: `${COLORS.background}cc`, text: COLORS.textMuted, dot: COLORS.textMuted };
    }
  };

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ backgroundColor: `${COLORS.surface}e6`, backdropFilter: 'blur(8px)', border: `1px solid ${COLORS.highlight}33` }}
    >
      <h3 className="mb-5 flex items-center gap-3 font-semibold text-lg" style={{ color: COLORS.text }}>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.primary}33`, border: `1px solid ${COLORS.primary}50` }}>
          <Activity className="w-4 h-4" style={{ color: COLORS.highlight }} />
        </div>
        Active Flows
        <span className="ml-auto text-sm font-normal" style={{ color: COLORS.textMuted }}>{flows.length} total</span>
      </h3>
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {flows.map((flow: Flow) => {
          const statusColors = getStatusColor(flow.status);
          return (
            <motion.div
              key={flow.id}
              layout
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}
            >
              <div
                className="flex items-center justify-between p-4 transition-colors cursor-pointer hover:opacity-90"
                onClick={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className={`w-2 h-2 rounded-full ${flow.status === 'running' ? 'animate-pulse' : ''}`}
                    style={{ backgroundColor: statusColors.dot }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: COLORS.text }}>{flow.name}</p>
                    <p className="text-xs" style={{ color: COLORS.textMuted }}>{flow.lastRun} • {flow.nodes} nodes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span 
                    className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                  >
                    {flow.status}
                  </span>
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${expandedFlow === flow.id ? 'rotate-90' : ''}`}
                    style={{ color: COLORS.textMuted }}
                  />
                </div>
              </div>
              
              <AnimatePresence>
                {expandedFlow === flow.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ borderTop: `1px solid ${COLORS.highlight}20` }}
                  >
                    <div className="p-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => { e.stopPropagation(); flow.status === 'running' ? onStopFlow(flow.id) : onRunFlow(flow.id); }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{
                          backgroundColor: flow.status === 'running' ? `${COLORS.secondary}33` : `${COLORS.primary}33`,
                          color: COLORS.text,
                          border: `1px solid ${flow.status === 'running' ? COLORS.secondary : COLORS.primary}50`,
                        }}
                      >
                        {flow.status === 'running' ? <><X className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Run</>}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onDuplicateFlow(flow.id); }}
                        className="p-2.5 rounded-xl transition-colors"
                        style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.textMuted }}
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => { e.stopPropagation(); onDeleteFlow(flow.id); }}
                        className="p-2.5 rounded-xl transition-colors"
                        style={{ backgroundColor: `${COLORS.secondary}33`, border: `1px solid ${COLORS.secondary}50`, color: COLORS.highlight }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Quick Actions Card - Warm Vintage Style
function QuickActionsCard({ onCreateFlow, onRunAllFlows, onExportData }: any) {
  const actions = [
    { label: 'New Flow', icon: Plus, action: onCreateFlow, description: 'Create pipeline' },
    { label: 'Run All', icon: Play, action: onRunAllFlows, description: 'Execute flows' },
    { label: 'Export', icon: Download, action: onExportData, description: 'Download data' },
    { label: 'Import', icon: Upload, action: () => toast.info('Import dialog opened'), description: 'Load config' },
  ];

  return (
    <div 
      className="p-6 rounded-2xl"
      style={{ backgroundColor: `${COLORS.surface}e6`, backdropFilter: 'blur(8px)', border: `1px solid ${COLORS.highlight}33` }}
    >
      <h3 className="mb-5 flex items-center gap-3 font-semibold text-lg" style={{ color: COLORS.text }}>
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.primary}33`, border: `1px solid ${COLORS.primary}50` }}>
          <Zap className="w-4 h-4" style={{ color: COLORS.highlight }} />
        </div>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.action}
            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
            style={{ 
              backgroundColor: `${COLORS.background}cc`, 
              border: `1px solid ${COLORS.highlight}33`,
            }}
          >
            <action.icon className="w-6 h-6" style={{ color: COLORS.highlight }} />
            <span className="text-sm font-medium" style={{ color: COLORS.text }}>{action.label}</span>
            <span className="text-xs" style={{ color: COLORS.textMuted }}>{action.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Flow Builder Component - Warm Vintage Theme
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
      style={{ backgroundColor: COLORS.background }}
    >
      {/* Canvas Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Warm Grid Background */}
        <div className="absolute inset-0" style={{ backgroundColor: COLORS.background }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, ${COLORS.highlight}08 1px, transparent 1px),
                linear-gradient(to bottom, ${COLORS.highlight}08 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />
          {/* Subtle radial gradient for depth */}
          <div 
            className="absolute inset-0" 
            style={{ background: `radial-gradient(ellipse at center, ${COLORS.surface}20 0%, transparent 70%)` }}
          />
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
            {/* SVG Connections - Warm Gradient Bezier */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b3b2d" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#c19aa9" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6d222d" stopOpacity="0.6" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
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
                    stroke="url(#connectionGradient)"
                    strokeWidth="3"
                    fill="none"
                    filter="url(#glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node: Node, i: number) => (
              <FlowNode
                key={node.id}
                node={node}
                index={i}
                isSelected={selectedNode?.id === node.id}
                onMouseDown={(e: React.MouseEvent) => onNodeMouseDown(e, node)}
              />
            ))}
          </div>
        </div>

        {/* Floating Toolbar - Warm Glassmorphism */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 p-2 rounded-2xl shadow-2xl"
          style={{ backgroundColor: `${COLORS.surface}e6`, backdropFilter: 'blur(12px)', border: `1px solid ${COLORS.highlight}33` }}
        >
          <ToolbarButton icon={ZoomOut} onClick={onZoomOut} label="Zoom Out" />
          <div className="px-4 py-2 text-sm font-medium" style={{ color: COLORS.textMuted }}>{Math.round(zoom * 100)}%</div>
          <ToolbarButton icon={ZoomIn} onClick={onZoomIn} label="Zoom In" />
          <div className="w-px mx-1" style={{ backgroundColor: `${COLORS.highlight}33` }} />
          <ToolbarButton icon={Maximize2} onClick={onFitToScreen} label="Fit to Screen" />
          <div className="w-px mx-1" style={{ backgroundColor: `${COLORS.highlight}33` }} />
          <ToolbarButton icon={Save} onClick={() => toast.success('Flow saved successfully!')} label="Save" semantic="primary" />
          <ToolbarButton icon={Play} onClick={() => toast.success('Flow execution started!')} label="Run Flow" semantic="primary" />
        </div>
      </div>

      {/* Configuration Panel - Warm Glassmorphism */}
      <div 
        className="w-80 p-6 overflow-auto"
        style={{ backgroundColor: `${COLORS.surface}e6`, backdropFilter: 'blur(12px)', borderLeft: `1px solid ${COLORS.highlight}33` }}
      >
        <h3 className="mb-5 text-lg font-semibold" style={{ color: COLORS.text }}>Configuration</h3>
        {selectedNode ? (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Node Type</label>
              <p className="mt-1.5 font-medium capitalize" style={{ color: COLORS.text }}>{selectedNode.type}</p>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider block mb-1.5" style={{ color: COLORS.textMuted }}>Label</label>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) => toast.info('Label updated')}
                className="w-full px-4 py-2.5 rounded-xl transition-all"
                style={{ 
                  backgroundColor: `${COLORS.background}cc`, 
                  border: `1px solid ${COLORS.highlight}33`, 
                  color: COLORS.text,
                  outline: 'none'
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}>
                <label className="text-xs" style={{ color: COLORS.textMuted }}>Inputs</label>
                <p className="text-xl font-bold mt-1" style={{ color: COLORS.text }}>{selectedNode.inputs}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}>
                <label className="text-xs" style={{ color: COLORS.textMuted }}>Outputs</label>
                <p className="text-xl font-bold mt-1" style={{ color: COLORS.text }}>{selectedNode.outputs}</p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium uppercase tracking-wider" style={{ color: COLORS.textMuted }}>Position</label>
              <div className="mt-1.5 text-sm font-mono" style={{ color: COLORS.text }}>
                X: {Math.round(selectedNode.x)} • Y: {Math.round(selectedNode.y)}
              </div>
            </div>
            <div className="pt-5" style={{ borderTop: `1px solid ${COLORS.highlight}33` }}>
              <label className="text-xs font-medium uppercase tracking-wider block mb-3" style={{ color: COLORS.textMuted }}>Actions</label>
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success('Node duplicated!')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ backgroundColor: `${COLORS.primary}33`, color: COLORS.text, border: `1px solid ${COLORS.primary}50` }}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Node
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.error('Node deleted')}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{ backgroundColor: `${COLORS.secondary}33`, color: COLORS.highlight, border: `1px solid ${COLORS.secondary}50` }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Node
                </motion.button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div 
              className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33` }}
            >
              <Workflow className="w-10 h-10" style={{ color: COLORS.textMuted }} />
            </div>
            <p style={{ color: COLORS.textMuted }}>Select a node to view configuration</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Flow Node Component - Warm Vintage Style
function FlowNode({ node, index, isSelected, onMouseDown }: any) {
  const Icon = node.icon;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
      className="absolute cursor-grab active:cursor-grabbing"
      style={{ left: node.x, top: node.y }}
      onMouseDown={onMouseDown}
    >
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="w-44 rounded-xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: `${COLORS.surface}e6`,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${isSelected ? COLORS.highlight : COLORS.highlight}33`,
          boxShadow: isSelected ? `0 0 20px ${COLORS.highlight}30` : 'none',
        }}
      >
        {/* Rust Red Header */}
        <div 
          className="px-4 py-3"
          style={{ backgroundColor: COLORS.primary }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Icon className="w-4 h-4" style={{ color: COLORS.text }} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.text }}>{node.type}</span>
          </div>
        </div>
        
        {/* Node Body */}
        <div className="p-4">
          <p className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>{node.label}</p>
          <div className="flex items-center gap-2 text-xs" style={{ color: COLORS.textMuted }}>
            <span>{node.inputs} in</span>
            <span>•</span>
            <span>{node.outputs} out</span>
          </div>
        </div>

        {/* Input Port */}
        {node.inputs > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
            <div 
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: COLORS.background, border: `2px solid ${COLORS.highlight}`, boxShadow: `0 0 10px ${COLORS.highlight}40` }}
            />
          </div>
        )}
        {/* Output Port */}
        {node.outputs > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
            <div 
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: COLORS.background, border: `2px solid ${COLORS.highlight}`, boxShadow: `0 0 10px ${COLORS.highlight}40` }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// Toolbar Button - Warm Vintage Style
function ToolbarButton({ icon: Icon, onClick, label, semantic }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-2.5 rounded-xl transition-all"
      style={{ 
        color: semantic === 'primary' ? COLORS.text : COLORS.textMuted,
        backgroundColor: semantic === 'primary' ? `${COLORS.primary}33` : 'transparent',
      }}
      title={label}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
}

// Settings View Component - Warm Vintage Theme
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-auto p-8"
      style={{ backgroundColor: COLORS.background }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Settings</h2>
          <p style={{ color: COLORS.textMuted }}>Manage your application preferences and configurations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Tabs */}
          <div className="space-y-1.5">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ x: 4 }}
                onClick={() => {
                  setActiveTab(tab.id);
                  toast.success(`Switched to ${tab.label} settings`);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm"
                style={{
                  backgroundColor: activeTab === tab.id ? `${COLORS.primary}33` : 'transparent',
                  color: activeTab === tab.id ? COLORS.text : COLORS.textMuted,
                  fontWeight: activeTab === tab.id ? 500 : 400,
                  border: activeTab === tab.id ? `1px solid ${COLORS.primary}50` : '1px solid transparent',
                }}
              >
                <tab.icon className="w-4 h-4" style={{ color: activeTab === tab.id ? COLORS.highlight : COLORS.textMuted }} />
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
                  className="space-y-4"
                >
                  <SettingCard
                    title="Auto-Save"
                    description="Automatically save changes as you work"
                    icon={Save}
                  >
                    <ToggleSwitch
                      enabled={autoSave}
                      onChange={(val: boolean) => {
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
                    <select 
                      className="px-4 py-2.5 rounded-xl transition-colors outline-none"
                      style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                    >
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
                    <select 
                      className="px-4 py-2.5 rounded-xl transition-colors outline-none"
                      style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                    >
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
                  className="space-y-4"
                >
                  <SettingCard title="Profile Information" icon={User}>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: COLORS.textMuted }}>Full Name</label>
                        <input
                          type="text"
                          defaultValue="John Doe"
                          className="w-full px-4 py-2.5 rounded-xl transition-colors outline-none"
                          style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: COLORS.textMuted }}>Email</label>
                        <input
                          type="email"
                          defaultValue="john@kendraio.com"
                          className="w-full px-4 py-2.5 rounded-xl transition-colors outline-none"
                          style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success('Profile updated successfully!')}
                        className="px-5 py-2.5 rounded-xl font-medium shadow-lg transition-shadow"
                        style={{ backgroundColor: COLORS.primary, color: COLORS.text, boxShadow: `0 4px 20px ${COLORS.primary}40` }}
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
                  className="space-y-4"
                >
                  <SettingCard title="API Key" description="Manage your API authentication" icon={Lock}>
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl font-mono text-sm transition-colors outline-none"
                        style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                      />
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => toast.success('API key regenerated!')}
                          className="px-4 py-2 rounded-xl font-medium text-sm shadow-lg"
                          style={{ backgroundColor: COLORS.secondary, color: COLORS.text, boxShadow: `0 4px 15px ${COLORS.secondary}40` }}
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
                          className="px-4 py-2 rounded-xl text-sm transition-colors"
                          style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
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
                      className="px-4 py-2.5 rounded-xl font-medium shadow-lg"
                      style={{ backgroundColor: COLORS.primary, color: COLORS.text, boxShadow: `0 4px 15px ${COLORS.primary}40` }}
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
                  className="space-y-4"
                >
                  <SettingCard title="Dark Mode" description="Toggle dark mode theme" icon={Palette}>
                    <ToggleSwitch
                      enabled={darkMode}
                      onChange={(val: boolean) => {
                        setDarkMode(val);
                        toast.success(val ? 'Dark mode enabled' : 'Light mode enabled');
                      }}
                    />
                  </SettingCard>

                  <SettingCard title="Accent Color" description="Customize your accent color" icon={Palette}>
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        { color: COLORS.primary, name: 'Rust Red' },
                        { color: COLORS.secondary, name: 'Deep Maroon' },
                        { color: COLORS.highlight, name: 'Muted Rose' },
                        { color: '#8b3b2d', name: 'Rust' },
                        { color: '#6d222d', name: 'Maroon' },
                        { color: '#c19aa9', name: 'Rose' },
                      ].map(({ color, name }) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast.success(`Accent color changed to ${name}`)}
                          className="w-10 h-10 rounded-xl transition-colors shadow-lg"
                          style={{ backgroundColor: color, border: `2px solid ${COLORS.highlight}50`, boxShadow: `0 0 20px ${color}40` }}
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
                  className="space-y-4"
                >
                  <SettingCard title="Webhook URL" description="Configure webhook endpoint" icon={Code}>
                    <div className="space-y-3">
                      <input
                        type="url"
                        placeholder="https://api.example.com/webhook"
                        className="w-full px-4 py-2.5 rounded-xl transition-colors outline-none"
                        style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}33`, color: COLORS.text }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.success('Webhook URL saved!')}
                        className="px-4 py-2.5 rounded-xl font-medium shadow-lg"
                        style={{ backgroundColor: COLORS.primary, color: COLORS.text, boxShadow: `0 4px 15px ${COLORS.primary}40` }}
                      >
                        Save Webhook
                      </motion.button>
                    </div>
                  </SettingCard>

                  <SettingCard title="Connected Services" icon={Globe}>
                    <div className="space-y-2">
                      {['GitHub', 'Slack', 'Discord', 'Zapier'].map((name) => (
                        <div 
                          key={name} 
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}
                        >
                          <span style={{ color: COLORS.text }}>{name}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toast.success(`Connected to ${name}!`)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            style={{ backgroundColor: `${COLORS.primary}33`, color: COLORS.text, border: `1px solid ${COLORS.primary}50` }}
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
                  className="space-y-4"
                >
                  <SettingCard title="Email Notifications" description="Receive updates via email" icon={Bell}>
                    <ToggleSwitch
                      enabled={notifications}
                      onChange={(val: boolean) => {
                        setNotifications(val);
                        toast.success(val ? 'Notifications enabled' : 'Notifications disabled');
                      }}
                    />
                  </SettingCard>

                  <SettingCard title="Notification Preferences" icon={Bell}>
                    <div className="space-y-2">
                      {['Flow completions', 'System alerts', 'Weekly reports', 'Security updates'].map((pref) => (
                        <div 
                          key={pref} 
                          className="flex items-center justify-between p-3 rounded-xl"
                          style={{ backgroundColor: `${COLORS.background}cc`, border: `1px solid ${COLORS.highlight}20` }}
                        >
                          <span className="text-sm" style={{ color: COLORS.text }}>{pref}</span>
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

// Setting Card Component - Warm Vintage Style
function SettingCard({ title, description, icon: Icon, children }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl transition-all"
      style={{ 
        backgroundColor: `${COLORS.surface}e6`, 
        backdropFilter: 'blur(8px)', 
        border: `1px solid ${COLORS.highlight}33` 
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {Icon && <Icon className="w-4 h-4" style={{ color: COLORS.highlight }} />}
            <h4 className="font-medium" style={{ color: COLORS.text }}>{title}</h4>
          </div>
          {description && <p className="text-sm" style={{ color: COLORS.textMuted }}>{description}</p>}
        </div>
      </div>
      <div>{children}</div>
    </motion.div>
  );
}

// Toggle Switch Component - Warm Vintage Style
function ToggleSwitch({ enabled, onChange }: any) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-12 h-6 rounded-full transition-all"
      style={{ 
        backgroundColor: enabled ? COLORS.primary : COLORS.background,
        boxShadow: enabled ? `0 0 15px ${COLORS.primary}50` : 'none',
        border: `1px solid ${enabled ? COLORS.primary : COLORS.highlight}50`
      }}
    >
      <motion.div
        animate={{ x: enabled ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full shadow-md"
        style={{ backgroundColor: COLORS.text }}
      />
    </button>
  );
}
