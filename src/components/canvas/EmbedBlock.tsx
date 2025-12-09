/**
 * Embed Block
 * An iframe embed block for external content (Grafana, YouTube, etc.)
 */

import * as React from "react";
import { ExternalLink, RefreshCw, Settings, AlertCircle, Globe } from "lucide-react";
import { cn } from "../ui/utils";

interface EmbedBlockProps {
  url: string;
  title?: string;
  allowFullscreen?: boolean;
  onUrlChange?: (url: string) => void;
  editable?: boolean;
  className?: string;
}

export function EmbedBlock({
  url,
  title = "Embedded Content",
  allowFullscreen = true,
  onUrlChange,
  editable = true,
  className,
}: EmbedBlockProps) {
  const [isConfiguring, setIsConfiguring] = React.useState(!url);
  const [localUrl, setLocalUrl] = React.useState(url);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useEffect(() => {
    setLocalUrl(url);
    setIsLoading(!!url);
    setHasError(false);
  }, [url]);

  const handleSave = () => {
    if (onUrlChange && isValidUrl(localUrl)) {
      onUrlChange(localUrl);
      setIsConfiguring(false);
      setIsLoading(true);
      setHasError(false);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      iframeRef.current.src = url;
    }
  };

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  // Configuration view
  if (isConfiguring) {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center p-6", className)}>
        <Globe className="w-12 h-12 text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-200 mb-2">Embed External Content</h3>
        <p className="text-sm text-slate-400 text-center mb-4">
          Enter a URL to embed content from external sources like Grafana, YouTube, or any iframe-compatible site.
        </p>
        <div className="w-full max-w-md space-y-4">
          <input
            type="url"
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="https://example.com/embed"
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!isValidUrl(localUrl)}
              className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Embed URL
            </button>
            {url && (
              <button
                onClick={() => setIsConfiguring(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 text-center">
            Note: Some sites may block embedding due to security policies.
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className={cn("h-full flex flex-col items-center justify-center p-6", className)}>
        <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-slate-200 mb-2">Unable to Load Content</h3>
        <p className="text-sm text-slate-400 text-center mb-4">
          The embedded content could not be loaded. This might be due to the site blocking embeds.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          {editable && (
            <button
              onClick={() => setIsConfiguring(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              Change URL
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center gap-2 text-slate-400 text-sm overflow-hidden">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{new URL(url).hostname}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleRefresh}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {editable && (
            <button
              onClick={() => setIsConfiguring(true)}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded transition-colors"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
            <div className="flex items-center gap-3 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Loading...</span>
            </div>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={url}
          title={title}
          className="w-full h-full border-0"
          allowFullScreen={allowFullscreen}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
