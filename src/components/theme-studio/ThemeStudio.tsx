/**
 * Theme Studio
 * Full-featured theme editor with color pickers, typography, and CSS snippets
 */

import * as React from "react";
import {
  X,
  Palette,
  Type,
  Square,
  Code,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Image,
} from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import { defaultTheme, type ThemeConfig, type CSSSnippet } from "../../config/theme-schema";
import { FontPicker } from "./FontPicker";
import { IconPackPicker } from "./IconPackPicker";

interface ThemeStudioProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeStudio({ isOpen, onClose }: ThemeStudioProps) {
  const [activeTab, setActiveTab] = React.useState<"colors" | "typography" | "borders" | "snippets">("colors");
  const [newSnippetName, setNewSnippetName] = React.useState("");
  const [newSnippetCode, setNewSnippetCode] = React.useState("");

  const globalTheme = usePreferencesStore((s) => s.globalTheme);
  const setGlobalTheme = usePreferencesStore((s) => s.setGlobalTheme);
  const updateThemeColors = usePreferencesStore((s) => s.updateThemeColors);
  const updateThemeTypography = usePreferencesStore((s) => s.updateThemeTypography);
  const addCSSSnippet = usePreferencesStore((s) => s.addCSSSnippet);
  const toggleCSSSnippet = usePreferencesStore((s) => s.toggleCSSSnippet);
  const removeCSSSnippet = usePreferencesStore((s) => s.removeCSSSnippet);
  const exportPreferences = usePreferencesStore((s) => s.exportPreferences);

