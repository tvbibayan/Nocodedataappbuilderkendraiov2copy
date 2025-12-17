/**
 * Database Connector Component
 * Handles database connections for various database types
 */

import { useState } from 'react';
import { Database, CheckCircle2, XCircle, Loader2, Plus, Trash2, Edit2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'sqlite' | 'redis' | 'mssql';

interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastConnected?: string;
}

const databaseTypes: { value: DatabaseType; label: string; defaultPort: string }[] = [
  { value: 'postgresql', label: 'PostgreSQL', defaultPort: '5432' },
  { value: 'mysql', label: 'MySQL', defaultPort: '3306' },
  { value: 'mongodb', label: 'MongoDB', defaultPort: '27017' },
  { value: 'sqlite', label: 'SQLite', defaultPort: '' },
  { value: 'redis', label: 'Redis', defaultPort: '6379' },
  { value: 'mssql', label: 'Microsoft SQL Server', defaultPort: '1433' },
];

export function DatabaseConnector() {
  const [connections, setConnections] = useState<DatabaseConnection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql' as DatabaseType,
    host: 'localhost',
    port: '5432',
    database: '',
    username: '',
    password: '',
  });

  const handleTypeChange = (type: DatabaseType) => {
    const dbType = databaseTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type,
      port: dbType?.defaultPort || '',
    });
  };

  const testConnection = async (connection: Partial<DatabaseConnection>) => {
    // Simulate connection test
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Random success/failure for demo
        const success = Math.random() > 0.3;
        resolve(success);
      }, 2000);
    });
  };

  const handleTestConnection = async () => {
    toast.info('Testing connection...');
    
    const success = await testConnection(formData);
    
    if (success) {
      toast.success('Connection successful!');
      return true;
    } else {
      toast.error('Connection failed. Please check your credentials.');
      return false;
    }
  };

  const handleSaveConnection = async () => {
    if (!formData.name || !formData.host || !formData.database) {
      toast.error('Please fill in all required fields');
      return;
    }

    const testSuccess = await handleTestConnection();
    if (!testSuccess) return;

    const newConnection: DatabaseConnection = {
      id: editingId || `${Date.now()}`,
      ...formData,
      status: 'connected',
      lastConnected: new Date().toISOString(),
    };

    if (editingId) {
      setConnections(prev => prev.map(c => c.id === editingId ? newConnection : c));
      toast.success('Connection updated successfully!');
    } else {
      setConnections(prev => [...prev, newConnection]);
      toast.success('Database connected successfully!');
    }

    resetForm();
  };

  const handleEdit = (connection: DatabaseConnection) => {
    setFormData({
      name: connection.name,
      type: connection.type,
      host: connection.host,
      port: connection.port,
      database: connection.database,
      username: connection.username,
      password: connection.password,
    });
    setEditingId(connection.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
    toast.success('Connection removed');
  };

  const handleReconnect = async (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'testing' } : c
    ));

    const connection = connections.find(c => c.id === id);
    if (!connection) return;

    const success = await testConnection(connection);

    setConnections(prev => prev.map(c => 
      c.id === id ? { 
        ...c, 
        status: success ? 'connected' : 'disconnected',
        lastConnected: success ? new Date().toISOString() : c.lastConnected
      } : c
    ));

    if (success) {
      toast.success('Reconnected successfully!');
    } else {
      toast.error('Reconnection failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'postgresql',
      host: 'localhost',
      port: '5432',
      database: '',
      username: '',
      password: '',
    });
    setEditingId(null);
    setShowForm(false);
    setShowPassword(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Database Connections</h3>
          <p className="text-cyan-300/70 text-sm">Connect to your databases and manage connections</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          New Connection
        </motion.button>
      </div>

      {/* Connection Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#1a1b2e] border border-cyan-500/30 rounded-2xl p-6 space-y-4"
          >
            <h4 className="text-lg font-semibold text-white mb-4">
              {editingId ? 'Edit Connection' : 'New Database Connection'}
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Connection Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Production DB"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Database Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as DatabaseType)}
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  {databaseTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Host *</label>
                <input
                  type="text"
                  value={formData.host}
                  onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                  placeholder="localhost or IP address"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Port</label>
                <input
                  type="text"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                  placeholder="5432"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Database Name *</label>
                <input
                  type="text"
                  value={formData.database}
                  onChange={(e) => setFormData({ ...formData, database: e.target.value })}
                  placeholder="my_database"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="text-sm text-cyan-300 font-medium block mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="admin"
                  className="w-full px-4 py-3 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div className="col-span-2">
                <label className="text-sm text-cyan-300 font-medium block mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 bg-[#0f0f23] border border-cyan-500/30 rounded-xl text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveConnection}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all"
              >
                <Database className="w-5 h-5" />
                {editingId ? 'Update Connection' : 'Connect Database'}
              </motion.button>
              
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-[#0f0f23] hover:bg-[#16172b] border border-cyan-500/30 text-cyan-300 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connections List */}
      {connections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {connections.map(connection => (
            <motion.div
              key={connection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a1b2e] border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 flex items-center justify-center">
                    <Database className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{connection.name}</h4>
                    <p className="text-sm text-cyan-300/70">{databaseTypes.find(t => t.value === connection.type)?.label}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {connection.status === 'connected' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </div>
                  )}
                  {connection.status === 'disconnected' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium">
                      <XCircle className="w-3 h-3" />
                      Disconnected
                    </div>
                  )}
                  {connection.status === 'testing' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Testing...
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300/70">Host:</span>
                  <span className="text-white font-mono">{connection.host}:{connection.port}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300/70">Database:</span>
                  <span className="text-white font-mono">{connection.database}</span>
                </div>
                {connection.lastConnected && (
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300/70">Last Connected:</span>
                    <span className="text-white">{new Date(connection.lastConnected).toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReconnect(connection.id)}
                  disabled={connection.status === 'testing'}
                  className="flex-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reconnect
                </button>
                <button
                  onClick={() => handleEdit(connection)}
                  className="p-2 bg-[#0f0f23] hover:bg-[#16172b] text-cyan-300 hover:text-white rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(connection.id)}
                  className="p-2 bg-[#0f0f23] hover:bg-red-500/20 text-cyan-300 hover:text-red-400 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#1a1b2e] border border-cyan-500/20 rounded-2xl">
          <Database className="w-16 h-16 mx-auto mb-4 text-cyan-500/50" />
          <h4 className="text-lg font-semibold text-white mb-2">No Database Connections</h4>
          <p className="text-cyan-300/70 mb-6">Get started by adding your first database connection</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl font-medium shadow-lg shadow-cyan-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Database
          </button>
        </div>
      )}
    </div>
  );
}
