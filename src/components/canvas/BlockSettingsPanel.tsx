/**
 * Block Settings Panel
 * Comprehensive settings panel for customizing canvas blocks
 */

import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    X,
    Palette,
    Layout,
    Type,
    Settings,
    Lock,
    Unlock,
    Eye,
    EyeOff,
} from "lucide-react";
import { cn } from "../ui/utils";
import type { CanvasBlock, BlockStyles } from "../../config/canvas-layout";

interface BlockSettingsPanelProps {
    isOpen: boolean;
    block: CanvasBlock | null;
    onClose: () => void;
    onUpdate: (updates: Partial<CanvasBlock>) => void;
}

const colorOptions = [
    { id: "cyan", color: "#06b6d4", label: "Cyan" },
    { id: "emerald", color: "#10b981", label: "Emerald" },
    { id: "violet", color: "#8b5cf6", label: "Violet" },
    { id: "amber", color: "#f59e0b", label: "Amber" },
    { id: "rose", color: "#f43f5e", label: "Rose" },
    { id: "blue", color: "#3b82f6", label: "Blue" },
];

const shadowOptions = [
    { id: "none", label: "None" },
    { id: "sm", label: "Small" },
    { id: "md", label: "Medium" },
    { id: "lg", label: "Large" },
    { id: "xl", label: "Extra Large" },
];

type TabId = "appearance" | "layout" | "content" | "behavior";

