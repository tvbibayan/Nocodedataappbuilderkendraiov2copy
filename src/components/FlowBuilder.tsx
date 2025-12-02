import { useState } from 'react';
import { NodePalette } from './NodePalette';
import { FlowCanvas } from './FlowCanvas';
import { ConfigPanel } from './ConfigPanel';
import { Save, Play, ArrowLeft } from 'lucide-react';

export interface FlowNode {
  id: string;
  type: 'trigger' | 'action' | 'logic' | 'mapping';
  title: string;
  icon: string;
  x: number;
  y: number;
  config?: Record<string, any>;
}

export function FlowBuilder() {
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: '1', type: 'trigger', title: 'Start', icon: 'play', x: 100, y: 150 },
    { id: '2', type: 'action', title: 'Spotify API', icon: 'music', x: 350, y: 150, config: { endpoint: 'https://api.spotify.com/v1/me/playlists', method: 'GET' } },
    { id: '3', type: 'mapping', title: 'Data Mapper', icon: 'shuffle', x: 600, y: 150 },
    { id: '4', type: 'action', title: 'Google Sheets', icon: 'table', x: 850, y: 150, config: { spreadsheetId: 'abc123', sheetName: 'Sheet1' } },
  ]);

  const connections = [
    { from: '1', to: '2' },
    { from: '2', to: '3' },
    { from: '3', to: '4' },
  ];

  const handleNodeClick = (node: FlowNode) => {
    setSelectedNode(node);
  };

  const handleConfigUpdate = (config: Record<string, any>) => {
    if (selectedNode) {
      setNodes(nodes.map(n => 
        n.id === selectedNode.id ? { ...n, config } : n
      ));
      setSelectedNode({ ...selectedNode, config });
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-400" />
            </button>
            <div>
              <h1 className="text-xl text-slate-100">Spotify to Sheets Flow</h1>
              <p className="text-sm text-slate-500">Last edited 2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-2 transition-colors border border-slate-700">
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/30">
              <Play className="w-4 h-4" />
              <span>Run Flow</span>
            </button>
          </div>
        </div>
      </header>

      {/* Three-pane layout */}
      <div className="flex-1 flex overflow-hidden">
        <NodePalette />
        <FlowCanvas 
          nodes={nodes} 
          connections={connections} 
          selectedNode={selectedNode}
          onNodeClick={handleNodeClick}
        />
        <ConfigPanel 
          selectedNode={selectedNode} 
          onConfigUpdate={handleConfigUpdate}
        />
      </div>
    </div>
  );
}
