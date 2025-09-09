# Component Style Guide

This guide establishes consistent patterns, conventions, and best practices for React components in the application.

## 🎨 Design System Overview

Our design system is built on:
- **UI Library**: Shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React icons
- **Typography**: System fonts with Tailwind typography utilities
- **Color System**: CSS custom properties for theme consistency

## 📁 Component Organization

### 1. UI Components (`/components/ui/`)

**Purpose**: Reusable, unstyled or minimally styled components
**Examples**: Button, Input, Card, Dialog

```jsx
// ✅ Good: Focused, reusable UI component
export const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
```

### 2. Business Components (`/components/business/`)

**Purpose**: Domain-specific components with business logic
**Examples**: UserProfile, FundCard, TaskManager

```jsx
// ✅ Good: Business component with clear domain focus
export const FundCard = ({ fund, onEdit, onDelete }) => {
  const { mutate: deleteFund } = useDeleteFund();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{fund.name}</CardTitle>
        <CardDescription>{fund.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Commitment:</span>
            <span className="font-semibold">
              {formatCurrency(fund.totalCommitment)}
            </span>
          </div>
          <BadgeStatus status={fund.status} />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={() => onEdit(fund)}>
          Edit
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => deleteFund(fund.id)}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
```

### 3. Common Components (`/components/common/`)

**Purpose**: Shared utility components used across domains
**Examples**: LoadingSpinner, ErrorBoundary, UserBadge

```jsx
// ✅ Good: Reusable utility component
export const LoadingSpinner = ({ size = "default", className }) => {
  return (
    <div className={cn("animate-spin", sizeVariants[size], className)}>
      <Loader2 className="h-full w-full" />
    </div>
  );
};
```

## 🏗️ Component Architecture Patterns

### 1. Compound Components

For complex UI patterns with multiple related parts:

```jsx
// ✅ Good: Compound component pattern
export const DataTable = ({ children, ...props }) => (
  <div className="rounded-md border" {...props}>
    {children}
  </div>
);

DataTable.Header = ({ children }) => (
  <div className="border-b bg-muted/50 px-4 py-3">
    {children}
  </div>
);

DataTable.Body = ({ children }) => (
  <div className="divide-y">
    {children}
  </div>
);

DataTable.Row = ({ children, ...props }) => (
  <div className="flex items-center px-4 py-3" {...props}>
    {children}
  </div>
);

// Usage
<DataTable>
  <DataTable.Header>
    <h3>Users</h3>
  </DataTable.Header>
  <DataTable.Body>
    <DataTable.Row>User 1</DataTable.Row>
    <DataTable.Row>User 2</DataTable.Row>
  </DataTable.Body>
</DataTable>
```

### 2. Render Props Pattern

For flexible, reusable logic:

```jsx
// ✅ Good: Render props for flexible data fetching
export const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(url)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return children({ data, loading, error });
};

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage error={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
```

### 3. Custom Hooks Pattern

Extract reusable component logic:

```jsx
// ✅ Good: Custom hook for reusable logic
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
};

// Usage in component
const Modal = ({ children }) => {
  const { value: isOpen, toggle: toggleModal } = useToggle();
  
  return (
    <>
      <Button onClick={toggleModal}>Open Modal</Button>
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        {children}
      </Dialog>
    </>
  );
};
```

## 📝 Naming Conventions

### 1. Component Names
- **PascalCase** for components: `UserProfile`, `DataTable`
- **Descriptive and specific**: `UserProfileCard` not `Card`
- **Avoid generic names**: `UserActions` not `Actions`

### 2. Props and Variables
- **camelCase** for props: `onClick`, `isLoading`, `userProfile`
- **Boolean props**: Prefix with `is`, `has`, `can`, `should`
  - `isLoading`, `hasError`, `canEdit`, `shouldRender`
- **Event handlers**: Prefix with `on`
  - `onClick`, `onSubmit`, `onUserSelect`

### 3. CSS Classes
- **Utility-first** with Tailwind CSS
- **Semantic class names** for custom styles
- **BEM methodology** for complex custom components

```jsx
// ✅ Good: Semantic Tailwind classes
<div className="flex items-center justify-between p-4 bg-card border rounded-lg">
  <h3 className="text-lg font-semibold text-card-foreground">Title</h3>
  <Button variant="outline" size="sm">Action</Button>
</div>
```

## 🎨 Styling Guidelines

### 1. Responsive Design

Use mobile-first approach with Tailwind breakpoints:

```jsx
// ✅ Good: Mobile-first responsive design
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <Card className="p-4 sm:p-6" />
</div>
```

### 2. Color Usage

Follow the design system color palette:

```jsx
// ✅ Good: Using design system colors
<div className="bg-background text-foreground border-border">
  <Button variant="destructive">Delete</Button>
  <Badge variant="success">Active</Badge>
</div>

// ❌ Avoid: Hardcoded colors
<div className="bg-gray-100 text-gray-900 border-gray-300">
```

### 3. Spacing and Layout

Use consistent spacing scale:

```jsx
// ✅ Good: Consistent spacing
<div className="space-y-4">
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-2">Section Title</h2>
    <p className="text-muted-foreground">Description</p>
  </div>
</div>
```

### 4. Typography

Follow typography hierarchy:

```jsx
// ✅ Good: Typography hierarchy
<div className="space-y-4">
  <h1 className="text-3xl font-bold tracking-tight">Page Title</h1>
  <h2 className="text-2xl font-semibold">Section Title</h2>
  <h3 className="text-lg font-medium">Subsection</h3>
  <p className="text-base text-muted-foreground">Body text</p>
  <p className="text-sm text-muted-foreground">Small text</p>
</div>
```

## 🔧 Props Design

### 1. Prop Types and Validation

