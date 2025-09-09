/**
 * Test Utilities
 * 
 * Common testing utilities and custom render functions
 */

import React from 'react';
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { configureStore } from '@reduxjs/toolkit';
import userSlice from '@/store/slices/userSlice';

// Create a test store
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }),
  });
};

// Create a test query client
export const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Custom render function with all providers
export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    queryClient = createTestQueryClient(),
    route = '/',
    ...renderOptions
  } = {}
) => {
  // Set initial route
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }) => (
    <ThemeProvider defaultTheme="light" storageKey="test-theme">
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );

  return {
    store,
    queryClient,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock authenticated user state
export const mockAuthenticatedUser = {
  user: {
    isAuthenticated: true,
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
    },
    token: 'mock-token',
    aws_credentials: {
      bucket_name: 'test-bucket',
      region: 'us-east-1',
      access_key_id: 'test-key',
      secret_access_key: 'test-secret',
    },
  },
};

// Mock unauthenticated user state
export const mockUnauthenticatedUser = {
  user: {
    isAuthenticated: false,
    user: null,
    token: null,
    aws_credentials: null,
  },
};

// Mock API responses
export const mockApiResponse = (data, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ok: true,
        status: 200,
        json: async () => ({ data, status: 'success' }),
      });
    }, delay);
  });
};

export const mockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};

// Mock form data
export const mockFormData = {
  fund: {
    id: '1',
    name: 'Test Fund',
    description: 'Test fund description',
    status: 'active',
    totalCommitment: 1000000,
    vintage: 2024,
  },
  task: {
    id: '1',
    title: 'Test Task',
    description: 'Test task description',
    status: 'pending',
    priority: 'medium',
  },
  entity: {
    id: '1',
    name: 'Test Entity',
    type: 'corporation',
    status: 'active',
  },
};

// Wait for element with custom timeout
export const waitForElementWithTimeout = (getBy, timeout = 5000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Element not found within ${timeout}ms`));
    }, timeout);

    const observer = new MutationObserver(() => {
      try {
        const element = getBy();
        if (element) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(element);
        }
      } catch (error) {
        // Element not found yet, continue observing
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Check immediately in case element already exists
    try {
      const element = getBy();
      if (element) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(element);
      }
    } catch (error) {
      // Element not found yet, wait for observer
    }
  });
};

// Custom matchers for better assertions
export const expectToBeVisible = (element) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectToHaveClass = (element, className) => {
  expect(element).toHaveClass(className);
};

export const expectToBeDisabled = (element) => {
  expect(element).toBeDisabled();
};

export const expectToBeEnabled = (element) => {
  expect(element).toBeEnabled();
};