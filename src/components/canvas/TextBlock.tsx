/**
 * Text Block
 * A rich text/markdown block for the Living Canvas
 */

import * as React from "react";
import { Type, Bold, Italic, Link, List, Heading1, Heading2, Code } from "lucide-react";
import { cn } from "../ui/utils";

interface TextBlockProps {
  content: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  className?: string;
}

export function TextBlock({
  content,
  onChange,
  editable = true,
  className,
}: TextBlockProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [localContent, setLocalContent] = React.useState(content);
  const editorRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && localContent !== content) {
      onChange(localContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setLocalContent(content);
      setIsEditing(false);
    }
    if (e.key === "Enter" && e.metaKey) {
      handleBlur();
    }
  };

  // Simple markdown-to-HTML converter
  const renderMarkdown = (text: string) => {
    let html = text
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-slate-200 mt-4 mb-2">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-slate-100 mt-4 mb-2">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-slate-100 mt-4 mb-3">$1</h1>')
      // Bold & Italic
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-slate-100">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Inline code
      .replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 bg-slate-800 rounded text-cyan-400 font-mono text-sm">$1</code>')
      // Links
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-cyan-400 hover:underline" target="_blank" rel="noopener">$1</a>')
      // Lists
      .replace(/^- (.+)$/gm, '<li class="ml-4 text-slate-300">• $1</li>')
      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 text-slate-300">$1. $2</li>')
      // Line breaks
      .replace(/\n\n/g, '</p><p class="mb-2">')
      .replace(/\n/g, '<br />');

    return `<p class="mb-2">${html}</p>`;
  };

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Toolbar (only in edit mode) */}
      {editable && isEditing && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-700/50 bg-slate-800/50">
          <ToolbarButton icon={Bold} title="Bold (⌘B)" />
          <ToolbarButton icon={Italic} title="Italic (⌘I)" />
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <ToolbarButton icon={Heading1} title="Heading 1" />
          <ToolbarButton icon={Heading2} title="Heading 2" />
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <ToolbarButton icon={List} title="List" />
          <ToolbarButton icon={Link} title="Link" />
          <ToolbarButton icon={Code} title="Code" />
          <div className="flex-1" />
          <span className="text-xs text-slate-500">⌘↵ to save</span>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4">
        {isEditing && editable ? (
          <textarea
            ref={editorRef}
            value={localContent}
            onChange={(e) => setLocalContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent text-slate-300 placeholder:text-slate-600 outline-none resize-none font-mono text-sm"
            placeholder="Type something... (Markdown supported)"
            autoFocus
          />
        ) : (
          <div
            onClick={() => editable && setIsEditing(true)}
            className={cn(
              "prose prose-invert prose-sm max-w-none text-slate-300",
              editable && "cursor-text hover:bg-slate-800/30 rounded -m-2 p-2 transition-colors"
            )}
          >
            {localContent ? (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(localContent) }} />
            ) : (
              <p className="text-slate-500 italic">Click to add text...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Toolbar button helper
function ToolbarButton({
  icon: Icon,
  title,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
