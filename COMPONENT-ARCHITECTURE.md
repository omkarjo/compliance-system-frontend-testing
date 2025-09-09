# Component Architecture Guide

## 📁 Directory Structure

```
src/components/
├── ui/                    # UI Primitives (shadcn/ui components)
│   ├── button.jsx        # Reusable button component
│   ├── card.jsx          # Card container component  
│   ├── input.jsx         # Form input component
│   └── ...               # Other UI primitives
│
├── business/             # Business Logic Components (organized by domain)
│   ├── tasks/           # Task management components
│   │   ├── TableTaskViewFM.jsx    # Fund Manager task table
│   │   ├── TableTaskViewUser.jsx  # User task table
│   │   ├── SheetTaskViewFM.jsx    # Task detail sheet
│   │   └── index.js               # Clean exports
│   │
│   ├── funds/           # Fund management components  
│   │   ├── FundDetails.jsx        # Fund details view
│   │   ├── FundSelect.jsx         # Fund selector dropdown
│   │   ├── TableFundView.jsx      # Fund table component
│   │   └── index.js               # Clean exports
│   │
│   ├── entities/        # Entity management components
│   ├── drawdowns/       # Drawdown components
│   ├── portfolio-companies/ # Portfolio company components  
│   ├── reports/         # Report components
│   └── index.js         # Main business exports
│
├── common/              # Shared utility components
│   ├── includes/        # Common shared components
│   │   ├── badge-status.jsx      # Status badge component
│   │   ├── UserBadge.jsx         # User display component
│   │   ├── card-stats.jsx        # Statistics card
│   │   └── ...                   # Other shared utilities
│   └── index.js         # Common exports
│
├── layout/              # Layout-specific components
│   └── dashboard/       # Dashboard layout components
│       ├── includes/    # Dashboard utilities
│       ├── sheet/       # Dashboard sheets  
│       └── tables/      # Dashboard tables
│
├── Table/               # Generic table utilities
├── Form/                # Form utilities
├── Select/              # Select components
└── index.js            # Master component exports
```

## 🔧 Import Patterns

### Recommended Import Patterns

```javascript
// ✅ Import specific business components
import { TableTaskViewFM, FundDetails } from '@/components/business';

// ✅ Import from specific domains
import { TableTaskViewFM } from '@/components/business/tasks';
import { FundSelect } from '@/components/business/funds';

// ✅ Import common utilities
import { BadgeStatusTask, UserBadge } from '@/components/common';

// ✅ Import UI primitives
import { Button, Card, Input } from '@/components/ui';

// ✅ Import everything from a domain (when needed)
import * as TaskComponents from '@/components/business/tasks';
```

### Legacy Patterns (Avoid)

```javascript
// ❌ Don't use relative imports
import BadgeStatusTask from '../../includes/badge-status';

// ❌ Don't import from non-existent paths  
import TaskView from '@/components/Task/TaskView';

// ❌ Don't use inconsistent naming
import CardStats from '@/components/includes/card-stats'; // Wrong name
```

## 🏗️ Component Categories

### 1. UI Primitives (`/ui/`)
- **Purpose**: Basic, reusable UI components
- **Examples**: Button, Input, Card, Dialog
- **Dependencies**: Should not depend on business logic
- **Usage**: Used throughout the application

### 2. Business Components (`/business/`)
- **Purpose**: Domain-specific business logic components
- **Organization**: Grouped by business domain (tasks, funds, entities, etc.)
- **Dependencies**: Can use UI primitives and common utilities
- **Usage**: Specific to particular features/pages

### 3. Common Components (`/common/`)
- **Purpose**: Shared utilities used across multiple domains
- **Examples**: UserBadge, BadgeStatusTask, CardStats
- **Dependencies**: Should minimize dependencies on business logic
- **Usage**: Used across multiple business domains

### 4. Layout Components (`/layout/`)
- **Purpose**: Layout and structural components
- **Examples**: Dashboard sidebar, navigation, breadcrumbs
- **Dependencies**: Can use UI primitives and common components
- **Usage**: Application structure and navigation

## 📋 Naming Conventions

### File Naming
- **Components**: PascalCase (e.g., `TableTaskViewFM.jsx`)
- **Index files**: lowercase (e.g., `index.js`)
- **Utilities**: kebab-case (e.g., `badge-status.jsx`)

### Component Exports
- **Default exports**: Use for main component
- **Named exports**: Use for utilities and multiple exports
- **Index files**: Re-export for clean imports

## 🔄 Migration Benefits

### Before Reorganization
- Components scattered across 15+ directories
- Inconsistent naming (CardStats vs TaskCard)
- Deep relative import paths
- Mixed business logic and UI components
- Difficult to locate and maintain components

### After Reorganization  
- ✅ Clear domain-based organization
- ✅ Consistent naming conventions
- ✅ Clean absolute import paths
- ✅ Separated concerns (UI vs Business vs Common)
- ✅ Easy component discovery and maintenance

## 🚀 Development Guidelines

1. **Adding New Components**:
   - Place in appropriate domain folder (`/business/[domain]/`)
   - Update corresponding `index.js` file
   - Use absolute imports only

2. **Modifying Existing Components**:
   - Maintain current location unless reorganizing
   - Update imports if moving components
   - Test builds after changes

3. **Creating Shared Components**:
   - Place in `/common/` if used across domains
   - Place in `/ui/` if purely presentational
   - Update index exports

4. **Import Organization**:
   - Group imports by type (external, internal, relative)
   - Use absolute imports with `@/` alias
   - Keep imports clean and organized

This architecture provides a scalable, maintainable foundation for the React application with clear separation of concerns and predictable patterns.