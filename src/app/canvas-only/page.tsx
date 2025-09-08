"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function CanvasOnlyPage() {
  const searchParams = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');

  useEffect(() => {
    if (messageIdFromUrl) {
      // Dispatch event to show the component in canvas
      // This event is listened to by CanvasSpace
      window.dispatchEvent(
        new CustomEvent("tambo:showComponent", {
          detail: {
            messageId: messageIdFromUrl,
            // component is not passed here, CanvasSpace will find it from the thread
          },
        }),
      );
    }
  }, [messageIdFromUrl]);

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <div className="h-screen w-full">
        <CanvasSpace className="w-full h-full" />
      </div>
    </TamboProvider>
  );
}