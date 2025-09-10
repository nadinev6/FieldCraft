"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { JSONSchemaFormViewer } from "@/components/form/json-schema-form-viewer";
import { convertFormDefToJSONSchema, convertMultiStepFormToJSONSchema, extractFormDefFromComponent } from "@/lib/form-schema-converter";
import { components, tools } from "@/lib/tambo";
import { TamboProvider, useTamboThread } from "@tambo-ai/react";
import { cn } from "@/lib/utils";


function CanvasOnlyContent() {
  const searchParams = useSearchParams();
  const messageIdFromUrl = searchParams.get('messageId');
  const threadIdFromUrl = searchParams.get('threadId');
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState(null);

  const { thread, switchCurrentThread } = useTamboThread();

  // Switch to the correct thread when component mounts
  useEffect(() => {
    if (threadIdFromUrl && threadIdFromUrl !== thread?.id) {
      console.log('Switching to thread:', threadIdFromUrl);
      console.log('Current thread ID:', thread?.id);
      console.log('Target thread ID:', threadIdFromUrl);
      
      // Switch thread using proper Promise handling
      void switchCurrentThread(threadIdFromUrl).catch(error => {
        console.error('Error switching thread:', error);
        // Show error to user instead of silent failure
        alert(`Failed to load the form. Error: ${error.message || 'Unknown error'}`);
      });
    }
  }, [threadIdFromUrl, thread?.id, switchCurrentThread]);

  // Show loading state while thread is loading
  if (!thread) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  // Find the target message and extract form definition
  const targetMessage = useMemo(() => {
    if (!thread?.messages || !messageIdFromUrl) {
      console.log('No thread messages or messageId:', { 
        hasMessages: !!thread?.messages, 
        messageCount: thread?.messages?.length || 0,
        messageIdFromUrl 
      });
      return null;
    }
    const message = thread.messages.find(msg => msg.id === messageIdFromUrl);
    console.log('Target message found:', !!message, 'Component type:', typeof message?.renderedComponent?.type === 'function' ? message?.renderedComponent?.type?.name : 'unknown');
    return message;
  }, [thread?.messages, messageIdFromUrl]);

  // Convert form definition to JSON Schema
  const { jsonSchema, uiSchema, isMultiStep, steps } = useMemo(() => {
    if (!targetMessage?.renderedComponent) {
      return { jsonSchema: null, uiSchema: null, isMultiStep: false, steps: [] };
    }

    const component = targetMessage.renderedComponent;
    
    // Extract form definition from component props
    if (React.isValidElement(component) && component.props) {
      const props = component.props as any;
      
      // Check for multi-step form
      if (props.multiStep && props.multiStepFormDef) {
        const result = convertMultiStepFormToJSONSchema(props.multiStepFormDef);
        return {
          jsonSchema: result.jsonSchema,
          uiSchema: result.uiSchema,
          isMultiStep: true,
          steps: result.steps,
        };
      }
      
      // Check for regular form
      if (props.formDef && Array.isArray(props.formDef)) {
        const result = convertFormDefToJSONSchema(props.formDef);
        return {
          jsonSchema: result.jsonSchema,
          uiSchema: result.uiSchema,
          isMultiStep: false,
          steps: [],
        };
      }
    }

    return { jsonSchema: null, uiSchema: null, isMultiStep: false, steps: [] };
  }, [targetMessage]);

  const handleFormSubmit = (data: any) => {
    setSubmittedData(data);
    console.log('Form submitted with data:', data);
  };

  const handleFormChange = (data: any) => {
    setFormData(data);
  };

  if (!jsonSchema) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">
            {!targetMessage 
              ? "No message found with the provided ID" 
              : "This message doesn't contain a valid form"}
          </p>
        </div>
      </div>
    );
  }

  if (submittedData) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Submitted Successfully!</h2>
            <p className="text-gray-600">Thank you for your submission.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Submitted Data:</h3>
            <pre className="text-sm text-gray-700 overflow-auto max-h-64">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setSubmittedData(null)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Fill Out Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 py-8">
      <JSONSchemaFormViewer
        jsonSchema={jsonSchema as any}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        isMultiStep={isMultiStep}
        steps={steps}
        className="mx-auto"
      />
    </div>
  );
}

export default function CanvasOnlyPage() {
  // Get thread ID from URL parameters
  const searchParams = useSearchParams();
  const threadId = searchParams.get('threadId');
  const messageId = searchParams.get('messageId');

  useEffect(() => {
    console.log("=== CANVAS-ONLY PAGE INITIALIZATION DEBUG ===");
    console.log("Raw threadId from URL:", threadId);
    console.log("messageId from URL:", messageId);
    console.log("All URL search params:", Object.fromEntries(searchParams.entries()));
    console.log("Current URL:", window.location.href);
    console.log("Components registered:", components.map(c => c.name));
    
    // Verify FormRenderer is in registry before proceeding
    const hasFormRenderer = components.some(c => c.name === 'FormRenderer');
    console.log("FormRenderer in registry:", hasFormRenderer ? 'YES' : 'NO');
    
    if (!hasFormRenderer) {
      console.error("CRITICAL: FormRenderer component not found in registry!");
    }
  }, [threadId, messageId, searchParams]);

  // Verify FormRenderer is available before mounting TamboProvider
  const hasFormRenderer = components.some(c => c.name === 'FormRenderer');
  
  if (!hasFormRenderer) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Component Registry Error</h2>
          <p className="text-gray-600 mb-4">
            The FormRenderer component is not available in the component registry. This may be a configuration issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_TAMBO_API_KEY) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">API Key Missing</h2>
          <p className="text-gray-600">
            The Tambo API key is not configured. Please check your environment variables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
      components={components}
      tools={tools}
    >
      <CanvasOnlyContent />
    </TamboProvider>
  );
}