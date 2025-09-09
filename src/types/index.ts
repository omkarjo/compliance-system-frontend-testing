/**
 * TypeScript Type Definitions
 * 
 * Common types used throughout the application
 */

// API Response Types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp?: string;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'super_admin' | 'fund_manager' | 'limited_partner' | 'user';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  aws_credentials?: AwsCredentials;
}

export interface AwsCredentials {
  bucket_name: string;
  region: string;
  access_key_id: string;
  secret_access_key: string;
}

// Fund Management Types
export interface Fund {
  id: string;
  name: string;
  description?: string;
  status: FundStatus;
  totalCommitment: number;
  totalDrawn: number;
  totalDistributed: number;
  vintage: number;
  fundManager: User;
  createdAt: string;
  updatedAt: string;
}

export type FundStatus = 'active' | 'closed' | 'fundraising' | 'liquidating';

export interface Drawdown {
  id: string;
  fundId: string;
  quarter: string;
  amount: number;
  dueDate: string;
  status: DrawdownStatus;
  notices: DrawdownNotice[];
  createdAt: string;
  updatedAt: string;
}

export type DrawdownStatus = 'pending' | 'sent' | 'completed' | 'overdue';

export interface DrawdownNotice {
  id: string;
  recipientEmail: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
}

// Task Management Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  dueDate?: string;
  tags: string[];
  fundId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Entity Management Types
export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  status: EntityStatus;
  registrationNumber?: string;
  incorporationDate?: string;
  address?: Address;
  contacts: Contact[];
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export type EntityType = 'corporation' | 'partnership' | 'llc' | 'trust' | 'individual';
export type EntityStatus = 'active' | 'inactive' | 'pending' | 'dissolved';

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isPrimary: boolean;
}

// Document Management Types
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  tags: string[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'contract' | 'report' | 'statement' | 'notice' | 'other';

// Portfolio Company Types
export interface PortfolioCompany {
  id: string;
  name: string;
  description?: string;
  sector: string;
  stage: CompanyStage;
  investmentAmount: number;
  ownershipPercentage: number;
  fundId: string;
  status: CompanyStatus;
  metrics: CompanyMetrics;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
}

export type CompanyStage = 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'mature';
export type CompanyStatus = 'active' | 'exited' | 'written_off' | 'under_review';

export interface CompanyMetrics {
  revenue?: number;
  ebitda?: number;
  valuation?: number;
  employees?: number;
  lastUpdated: string;
}

// UI Component Types
export interface TableColumn<T = any> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  error?: string;
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
}

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  readonly?: boolean;
  defaultValue?: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
}

// Form Types
export interface FormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
  loading?: boolean;
  error?: string;
  submitLabel?: string;
  resetAfterSubmit?: boolean;
}

// Error Handling Types
export interface AppError {
  id: string;
  message: string;
  stack?: string;
  component?: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  type: 'javascript_error' | 'api_error' | 'component_error' | 'network_error';
  context?: Record<string, any>;
}

// Performance Monitoring Types
export interface PerformanceMetric {
  type: 'route_change' | 'component_render' | 'api_call' | 'user_action';
  name: string;
  duration?: number;
  timestamp: number;
  details?: Record<string, any>;
}

// State Management Types
export interface RootState {
  user: AuthState;
  ui: UiState;
  // Add other slices as needed
}

export interface UiState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  loading: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  actions?: NotificationAction[];
  createdAt: string;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary';
}

// Utility Types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ApiEndpoint<T = any> = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  data?: T;
};