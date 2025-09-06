"use client";

import { CanvasSpace } from "@/components/tambo/canvas-space";
import { MessageThreadPanel } from "@/components/tambo/message-thread-panel";
import { TamboProvider } from "@tambo-ai/react";

export default function App() {
  return (
    <TamboProvider>
      <div className="flex h-screen w-full">
        {/* Left panel: Chat (1/3) */}
<div className="flex-[1_1_33%] min-w-0 h-full border border-red-500">
  <MessageThreadPanel contextKey="main-thread" className="w-full h-full flex-1" />
</div>

        {/* Right panel: Canvas (2/3) */}
<div className="flex-[2_2_67%] min-w-0 h-full border border-blue-500">
  <CanvasSpace className="w-full h-full flex-1" />
</div>
      </div>
    </TamboProvider>
  );
}