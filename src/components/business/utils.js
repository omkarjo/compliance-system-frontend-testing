/**
 * Business Component Utilities
 * 
 * Common utility functions used across business components
 */

/**
 * Creates standardized table action configurations
 */
export const createTableActions = (actions = {}) => {
  const defaultActions = {
    view: {
      label: 'View Details',
      icon: 'Eye',
      variant: 'ghost'
    },
    edit: {
      label: 'Edit',
      icon: 'Pencil', 
      variant: 'ghost'
    },
    delete: {
      label: 'Delete',
      icon: 'Trash2',
      variant: 'ghost',
      className: 'text-destructive'
    }
  };
  
  return { ...defaultActions, ...actions };
};

/**
 * Creates standardized form field configurations
 */
export const createFormFields = (domain, customFields = []) => {
  const commonFields = [
    {
      name: 'created_at',
      type: 'date',
      label: 'Created Date',
      readonly: true
    },
    {
      name: 'updated_at', 
      type: 'date',
      label: 'Last Updated',
      readonly: true
    }
  ];
  
  return [...customFields, ...commonFields];
};

/**
 * Creates standardized component props for consistency
 */
export const createStandardProps = (componentType, domain) => {
  const baseProps = {
    className: '',
    'data-testid': `${domain}-${componentType}`
  };
  
  const typeSpecificProps = {
    table: {
      ...baseProps,
      loading: false,
      pageSize: 10,
      searchable: true
    },
    form: {
      ...baseProps,
      loading: false,
      resetAfterSubmit: false
    },
    modal: {
      ...baseProps,
      size: 'default',
      closable: true
    }
  };
  
  return typeSpecificProps[componentType] || baseProps;
};

/**
 * Component validation helpers
 */
export const validateComponentStructure = (component, expectedProps = []) => {
  const warnings = [];
  
  expectedProps.forEach(prop => {
    if (!(prop in component.props)) {
      warnings.push(`Missing expected prop: ${prop}`);
    }
  });
  
  if (warnings.length > 0) {
    console.warn(`Component validation warnings for ${component.name}:`, warnings);
  }
  
  return warnings.length === 0;
};

/**
 * Creates consistent error boundaries for business components
 */
export const withErrorBoundary = (Component, fallbackComponent = null) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error(`Error in ${Component.name}:`, error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return fallbackComponent || (
          <div className="p-4 border border-destructive rounded-md">
            <h3 className="text-destructive font-semibold">Component Error</h3>
            <p className="text-sm text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
        );
      }
      
      return <Component {...this.props} />;
    }
  };
};