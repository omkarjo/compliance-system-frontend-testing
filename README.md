# AJVC Compliance System Frontend

A modern React-based compliance management system built with a unified design system, dark mode support, and centralized component architecture.

## 📁 Project Structure

```
src/
├── components/
│   ├── Cards/                    # Reusable card components
│   │   ├── InfoCard.jsx         # Information display cards
│   │   ├── StatsCard.jsx        # Statistics display cards
│   │   └── StatusCard.jsx       # Status indicator cards
│   ├── Dashboard/               # Dashboard-specific components
│   │   ├── app-sidebar.jsx      # Main sidebar navigation
│   │   └── includes/            # Dashboard utilities
│   ├── icons/                   # Centralized icon management
│   │   └── index.js            # All icons exported from here
│   ├── ui/                      # Base UI components
│   │   ├── button.jsx          # Button component
│   │   ├── sidebar.jsx         # Sidebar primitives
│   │   ├── theme-toggle.jsx    # Dark/light mode toggle
│   │   └── ...                 # Other UI primitives
│   └── ...                     # Other component categories
├── contexts/
│   └── ThemeProvider.jsx        # Theme management context
├── layouts/
│   └── DashboardLayout.jsx      # Main dashboard layout
├── lib/
│   └── getStatusStyleIcon.jsx   # Status styling utilities
├── store/                       # Redux store
├── routes/                      # Application routing
├── index.css                    # 🎨 UNIFIED STYLING SYSTEM
└── App.jsx                      # Main application component
```

## 🎨 Apple-Inspired Design System

This application follows Apple's Human Interface Guidelines, creating a sophisticated and consistent design system that rivals Apple's own applications.

### 🎭 Typography System

Our typography system is based on Apple's text hierarchy, providing clear information architecture and optimal readability.

#### Text Hierarchy
```css
.text-large-title    /* 34px/40px - Hero sections and primary headings */
.text-title-1        /* 28px/34px - Page titles and section headers */
.text-title-2        /* 22px/28px - Subsection headers */
.text-title-3        /* 18px/24px - Smaller headers */
.text-headline       /* 16px/22px - Card titles and emphasized text */
.text-body           /* 16px/24px - Primary body text */
.text-subheadline    /* 15px/20px - Secondary information */
.text-footnote       /* 13px/18px - Supporting information */
.text-caption-1      /* 12px/16px - Labels and metadata */
.text-caption-2      /* 11px/14px - Smallest text */
```

#### Semantic Text Colors
```css
.text-primary        /* Primary brand color */
.text-secondary      /* Secondary emphasis */
.text-success        /* Success states - Apple Green */
.text-warning        /* Warning states - Apple Orange */
.text-error          /* Error states - Apple Red */
.text-accent         /* Accent highlights */
```

### 🌈 Color System

Built on Refactoring UI's Palette 5 (Blue Grey) with Apple's semantic color principles.

#### Base Color Palette
```css
--palette-5-50: #F0F4F8;   /* Lightest - backgrounds */
--palette-5-100: #D9E2EC;  /* Light borders */
--palette-5-200: #BCCCDC;  /* Subtle borders */
--palette-5-300: #9FB3C8;  /* Disabled text */
--palette-5-400: #829AB1;  /* Placeholder text */
--palette-5-500: #627D98;  /* Secondary text */
--palette-5-600: #486581;  /* Primary brand */
--palette-5-700: #334E68;  /* Dark text */
--palette-5-800: #243B53;  /* Headings */
--palette-5-900: #102A43;  /* Body text */
```

#### Apple Semantic Colors
```css
--palette-5-success: #30D158;  /* Apple Green */
--palette-5-warning: #FF9F0A;  /* Apple Orange */
--palette-5-error: #FF453A;    /* Apple Red */
--palette-5-info: #007AFF;     /* Apple Blue */
```

#### Semantic Application
```css
--primary: var(--palette-5-600);
--secondary: var(--palette-5-blue-500);
--accent: var(--palette-5-cyan-400);
--background: #FFFFFF;
--foreground: var(--palette-5-900);
```

### 🌙 Advanced Dark Mode

Dark mode follows Apple's sophisticated color adaptation principles, providing excellent contrast and visual hierarchy.

#### Automatic Color Adaptation
- **Backgrounds**: Shift from light to dark variants
- **Text**: Maintains optimal contrast ratios
- **Borders**: Subtle appearance in dark environments
- **Interactive elements**: Proper hover and focus states

```css
.dark {
  --background: var(--palette-5-900);
  --foreground: var(--palette-5-50);
  --primary: var(--palette-5-400);
  /* All colors automatically adapt */
}
```

## 🧩 Apple-Quality Component Architecture

### 🎨 Unified Component Classes

All components follow Apple's design principles with consistent styling, spacing, and interactions.

