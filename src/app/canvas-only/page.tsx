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
  const formDefParam = searchParams.get('formDef');
  const buttonsParam = searchParams.get('buttons');
  const testMode = searchParams.get('test');

  // Add thread debugging
  const { thread } = useTamboThread();
  
  useEffect(() => {
    console.log("=== CANVAS-ONLY CONTENT DEBUG ===");
    console.log("Thread from useTamboThread():", thread);
    console.log("Thread ID from useTamboThread():", thread?.id);
    console.log("Thread messages count:", thread?.messages?.length || 0);
    console.log("messageIdFromUrl:", messageIdFromUrl);
    console.log("formDefParam:", formDefParam);
    console.log("buttonsParam:", buttonsParam);
    console.log("testMode:", testMode);
  }, [thread, messageIdFromUrl, formDefParam, buttonsParam]);

  // Direct test mode - hardcoded FormRenderer with multiStep and styling
  if (testMode === 'multistep') {
    const testFormDef = [
      {
        type: "group",
        label: "Step 1: Personal Information",
        fields: [
          { type: "text", label: "Full Name", name: "fullName", required: true },
          { type: "email", label: "Email Address", name: "email", required: true },
          { type: "date", label: "Date of Birth", name: "dateOfBirth" }
        ]
      },
      {
        type: "group", 
        label: "Step 2: Contact Details",
        fields: [
          { type: "text", label: "Phone Number", name: "phone" },
          { type: "text", label: "Address", name: "address" },
          { type: "text", label: "City", name: "city" }
        ]
      },
      {
        type: "group",
        label: "Step 3: Preferences", 
        fields: [
          { 
            type: "select", 
            label: "Preferred Contact Method", 
            name: "contactMethod",
            options: [
              { label: "Email", value: "email" },
              { label: "Phone", value: "phone" },
              { label: "SMS", value: "sms" }
            ]
          },
          { type: "checkbox", label: "Subscribe to Newsletter", name: "newsletter" },
          { 
            type: "starRating", 
            label: "Rate Your Experience", 
            name: "rating",
            maxRating: 5 
          }
        ]
      }
    ];

    const testButtons = [
      { label: "Save Draft", type: "button", variant: "secondary" },
      { label: "Submit Form", type: "submit", variant: "primary" }
    ];

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Direct FormRenderer Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Testing multiStep=true with purple background and yellow text
            </p>
          </div>
          <FormRenderer 
            formDef={testFormDef}
            buttons={testButtons}
            multiStep={true}
            backgroundColorClass="bg-purple-700"
            textColorClass="text-yellow-300"
            buttonsAlign="center"
          />
        </div>
      </div>
    );
  }
  // Parse form data if available
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

  console.log("=== CANVAS-ONLY PAGE DEBUG ===");
  console.log("Raw threadId from URL:", searchParams.get('threadId'));
  console.log("Final threadId being used:", threadId);
  console.log("ThreadId type:", typeof threadId);
  console.log("All URL search params:", Object.fromEntries(searchParams.entries()));

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