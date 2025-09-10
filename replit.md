# FieldCraft - AI-Powered Form Builder

## Overview

FieldCraft is a Next.js application that enables dynamic, AI-powered form creation and rendering using Tambo AI. It serves as a template for building generative UI/UX applications where AI can dynamically generate, modify, and control React components based on user input. The application focuses on form building capabilities with support for complex multi-step forms, various field types, and real-time AI-driven modifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 15.4.1 with App Router for modern React application structure
- **UI Library**: React 19.1.0 with TypeScript for type-safe component development
- **Styling**: Tailwind CSS v4 with custom CSS variables and dark mode support
- **Component System**: Modular component architecture with Zod schema validation for all components

### AI Integration Layer
- **Tambo AI SDK**: Core integration using `@tambo-ai/react` for AI-driven component generation and control
- **Component Registration**: Centralized component registration system in `src/lib/tambo.ts` where components are registered with Zod schemas for AI consumption
- **Real-time State Management**: Uses Tambo hooks (`useTamboComponentState`, `useTamboStreaming`) for AI-controlled component state updates
- **Tool System**: External function registration as "tools" that AI can invoke for data fetching and actions

### Form Generation System
- **Schema-First Development**: All form fields and components defined using Zod schemas in `src/lib/form-field-schemas.ts`
- **Multi-Step Form Support**: Complex form workflows with step navigation and validation
- **Field Type Variety**: Support for text, email, number, checkbox, select, radio, textarea, date, star rating, and structural elements (groups, dividers)
- **JSON Schema Conversion**: Automatic conversion from custom form definitions to JSON Schema for compatibility with react-jsonschema-form

### Component Architecture
- **FormRenderer**: Main form rendering component with support for single and multi-step forms
- **Canvas Space**: Interactive workspace where AI-generated components are displayed and can be modified
- **Message Thread System**: Chat-like interface for AI interaction with component generation capabilities
- **Theme System**: Comprehensive theming with light/dark mode support using next-themes

### State Management Patterns
- **Tambo Component State**: Individual component properties managed through `useTamboComponentState` for granular AI control
- **Local State**: React useState for component-specific UI state not controlled by AI
- **Context Providers**: React Context for sharing thread data, canvas state, and theme information across components

### Navigation and Routing
- **App Router**: Next.js App Router for file-based routing
- **Dynamic Routing**: Support for message-specific URLs and canvas-only views
- **Client-Side Navigation**: useRouter hooks for programmatic navigation between chat and canvas views

## External Dependencies

### Core Dependencies
- **@tambo-ai/react**: Primary AI integration SDK for component generation and control
- **@tambo-ai/typescript-sdk**: TypeScript SDK for Tambo AI services
- **next**: Next.js framework for React applications
- **react** and **react-dom**: React library for UI components
- **zod**: Schema validation library for type-safe component definitions

### UI and Styling
- **@tailwindcss/oxide**: Advanced Tailwind CSS engine for styling
- **tailwindcss**: Utility-first CSS framework
- **next-themes**: Theme switching functionality for dark/light mode
- **framer-motion**: Animation library for smooth UI transitions
- **lucide-react**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating component variants

### Form Handling
- **@rjsf/core**: React JSON Schema Form for dynamic form rendering
- **@rjsf/validator-ajv8**: JSON Schema validation for forms
- **@rjsf/utils**: Utility functions for form handling
- **@rjsf/bootstrap-4**: Bootstrap styling for forms

### Development and Build Tools
- **typescript**: Type checking and development experience
- **eslint**: Code linting and quality enforcement
- **autoprefixer**: CSS vendor prefixing
- **postcss**: CSS processing and transformation

### Utility Libraries
- **clsx** and **tailwind-merge**: CSS class manipulation utilities
- **react-markdown**: Markdown rendering for AI responses
- **highlight.js**: Syntax highlighting for code blocks
- **dompurify**: HTML sanitization for security
- **recharts**: Charting library for data visualization components

### UI Components
- **@radix-ui/react-dropdown-menu**: Accessible dropdown menu components
- **radix-ui**: Base UI component library for accessibility