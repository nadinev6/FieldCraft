"use client";

import { cn } from "@/lib/utils";
import { FormRenderer } from "@/components/form/form-renderer";
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

  // Log thread ID immediately when component renders
  useEffect(() => {
    console.log("=== CANVAS SPACE THREAD DEBUG ===");
    console.log("Current thread object:", thread);
    console.log("Current thread.id:", thread?.id);
    console.log("Thread ID type:", typeof thread?.id);
    console.log("Is thread ID placeholder?", thread?.id === "placeholder");
  }, [thread?.id]);

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
    console.log("=== COMPONENT TO RENDER CALCULATION ===");
    if (!thread?.messages) {
      console.log("No thread messages available");
      return null;
    }

    console.log("Thread messages count:", thread.messages.length);
    console.log("Active canvas message ID:", activeCanvasMessageId);
    
    // Log all messages with their renderedComponent status
    thread.messages.forEach((msg, index) => {
      console.log(`Message ${index}:`, {
        id: msg.id,
        role: msg.role,
        hasRenderedComponent: !!msg.renderedComponent,
        renderedComponentType: msg.renderedComponent ? 
          (React.isValidElement(msg.renderedComponent) ? 
            (msg.renderedComponent.type as any)?.name || 
            (msg.renderedComponent.type as any)?.displayName || 
            'Unknown React Element' : 
            typeof msg.renderedComponent) : 
          'None'
      });
      
      // If this message has a renderedComponent, log its props
      if (msg.renderedComponent && React.isValidElement(msg.renderedComponent)) {
        const element = msg.renderedComponent as React.ReactElement;
        console.log(`Message ${index} component props:`, element.props);
        
        // Specifically check for FormRenderer props
        if (element.props.formDef) {
          console.log(`Message ${index} formDef:`, element.props.formDef);
        }
        if (element.props.buttons) {
          console.log(`Message ${index} buttons:`, element.props.buttons);
        }
        if (element.props.multiStep !== undefined) {
          console.log(`Message ${index} multiStep:`, element.props.multiStep);
        }
        if (element.props.backgroundColorClass) {
          console.log(`Message ${index} backgroundColorClass:`, element.props.backgroundColorClass);
        }
        if (element.props.backgroundGradientClass) {
          console.log(`Message ${index} backgroundGradientClass:`, element.props.backgroundGradientClass);
        }
        if (element.props.textColorClass) {
          console.log(`Message ${index} textColorClass:`, element.props.textColorClass);
        }
      }
    });

    if (activeCanvasMessageId) {
      const activeMessage = thread.messages.find(msg => msg.id === activeCanvasMessageId);
      if (activeMessage?.renderedComponent) {
        console.log("Rendering active message component:", activeCanvasMessageId);
        console.log("Active message component details:", {
          isReactElement: React.isValidElement(activeMessage.renderedComponent),
          componentType: React.isValidElement(activeMessage.renderedComponent) ? 
            (activeMessage.renderedComponent.type as any)?.name || 
            (activeMessage.renderedComponent.type as any)?.displayName : 
            typeof activeMessage.renderedComponent
        });
        return activeMessage.renderedComponent;
      }
    }

    // Find latest message with a component
    const latestMessage = [...thread.messages]
      .reverse()
      .find(msg => msg.renderedComponent);

    if (latestMessage?.renderedComponent) {
      console.log("Rendering latest component from message:", latestMessage.id);
      console.log("Latest component details:", {
        isReactElement: React.isValidElement(latestMessage.renderedComponent),
        componentType: React.isValidElement(latestMessage.renderedComponent) ? 
          (latestMessage.renderedComponent.type as any)?.name || 
          (latestMessage.renderedComponent.type as any)?.displayName : 
          typeof latestMessage.renderedComponent
      });
      
      // Log the actual component being returned
      console.log("Component being returned:", latestMessage.renderedComponent);
      return latestMessage.renderedComponent;
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
            console.log('Thread ID being used for URL:', thread?.id);
            console.log('=== COMPONENT TO RENDER DEBUG ===');
            console.log('componentToRender (full object):', componentToRender);
            console.log('componentToRender type:', typeof componentToRender);
            console.log('componentToRender is React element?', React.isValidElement(componentToRender));
            
            if (componentToRender) {
              if (React.isValidElement(componentToRender)) {
                const element = componentToRender as React.ReactElement;
                console.log('Element type:', element.type);
                console.log('Element type name:', (element.type as any)?.name || (element.type as any)?.displayName);
                console.log('Element props:', element.props);
                console.log('Props has formDef?', 'formDef' in element.props);
                console.log('Props has buttons?', 'buttons' in element.props);
                console.log('Direct type comparison with FormRenderer:', element.type === FormRenderer);
              }
              
              let url = `${window.location.origin}/canvas-only`;
              const params = new URLSearchParams();
              
              // Always include threadId if available
              if (thread?.id) {
                params.set('threadId', thread.id);
                console.log('Added threadId to URL:', thread.id);
              } else {
                console.log('WARNING: No thread.id available to add to URL');
              }
              
              // Extract form data from React element props
              if (React.isValidElement(componentToRender)) {
                const element = componentToRender as React.ReactElement;
                const props = element.props;
                
                console.log('=== FORM DATA EXTRACTION ===');
                console.log('Checking for formDef in props...');
                console.log('formDef value:', props.formDef);
                console.log('buttons value:', props.buttons);
                
                // Check if this looks like a FormRenderer (has formDef or buttons)
                if (props.formDef || props.buttons) {
                  console.log('Found form data in props, adding to URL...');
                  try {
                    if (props.formDef) {
                      const serializedFormDef = JSON.stringify(props.formDef);
                      console.log('Serialized formDef:', serializedFormDef);
                      params.set('formDef', encodeURIComponent(serializedFormDef));
                      console.log('Added formDef to URL parameters');
                    }
                    if (props.buttons) {
                      const serializedButtons = JSON.stringify(props.buttons);
                      console.log('Serialized buttons:', serializedButtons);
                      params.set('buttons', encodeURIComponent(serializedButtons));
                      console.log('Added buttons to URL parameters');
                    }
                  } catch (error) {
                    console.error('Failed to serialize form data:', error);
                    console.log('Falling back to messageId approach due to serialization error');
                  }
                } else {
                  console.log('No form data found in props, using messageId approach');
                }
              }
              
              // Fallback to messageId if no form data was extracted
              if (!params.has('formDef') && !params.has('buttons') && activeCanvasMessageId) {
                console.log('Using messageId fallback:', activeCanvasMessageId);
                params.set('messageId', activeCanvasMessageId);
              }
              
              // Construct final URL with all parameters
              console.log('=== FINAL URL CONSTRUCTION ===');
              console.log('URL parameters:', Object.fromEntries(params.entries()));
              if (params.toString()) {
                url += `?${params.toString()}`;
              }
              console.log('Final URL being opened:', url);
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