export function BlockSettingsPanel({
    isOpen,
    block,
    onClose,
    onUpdate,
}: BlockSettingsPanelProps) {
    const [activeTab, setActiveTab] = React.useState<TabId>("appearance");

    // Get current styles with defaults
    const styles: BlockStyles = block?.styles || {};
    const currentColor = (block?.props?.color as string) || "cyan";

    const updateStyles = (newStyles: Partial<BlockStyles>) => {
        onUpdate({
            styles: { ...styles, ...newStyles },
        });
    };

    const updateProps = (newProps: Record<string, unknown>) => {
        onUpdate({
            props: { ...block?.props, ...newProps },
        });
    };

    if (!isOpen || !block) return null;

    // Use portal to render at document body level
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Panel */}
            <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-md border-l border-slate-700 shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-cyan-400" />
                        <div>
                            <h2 className="text-lg font-semibold text-slate-100">Block Settings</h2>
                            <p className="text-xs text-slate-400">{block.title || block.type}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-700">
                    {[
                        { id: "appearance" as TabId, label: "Appearance", icon: Palette },
                        { id: "layout" as TabId, label: "Layout", icon: Layout },
                        { id: "content" as TabId, label: "Content", icon: Type },
                        { id: "behavior" as TabId, label: "Behavior", icon: Settings },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 px-3 py-3 text-sm transition-colors",
                                activeTab === id
                                    ? "text-cyan-400 border-b-2 border-cyan-400 bg-slate-800/50"
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {/* Appearance Tab */}
                    {activeTab === "appearance" && (
                        <>
                            {/* Accent Color */}
                            <SettingsSection title="Accent Color">
                                <div className="grid grid-cols-6 gap-2">
                                    {colorOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => updateProps({ color: opt.id })}
                                            className={cn(
                                                "w-10 h-10 rounded-lg border-2 transition-all",
                                                currentColor === opt.id
                                                    ? "border-white scale-110 shadow-lg"
                                                    : "border-transparent hover:border-slate-500"
                                            )}
                                            style={{ backgroundColor: opt.color }}
                                            title={opt.label}
                                        />
                                    ))}
                                </div>
                            </SettingsSection>

                            {/* Background */}
                            <SettingsSection title="Background">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm text-slate-400 w-20">Color</label>
                                        <input
                                            type="color"
                                            value={styles.backgroundColor || "#1e293b"}
                                            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border border-slate-600"
                                        />
                                        <input
                                            type="text"
                                            value={styles.backgroundColor || "#1e293b"}
                                            onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 font-mono"
                                        />
                                    </div>
                                    <SliderInput
                                        label="Opacity"
                                        value={styles.backgroundOpacity ?? 100}
                                        min={0}
                                        max={100}
                                        unit="%"
                                        onChange={(value) => updateStyles({ backgroundOpacity: value })}
                                    />
                                </div>
                            </SettingsSection>

                            {/* Border */}
                            <SettingsSection title="Border">
                                <div className="space-y-3">
                                    <SliderInput
                                        label="Width"
                                        value={styles.borderWidth ?? 1}
                                        min={0}
                                        max={8}
                                        unit="px"
                                        onChange={(value) => updateStyles({ borderWidth: value })}
                                    />
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm text-slate-400 w-20">Color</label>
                                        <input
                                            type="color"
                                            value={styles.borderColor || "#475569"}
                                            onChange={(e) => updateStyles({ borderColor: e.target.value })}
                                            className="w-10 h-10 rounded cursor-pointer bg-transparent border border-slate-600"
                                        />
                                        <input
                                            type="text"
                                            value={styles.borderColor || "#475569"}
                                            onChange={(e) => updateStyles({ borderColor: e.target.value })}
                                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 font-mono"
                                        />
                                    </div>
                                    <SliderInput
                                        label="Radius"
                                        value={styles.borderRadius ?? 12}
                                        min={0}
                                        max={32}
                                        unit="px"
                                        onChange={(value) => updateStyles({ borderRadius: value })}
                                    />
                                </div>
                            </SettingsSection>

                            {/* Shadow */}
                            <SettingsSection title="Shadow">
                                <div className="grid grid-cols-5 gap-2">
                                    {shadowOptions.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => updateStyles({ shadow: opt.id as BlockStyles["shadow"] })}
                                            className={cn(
                                                "px-3 py-2 text-xs rounded-lg border transition-all",
                                                (styles.shadow || "lg") === opt.id
                                                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                                                    : "bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </SettingsSection>
                        </>
                    )}

                    {/* Layout Tab */}
                    {activeTab === "layout" && (
                        <>
                            <SettingsSection title="Size">
                                <div className="space-y-3">
                                    <SliderInput
                                        label="Width (columns)"
                                        value={block.position.w}
                                        min={1}
                                        max={12}
                                        onChange={(value) =>
                                            onUpdate({ position: { ...block.position, w: value } })
                                        }
                                    />
                                    <SliderInput
                                        label="Height (rows)"
                                        value={block.position.h}
                                        min={1}
                                        max={12}
                                        onChange={(value) =>
                                            onUpdate({ position: { ...block.position, h: value } })
                                        }
                                    />
                                </div>
                            </SettingsSection>

                            <SettingsSection title="Padding">
                                <div className="grid grid-cols-2 gap-3">
                                    <NumberInput
                                        label="Top"
                                        value={styles.padding?.top ?? 0}
                                        onChange={(value) =>
                                            updateStyles({
                                                padding: { ...getDefaultPadding(styles.padding), top: value },
                                            })
                                        }
                                    />
                                    <NumberInput
                                        label="Right"
                                        value={styles.padding?.right ?? 0}
                                        onChange={(value) =>
                                            updateStyles({
                                                padding: { ...getDefaultPadding(styles.padding), right: value },
                                            })
                                        }
                                    />
                                    <NumberInput
                                        label="Bottom"
                                        value={styles.padding?.bottom ?? 0}
                                        onChange={(value) =>
                                            updateStyles({
                                                padding: { ...getDefaultPadding(styles.padding), bottom: value },
                                            })
                                        }
                                    />
                                    <NumberInput
                                        label="Left"
                                        value={styles.padding?.left ?? 0}
                                        onChange={(value) =>
                                            updateStyles({
                                                padding: { ...getDefaultPadding(styles.padding), left: value },
                                            })
                                        }
                                    />
                                </div>
                            </SettingsSection>
                        </>
                    )}

                    {/* Content Tab */}
                    {activeTab === "content" && (
                        <>
                            <SettingsSection title="Block Title">
                                <input
                                    type="text"
                                    value={block.title || ""}
                                    onChange={(e) => onUpdate({ title: e.target.value })}
                                    placeholder="Enter block title..."
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                            </SettingsSection>

                            {/* Type-specific content */}
                            {block.type === "stat" && (
                                <>
                                    <SettingsSection title="Stat Value">
                                        <input
                                            type="text"
                                            value={(block.props?.value as string) || ""}
                                            onChange={(e) => updateProps({ value: e.target.value })}
                                            placeholder="e.g., 1,234"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </SettingsSection>
                                    <SettingsSection title="Label">
                                        <input
                                            type="text"
                                            value={(block.props?.label as string) || ""}
                                            onChange={(e) => updateProps({ label: e.target.value })}
                                            placeholder="e.g., Total Users"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </SettingsSection>
                                    <SettingsSection title="Change Text">
                                        <input
                                            type="text"
                                            value={(block.props?.change as string) || ""}
                                            onChange={(e) => updateProps({ change: e.target.value })}
                                            placeholder="e.g., +12% this week"
                                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        />
                                    </SettingsSection>
                                </>
                            )}

                            {block.type === "text" && (
                                <SettingsSection title="Text Content">
                                    <textarea
                                        value={(block.props?.content as string) || ""}
                                        onChange={(e) => updateProps({ content: e.target.value })}
                                        placeholder="Enter text content..."
                                        rows={6}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                    />
                                </SettingsSection>
                            )}

                            {block.type === "embed" && (
                                <SettingsSection title="Embed URL">
                                    <input
                                        type="url"
                                        value={(block.props?.url as string) || ""}
                                        onChange={(e) => updateProps({ url: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    />
                                </SettingsSection>
                            )}
                        </>
                    )}

                    {/* Behavior Tab */}
                    {activeTab === "behavior" && (
                        <>
                            <SettingsSection title="Position Lock">
                                <button
                                    onClick={() => onUpdate({ isLocked: !block.isLocked })}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all",
                                        block.isLocked
                                            ? "bg-amber-500/20 border-amber-500/50 text-amber-400"
                                            : "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-500"
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        {block.isLocked ? (
                                            <Lock className="w-5 h-5" />
                                        ) : (
                                            <Unlock className="w-5 h-5" />
                                        )}
                                        <span>{block.isLocked ? "Block is Locked" : "Block is Unlocked"}</span>
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded bg-slate-700">
                                        {block.isLocked ? "Click to Unlock" : "Click to Lock"}
                                    </span>
                                </button>
                                <p className="text-xs text-slate-500 mt-2">
                                    Locked blocks cannot be moved or resized.
                                </p>
                            </SettingsSection>

                            <SettingsSection title="Visibility">
                                <div className="space-y-2">
                                    {["viewer", "analyst", "admin"].map((role) => {
                                        const visibleTo = block.visibleTo || ["viewer", "analyst", "admin"];
                                        const isVisible = visibleTo.includes(role);
                                        return (
                                            <button
                                                key={role}
                                                onClick={() => {
                                                    const newVisibleTo = isVisible
                                                        ? visibleTo.filter((r) => r !== role)
                                                        : [...visibleTo, role];
                                                    onUpdate({ visibleTo: newVisibleTo.length > 0 ? newVisibleTo : undefined });
                                                }}
                                                className={cn(
                                                    "w-full flex items-center justify-between px-4 py-2 rounded-lg border transition-all",
                                                    isVisible
                                                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                        : "bg-slate-800 border-slate-600 text-slate-500"
                                                )}
                                            >
                                                <span className="flex items-center gap-2 capitalize">
                                                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                                    {role}
                                                </span>
                                                <span className="text-xs">{isVisible ? "Visible" : "Hidden"}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </SettingsSection>
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

// Helper Components
function SettingsSection({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <h3 className="text-sm font-medium text-slate-300 mb-3">{title}</h3>
            {children}
        </div>
    );
}

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
                <span className="text-sm text-slate-200 font-mono">
                    {value}{unit}
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

function NumberInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (value: number) => void;
}) {
    return (
        <div className="space-y-1">
            <label className="text-xs text-slate-400">{label}</label>
            <input
                type="number"
                min={0}
                max={100}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
        </div>
    );
}

function getDefaultPadding(padding?: BlockStyles["padding"]) {
    return {
        top: padding?.top ?? 0,
        right: padding?.right ?? 0,
        bottom: padding?.bottom ?? 0,
        left: padding?.left ?? 0,
    };
}
