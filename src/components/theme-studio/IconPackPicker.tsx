/**
 * Icon Pack Picker
 * Component for switching between icon libraries
 */

import * as React from "react";
import {
  Check,
  ChevronDown,
  Home,
  Settings,
  User,
  Bell,
  Search,
  Heart,
  Star,
  Zap,
  Folder,
  File,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { IconPack } from "../../config/theme-schema";

interface IconPackOption {
  id: IconPack;
  name: string;
  description: string;
  previewIcons: React.ReactNode[];
}

const ICON_PACKS: IconPackOption[] = [
  {
    id: "lucide",
    name: "Lucide",
    description: "Clean, consistent icons (default)",
    previewIcons: [
      <Home key="home" className="w-5 h-5" />,
      <Settings key="settings" className="w-5 h-5" />,
      <User key="user" className="w-5 h-5" />,
      <Bell key="bell" className="w-5 h-5" />,
      <Search key="search" className="w-5 h-5" />,
    ],
  },
  {
    id: "heroicons",
    name: "Heroicons",
    description: "Beautiful hand-crafted icons by Tailwind Labs",
    previewIcons: [
      <HomeHero key="home" />,
      <CogHero key="cog" />,
      <UserHero key="user" />,
      <BellHero key="bell" />,
      <SearchHero key="search" />,
    ],
  },
  {
    id: "phosphor",
    name: "Phosphor",
    description: "Flexible icon family with multiple weights",
    previewIcons: [
      <HomePhosphor key="home" />,
      <GearPhosphor key="gear" />,
      <UserPhosphor key="user" />,
      <BellPhosphor key="bell" />,
      <SearchPhosphor key="search" />,
    ],
  },
  {
    id: "custom",
    name: "Custom Icons",
    description: "Upload your own SVG icons or use emojis",
    previewIcons: [
      <span key="1" className="text-lg">🏠</span>,
      <span key="2" className="text-lg">⚙️</span>,
      <span key="3" className="text-lg">👤</span>,
      <span key="4" className="text-lg">🔔</span>,
      <span key="5" className="text-lg">🔍</span>,
    ],
  },
];

interface IconPackPickerProps {
  value: IconPack;
  onChange: (value: IconPack) => void;
  className?: string;
}

export function IconPackPicker({
  value,
  onChange,
  className,
}: IconPackPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedPack = ICON_PACKS.find((p) => p.id === value) || ICON_PACKS[0];

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

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <label className="block text-sm text-slate-400 mb-1.5">Icon Pack</label>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-left hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-slate-400">
            {selectedPack.previewIcons.slice(0, 3)}
          </div>
          <div>
            <p className="text-sm text-slate-200 font-medium">{selectedPack.name}</p>
            <p className="text-xs text-slate-500">{selectedPack.description}</p>
          </div>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2">
            {ICON_PACKS.map((pack) => (
              <button
                key={pack.id}
                onClick={() => {
                  onChange(pack.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                  value === pack.id
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "hover:bg-slate-800"
                )}
              >
                <div className="flex items-center gap-1.5 text-slate-400 w-28">
                  {pack.previewIcons}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-200">{pack.name}</p>
                  <p className="text-xs text-slate-500">{pack.description}</p>
                </div>
                {value === pack.id && <Check className="w-4 h-4 text-cyan-400" />}
              </button>
            ))}
          </div>

          {/* Custom icons note */}
          {value === "custom" && (
            <div className="p-3 border-t border-slate-700 bg-slate-800/50">
              <p className="text-xs text-slate-400">
                Custom icons can be uploaded in Settings → Theme → Icon Overrides.
                Use SVG format for best results.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Heroicons-style SVG components (simplified versions)
function HomeHero() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function CogHero() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UserHero() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function BellHero() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
  );
}

function SearchHero() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

// Phosphor-style SVG components (simplified versions)
function HomePhosphor() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
      <path d="M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z"/>
    </svg>
  );
}

function GearPhosphor() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z" opacity="0.2"/>
      <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"/>
    </svg>
  );
}

function UserPhosphor() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Z"/>
    </svg>
  );
}

function BellPhosphor() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
      <path d="M168,224a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm53.85-32A15.8,15.8,0,0,1,208,200H48a16,16,0,0,1-13.8-24.06C39.75,166.38,48,139.34,48,104a80,80,0,1,1,160,0c0,35.33,8.26,62.38,13.81,71.94A15.89,15.89,0,0,1,221.85,192Z"/>
    </svg>
  );
}

function SearchPhosphor() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256">
      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/>
    </svg>
  );
}