Use TypeScript interfaces for prop validation:

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "default",
  size = "default",
  ...props 
}) => {
  // Component implementation
};
```

### 2. Default Props Pattern

Provide sensible defaults:

```jsx
// ✅ Good: Sensible defaults
const UserCard = ({ 
  user,
  showAvatar = true,
  showEmail = true,
  size = "medium",
  onEdit,
  className
}) => {
  // Component implementation
};
```

### 3. Flexible Props

Support both controlled and uncontrolled patterns:

```jsx
// ✅ Good: Flexible component API
const Toggle = ({ 
  checked, 
  defaultChecked = false,
  onChange,
  ...props 
}) => {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const checkedValue = isControlled ? checked : internalChecked;
  
  const handleChange = (newChecked) => {
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    onChange?.(newChecked);
  };
  
  return (
    <input 
      type="checkbox"
      checked={checkedValue}
      onChange={(e) => handleChange(e.target.checked)}
      {...props}
    />
  );
};
```

## 📊 State Management Patterns

### 1. Local State (useState)

For component-specific state:

```jsx
// ✅ Good: Simple local state
const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <form onSubmit={() => onSubmit(formData)}>
      <Input 
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
    </form>
  );
};
```

### 2. Global State (Redux)

For application-wide state:

```jsx
// ✅ Good: Redux for global state
const UserProfile = () => {
  const { user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => dispatch(logoutUser())}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 3. Server State (React Query)

For remote data:

```jsx
// ✅ Good: React Query for server state
const UserList = () => {
  const { 
    data: users, 
    isLoading, 
    error,
    refetch 
  } = useGetUsers();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} onRetry={refetch} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

## 🚨 Error Handling

### 1. Error Boundaries

Wrap components in error boundaries:

```jsx
// ✅ Good: Error boundary usage
const FundManagement = () => (
  <ComponentErrorBoundary componentName="FundManagement">
    <FundList />
    <FundForm />
  </ComponentErrorBoundary>
);
```

### 2. Error States

Handle and display errors gracefully:

```jsx
// ✅ Good: Error state handling
const DataComponent = () => {
  const { data, error, isLoading } = useQuery();
  
  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }
  
  if (error) {
    return (
      <ErrorState 
        title="Failed to load data"
        description={error.message}
        action={
          <Button onClick={() => queryClient.invalidateQueries()}>
            Try Again
          </Button>
        }
      />
    );
  }
  
  return <DataDisplay data={data} />;
};
```

## 🎭 Accessibility Guidelines

### 1. Semantic HTML

Use appropriate HTML elements:

```jsx
// ✅ Good: Semantic HTML
<main>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/dashboard">Dashboard</a></li>
    </ul>
  </nav>
  
  <section>
    <h1>Page Title</h1>
    <article>
      <h2>Section Title</h2>
      <p>Content</p>
    </article>
  </section>
</main>
```

### 2. ARIA Labels

Provide accessible labels:

```jsx
// ✅ Good: ARIA labels
<Button 
  aria-label="Delete user John Doe"
  onClick={() => deleteUser(user.id)}
>
  <Trash2 className="h-4 w-4" />
</Button>

<Input
  type="email"
  placeholder="Email address"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>
{error && (
  <div id="email-error" className="text-destructive text-sm">
    {error}
  </div>
)}
```

### 3. Keyboard Navigation

Support keyboard interactions:

```jsx
// ✅ Good: Keyboard support
const DropdownMenu = () => {
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        closeMenu();
        break;
      case 'ArrowDown':
        event.preventDefault();
        focusNextItem();
        break;
      // ... other keys
    }
  };
  
  return (
    <div
      role="menu"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Menu items */}
    </div>
  );
};
```

## 📱 Performance Optimization

### 1. Memoization

Use React.memo and useMemo appropriately:

```jsx
// ✅ Good: Memoized expensive component
const ExpensiveUserList = React.memo(({ users, onUserSelect }) => {
  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }, [users]);
  
  return (
    <div>
      {sortedUsers.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          onClick={() => onUserSelect(user)}
        />
      ))}
    </div>
  );
});
```

### 2. Lazy Loading

Implement lazy loading for heavy components:

```jsx
// ✅ Good: Lazy loaded component
const LazyDataTable = lazy(() => import('./DataTable'));

const DataPage = () => (
  <Suspense fallback={<TableSkeleton />}>
    <LazyDataTable data={data} />
  </Suspense>
);
```

### 3. Virtual Scrolling

For large lists:

```jsx
// ✅ Good: Virtual scrolling for large datasets
const VirtualizedList = ({ items }) => {
  const { visibleItems, containerProps } = useVirtualScroll({
    items,
    itemHeight: 60,
    containerHeight: 400
  });
  
  return (
    <div {...containerProps}>
      {visibleItems.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
};
```

## 🧪 Testing Guidelines

### 1. Component Testing

Focus on user behavior:

```jsx
// ✅ Good: Behavior-focused tests
test('submits form with user data', async () => {
  const user = userEvent.setup();
  const mockSubmit = vi.fn();
  
  render(<UserForm onSubmit={mockSubmit} />);
  
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(mockSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com'
  });
});
```

### 2. Integration Testing

Test component interactions:

```jsx
// ✅ Good: Integration test
test('updates user list after deletion', async () => {
  const user = userEvent.setup();
  server.use(
    http.get('/api/users', () => HttpResponse.json({ users: mockUsers })),
    http.delete('/api/users/:id', () => HttpResponse.json({ success: true }))
  );
  
  render(<UserManagement />);
  
  await user.click(screen.getByRole('button', { name: /delete john/i }));
  await user.click(screen.getByRole('button', { name: /confirm/i }));
  
  await waitFor(() => {
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  });
});
```

This style guide ensures consistent, maintainable, and accessible React components across the entire application.