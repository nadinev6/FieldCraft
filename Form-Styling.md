
# Form Styling Options Documentation

## 1. Global Form Styling (via formRendererPropsSchema)

### Background & Text Colors
- `backgroundColor`: Set form background color (hex, rgb, or CSS color name)
- `textColor`: Set text color (hex, rgb, or CSS color name)

### Typography
- `fontSize`: Font size in pixels (8-72px)
- `fontFamily`: Font family name

### Layout & Spacing
- `padding`: Form padding in pixels (0-100px)
- `margin`: Form margin in pixels (0-100px)
- `borderRadius`: Border radius in pixels (0-50px)

### Borders
- `borderWidth`: Border width in pixels (0-10px)
- `borderColor`: Border color (hex, rgb, or CSS color name)

## 2. Button Styling (via buttonSchema)

### Visual Variants
- `variant`: Predefined styles - "primary", "secondary", "outline", "danger"

### Custom Styling
- `colorClass`: Custom Tailwind CSS classes for button styling
- `align`: Horizontal alignment - "left", "center", "right"

## 3. Field-Specific Styling Options

### Text & Number Fields
- `placeholder`: Input placeholder text
- `minLength`/`maxLength`: Character count restrictions
- `pattern`: Regular expression validation
- `required`: Field requirement indicator

### Select & Radio Fields
- `options`: Array of options with:
  - `label`: Display text
  - `value`: Option value
  - `disabled`: Option state (boolean)

### Textarea Fields
- `rows`: Number of visible rows
- `placeholder`: Input placeholder text

### Date Fields
- `min`/`max`: Date range restrictions (ISO date strings)

### Star Rating Fields
- `maxRating`: Maximum rating value (1-10, default 5)
- `allowHalf`: Enable half-star ratings (boolean)
- `required`: Field requirement indicator

### Group Fields
- `columns`: Number of columns for field layout
- `collapsible`: Enable collapse/expand functionality
- `defaultCollapsed`: Initial collapsed state
- `description`: Additional instructions
- `disclaimer`: Information displayed in popover (not working)

## 4. Layout & Structure Options

### Multi-Step Forms
- `multiStep`: Enable step-by-step navigation
- `allowStepSkipping`: Allow skipping steps
- `showStepNumbers`: Display step numbers in progress indicator

### Text Elements
#### Headings (headingFieldSchema)
- `level`: Heading size (h1-h6, default h2)
- `alignment`: Text alignment ("left", "center", "right")
- `className`: Custom CSS classes

#### Paragraphs (paragraphFieldSchema)
- `alignment`: Text alignment ("left", "center", "right")
- `className`: Custom CSS classes

### Dividers
- `dividerFieldSchema`: Horizontal divider
- `verticalDividerFieldSchema`: Vertical divider

## 5. Conditional Display

### Conditional Rendering (via condition in groupFieldSchema)
- `field`: Reference to another field
- `value`: Value to match
- `operator`: Comparison operator ("equals", "notEquals", "greaterThan", "lessThan")

## 6. Alignment Options

### Button Alignment
- `buttonsAlign`: Global button alignment ("left", "center", "right")

### Text Alignment
- Headings and paragraphs can be aligned left, center, or right

## 7. Specialized Field Options

### Star Rating Fields
- `maxRating`: Maximum rating (1-10)
- `allowHalf`: Enable half-star ratings
- `required`: Field requirement indicator

### Group Fields
- `columns`: Multi-column layout (1+ columns)
- `collapsible`: Collapsible sections
- `disclaimer`: Information in popover (not working)
