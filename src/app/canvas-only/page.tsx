"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { CanvasSpace } from "@/components/tambo/canvas-space";
import { FormRenderer } from "@/components/form/form-renderer";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

function CanvasOnlyContent() {
  const searchParams = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');
  const formDefParam = searchParams.get('formDef');
  const buttonsParam = searchParams.get('buttons');

  // If we have form data in URL params, render the form directly
  if (formDefParam || buttonsParam) {
    try {
      const formDef = formDefParam ? JSON.parse(decodeURIComponent(formDefParam)) : undefined;
      const buttons = buttonsParam ? JSON.parse(decodeURIComponent(buttonsParam)) : undefined;
      
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-8">
          <FormRenderer formDef={formDef} buttons={buttons} />
        </div>
      );
    } catch (error) {
      console.error('Failed to parse form data from URL:', error);
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Error Loading Form
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              The form data in the URL appears to be corrupted or invalid.
            </p>
          </div>
        </div>
      );
    }
  }

  // Fallback to original messageId-based approach for other components
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
    <div className="h-screen w-full">
      <CanvasSpace className="w-full h-full" />
    </div>
  );
}

export default function CanvasOnlyPage() {
  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <Suspense fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }>
        <CanvasOnlyContent />
      </Suspense>
    </TamboProvider>
  );
}