// Apple-Inspired Icon System
// Central place to manage all icons used across the application
// Following Apple's Human Interface Guidelines for icon organization

// Import React for JSX component
import React from "react";

// Import all icons from lucide-react
import {
  AlertTriangle,
  Banknote,
  BookOpen,
  Bot,
  Building,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  GalleryVerticalEnd,
  GitCompare,
  Globe,
  History,
  Home,
  Hourglass,
  IndianRupee,
  LayoutDashboard,
  Menu,
  Paperclip,
  Plus,
  Search,
  Settings,
  SquareTerminal,
  SquareUser,
  Trash,
  Upload,
  User,
  UserCircle,
  Users,
  View,
  Watch,
  X,
  XCircle,
} from "lucide-react";

// Apple-style icon size constants
export const IconSizes = {
  xs: 12,     // 12px - Caption/small UI elements
  sm: 16,     // 16px - Body text inline icons
  md: 20,     // 20px - Standard UI icons
  lg: 24,     // 24px - Navigation and primary actions
  xl: 32,     // 32px - Large interactive elements
  "2xl": 48,  // 48px - Hero icons and illustrations
};

// Apple-inspired icon weight/stroke constants
export const IconWeights = {
  thin: 1,
  light: 1.5,
  regular: 2,   // Default Apple weight
  medium: 2.5,
  bold: 3,
};

// Status Icons
export const StatusIcons = {
  Open: Circle,
  Pending: Watch,
  Review: View,
  "Review Required": View,
  Completed: CheckCircle,
  Overdue: AlertTriangle,
  Blocked: XCircle,
  Default: Circle,
};

// Navigation Icons - Primary app navigation
export const NavigationIcons = {
  Dashboard: LayoutDashboard,
  Home: Home,
  Tasks: Bot,
  Processes: GitCompare,
  Documents: FileText,
  ActivityLog: History,
  LimitedPartners: User,
  PortfolioCompanies: Building,
  Drawdowns: IndianRupee,
  FundDetails: Banknote,
  Entities: SquareUser,
  Users: Users,
  Globe,
};

// Action Icons - User actions and controls
export const ActionIcons = {
  Add: Plus,
  Create: Plus,
  Edit,
  Delete: Trash,
  Remove: Trash,
  View: Eye,
  Show: Eye,
  Download,
  Upload,
  Search,
  Filter,
  Menu,
  Settings,
  Configure: Settings,
  Close: X,
  Cancel: X,
};

// UI Icons - Interface elements
export const UIIcons = {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Time: Clock,
  Hourglass,
  Loading: Hourglass,
  Paperclip,
  Attachment: Paperclip,
  Document: FileText,
  File: FileText,
  User,
  UserCircle,
  Profile: UserCircle,
};

// Feedback Icons - System states and notifications
export const FeedbackIcons = {
  Alert: AlertTriangle,
  Success: CheckCircle2,
  Complete: CheckCircle2,
  Warning: AlertTriangle,
  Error: XCircle,
  Failed: XCircle,
  Info: Circle,
  Information: Circle,
  Pending: Clock,
  InProgress: Hourglass,
};

// Utility Icons - Backward compatibility alias
export const UtilityIcons = FeedbackIcons;

// Apple-style icon component with consistent sizing and styling
export const AppleIcon = ({ 
  icon: IconComponent, 
  size = "md", 
  weight = "regular",
  className = "",
  color,
  ...props 
}) => {
  const sizeValue = IconSizes[size] || IconSizes.md;
  const strokeWidth = IconWeights[weight] || IconWeights.regular;
  
  return React.createElement(IconComponent, {
    size: sizeValue,
    strokeWidth: strokeWidth,
    className: `transition-apple ${className}`,
    style: { color },
    ...props
  });
};

// Helper functions with Apple-style consistent sizing
export const getStatusIcon = (status, { size = "md", weight = "regular", ...props } = {}) => {
  const IconComponent = StatusIcons[status] || StatusIcons.Default;
  return IconComponent;
};

export const getNavigationIcon = (name, { size = "lg", weight = "regular", ...props } = {}) => {
  const IconComponent = NavigationIcons[name];
  return IconComponent;
};

export const getActionIcon = (action, { size = "md", weight = "regular", ...props } = {}) => {
  const IconComponent = ActionIcons[action];
  return IconComponent;
};

export const getFeedbackIcon = (type, { size = "md", weight = "regular", ...props } = {}) => {
  const IconComponent = FeedbackIcons[type];
  return IconComponent;
};

// Export all icons organized by category
export const Icons = {
  Status: StatusIcons,
  Navigation: NavigationIcons,
  Action: ActionIcons,
  UI: UIIcons,
  Feedback: FeedbackIcons,
};

// Export all icons flattened for legacy compatibility
export const AllIcons = {
  ...StatusIcons,
  ...NavigationIcons,
  ...ActionIcons,
  ...UIIcons,
  ...FeedbackIcons,
};

// Default export
export default Icons;