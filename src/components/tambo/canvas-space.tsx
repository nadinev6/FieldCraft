"use client";

import { cn } from "@/lib/utils";
import { useTamboThread } from "@tambo-ai/react";
import { useEffect, useRef, useState } from "react";
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
export function CanvasSpace({ className }: CanvasSpaceProps) {
  // Access the current Tambo thread context
  const { thread } = useTamboThread();

  // declare activeCanvasMessageId state
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
        className="w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-300"
      >
        <div className="p-8 h-full flex flex-col">
          {componentToRender ? (
            <div className="h-full space-y-6 pb-8 flex flex-col items-center justify-center w-full">
              <div
                className={cn(
                  "mx-auto max-w-full transition-all duration-200 ease-out transform flex justify-center",
                  "opacity-100 scale-100",
                )}
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
    </div>
  );
}
