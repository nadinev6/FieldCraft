"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { FormRenderer } from "@/components/form/form-renderer";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { useTamboThread } from "@tambo-ai/react";


function CanvasOnlyContent() {
  const searchParams = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');

  // Add thread debugging
  const { thread } = useTamboThread();
  
  useEffect(() => {
    console.log("=== CANVAS-ONLY CONTENT THREAD DEBUG ===");
    console.log("Thread from useTamboThread():", thread);
    console.log("Thread ID from useTamboThread():", thread?.id);
    console.log("Thread messages count:", thread?.messages?.length || 0);
    console.log("Thread messages array:", thread?.messages);
    
    // Log each message in detail
    if (thread?.messages && thread.messages.length > 0) {
      console.log("=== DETAILED MESSAGE ANALYSIS ===");
      thread.messages.forEach((message, index) => {
        console.log(`Message ${index}:`, {
          id: message.id,
          role: message.role,
          hasRenderedComponent: !!message.renderedComponent,
          renderedComponentType: message.renderedComponent ? 
            (React.isValidElement(message.renderedComponent) ? 
              (message.renderedComponent.type as any)?.name || 
              (message.renderedComponent.type as any)?.displayName || 
              'Unknown React Element' : 
              typeof message.renderedComponent) : 
            'None'
        });
        
        // If this message has a renderedComponent, log its props
        if (message.renderedComponent && React.isValidElement(message.renderedComponent)) {
          const element = message.renderedComponent as React.ReactElement;
          console.log(`Message ${index} component props (stringified):`, JSON.stringify(element.props, null, 2));
        }
      });
    } else {
      console.log("No messages found in thread or thread is null/undefined");
    }
    
    console.log("=== URL PARAMETERS ===");
    console.log("messageIdFromUrl:", messageIdFromUrl);
  }, [thread, messageIdFromUrl]);

  // State to track canvas readiness
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
    
    // Trigger event after canvas is ready
    if (messageIdFromUrl && isReady) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.dispatchEvent(
          new CustomEvent("tambo:showComponent", {
            detail: {
              messageId: messageIdFromUrl,
            },
          })
        );
      });
    }
  }, [messageIdFromUrl, isReady]);

  return (
    <div className="h-screen w-full">
      <CanvasSpace className="w-full h-full" />
    </div>
  );
}

export default function CanvasOnlyPage() {
  // Get thread ID from URL parameters
  const searchParams = useSearchParams();
  const threadId = searchParams.get('threadId') || 'default-thread';

  useEffect(() => {
    console.log("=== CANVAS-ONLY PAGE INITIALIZATION DEBUG ===");
    console.log("Raw threadId from URL:", searchParams.get('threadId'));
    console.log("Final threadId being used:", threadId);
    console.log("ThreadId type:", typeof threadId);
    console.log("ThreadId length:", threadId.length);
    console.log("Is threadId placeholder?", threadId === 'default-thread');
    console.log("All URL search params:", Object.fromEntries(searchParams.entries()));
    console.log("Current URL:", window.location.href);
  }, [threadId, searchParams]);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
      threadId={threadId} // Pass thread ID explicitly
    >
      <CanvasOnlyContent />
    </TamboProvider>
  );
}