#### Card Components
```css
.card-base         /* Basic card with Apple-style shadows */
.card-info         /* Information display cards with proper spacing */
.card-stats        /* Statistics cards with ideal aspect ratios */
.container-card    /* Apple-style card container with rounded corners */
```

#### Status Classes (Apple-Inspired)
```css
.status-open       /* Open status with semantic colors */
.status-pending    /* Pending status with appropriate visibility */
.status-review     /* Review status with warning emphasis */
.status-completed  /* Completed status with success colors */
.status-overdue    /* Overdue status with error indication */
.status-blocked    /* Blocked status with clear warnings */
```

#### Interactive States (Apple-Style)
```css
.button-primary      /* Primary CTA with Apple-style hover effects */
.button-secondary    /* Secondary actions with subtle styling */
.hover-lift          /* Apple-style lift animation on hover */
.selection-highlight /* Apple-style selection states */
.focus-ring         /* Apple-style focus indicators */
.transition-apple   /* Apple's signature smooth transitions */
```

#### Layout System (8-Point Grid)
```css
/* Apple's 8-point grid spacing */
.spacing-xs    /* 4px gap */
.spacing-sm    /* 8px gap */
.spacing-md    /* 12px gap */
.spacing-lg    /* 16px gap */
.spacing-xl    /* 24px gap */
.spacing-2xl   /* 32px gap */
.spacing-3xl   /* 48px gap */

/* Flex layouts */
.flex-between     /* Space-between with proper gap */
.flex-center      /* Centered with consistent spacing */
.flex-start       /* Flex-start with Apple spacing */
.flex-column      /* Column layout with vertical rhythm */

/* Grid layouts */
.grid-auto        /* Responsive auto-fit grid */
.grid-2, .grid-3, .grid-4  /* Fixed column grids */

/* Content stacking */
.stack-sm, .stack-md, .stack-lg, .stack-xl  /* Vertical rhythm */
```

### Component Usage Examples

#### InfoCard Component
```jsx
import { InfoCard } from "@/components/Cards/InfoCard";

<InfoCard 
  data={[
    { label: "Total Users", value: "1,234" },
    { label: "Active Projects", value: "56" }
  ]} 
/>
```

#### Status Display
```jsx
import { getStatusStyle } from "@/lib/getStatusStyleIcon";

const { statusClass } = getStatusStyle(item.status);
<div className={`px-3 py-1 rounded-full text-sm ${statusClass}`}>
  {item.status}
</div>
```

## 🎯 Apple-Style Icon System

Our icon system follows Apple's Human Interface Guidelines with consistent sizing, weights, and semantic organization.

### 📐 Icon Specifications

#### Apple-Inspired Sizing Scale
```javascript
export const IconSizes = {
  xs: 12,     // Caption/small UI elements
  sm: 16,     // Body text inline icons  
  md: 20,     // Standard UI icons
  lg: 24,     // Navigation and primary actions
  xl: 32,     // Large interactive elements
  "2xl": 48,  // Hero icons and illustrations
};
```

#### Icon Weights (Apple-Style)
```javascript
export const IconWeights = {
  thin: 1,      // Very light strokes
  light: 1.5,   // Light strokes
  regular: 2,   // Default Apple weight
  medium: 2.5,  // Medium emphasis
  bold: 3,      // Strong emphasis
};
```

### 🗂️ Icon Categories

#### Navigation Icons
```javascript
export const NavigationIcons = {
  Dashboard: LayoutDashboard,
  Home: Home,
  Tasks: Bot,
  Documents: FileText,
  Users: Users,
  // Organized by app navigation
};
```

#### Action Icons
```javascript
export const ActionIcons = {
  Add: Plus,
  Edit: Edit,
  Delete: Trash,
  View: Eye,
  Download: Download,
  // User actions and controls
};
```

#### Feedback Icons
```javascript
export const FeedbackIcons = {
  Success: CheckCircle2,
  Warning: AlertTriangle,
  Error: XCircle,
  Info: Circle,
  // System states and notifications
};
```

### 🎨 Apple-Style Icon Component

Use the `AppleIcon` component for consistent styling across all icons:

```jsx
import { AppleIcon, NavigationIcons } from "@/components/icons";

// Apple-style icon with consistent sizing
<AppleIcon 
  icon={NavigationIcons.Dashboard}
  size="lg"
  weight="regular"
  className="text-primary"
/>

// Or use helper functions
import { getNavigationIcon } from "@/components/icons";
const DashboardIcon = getNavigationIcon("Dashboard", { 
  size: "lg", 
  weight: "medium" 
});
```

### 🔧 Adding New Icons

1. **Import from lucide-react** in `src/components/icons/index.js`
2. **Categorize appropriately** (Navigation, Action, Feedback, UI)
3. **Use consistent naming** (PascalCase for components)
4. **Test in both themes** (light and dark mode)

