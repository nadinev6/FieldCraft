# Tambo Best Practices for FieldCraft

This document outlines best practices for updating existing components, adding new components, and integrating new tools within the FieldCraft application, focusing on effective state management and adherence to Tambo's recommended patterns.

## 1. General Principles

*   **Schema-First Development**: Always define your component and tool interfaces using Zod schemas. This ensures type safety, runtime validation, and clear communication with the Tambo AI.
*   **Leverage Tambo Hooks**: Utilize Tambo's provided React hooks (`useTamboComponentState`, `useTamboStreaming`, etc.) for managing component state that needs to be influenced or controlled by the AI. Avoid ad-hoc `useEffect` logic for syncing props when a dedicated Tambo hook is available.
*   **Modularity**: Keep components and tools focused on a single responsibility.
*   **Consistency**: Adhere to the existing file structure and coding conventions.
*   **Prop Size Awareness**: Be mindful of the size of props passed to components. Large props (e.g., extensive lists or complex nested objects) can impact Tambo's response time and efficiency. If possible, consider having components fetch their own data using a tool rather than receiving very large arrays directly as props. For example, instead of passing a huge list of products, pass a product ID and let the component fetch details.

## 2. Updating and Adding Props to Existing Components

When modifying an existing component to accept new props or change how existing props are handled, follow these steps:

1.  **Update the Zod `propsSchema`**:
    *   Locate the component's `propsSchema` definition in `src/lib/tambo.ts`.
    *   Add or modify the properties in the Zod object to reflect the new or changed props.
    *   Ensure proper Zod types, optionality (`.optional()`), default values (`.default()`), and descriptions (`.describe()`).
    *   **Optional Props Handling**: Remember that `.optional()` means Tambo may not generate a value for that prop at all. Components should always handle `undefined` gracefully for optional props. For instance, in `StylingPanel`, `backgroundColor` is optional, so the component should provide a fallback if it's not provided.

    ```typescript
    // Example in src/lib/tambo.ts for an existing component
    export const myComponentSchema = z.object({
      // ... existing props
      newProp: z.string().optional().describe("A new optional property for the component"),
      updatedProp: z.boolean().default(true).describe("An existing prop with a new default"),
    });
    ```

2.  **Update the React Component's Type Definition**:
    *   In the component's `.tsx` file (e.g., `src/components/form/form-renderer.tsx`), update its TypeScript interface or type alias to include the new props. If using `z.infer<typeof yourSchema>`, this step might be automatic.

3.  **Sync Props with `useTamboComponentState`**:
    *   For any prop that needs to be dynamically updated by Tambo (e.g., `formDef`, `multiStep`, `buttonsAlign` in `FormRenderer`), use `useTamboComponentState` for *each individual prop*.
    *   This hook efficiently streams updates from Tambo to your component's internal state.
    *   **Component State Granularity**: Explicitly avoid using a single object state (e.g., `internalState`) for all props with `useTamboComponentState`. Tambo tracks each value individually, so separate `useTamboComponentState` calls for each prop (like `stepIndex`, `isMultiStep`, `currentFormDef` in `FormRenderer`) is the recommended pattern.

    ```typescript
    // Example in your component's .tsx file (e.g., src/components/form/form-renderer.tsx)
    import { useTamboComponentState } from "@tambo-ai/react";

    export const MyComponent: React.FC<MyComponentProps> = ({
      initialPropA,
      dynamicPropC,
    }) => {
      // Use useTamboComponentState for props that Tambo can dynamically update
      const [propC, setPropC] = useTamboComponentState("propC", dynamicPropC);
      // ... other individual state variables

      // For props that are not expected to change dynamically from Tambo,
      // you can use them directly or manage them with standard React state if needed.
      const [internalState, setInternalState] = useState(initialPropA);

      // ... rest of your component logic
    };
    ```

