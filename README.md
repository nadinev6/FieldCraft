# FieldCraft

FieldCraft is a production-ready form builder powered by Tambo AI, designed for the TamboHack. It uses Next.js, React, TypeScript, Tailwind CSS, and Zod for schema validation. This README will guide you through the architecture and file structure so you can replicate or extend the app.

---

## Overview

FieldCraft enables dynamic, schema-driven form creation and rendering. Forms are defined using JSON objects validated by Zod schemas, and rendered as interactive UI components. The app supports multi-section forms, conditional logic, and extensible field types.

---

## File Structure & Key Components

### 1. **Form Field Schemas**

Defines the blueprint for each form field type using Zod.

- **File:** `src/lib/form-field-schemas.ts`
- **Purpose:** Centralized schema definitions for all supported field types and structural elements.

#### Supported Field Types:
- **Basic Fields:** `text`, `email`, `password`, `number`, `checkbox`, `select`, `radio`, `textarea`, `date`
- **Structural Elements:** `group` (for sections), `divider` (for visual separation)

#### Form Definition Flexibility:
The `formFieldSchema` allows for maximum flexibility in form layout:

```typescript
// Individual fields at top level
const simpleForm = [
  { type: "text", label: "Name", name: "name" },
  { type: "email", label: "Email", name: "email" }
];

// Mixed structure with groups and individual fields
const complexForm = [
  { type: "text", label: "Title", name: "title" }, // Individual field
  { type: "divider", label: "Personal Information" }, // Visual separator
  { 
    type: "group", 
    label: "Contact Details",
    fields: [
      { type: "text", label: "Name", name: "name" },
      { type: "email", label: "Email", name: "email" }
    ]
  },
  { type: "checkbox", label: "Subscribe", name: "subscribe" } // Another individual field
];
```

### 2. **Form Definitions**

Contains the JSON structure for each form instance.

- **File:** `src/lib/form-definitions.ts`
- **Purpose:** Stores the form layout, sections, fields, and conditional logic. Can be static or loaded dynamically. Serves as examples and default forms.

### 3. **Form Validation Logic**

Builds composite Zod schemas and validates form data.

- **File:** `src/lib/form-validation.ts`
- **Purpose:** Maps form definitions to Zod schemas, validates user input, and handles errors.

### 4. **Form Rendering Components**

Renders the form UI based on definitions and schemas.

- **File:** `src/components/form/form-renderer.tsx`
- **Purpose:** Dynamically generates React components for each field, section, and divider. Handles conditional rendering and user interaction.

#### Key Features:
- **Flexible Rendering:** Supports both grouped fields (within `fieldset` elements) and individual fields at the top level
- **Conditional Logic:** Can show/hide sections based on field values
- **Custom Buttons:** Supports custom button configurations with different variants
- **Responsive Design:** Mobile-first design with dark mode support
- **Error Handling:** Graceful fallbacks for invalid form definitions

---

## AI Integration with Tambo

FieldCraft leverages Tambo AI for intelligent form generation:

### Tambo Components
- **FormRenderer:** Registered as a Tambo component in `src/lib/tambo.ts`
- **AI-Driven:** Forms can be generated dynamically based on natural language prompts
- **Schema Validation:** All AI-generated forms are validated against Zod schemas

### Example AI Prompts:
- "Create a registration form for a work event"
- "Build a contact form with validation"
- "Generate an order form with multiple sections"

---

## Getting Started

1. **Clone the repository and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd FieldCraft
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Explore the core files:**
   - Edit or extend field schemas in `src/lib/form-field-schemas.ts`
   - Define new forms in `src/lib/form-definitions.ts`
   - Add validation logic in `src/lib/form-validation.ts`
   - Customize rendering in `src/components/form/form-renderer.tsx`

---

## Extending FieldCraft

### Adding New Field Types
1. **Define Schema:** Add new field schema in `src/lib/form-field-schemas.ts`
2. **Update Union:** Include in the `formFieldSchema` union type
3. **Add Component:** Create rendering component in `src/components/form/form-renderer.tsx`
4. **Register Component:** Add to `FieldComponents` object

### Advanced Features
- **Conditional Logic:** Use `condition` properties on groups or fields
- **Custom Validation:** Extend validation logic in `form-validation.ts`
- **Styling:** Customize appearance using Tailwind CSS classes
- **Accessibility:** All components include proper ARIA labels and keyboard navigation

### Integration Examples
```typescript
// Custom field type
const customFieldSchema = z.object({
  type: z.literal("custom"),
  label: z.string(),
  name: z.string(),
  customProperty: z.string().optional()
});

// Add to union
export const formFieldSchema = z.union([
  // ... existing schemas
  customFieldSchema
]);
```

---

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- Tambo AI SDK

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

MIT License

---

**Happy building with FieldCraft!**