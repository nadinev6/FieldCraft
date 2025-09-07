"use client";

import { CanvasSpace } from "@/components/tambo/canvas-space";
import { MessageThreadPanel } from "@/components/tambo/message-thread-panel";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function App() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <div className="flex h-screen w-full">
        {/* Left panel: Chat (1/3) */}
        <div className="flex-[1_1_33%] min-w-0 h-full shadow-2xl">
  <MessageThreadPanel contextKey="main-thread" className="w-full h-full flex-1" />
        </div>

        {/* Right panel: Canvas (2/3) */}
        <div className="flex-[2_2_67%] min-w-0 h-full shadow-2xl">
  <CanvasSpace className="w-full h-full flex-1" />
        </div>
      </div>
    </TamboProvider>
  );
}