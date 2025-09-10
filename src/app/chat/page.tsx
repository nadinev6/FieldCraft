"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { MessageThreadPanel } from "@/components/tambo/message-thread-panel";
import { components, tools } from "@/lib/tambo";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";

function ChatContent() {
  const searchParams = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');
  const { thread } = useTamboThread();

  useEffect(() => {
    if (messageIdFromUrl && thread?.messages) {
      const message = thread.messages.find(msg => msg.id === messageIdFromUrl);
      if (message?.renderedComponent) {
        // Dispatch event to show the component in canvas
        window.dispatchEvent(
          new CustomEvent("tambo:showComponent", {
            detail: {
              messageId: message.id,
              component: message.renderedComponent,
            },
          }),
        );
      }
    }
  }, [messageIdFromUrl, thread?.messages]);

  return (
    <div className="flex h-screen w-full">
      {/* Left panel: Chat (1/3) */}
      <MessageThreadPanel 
        contextKey="main-thread" 
        className="h-full shadow-2xl"
      />

      {/* Right panel: Canvas (2/3) */}
      <div className="flex-1 min-w-0 h-full shadow-2xl">
        <CanvasSpace 
          className="w-full h-full flex-1"
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <ChatContent />
    </TamboProvider>
  );
}