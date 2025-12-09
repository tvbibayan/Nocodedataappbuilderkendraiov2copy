/**
 * Customizable Sidebar
 * Drag-and-drop sidebar with folders and pinned flows
 */

import * as React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  User,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Settings,
  Edit3,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { usePreferencesStore } from "../../stores/preferences-store";
import type { NavItem } from "../../config/navigation-schema";
import { cn } from "../ui/utils";

interface CustomizableSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function CustomizableSidebar({
  activeView,
  onViewChange,
}: CustomizableSidebarProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);

  const getCurrentWorkspace = usePreferencesStore((s) => s.getCurrentWorkspace);
  const reorderSidebarItems = usePreferencesStore((s) => s.reorderSidebarItems);

  const workspace = getCurrentWorkspace();
  const sidebarConfig = workspace?.sidebarConfig;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && sidebarConfig) {
      const oldIndex = sidebarConfig.items.findIndex((item) => item.id === active.id);
      const newIndex = sidebarConfig.items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(sidebarConfig.items, oldIndex, newIndex).map(
        (item, index) => ({ ...item, order: index })
      );

      reorderSidebarItems(newItems);
    }
  };

  if (!sidebarConfig) {
    return <div className="w-64 bg-slate-900" />;
  }

  // Filter visible items
  const visibleItems = sidebarConfig.items.filter((item) => !item.isHidden);

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white">K</span>
            </div>
            <span className="text-xl tracking-tight text-slate-100">Kendraio</span>
          </div>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isEditMode
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-slate-400 hover:bg-slate-800"
            )}
            title={isEditMode ? "Done editing" : "Edit sidebar"}
          >
            {isEditMode ? <Settings className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {isEditMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleItems.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {visibleItems.map((item) => (
                <SortableNavItem
                  key={item.id}
                  item={item}
                  isActive={item.href === `/${activeView}` || item.id === activeView}
                  onNavigate={onViewChange}
                  isEditMode={isEditMode}
                />
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          visibleItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={item}
              isActive={item.href === `/${activeView}` || item.id === activeView}
              onNavigate={onViewChange}
            />
          ))
        )}
      </nav>

      {/* User Profile */}
      {sidebarConfig.showUserProfile && (
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-200">Alex Morgan</div>
              <div className="text-xs text-slate-500">alex@kendraio.com</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sortable nav item wrapper
function SortableNavItem({
  item,
  isActive,
  onNavigate,
  isEditMode,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: (view: string) => void;
  isEditMode: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-4 h-4 text-slate-500" />
        </div>
      )}
      <NavItemComponent
        item={item}
        isActive={isActive}
        onNavigate={onNavigate}
        indent={isEditMode ? 1 : 0}
      />
    </div>
  );
}

// Nav item component
function NavItemComponent({
  item,
  isActive,
  onNavigate,
  indent = 0,
}: {
  item: NavItem;
  isActive: boolean;
  onNavigate: (view: string) => void;
  indent?: number;
}) {
  const [isOpen, setIsOpen] = React.useState(!item.isCollapsed);

  // Handle separator
  if (item.type === "separator") {
    return <div className="my-2 border-t border-slate-800" />;
  }

  // Get icon component
  const IconComponent = item.icon
    ? (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] ||
      (() => <span className="text-lg">{item.icon}</span>)
    : null;

  // Handle folder
  if (item.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
          style={{ paddingLeft: `${16 + indent * 12}px` }}
        >
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {IconComponent && <IconComponent className="w-5 h-5" />}
          <span>{item.label}</span>
        </button>
        {isOpen && item.children && (
          <div className="ml-4">
            {item.children.map((child) => (
              <NavItemComponent
                key={child.id}
                item={child}
                isActive={child.href === `/${child.id}`}
                onNavigate={onNavigate}
                indent={indent + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle pinned flow
  if (item.type === "pinned-flow") {
    return (
      <button
        onClick={() => onNavigate(item.flowId || "flows")}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
          isActive
            ? "bg-amber-500/20 text-amber-400"
            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        )}
        style={{ paddingLeft: `${16 + indent * 12}px` }}
      >
        <span className="text-lg">{item.icon || "📌"}</span>
        <span className="truncate">{item.label}</span>
      </button>
    );
  }

  // Handle regular link
  return (
    <button
      onClick={() => {
        const view = item.href?.replace("/", "") || item.id;
        onNavigate(view);
      }}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
        isActive
          ? "bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/20"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      )}
      style={{ paddingLeft: `${16 + indent * 12}px` }}
    >
      {IconComponent && <IconComponent className="w-5 h-5" />}
      <span>{item.label}</span>
    </button>
  );
}
