/**
 * Business Component Types and Interfaces
 * 
 * This file defines common types and interfaces used across business components.
 * It helps maintain consistency and provides type safety.
 */

// Common prop interfaces for business components
export const CommonPropTypes = {
  // Table component common props
  TABLE_COMMON_PROPS: ['data', 'loading', 'onRowClick', 'onRowSelect', 'columns'],
  
  // Sheet/Modal component common props  
  SHEET_COMMON_PROPS: ['isOpen', 'onClose', 'title', 'data'],
  
  // Form component common props
  FORM_COMMON_PROPS: ['onSubmit', 'defaultValues', 'schema', 'loading'],
  
  // Select component common props
  SELECT_COMMON_PROPS: ['value', 'onChange', 'options', 'placeholder', 'disabled']
};

// Common component patterns
export const ComponentPatterns = {
  // Standard table component structure
  STANDARD_TABLE: {
    columns: 'Array of column definitions',
    data: 'Array of row data',
    loading: 'Boolean loading state',
    pagination: 'Pagination configuration',
    actions: 'Array of row actions'
  },
  
  // Standard form component structure
  STANDARD_FORM: {
    schema: 'Validation schema (Zod/Yup)',
    fields: 'Form field definitions',
    onSubmit: 'Submit handler function',
    defaultValues: 'Initial form values',
    loading: 'Submission loading state'
  },
  
  // Standard modal/sheet structure
  STANDARD_MODAL: {
    trigger: 'Component that opens modal',
    content: 'Modal body content',
    actions: 'Modal footer actions',
    size: 'Modal size configuration'
  }
};

// Business domain constants
export const BusinessDomains = {
  TASKS: 'tasks',
  FUNDS: 'funds', 
  ENTITIES: 'entities',
  DRAWDOWNS: 'drawdowns',
  PORTFOLIO_COMPANIES: 'portfolio-companies',
  REPORTS: 'reports'
};

// Component naming conventions
export const NamingConventions = {
  TABLE_COMPONENT: (domain) => `Table${domain}View`,
  SHEET_COMPONENT: (domain) => `Sheet${domain}View`, 
  FORM_COMPONENT: (domain) => `${domain}Form`,
  SELECT_COMPONENT: (domain) => `${domain}Select`,
  CARD_COMPONENT: (domain) => `${domain}Card`
};