"use client";

import { cn } from "@/lib/utils";
import { useTamboThread } from "@tambo-ai/react";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import * as React from "react";
import type { TamboThreadMessage } from "@tambo-ai/react";

/**
 * Props for the CanvasSpace component
 * @interface
 */
interface CanvasSpaceProps {
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * A canvas space component that displays rendered components from chat messages.
 * @component
 * @example
 * ```tsx
 * <CanvasSpace className="custom-styles" />
 * ```
 */

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.0;
export function CanvasSpace({ className }: CanvasSpaceProps) {
  // Access the current Tambo thread context
  const { thread } = useTamboThread();

  // declare activeCanvasMessageId state
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 2.0;
  const [activeCanvasMessageId, setActiveCanvasMessageId] = useState<string | null>(null);


  // State for managing the currently rendered component
  const [renderedComponent, setRenderedComponent] =
    useState<React.ReactNode | null>(null);
  // Ref for the scrollable container to enable auto-scrolling
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track previous thread ID to handle thread changes
  const previousThreadId = useRef<string | null>(null);

  /**
   * Effect to reset canvas state when switching between threads
   * Prevents components from previous threads being displayed in new threads
   */
  useEffect(() => {
    // If there's no thread, or if the thread ID changed, reset the canvas state
    if (
      !thread ||
      (previousThreadId.current && previousThreadId.current !== thread.id)
    ) {
      setActiveCanvasMessageId(null);
    }

    // Update the previous thread ID reference
    previousThreadId.current = thread?.id ?? null;
  }, [thread]);

  /**
   * Effect to handle custom 'tambo:showComponent' events
   * Allows external triggers to update the rendered component
   */
  useEffect(() => {
    const handleShowComponent = (
      event: CustomEvent<{ messageId: string; component: React.ReactNode }>,
    ) => {
      try {
        setActiveCanvasMessageId(event.detail.messageId);
      } catch (error) {
        console.error("Failed to render component:", error);
        setActiveCanvasMessageId(null);
      }
    };

    window.addEventListener(
      "tambo:showComponent",
      handleShowComponent as EventListener,
    );

    return () => {
      window.removeEventListener(
        "tambo:showComponent",
        handleShowComponent as EventListener,
      );
    };
  }, []);

  /**
   * Effect to validate activeCanvasMessageId and reset if invalid
   */
  useEffect(() => {
    if (!thread?.messages) {
      setActiveCanvasMessageId(null);
      return;
    }

    // If there's an actively selected message, validate it still exists and has a component
    if (activeCanvasMessageId) {
      const activeMessage = thread.messages.find(
        (msg: TamboThreadMessage) => msg.id === activeCanvasMessageId
      );
      
      if (!activeMessage || !activeMessage.renderedComponent) {
        // Active message no longer exists or has no component, reset selection
        setActiveCanvasMessageId(null);
      }
    }
  }, [thread?.messages, activeCanvasMessageId]);

  // Derive the component to render directly from thread.messages (recommended pattern)
  const componentToRender = React.useMemo(() => {
    if (!thread?.messages) {
      return null;
    }

    // If there's an actively selected message, use its component
    if (activeCanvasMessageId) {
      const activeMessage = thread.messages.find(
        (msg: TamboThreadMessage) => msg.id === activeCanvasMessageId
      );
      if (activeMessage?.renderedComponent) {
        return activeMessage.renderedComponent;
      }
    }

    // Fall back to the latest message with a rendered component
    const latestComponent = thread.messages
      .slice()
      .reverse()
      .find((message: TamboThreadMessage) => message.renderedComponent)?.renderedComponent;

    return latestComponent || null;
  }, [thread?.messages, activeCanvasMessageId]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.1, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.1, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.0);
  }, []);

  // Ensure the scroll container can scroll horizontally when zoomed
  const scrollContainerClasses = "w-full flex-1 overflow-y-auto overflow-x-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-300";

  return (
    <div
      className={cn(
        "h-screen flex-1 flex flex-col bg-white/50 backdrop-blur-sm overflow-hidden border-l border-flat canvas-grid",
        className,
      )}
      data-canvas-space="true"
    >
      <div
        ref={scrollContainerRef}
        className={scrollContainerClasses}
      >
        <div className="p-8 h-full flex flex-col">
          {componentToRender ? (
            <div className="h-full space-y-6 pb-8 flex flex-col items-center justify-center w-full">
              <div
                className={cn(
                  "mx-auto max-w-full transition-all duration-200 ease-out transform flex justify-center",
                  "opacity-100"
                )}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center",
                }}
              >
                {componentToRender}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-6">
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Canvas is empty</p>
                <p className="text-sm text-gray-500">
                  Interactive components will appear here as they are generated
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 bg-white dark:bg-zinc-800 p-2 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700">
        <button
          onClick={() => {
            if (componentToRender) {
              // Try to extract FormRenderer props if it's a FormRenderer component
              let url = `${window.location.origin}/canvas-only`;
              
              // Check if the component is a FormRenderer by looking at its props
              if (componentToRender && typeof componentToRender === 'object' && 'props' in componentToRender) {
                const props = (componentToRender as any).props;
                if (props && (props.formDef || props.buttons)) {
                  try {
                    const params = new URLSearchParams();
                    if (props.formDef) {
                      params.set('formDef', encodeURIComponent(JSON.stringify(props.formDef)));
                    }
                    if (props.buttons) {
                      params.set('buttons', encodeURIComponent(JSON.stringify(props.buttons)));
                    }
                    url += `?${params.toString()}`;
                  } catch (error) {
                    console.error('Failed to serialize form data:', error);
                    // Fallback to messageId approach
                    if (activeCanvasMessageId) {
                      url += `?messageId=${activeCanvasMessageId}`;
                    }
                  }
                } else if (activeCanvasMessageId) {
                  // Fallback to messageId approach for non-FormRenderer components
                  url += `?messageId=${activeCanvasMessageId}`;
                }
              } else if (activeCanvasMessageId) {
                // Fallback to messageId approach
                url += `?messageId=${activeCanvasMessageId}`;
              }
              
              window.open(url, '_blank');
            }
          }}
          disabled={!componentToRender}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Zoom out"
        >
          -
        </button>
        <button
          onClick={handleResetZoom}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
          aria-label="Reset zoom"
        >
        {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}