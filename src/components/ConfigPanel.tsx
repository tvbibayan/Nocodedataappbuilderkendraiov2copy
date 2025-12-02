import { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';
import type { FlowNode } from './FlowBuilder';

interface ConfigPanelProps {
  selectedNode: FlowNode | null;
  onConfigUpdate: (config: Record<string, any>) => void;
}

export function ConfigPanel({ selectedNode, onConfigUpdate }: ConfigPanelProps) {
  const [config, setConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedNode?.config) {
      setConfig(selectedNode.config);
    } else {
      setConfig({});
    }
  }, [selectedNode]);

  const handleChange = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigUpdate(newConfig);
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <Settings className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            Select a node to configure its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg text-slate-100 mb-1">{selectedNode.title}</h2>
            <p className="text-xs text-slate-500 capitalize">{selectedNode.type} Node</p>
          </div>
          <button className="p-1 hover:bg-slate-800 rounded transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Configuration Forms */}
        <div className="space-y-4">
          {selectedNode.type === 'action' && selectedNode.title === 'Spotify API' && (
            <>
              <div>
                <label className="block text-sm text-slate-400 mb-2">API Endpoint</label>
                <input
                  type="text"
                  value={config.endpoint || ''}
                  onChange={(e) => handleChange('endpoint', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="https://api.spotify.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Method</label>
                <select
                  value={config.method || 'GET'}
                  onChange={(e) => handleChange('method', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Headers</label>
                <textarea
                  value={config.headers || ''}
                  onChange={(e) => handleChange('headers', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-none"
                  placeholder='{"Authorization": "Bearer token"}'
                />
              </div>
            </>
          )}

          {selectedNode.type === 'action' && selectedNode.title === 'Google Sheets' && (
            <>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Spreadsheet ID</label>
                <input
                  type="text"
                  value={config.spreadsheetId || ''}
                  onChange={(e) => handleChange('spreadsheetId', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="abc123xyz"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Sheet Name</label>
                <input
                  type="text"
                  value={config.sheetName || ''}
                  onChange={(e) => handleChange('sheetName', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Sheet1"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Operation</label>
                <select
                  value={config.operation || 'append'}
                  onChange={(e) => handleChange('operation', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="append">Append Row</option>
                  <option value="update">Update Row</option>
                  <option value="read">Read Rows</option>
                </select>
              </div>
            </>
          )}

          {selectedNode.type === 'mapping' && (
            <>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Input Field</label>
                <input
                  type="text"
                  value={config.inputField || ''}
                  onChange={(e) => handleChange('inputField', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="data.items"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Output Field</label>
                <input
                  type="text"
                  value={config.outputField || ''}
                  onChange={(e) => handleChange('outputField', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="transformedData"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Transformation</label>
                <textarea
                  value={config.transformation || ''}
                  onChange={(e) => handleChange('transformation', e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 h-32 resize-none font-mono"
                  placeholder="item => ({ name: item.title, value: item.count })"
                />
              </div>
            </>
          )}

          {selectedNode.type === 'trigger' && (
            <div className="text-sm text-slate-500">
              This is a trigger node. Configure your flow entry point here.
            </div>
          )}
        </div>

        {/* Node Info */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <h3 className="text-xs text-slate-500 mb-3 uppercase tracking-wider">Node Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Node ID:</span>
              <span className="text-slate-300">{selectedNode.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="text-slate-300 capitalize">{selectedNode.type}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
