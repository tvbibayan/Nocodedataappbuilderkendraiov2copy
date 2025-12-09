/**
 * Font Picker
 * A component for selecting system fonts or loading Google Fonts
 */

import * as React from "react";
import { Check, ChevronDown, Type, Globe, Search } from "lucide-react";
import { cn } from "../ui/utils";

// Popular Google Fonts
const GOOGLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Nunito",
  "Raleway",
  "Ubuntu",
  "Playfair Display",
  "Merriweather",
  "PT Sans",
  "Noto Sans",
  "Work Sans",
  "DM Sans",
  "Space Grotesk",
  "Outfit",
  "Plus Jakarta Sans",
  "Manrope",
];

// System font stacks
const SYSTEM_FONTS = [
  { name: "System Default", value: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" },
  { name: "San Francisco", value: "-apple-system, BlinkMacSystemFont, sans-serif" },
  { name: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, sans-serif" },
  { name: "Arial", value: "Arial, Helvetica, sans-serif" },
  { name: "Georgia", value: "Georgia, 'Times New Roman', serif" },
  { name: "Verdana", value: "Verdana, Geneva, sans-serif" },
];

const MONO_FONTS = [
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace", isGoogle: true },
  { name: "Fira Code", value: "'Fira Code', monospace", isGoogle: true },
  { name: "Source Code Pro", value: "'Source Code Pro', monospace", isGoogle: true },
  { name: "IBM Plex Mono", value: "'IBM Plex Mono', monospace", isGoogle: true },
  { name: "Roboto Mono", value: "'Roboto Mono', monospace", isGoogle: true },
  { name: "Menlo", value: "Menlo, Monaco, monospace", isGoogle: false },
  { name: "Consolas", value: "Consolas, 'Courier New', monospace", isGoogle: false },
];

interface FontPickerProps {
  value: string;
  onChange: (value: string) => void;
  type?: "sans" | "mono";
  label?: string;
  className?: string;
}

export function FontPicker({
  value,
  onChange,
  type = "sans",
  label = "Font Family",
  className,
}: FontPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [loadedFonts, setLoadedFonts] = React.useState<Set<string>>(new Set());
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Load Google Font
  const loadGoogleFont = React.useCallback((fontName: string) => {
    if (loadedFonts.has(fontName)) return;

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@400;500;600;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setLoadedFonts((prev) => new Set(prev).add(fontName));
  }, [loadedFonts]);

  // Load current font if it's a Google Font
  React.useEffect(() => {
    const fontName = value.split(",")[0].replace(/['"]/g, "").trim();
    if (GOOGLE_FONTS.includes(fontName) || MONO_FONTS.find(f => f.isGoogle && f.name === fontName)) {
      loadGoogleFont(fontName);
    }
  }, [value, loadGoogleFont]);

  const handleSelect = (fontValue: string, fontName: string, isGoogle: boolean) => {
    if (isGoogle) {
      loadGoogleFont(fontName);
    }
    onChange(fontValue);
    setIsOpen(false);
    setSearch("");
  };

  const fonts = type === "mono" ? MONO_FONTS : GOOGLE_FONTS;
  const systemFontOptions = type === "sans" ? SYSTEM_FONTS : [];

  // Filter fonts by search
  const filteredGoogleFonts = type === "sans" 
    ? GOOGLE_FONTS.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : MONO_FONTS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const filteredSystemFonts = systemFontOptions.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  // Get display name from value
  const getDisplayName = () => {
    const fontName = value.split(",")[0].replace(/['"]/g, "").trim();
    const systemFont = SYSTEM_FONTS.find(f => f.value === value);
    const monoFont = MONO_FONTS.find(f => f.value === value);
    return systemFont?.name || monoFont?.name || fontName || "Select font...";
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label className="block text-sm text-slate-400 mb-1.5">{label}</label>
      
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
      >
        <span 
          className="text-slate-200 truncate" 
          style={{ fontFamily: value }}
        >
          {getDisplayName()}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-700">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fonts..."
                className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-500 outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Font List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {/* System Fonts */}
            {filteredSystemFonts.length > 0 && (
              <>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 uppercase tracking-wider">
                  <Type className="w-3 h-3" />
                  System Fonts
                </div>
                {filteredSystemFonts.map((font) => (
                  <FontOption
                    key={font.name}
                    name={font.name}
                    value={font.value}
                    isSelected={value === font.value}
                    onSelect={() => handleSelect(font.value, font.name, false)}
                  />
                ))}
                <div className="h-px bg-slate-700 my-2" />
              </>
            )}

            {/* Google Fonts */}
            <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 uppercase tracking-wider">
              <Globe className="w-3 h-3" />
              {type === "mono" ? "Monospace Fonts" : "Google Fonts"}
            </div>
            {type === "sans" ? (
              filteredGoogleFonts.map((fontName) => {
                const fontValue = `'${fontName}', system-ui, sans-serif`;
                return (
                  <FontOption
                    key={fontName}
                    name={fontName}
                    value={fontValue}
                    isSelected={value.includes(fontName)}
                    onSelect={() => handleSelect(fontValue, fontName, true)}
                    onHover={() => loadGoogleFont(fontName)}
                  />
                );
              })
            ) : (
              (filteredGoogleFonts as typeof MONO_FONTS).map((font) => (
                <FontOption
                  key={font.name}
                  name={font.name}
                  value={font.value}
                  isSelected={value === font.value}
                  onSelect={() => handleSelect(font.value, font.name, font.isGoogle)}
                  onHover={() => font.isGoogle && loadGoogleFont(font.name)}
                />
              ))
            )}

            {filteredGoogleFonts.length === 0 && filteredSystemFonts.length === 0 && (
              <div className="py-4 text-center text-sm text-slate-500">
                No fonts found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Font option item
function FontOption({
  name,
  value,
  isSelected,
  onSelect,
  onHover,
}: {
  name: string;
  value: string;
  isSelected: boolean;
  onSelect: () => void;
  onHover?: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
        isSelected
          ? "bg-cyan-500/20 text-cyan-300"
          : "text-slate-300 hover:bg-slate-800"
      )}
    >
      <span style={{ fontFamily: value }}>{name}</span>
      {isSelected && <Check className="w-4 h-4" />}
    </button>
  );
}
