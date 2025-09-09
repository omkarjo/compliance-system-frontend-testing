/**
 * Preload Utilities
 * 
 * Utilities for preloading critical resources and optimizing performance
 */

// Preload critical routes based on user role
export const preloadCriticalRoutes = async (userRole) => {
  const routes = [];
  
  // Always preload dashboard
  routes.push(import('@/pages/Dashboard/Overview/DashBoard'));
  
  // Preload based on role
  if (['admin', 'super_admin'].includes(userRole)) {
    routes.push(
      import('@/pages/Dashboard/Compliance/LPDashboard'),
      import('@/pages/Dashboard/Admin/UsersDashboard')
    );
  }
  
  if (['fund_manager', 'admin', 'super_admin'].includes(userRole)) {
    routes.push(
      import('@/pages/Dashboard/Compliance/Fund/FundPage'),
      import('@/pages/Dashboard/Compliance/Fund/FundDetailsPage')
    );
  }
  
  // Execute preloads in parallel
  try {
    await Promise.all(routes);
    console.log('✅ Critical routes preloaded');
  } catch (error) {
    console.warn('⚠️ Some routes failed to preload:', error);
  }
};

// Preload component on hover (for better UX)
export const preloadOnHover = (importFn) => {
  let preloadPromise = null;
  
  return {
    onMouseEnter: () => {
      if (!preloadPromise) {
        preloadPromise = importFn();
      }
    },
    onFocus: () => {
      if (!preloadPromise) {
        preloadPromise = importFn();
      }
    }
  };
};

// Preload resources during idle time
export const idlePreload = (importFn, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn(), { timeout });
  } else {
    setTimeout(() => importFn(), timeout);
  }
};

// Progressive loading for large datasets
export const createProgressiveLoader = (pageSize = 20) => {
  return {
    initialLoad: pageSize,
    loadMore: pageSize * 2,
    threshold: 0.8 // Load more when 80% scrolled
  };
};

// Cache management for lazy loaded components
export const componentCache = new Map();

export const getCachedComponent = (key, importFn) => {
  if (!componentCache.has(key)) {
    componentCache.set(key, importFn());
  }
  return componentCache.get(key);
};