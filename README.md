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
- **Purpose:** Centralized schema definitions for all supported field types (text, number, checkbox, select, radio, textarea, date, group/section, divider, etc.).

### 2. **Form Definitions**

Contains the JSON structure for each form instance.

- **File:** `src/lib/form-definitions.ts`
- **Purpose:** Stores the form layout, sections, fields, and conditional logic. Can be static or loaded dynamically.

### 3. **Form Validation Logic**

Builds composite Zod schemas and validates form data.

- **File:** `src/lib/form-validation.ts`
- **Purpose:** Maps form definitions to Zod schemas, validates user input, and handles errors.

### 4. **Form Rendering Components**

Renders the form UI based on definitions and schemas.

- **File:** `src/components/form/form-renderer.tsx`
- **Purpose:** Dynamically generates React components for each field, section, and divider. Handles conditional rendering and user interaction.

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

- **Add new field types:** Update `form-field-schemas.ts` and map them in `form-validation.ts`.
- **Support advanced layouts:** Use group/section and divider schemas for multi-section forms.
- **Implement conditional logic:** Add `condition` properties to sections or fields in your form definitions.
- **Integrate with Tambo AI:** Use hooks and components from `@tambo-ai/react` for generative UI features.

---

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- Zod
- Tambo AI SDK

---

## License

This project is built for the TamboHack and is open for extension and experimentation.

---

**Happy building with FieldCraft!**