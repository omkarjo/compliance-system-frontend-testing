# Testing Guide

This document outlines the testing strategy, setup, and best practices for the React application.

## 🧪 Testing Stack

- **Test Runner**: [Vitest](https://vitest.dev/) - Fast Vite-native unit test framework
- **Testing Library**: [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) - Simple and complete React DOM testing utilities
- **DOM Environment**: [jsdom](https://github.com/jsdom/jsdom) - Pure JavaScript DOM implementation
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro) - Fire events the same way the user does
- **Assertions**: [Jest DOM matchers](https://testing-library.com/docs/ecosystem-jest-dom) - Custom Jest matchers for DOM elements

## 📁 Test Structure

```
src/
├── test/
│   ├── setup.js          # Global test setup and configuration
│   └── utils.jsx         # Testing utilities and custom render functions
└── components/
    ├── ui/
    │   └── button.test.jsx      # UI component tests
    ├── common/
    │   └── ErrorBoundary.test.jsx  # Utility component tests
    └── business/
        └── [domain]/
            └── Component.test.jsx  # Business logic tests
```

## 🛠 Configuration

### Vitest Configuration (`vitest.config.js`)

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    coverage: {
      provider: 'v8',
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  }
});
```

### Global Setup (`src/test/setup.js`)

- Imports `@testing-library/jest-dom` for custom matchers
- Mocks browser APIs (matchMedia, ResizeObserver, etc.)
- Sets up localStorage/sessionStorage mocks
- Configures console warning suppressions

## 📝 Available Scripts

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui

# Run tests in watch mode
npm run test:watch
```

## 🧰 Testing Utilities

### Custom Render Function

Use `renderWithProviders` for testing components that need context:

```jsx
import { renderWithProviders } from '@/test/utils';

test('component renders with providers', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Pre-configured States

```jsx
import { mockAuthenticatedUser, mockUnauthenticatedUser } from '@/test/utils';

test('shows user dashboard when authenticated', () => {
  renderWithProviders(<Dashboard />, {
    preloadedState: mockAuthenticatedUser
  });
  
  expect(screen.getByText('Welcome back!')).toBeInTheDocument();
});
```

### API Mocking

```jsx
import { mockApiResponse, mockApiError } from '@/test/utils';

test('handles API success', async () => {
  fetch.mockResolvedValueOnce(mockApiResponse({ users: [] }));
  
  renderWithProviders(<UserList />);
  
  await waitFor(() => {
    expect(screen.getByText('No users found')).toBeInTheDocument();
  });
});
```

## 📋 Testing Patterns

### 1. Component Testing

**Basic Component Test:**

```jsx
describe('Button Component', () => {
  it('renders with correct text', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Component with Props:**

```jsx
describe('Card Component', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    status: 'active'
  };

  it('displays all props correctly', () => {
    renderWithProviders(<Card {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it('applies conditional styling based on status', () => {
    renderWithProviders(<Card {...defaultProps} status="inactive" />);
    
    const card = screen.getByRole('article');
    expect(card).toHaveClass('opacity-50');
  });
});
```

### 2. Hook Testing

```jsx
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useGetFunds Hook', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    });
  });

  it('fetches funds successfully', async () => {
    fetch.mockResolvedValueOnce(mockApiResponse({ funds: [] }));

    const { result } = renderHook(() => useGetFunds(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data.funds).toEqual([]);
  });
});
```

### 3. Form Testing

```jsx
describe('UserForm Component', () => {
  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    renderWithProviders(<UserForm onSubmit={onSubmit} />);
    
    // Fill form fields
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('displays validation errors', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<UserForm />);
    
    // Submit empty form
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });
});
```

### 4. Async Component Testing

```jsx
describe('AsyncDataComponent', () => {
  it('shows loading state initially', () => {
    renderWithProviders(<AsyncDataComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays data after loading', async () => {
    fetch.mockResolvedValueOnce(mockApiResponse({ message: 'Success!' }));
    
    renderWithProviders(<AsyncDataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
    });
    
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it('handles error states', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithProviders(<AsyncDataComponent />);
    
    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });
});
```

### 5. Router Testing

```jsx
describe('Navigation Component', () => {
  it('navigates to correct routes', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<Navigation />, {
      route: '/dashboard'
    });
    
    await user.click(screen.getByRole('link', { name: /settings/i }));
    
    expect(window.location.pathname).toBe('/settings');
  });
});
```

## 🎯 Best Practices

### 1. Writing Good Tests

**✅ Do:**
- Test behavior, not implementation
- Use semantic queries (`getByRole`, `getByLabelText`)
- Test from user's perspective
- Keep tests simple and focused
- Use descriptive test names

```jsx
// Good: Tests behavior
it('shows error message when email is invalid', async () => {
  const user = userEvent.setup();
  
  renderWithProviders(<LoginForm />);
  await user.type(screen.getByLabelText(/email/i), 'invalid-email');
  await user.click(screen.getByRole('button', { name: /sign in/i }));
  
  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
});

// Bad: Tests implementation
it('calls validateEmail function', () => {
  const validateEmailSpy = vi.spyOn(utils, 'validateEmail');
  renderWithProviders(<LoginForm />);
  expect(validateEmailSpy).toHaveBeenCalled();
});
```

**❌ Don't:**
- Test implementation details
- Use `container.querySelector`
- Test multiple behaviors in one test
- Rely on random data
- Ignore act() warnings

### 2. Query Priority

Use this priority when selecting elements:

1. **Accessible queries**: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`
2. **Semantic queries**: `getByAltText`, `getByTitle`
3. **Test IDs**: `getByTestId` (as last resort)

### 3. Async Testing

```jsx
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
});

// Use findBy for elements that appear asynchronously
const element = await screen.findByText('Async content');
expect(element).toBeInTheDocument();
```

### 4. Error Boundary Testing

```jsx
// Suppress console.error for intentional errors
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = vi.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});
```

## 🔍 Coverage Goals

Maintain these coverage thresholds:
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

Focus coverage on:
- Business logic components
- Utility functions
- Critical user flows
- Error handling paths

## 🚀 CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch pushes
- Before deployments

```yaml
# GitHub Actions example
- name: Run Tests
  run: npm run test:coverage
  
- name: Upload Coverage
  uses: codecov/codecov-action@v1
```

## 🐛 Debugging Tests

### Common Issues

1. **Act warnings**: Wrap state updates in `act()`
2. **Memory leaks**: Ensure proper cleanup in `useEffect`
3. **Timing issues**: Use `waitFor` or `findBy` for async content
4. **Context missing**: Use `renderWithProviders`

### Debugging Tools

```jsx
// Debug rendered output
screen.debug();

// Debug specific element
screen.debug(screen.getByRole('button'));

// Log all queries
screen.logTestingPlaygroundURL();
```

This testing setup provides comprehensive coverage while maintaining developer productivity and code quality.