4.  **Handle Derived State and Side Effects**:
    *   If a prop change requires a derived state calculation or a side effect (e.g., clamping a value, initializing a sub-state), use `React.useMemo` or `React.useEffect` *after* the `useTamboComponentState` calls.
    *   Ensure your `useEffect` dependencies are correctly specified to avoid infinite loops or stale closures.

    ```typescript
    // Example: Clamping a step index after a multi-step form definition changes in FormRenderer
    React.useEffect(() => {
      if (isMultiStep && currentMultiStepFormDef) {
        const maxSteps = currentMultiStepFormDef.steps.length;
        if (stepIndex >= maxSteps) {
          setStepIndex(Math.max(0, maxSteps - 1));
        }
      }
    }, [isMultiStep, currentMultiStepFormDef?.steps.length, stepIndex, setStepIndex]); // Include setter in dependencies
    ```

## 3. Adding New Components

To introduce a completely new UI component that Tambo AI can render:

1.  **Create the React Component**:
    *   Develop your React component (e.g., `src/components/tambo/NewWidget.tsx`).
    *   Ensure it's a functional component and handles its own internal state and rendering.
    *   If the component needs to be interactable or receive dynamic updates from Tambo, consider using `withInteractable` or `useTamboComponentState` as appropriate.
    *   **Interactable Components**: Components wrapped with `withInteractable` (like `SettingsPanel` in `src/app/interactables/components/settings-panel.tsx` or `StylingPanel` in `src/app/interactables/components/styling-panel.tsx`) allow Tambo to update their props in-place. This is particularly useful for user-driven UIs where the AI can modify the component's state based on user commands.

2.  **Define its Zod `propsSchema`**:
    *   Create a Zod schema that precisely defines all the props your new component expects. This schema will be used by Tambo to understand how to generate and validate props for your component.

    ```typescript
    // Example in src/components/tambo/NewWidget.tsx
    export const newWidgetSchema = z.object({
      title: z.string().describe("Title of the new widget"),
      data: z.array(z.number()).describe("Numeric data for the widget"),
      color: z.string().optional().describe("Optional color for the widget"),
    });

    export type NewWidgetProps = z.infer<typeof newWidgetSchema>;
    ```

3.  **Register the Component in `src/lib/tambo.ts`**:
    *   Import your new component and its `propsSchema`.
    *   Add an entry to the `components` array, providing a unique `name`, a clear `description`, the `component` itself, and its `propsSchema`.

    ```typescript
    // Example in src/lib/tambo.ts
    import { NewWidget, newWidgetSchema } from "@/components/tambo/NewWidget";

    export const components: TamboComponent[] = [
      // ... existing components
      {
        name: "NewWidget",
        description: "A versatile new widget for displaying data.",
        component: NewWidget,
        propsSchema: newWidgetSchema,
      },
    ];
    ```

## 4. Adding New Tools

To expose new backend functionalities or data fetching capabilities to Tambo AI:

1.  **Implement the Tool Function**:
    *   Create a function that performs the desired operation (e.g., `src/services/my-new-service.ts`). This function should ideally be asynchronous and return data.

    ```typescript
    // Example in src/services/my-new-service.ts
    export async function fetchUserData(userId: string) {
      // ... logic to fetch user data
      return { id: userId, name: "John Doe" };
    }
    ```

2.  **Define its Zod `toolSchema`**:
    *   Create a Zod function schema that defines the arguments your tool function expects and the shape of the data it returns.

    ```typescript
    // Example in src/lib/tambo.ts (or a separate schema file if complex)
    export const fetchUserDataSchema = z
      .function()
      .args(z.string().describe("The ID of the user to fetch"))
      .returns(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      );
    ```

3.  **Register the Tool in `src/lib/tambo.ts`**:
    *   Import your new tool function and its `toolSchema`.
    *   Add an entry to the `tools` array, providing a unique `name`, a clear `description`, the `tool` function itself, and its `toolSchema`.

    ```typescript
    // Example in src/lib/tambo.ts
    import { fetchUserData } from "@/services/my-new-service";
    import { fetchUserDataSchema } from "@/lib/tambo"; // Assuming schema is here

    export const tools: TamboTool[] = [
      // ... existing tools
      {
        name: "fetchUserData",
        description: "Fetches detailed information for a given user ID.",
        tool: fetchUserData,
        toolSchema: fetchUserDataSchema,
      },
    ];
    ```

By following these best practices, you can ensure that your FieldCraft application remains maintainable, scalable, and effectively leverages the power of Tambo AI.