```javascript
// Add to appropriate category
import { NewFeatureIcon } from "lucide-react";

export const NavigationIcons = {
  // ... existing icons
  NewFeature: NewFeatureIcon,
};

// Use with Apple styling
import { getNavigationIcon } from "@/components/icons";
<div>{getNavigationIcon("NewFeature", { size: "lg" })}</div>
```

## 🌙 Theme Management

### ThemeProvider

The application uses a context-based theme system that supports:
- Light mode
- Dark mode  
- System preference (auto-detect)

```jsx
// Already configured in App.jsx
<ThemeProvider defaultTheme="light" storageKey="compliance-ui-theme">
  {/* App content */}
</ThemeProvider>
```

### Theme Toggle

Users can switch themes using the `ThemeToggle` component in the header:

```jsx
import { ThemeToggle } from "@/components/ui/theme-toggle";
<ThemeToggle />
```

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (for containerized deployments)

## Getting Started

1. **Clone the Repository**  
   Clone the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/Tech-AJVC/compliance-system-frontend.git
   ```

2. **Install Dependencies**  
   Install the required dependencies using npm or yarn:
   ```bash
   npm install
   ```
   Or, if you prefer yarn:
   ```bash
   yarn install
   ```

3. **Run the Development Server**  
   Start the development server to preview the application:
   ```bash
   npm run dev
   ```
   Or, with yarn:
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173` by default.

## Building for Production

To create a production build of the application, run:
```bash
npm run build
```
Or, with yarn:
```bash
yarn build
```
The build files will be generated in the `dist` directory.

## Docker Deployment

To deploy the application using Docker, follow these steps:

1. **Build the Docker Image**  
   Build the Docker image using the provided `Dockerfile`:
   ```bash
   docker build -t compliance-system-frontend .
   ```

2. **Run the Docker Container**  
   Start a container from the built image:
   ```bash
   docker run -d -p 80:80 compliance-system-frontend
   ```
   The application will be accessible at `http://localhost`.

3. **Stop the Container**  
   To stop the running container, use:
   ```bash
   docker ps
   docker stop <container_id>
   ```

## 🛠️ Apple-Quality Development Guidelines

### 🎨 Adding Colors (Apple Way)

1. **Define semantic purpose** first - What does this color represent?
2. **Add to color system** in `src/index.css`:
```css
:root {
  --palette-5-new-semantic: #YOUR_COLOR;
}
```

3. **Create dark mode variant** with proper contrast:
```css
.dark {
  --palette-5-new-semantic: #YOUR_DARK_COLOR; /* Ensure WCAG compliance */
}
```

4. **Map to semantic usage**:
```css
:root {
  --feature-highlight: var(--palette-5-new-semantic);
}
```

### 🧩 Creating Apple-Style Components

Follow Apple's design principles for consistency and quality:

```jsx
// ✅ Apple-Quality Component
const AppleStyleComponent = () => (
  <div className="container-card hover-lift transition-apple">
    <h2 className="text-headline text-primary">Feature Title</h2>
    <p className="text-body">Clear, concise description using semantic classes.</p>
    <div className="flex-between spacing-md">
      <span className="text-caption-1 text-success">Active</span>
      {getActionIcon("Edit", { size: "sm" })}
    </div>
  </div>
);

// ❌ Avoid - Breaks Apple's design principles
const PoorComponent = () => (
  <div style={{ padding: '10px', backgroundColor: '#eee' }}>
    <span style={{ fontSize: '14px', color: '#666' }}>Text</span>
  </div>
);
```

### 🎭 Typography Best Practices

1. **Use semantic hierarchy** - Choose text classes based on content importance
2. **Maintain vertical rhythm** - Use consistent spacing classes
3. **Test accessibility** - Ensure proper contrast ratios

```jsx
// ✅ Proper Typography Hierarchy
const ContentSection = () => (
  <section className="container-section stack-lg">
    <h1 className="text-title-1">Main Section Title</h1>
    <h2 className="text-title-2">Subsection</h2>
    <p className="text-body">Main content with proper line height and spacing.</p>
    <span className="text-caption-1 text-muted">Supporting metadata</span>
  </section>
);
```

### 🎯 Icon Usage Guidelines

1. **Use semantic helpers** for consistency:
```jsx
// ✅ Semantic and consistent
{getNavigationIcon("Dashboard", { size: "lg", weight: "medium" })}
{getFeedbackIcon("Success", { size: "sm", className: "text-success" })}

// ❌ Direct icon usage without Apple styling
<CheckIcon size={20} />
```

2. **Match icon weight** to text weight:
```jsx
<div className="flex-center">
  <h3 className="text-headline">Title</h3>
  {getActionIcon("Edit", { weight: "medium" })} {/* Matches headline weight */}
</div>
```

### 🌙 Dark Mode Testing

