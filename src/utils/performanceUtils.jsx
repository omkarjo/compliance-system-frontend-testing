/**
 * Performance Optimization Utilities
 * 
 * React performance optimization helpers
 */

import { memo, useMemo, useCallback, useState, useEffect } from 'react';

// Higher-order component for memoizing heavy components
export const withMemo = (Component, areEqual) => {
  return memo(Component, areEqual);
};

// Custom hook for debounced values (search, filtering)
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for virtual scrolling
export const useVirtualScroll = (items, containerHeight, itemHeight) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
    
    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
      setScrollTop
    };
  }, [items, containerHeight, itemHeight, scrollTop]);
};

// Memoized table row component
export const MemoizedTableRow = memo(({ row, columns, onRowClick }) => {
  const handleClick = useCallback(() => {
    onRowClick?.(row);
  }, [row, onRowClick]);

  return (
    <tr onClick={handleClick} className="hover:bg-muted/50 cursor-pointer">
      {columns.map((column, index) => (
        <td key={index} className="px-4 py-2">
          {column.render ? column.render(row) : row[column.key]}
        </td>
      ))}
    </tr>
  );
});

// Optimized form field component
export const MemoizedFormField = memo(({ field, value, onChange, error }) => {
  const handleChange = useCallback((e) => {
    onChange(field.name, e.target.value);
  }, [field.name, onChange]);

  return (
    <div className="space-y-2">
      <label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
      </label>
      <input
        id={field.name}
        type={field.type}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md"
      />
      {error && <span className="text-sm text-destructive">{error}</span>}
    </div>
  );
});

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // 16ms = 60fps threshold
        console.warn(`⚠️ ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (callback, options = {}) => {
  const [ref, setRef] = useState(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(callback, {
      threshold: 0.1,
      ...options
    });

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, callback]);

  return setRef;
};