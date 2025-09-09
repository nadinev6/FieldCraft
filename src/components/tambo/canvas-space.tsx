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
  const { thread } = useTamboThread();
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [activeCanvasMessageId, setActiveCanvasMessageId] = useState<string | null>(null);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousThreadId = useRef<string | null>(null);

  // Log thread changes
  useEffect(() => {
    console.log("Thread changed:", thread?.id);
    if (!thread || (previousThreadId.current && previousThreadId.current !== thread.id)) {
      console.log("Resetting canvas state");
      setActiveCanvasMessageId(null);
      setRenderedComponent(null);
    }
    previousThreadId.current = thread?.id ?? null;
  }, [thread]);

  // Handle custom events with enhanced logging
  useEffect(() => {
    const handleShowComponent = (event: CustomEvent<{ messageId: string; component: React.ReactNode }>) => {
      console.log("Received tambo:showComponent event:", event.detail);
      try {
        setActiveCanvasMessageId(event.detail.messageId);
        setRenderedComponent(event.detail.component);
      } catch (error) {
        console.error("Failed to render component:", error);
        setActiveCanvasMessageId(null);
      }
    };

    window.addEventListener("tambo:showComponent", handleShowComponent as EventListener);
    return () => {
      window.removeEventListener("tambo:showComponent", handleShowComponent as EventListener);
    };
  }, []);

  // Validate active message
  useEffect(() => {
    if (!thread?.messages) {
      console.log("No messages in thread");
      setActiveCanvasMessageId(null);
      return;
    }

    if (activeCanvasMessageId) {
      const activeMessage = thread.messages.find(msg => msg.id === activeCanvasMessageId);
      if (!activeMessage || !activeMessage.renderedComponent) {
        console.log("Active message no longer valid:", activeCanvasMessageId);
        setActiveCanvasMessageId(null);
      }
    }
  }, [thread?.messages, activeCanvasMessageId]);

  // Determine component to render
  const componentToRender = React.useMemo(() => {
    if (!thread?.messages) {
      console.log("No thread messages available");
      return null;
    }

    if (activeCanvasMessageId) {
      const activeMessage = thread.messages.find(msg => msg.id === activeCanvasMessageId);
      if (activeMessage?.renderedComponent) {
        console.log("Rendering active message component:", activeCanvasMessageId);
        return activeMessage.renderedComponent;
      }
    }

    // Find latest message with a component
    const latestComponent = [...thread.messages]
      .reverse()
      .find(msg => msg.renderedComponent)?.renderedComponent;

    if (latestComponent) {
      console.log("Rendering latest component");
      return latestComponent;
    }

    console.log("No components found in thread messages");
    return null;
  }, [thread?.messages, activeCanvasMessageId]);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, MAX_ZOOM));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, MIN_ZOOM));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(1.0);
  }, []);

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
                className="mx-auto max-w-full transition-all duration-200 ease-out transform flex justify-center opacity-100"
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
            console.log('=== CANVAS LINK DEBUG ===');
            console.log('componentToRender:', componentToRender);
            console.log('typeof componentToRender:', typeof componentToRender);
            console.log('componentToRender has props?', componentToRender && typeof componentToRender === 'object' && 'props' in componentToRender);
            
            console.log('=== CANVAS LINK DEBUG ===');
            console.log('componentToRender:', componentToRender);
            console.log('typeof componentToRender:', typeof componentToRender);
            console.log('componentToRender has props?', componentToRender && typeof componentToRender === 'object' && 'props' in componentToRender);
            
            if (componentToRender) {
              if (componentToRender && typeof componentToRender === 'object' && 'props' in componentToRender) {
                console.log('componentToRender.props:', (componentToRender as any).props);
                console.log('componentToRender.type:', (componentToRender as any).type);
                console.log('componentToRender.type.name:', (componentToRender as any).type?.name);
              }
              
                console.log('componentToRender.props:', (componentToRender as any).props);
                console.log('componentToRender.type:', (componentToRender as any).type);
                console.log('componentToRender.type.name:', (componentToRender as any).type?.name);
              
              
              let url = `${window.location.origin}/canvas-only`;
              
              // Extract FormRenderer props if applicable
              if (typeof componentToRender === 'object' && 'props' in componentToRender) {
                const props = (componentToRender as any).props;
                console.log('Extracted props:', props);
                console.log('Props has formDef?', props && 'formDef' in props);
                console.log('Props has buttons?', props && 'buttons' in props);
                
                console.log('Extracted props:', props);
                console.log('Props has formDef?', props && 'formDef' in props);
                console.log('Props has buttons?', props && 'buttons' in props);
                
                if (props && (props.formDef || props.buttons)) {
                  console.log('Found FormRenderer props, creating URL with form data');
                  console.log('Found FormRenderer props, creating URL with form data');
                  try {
                    const params = new URLSearchParams();
                    if (props.formDef) {
                      console.log('Adding formDef to URL:', props.formDef);
                      console.log('Adding formDef to URL:', props.formDef);
                      params.set('formDef', encodeURIComponent(JSON.stringify(props.formDef)));
                    }
                    if (props.buttons) {
                      console.log('Adding buttons to URL:', props.buttons);
                      console.log('Adding buttons to URL:', props.buttons);
                      params.set('buttons', encodeURIComponent(JSON.stringify(props.buttons)));
                    }
                    url += `?${params.toString()}`;
                    console.log('Final URL:', url);
                    console.log('Final URL:', url);
                  } catch (error) {
                    console.error('Failed to serialize form data:', error);
                    if (activeCanvasMessageId) {
                      console.log('Falling back to messageId approach:', activeCanvasMessageId);
                      console.log('Falling back to messageId approach:', activeCanvasMessageId);
                      url += `?messageId=${activeCanvasMessageId}`;
                    }
                  }
                } else if (activeCanvasMessageId) {
                  console.log('No FormRenderer props found, using messageId approach:', activeCanvasMessageId);
                  console.log('No FormRenderer props found, using messageId approach:', activeCanvasMessageId);
                  // Fallback to messageId approach for non-FormRenderer components
                  url += `?messageId=${activeCanvasMessageId}`;
                }
              } else if (activeCanvasMessageId) {
                console.log('Component has no props, using messageId approach:', activeCanvasMessageId);
                console.log('Component has no props, using messageId approach:', activeCanvasMessageId);
                // Fallback to messageId approach
                url += `?messageId=${activeCanvasMessageId}`;
              }
              
              console.log('Opening URL:', url);
              console.log('Opening URL:', url);
              window.open(url, '_blank');
            } else {
              console.log('No componentToRender available');
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