Test all components in both themes:

```jsx
// Use semantic colors that adapt automatically
className="text-foreground bg-background border-border"

// Avoid hardcoded colors
className="text-gray-900 bg-white border-gray-200" // ❌
```

### 📐 Layout & Spacing

Use Apple's 8-point grid system:

```jsx
// ✅ Apple's 8-point grid
<div className="grid-auto spacing-xl">
  <div className="container-card">Content</div>
</div>

// ✅ Proper flex layouts
<div className="flex-between spacing-md">
  <span>Label</span>
  <span>Value</span>
</div>
```

### 🔍 Apple-Style Interactive States

Implement proper hover, focus, and active states:

```jsx
// ✅ Apple-quality interactions
<button className="button-primary focus-ring transition-apple">
  Submit
</button>

<div className="hover-lift selection-highlight transition-apple-fast">
  Interactive Card
</div>
```

### ✅ Quality Checklist

Before committing components, ensure:

- [ ] Uses semantic CSS classes from `index.css`
- [ ] Works perfectly in both light and dark modes
- [ ] Uses centralized icon system with proper sizing
- [ ] Follows Apple's typography hierarchy
- [ ] Implements smooth Apple-style transitions
- [ ] Maintains proper spacing with 8-point grid
- [ ] Uses semantic color variables (never hardcoded colors)
- [ ] Includes proper focus states for accessibility
- [ ] Tests well on different screen sizes

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run type checking
npm run typecheck

# Run linting
npm run lint
```

## Linting and Formatting

This project includes ESLint for linting and Prettier for code formatting. To run lint checks, use:
```bash
npm run lint
```
Or, with yarn:
```bash
yarn lint
```

## Cypress Testing

This project uses [Cypress](https://www.cypress.io/) for end-to-end testing. To run the tests locally, use:

```bash
npx cypress open
```

Or, to run Cypress tests in headless mode:

```bash
npx cypress run
```

Make sure the development server is running (`npm run dev` or `yarn dev`) before executing the tests.

## 📝 Apple-Quality Design Notes

- **Typography**: Complete Apple-inspired text hierarchy with semantic meaning
- **Colors**: Palette 5 foundation with Apple's semantic color principles
- **Icons**: Centralized system with Apple-style sizing and weights  
- **Interactions**: Smooth transitions using Apple's signature easing curves
- **Spacing**: 8-point grid system for consistent visual rhythm
- **Dark Mode**: Sophisticated color adaptation following Apple's guidelines
- **Components**: Apple-quality cards, buttons, and interactive states
- **Accessibility**: WCAG-compliant contrast ratios and focus indicators

## 🏆 Apple-Level Quality Standards

This design system achieves Apple-level quality through:

### 🎨 Visual Excellence
- **Consistent Typography**: 10-level hierarchy with perfect line spacing
- **Sophisticated Colors**: Semantic palette with intelligent dark mode adaptation
- **Premium Interactions**: Smooth animations with Apple's signature easing
- **Perfect Spacing**: 8-point grid system for visual harmony

### 🛠️ Developer Experience  
- **Semantic Classes**: Intuitive, purpose-driven class names
- **Centralized System**: Single source of truth for all design tokens
- **Type Safety**: Helper functions for consistent icon and color usage
- **Easy Maintenance**: Change colors/icons from one location

### ♿ Accessibility First
- **WCAG Compliance**: All color combinations meet accessibility standards
- **Focus Indicators**: Clear, Apple-style focus rings on all interactive elements
- **Semantic HTML**: Proper heading hierarchy and landmark usage
- **Screen Reader Support**: Meaningful alt text and ARIA labels

## 🤝 Contributing to Apple-Quality Standards

When contributing to this design system:

1. **Follow Apple's principles** - Study the Human Interface Guidelines
2. **Use semantic classes** - Never hardcode colors or spacing
3. **Test thoroughly** - Both themes, all screen sizes, accessibility
4. **Maintain consistency** - Use established patterns and conventions
5. **Document changes** - Update this README for new systems or patterns
6. **Quality first** - Match Apple's attention to detail in every component

### 🔍 Code Review Checklist

- [ ] Component uses semantic CSS classes from the unified system
- [ ] All colors use CSS custom properties (no hardcoded values)
- [ ] Icons use the centralized system with proper Apple styling
- [ ] Typography follows the Apple-inspired hierarchy
- [ ] Interactive states include proper hover, focus, and active styles
- [ ] Component works flawlessly in both light and dark themes
- [ ] Spacing follows the 8-point grid system
- [ ] Accessibility requirements are met (focus, contrast, semantics)
- [ ] Performance is optimized (no unnecessary re-renders or calculations)

## Internal Use Only

This project is an internal tool and is not intended for public use or distribution. Please ensure proper authorization before accessing or modifying the codebase.
