import { Play, Music, Shuffle, Table, CheckCircle } from 'lucide-react';
import type { FlowNode } from './FlowBuilder';

interface FlowCanvasProps {
  nodes: FlowNode[];
  connections: Array<{ from: string; to: string }>;
  selectedNode: FlowNode | null;
  onNodeClick: (node: FlowNode) => void;
}

const iconMap = {
  play: Play,
  music: Music,
  shuffle: Shuffle,
  table: Table,
};

export function FlowCanvas({ nodes, connections, selectedNode, onNodeClick }: FlowCanvasProps) {
  // Calculate connection paths
  const getConnectionPath = (fromNode: FlowNode, toNode: FlowNode) => {
    const startX = fromNode.x + 120;
    const startY = fromNode.y + 50;
    const endX = toNode.x;
    const endY = toNode.y + 50;
    
    const controlPoint1X = startX + (endX - startX) / 3;
    const controlPoint2X = startX + (2 * (endX - startX)) / 3;
    
    return `M ${startX} ${startY} C ${controlPoint1X} ${startY}, ${controlPoint2X} ${endY}, ${endX} ${endY}`;
  };

  return (
    <div className="flex-1 bg-slate-950 relative overflow-auto">
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgb(51 65 85 / 0.3) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(51 65 85 / 0.3) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}></div>

      {/* Canvas Content */}
      <div className="relative min-w-[1400px] min-h-[800px]">
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 0.8 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <path
                key={idx}
                d={getConnectionPath(fromNode, toNode)}
                stroke="url(#connectionGradient)"
                strokeWidth="3"
                fill="none"
                filter="url(#glow)"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const Icon = iconMap[node.icon as keyof typeof iconMap];
          const isSelected = selectedNode?.id === node.id;
          
          return (
            <div
              key={node.id}
              className={`absolute cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-cyan-500 shadow-2xl shadow-cyan-500/50' 
                  : 'hover:shadow-xl hover:shadow-cyan-500/30'
              }`}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '220px',
              }}
              onClick={() => onNodeClick(node)}
            >
              <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-xl p-4 backdrop-blur">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      {Icon && <Icon className="w-5 h-5 text-cyan-400" />}
                    </div>
                    <div>
                      <div className="text-sm text-slate-200">{node.title}</div>
                      <div className="text-xs text-slate-500 capitalize">{node.type}</div>
                    </div>
                  </div>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                
                {/* Connection Points */}
                <div className="flex justify-between mt-2">
                  {node.id !== '1' && (
                    <div className="w-3 h-3 bg-cyan-500 rounded-full -ml-6 mt-2 shadow-lg shadow-cyan-500/50"></div>
                  )}
                  {node.id !== '4' && (
                    <div className="w-3 h-3 bg-cyan-500 rounded-full -mr-6 mt-2 ml-auto shadow-lg shadow-cyan-500/50"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
