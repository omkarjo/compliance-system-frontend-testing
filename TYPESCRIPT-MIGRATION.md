# TypeScript Migration Guide

This guide outlines the approach for gradually migrating the React application from JavaScript to TypeScript.

## 🎯 Migration Strategy

### Phase 1: Foundation Setup ✅
- [x] Install TypeScript and type dependencies
- [x] Create tsconfig.json with gradual migration settings
- [x] Define common types in `/src/types/index.ts`
- [x] Set up type checking scripts

### Phase 2: Gradual Component Migration (In Progress)
- [ ] Convert utility functions to TypeScript
- [ ] Migrate UI components (start with simple ones)
- [ ] Add types to business logic components
- [ ] Convert API layer to TypeScript

### Phase 3: Strict Mode Enable
- [ ] Enable strict TypeScript settings
- [ ] Fix all type errors
- [ ] Add comprehensive type definitions

## 📁 Directory Structure

```
src/
├── types/
│   ├── index.ts          # Common type definitions
│   ├── api.ts            # API-related types
│   ├── components.ts     # Component prop types
│   └── state.ts          # State management types
└── components/
    ├── ui/               # Start migration here (simple components)
    ├── common/           # Utility components
    └── business/         # Complex business logic (migrate last)
```

## 🔧 Migration Guidelines

### 1. File Naming Convention
- Keep existing `.jsx` files for gradual migration
- New TypeScript files use `.tsx` extension
- Type-only files use `.ts` extension

### 2. Component Migration Order
1. **UI Primitives** (`/components/ui/`) - Simple, reusable components
2. **Common Components** (`/components/common/`) - Shared utilities
3. **Business Components** (`/components/business/`) - Domain-specific logic
4. **Pages** (`/pages/`) - Top-level route components

### 3. Type Definition Priorities
1. **Props interfaces** - Define component props first
2. **API responses** - Type external data
3. **State shapes** - Redux/Context state types
4. **Event handlers** - Function signatures

## 📝 Examples

### Basic Component Migration

**Before (JavaScript):**
```jsx
// Button.jsx
import React from 'react';
import { cn } from '@/lib/utils';

const Button = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        variant === 'primary' && 'bg-blue-600 text-white',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

**After (TypeScript):**
```tsx
// Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className,
  ...props 
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md',
        variant === 'primary' && 'bg-blue-600 text-white',
        className
      )}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### API Hook Migration

**Before (JavaScript):**
```jsx
// useGetFunds.js
import { useQuery } from '@tanstack/react-query';
import { getFunds } from '@/api/funds';

export const useGetFunds = (filters = {}) => {
  return useQuery({
    queryKey: ['funds', filters],
    queryFn: () => getFunds(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

**After (TypeScript):**
```tsx
// useGetFunds.ts
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getFunds } from '@/api/funds';
import { Fund, PaginatedResponse } from '@/types';

interface FundFilters {
  status?: string;
  vintage?: number;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const useGetFunds = (
  filters: FundFilters = {}
): UseQueryResult<PaginatedResponse<Fund>, Error> => {
  return useQuery({
    queryKey: ['funds', filters],
    queryFn: () => getFunds(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 🛠 Development Workflow

### Step 1: Convert Simple Components
Start with components that have minimal props and straightforward logic:

```bash
# Convert UI primitives first
src/components/ui/button.jsx → button.tsx
src/components/ui/input.jsx → input.tsx
src/components/ui/card.jsx → card.tsx
```

### Step 2: Add Type Definitions
Create interfaces for complex data structures:

```typescript
// types/funds.ts
export interface Fund {
  id: string;
  name: string;
  status: 'active' | 'closed' | 'fundraising';
  // ... other properties
}
```

### Step 3: Migrate Business Logic
Convert components that use the defined types:

```bash
# Convert business components that use Fund type
src/components/business/funds/FundCard.jsx → FundCard.tsx
src/components/business/funds/FundForm.jsx → FundForm.tsx
```

### Step 4: Update Imports
Update import statements to use TypeScript files:

```typescript
// Before
import Button from '@/components/ui/button';

// After (once migrated)
import Button from '@/components/ui/button';  // .tsx extension inferred
```

## 🔍 Type Checking

### Development
```bash
# Run type checking alongside development
npm run type-check:watch
```

### Build Integration
TypeScript checking is integrated into the build process. The build will fail if there are type errors (once strict mode is enabled).

### IDE Setup
- Install TypeScript language support in your IDE
- Enable TypeScript error highlighting
- Use IntelliSense for better autocompletion

## 📚 Best Practices

1. **Start Small**: Begin with simple, self-contained components
2. **Define Types Early**: Create type definitions before migrating components
3. **Use Gradual Typing**: Don't try to type everything at once
4. **Leverage Inference**: Let TypeScript infer types when possible
5. **Generic Components**: Use generics for reusable components
6. **Strict Props**: Define exact prop shapes with TypeScript interfaces

## 🚨 Common Pitfalls

1. **Over-typing**: Don't add types that don't add value
2. **`any` abuse**: Avoid using `any` - use `unknown` or proper types
3. **Prop spreading**: Be careful with `{...props}` - use proper interface extension
4. **Event handlers**: Always type event parameters correctly
5. **API responses**: Don't trust external data - validate and type it

## 📈 Migration Progress

### Completed ✅
- TypeScript configuration and setup
- Common type definitions
- Type checking scripts

### In Progress 🔄
- Converting utility functions to TypeScript
- Migrating UI components

### Planned 📋
- Business logic components
- API layer migration
- Strict mode enablement

## 🎯 Success Metrics

- [ ] Zero TypeScript errors in strict mode
- [ ] 90%+ components migrated to TypeScript
- [ ] All API responses properly typed
- [ ] Comprehensive type coverage
- [ ] Improved developer experience with IntelliSense

This migration approach ensures a smooth, gradual transition while maintaining application stability and developer productivity.