  // Export theme as JSON
  const handleExport = () => {
    const json = JSON.stringify(globalTheme, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${globalTheme.name.toLowerCase().replace(/\s+/g, "-")}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import theme from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const theme = JSON.parse(event.target?.result as string) as ThemeConfig;
        if (theme.version === "1.0" && theme.colors && theme.typography) {
          setGlobalTheme(theme);
        } else {
          alert("Invalid theme file format");
        }
      } catch {
        alert("Failed to parse theme file");
      }
    };
    reader.readAsText(file);
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm("Reset theme to defaults? This cannot be undone.")) {
      setGlobalTheme(defaultTheme);
    }
  };

  // Add CSS snippet
  const handleAddSnippet = () => {
    if (newSnippetName.trim() && newSnippetCode.trim()) {
      addCSSSnippet(newSnippetName.trim(), newSnippetCode.trim());
      setNewSnippetName("");
      setNewSnippetCode("");
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div 
        className="bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-slate-100">Theme Studio</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded"
              title="Export theme"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <label className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800 rounded cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
              title="Reset to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700">
          {[
            { id: "colors", label: "Colors", icon: Palette },
            { id: "typography", label: "Typography", icon: Type },
            { id: "borders", label: "Borders", icon: Square },
            { id: "snippets", label: "CSS Snippets", icon: Code },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                activeTab === id
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Colors Tab */}
          {activeTab === "colors" && (
            <div className="space-y-4">
              {Object.entries(globalTheme.colors).map(([key, value]) => (
                <ColorInput
                  key={key}
                  label={formatLabel(key)}
                  value={value}
                  onChange={(newValue) =>
                    updateThemeColors({ [key]: newValue } as Partial<ThemeConfig["colors"]>)
                  }
                />
              ))}
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === "typography" && (
            <div className="space-y-6">
              <FontPicker
                label="Font Family"
                value={globalTheme.typography.fontFamily}
                onChange={(value) => updateThemeTypography({ fontFamily: value })}
                type="sans"
              />
              <FontPicker
                label="Monospace Font"
                value={globalTheme.typography.fontFamilyMono}
                onChange={(value) => updateThemeTypography({ fontFamilyMono: value })}
                type="mono"
              />
              <SliderInput
                label="Base Font Size"
                value={globalTheme.typography.baseFontSize}
                min={10}
                max={20}
                unit="px"
                onChange={(value) => updateThemeTypography({ baseFontSize: value })}
              />
              <SliderInput
                label="Line Height"
                value={globalTheme.typography.lineHeight}
                min={1}
                max={2}
                step={0.1}
                onChange={(value) => updateThemeTypography({ lineHeight: value })}
              />
            </div>
          )}

          {/* Borders Tab */}
          {activeTab === "borders" && (
            <div className="space-y-6">
              <SliderInput
                label="Border Radius"
                value={globalTheme.borders.radius}
                min={0}
                max={24}
                unit="px"
                onChange={(value) =>
                  setGlobalTheme({
                    ...globalTheme,
                    borders: { ...globalTheme.borders, radius: value },
                  })
                }
              />
              <SliderInput
                label="Border Width"
                value={globalTheme.borders.width}
                min={0}
                max={4}
                unit="px"
                onChange={(value) =>
                  setGlobalTheme({
                    ...globalTheme,
                    borders: { ...globalTheme.borders, width: value },
                  })
                }
              />

              {/* Icon Pack Picker */}
              <div className="pt-4 border-t border-slate-700">
                <IconPackPicker
                  value={globalTheme.iconPack}
                  onChange={(value) =>
                    setGlobalTheme({
                      ...globalTheme,
                      iconPack: value,
                    })
                  }
                />
              </div>

              {/* Preview */}
              <div className="mt-8 p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-400 mb-3">Preview</p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 bg-slate-700 border"
                    style={{
                      borderRadius: `${globalTheme.borders.radius}px`,
                      borderWidth: `${globalTheme.borders.width}px`,
                      borderColor: globalTheme.colors.border,
                    }}
                  />
                  <button
                    style={{
                      borderRadius: `${globalTheme.borders.radius}px`,
                      backgroundColor: globalTheme.colors.primary,
                    }}
                    className="px-4 py-2 text-white text-sm"
                  >
                    Button
                  </button>
                  <input
                    type="text"
                    placeholder="Input field"
                    style={{
                      borderRadius: `${globalTheme.borders.radius}px`,
                      borderWidth: `${globalTheme.borders.width}px`,
                      borderColor: globalTheme.colors.border,
                    }}
                    className="px-3 py-2 bg-slate-700 text-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* CSS Snippets Tab */}
          {activeTab === "snippets" && (
            <div className="space-y-6">
              {/* Add new snippet */}
              <div className="p-4 bg-slate-800 rounded-lg space-y-3">
                <input
                  type="text"
                  value={newSnippetName}
                  onChange={(e) => setNewSnippetName(e.target.value)}
                  placeholder="Snippet name..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-slate-200"
                />
                <textarea
                  value={newSnippetCode}
                  onChange={(e) => setNewSnippetCode(e.target.value)}
                  placeholder=".my-class { color: red; }"
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-sm text-slate-200 font-mono"
                />
                <button
                  onClick={handleAddSnippet}
                  disabled={!newSnippetName.trim() || !newSnippetCode.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:text-slate-400 rounded text-sm text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add Snippet
                </button>
              </div>

              {/* Existing snippets */}
              <div className="space-y-3">
                {globalTheme.cssSnippets.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No CSS snippets yet. Add one above to customize styling.
                  </p>
                ) : (
                  globalTheme.cssSnippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      onToggle={() => toggleCSSSnippet(snippet.id)}
                      onDelete={() => removeCSSSnippet(snippet.id)}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component: Color input
function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-32 text-sm text-slate-400">{label}</div>
      <div className="flex items-center gap-2 flex-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 font-mono"
        />
      </div>
    </div>
  );
}

// Helper component: Slider input
function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-400">{label}</label>
        <span className="text-sm text-slate-200">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-cyan-500"
      />
    </div>
  );
}

// Helper component: Snippet card
function SnippetCard({
  snippet,
  onToggle,
  onDelete,
}: {
  snippet: CSSSnippet;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 bg-slate-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-200">{snippet.name}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className={`p-1 rounded ${
              snippet.enabled ? "text-cyan-400" : "text-slate-500"
            }`}
            title={snippet.enabled ? "Disable" : "Enable"}
          >
            {snippet.enabled ? (
              <ToggleRight className="w-5 h-5" />
            ) : (
              <ToggleLeft className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:bg-red-900/30 rounded"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <pre className="text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded overflow-x-auto">
        {snippet.code}
      </pre>
    </div>
  );
}

// Format camelCase to Title Case
function formatLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}
