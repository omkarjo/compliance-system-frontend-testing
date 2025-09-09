import { cn } from '@/lib/utils';

/**
 * Typography components using native HTML elements and Tailwind CSS
 * Maintains design system consistency with theme-aware colors
 * 
 * Typography Hierarchy:
 * - Headings: XXL, XL, L, M, S (for titles, headers)
 * - Body: Large, Medium, Small (for content, labels, secondary info)
 * - All components use semantic HTML elements and proper theme colors
 */

// =============================================================================
// HEADING COMPONENTS
// =============================================================================

/**
 * Page/Section Titles (XXL - 28px)
 * Use for: Main page titles, primary headers
 */
export const HeadingXXL = ({ children, className, ...props }) => (
  <h1 className={cn("text-3xl font-medium text-foreground", className)} {...props}>
    {children}
  </h1>
);

/**
 * Section Headers (XL - 24px)
 * Use for: Card titles, modal headers, secondary page sections
 */
export const HeadingXL = ({ children, className, as: Component = "h2", ...props }) => (
  <Component className={cn("text-2xl font-medium text-foreground", className)} {...props}>
    {children}
  </Component>
);

/**
 * Subsection Headers (L - 20px)
 * Use for: Component titles, form section headers
 */
export const HeadingL = ({ children, className, ...props }) => (
  <h3 className={cn("text-xl font-medium text-foreground", className)} {...props}>
    {children}
  </h3>
);

/**
 * Component Headers (M - 16px)
 * Use for: Table headers, card subtitles
 */
export const HeadingM = ({ children, className, ...props }) => (
  <h4 className={cn("text-base font-medium text-foreground", className)} {...props}>
    {children}
  </h4>
);

/**
 * Small Headers (S - 14px)
 * Use sparingly for: Compact headers in limited spaces
 */
export const HeadingS = ({ children, className, ...props }) => (
  <h5 className={cn("text-sm font-medium text-foreground", className)} {...props}>
    {children}
  </h5>
);

// =============================================================================
// BODY TEXT COMPONENTS
// =============================================================================

/**
 * Large Body Text (16px)
 * Use for: Main content, descriptions, default reading text
 */
export const BodyLarge = ({ children, className, weight = "regular", color, ...props }) => {
  const weightClass = weight === "medium" ? "font-medium" : "font-normal";
  return (
    <span className={cn("text-base", weightClass, "text-foreground", className)} {...props}>
      {children}
    </span>
  );
};

/**
 * Medium Body Text (14px)  
 * Use for: Labels, short text, component text
 */
export const BodyMedium = ({ children, className, weight = "regular", color, ...props }) => {
  const weightClass = weight === "medium" ? "font-medium" : "font-normal";
  return (
    <span className={cn("text-sm", weightClass, "text-foreground", className)} {...props}>
      {children}
    </span>
  );
};

/**
 * Small Body Text (12px)
 * Use sparingly for: Secondary content, captions, footnotes
 */
export const BodySmall = ({ children, className, weight = "regular", color, ...props }) => {
  const weightClass = weight === "medium" ? "font-medium" : "font-normal";
  return (
    <span className={cn("text-xs", weightClass, "text-muted-foreground", className)} {...props}>
      {children}
    </span>
  );
};

// =============================================================================
// UTILITY COMPONENTS
// =============================================================================

/**
 * Emphasized Text
 * Use for: Important content that needs attention
 */
export const TextEmphasis = ({ children, className, size, ...props }) => {
  let sizeClass = "text-base"; // Default size.300
  if (size === "size.600") sizeClass = "text-3xl";
  else if (size === "size.500") sizeClass = "text-2xl";
  else if (size === "size.400") sizeClass = "text-xl";
  else if (size === "size.200") sizeClass = "text-sm";
  else if (size === "size.100") sizeClass = "text-xs";
  
  return (
    <span className={cn(sizeClass, "font-medium text-foreground", className)} {...props}>
      {children}
    </span>
  );
};

/**
 * Subtle Text
 * Use for: Less important, secondary information
 */
export const TextSubtle = ({ children, className, size, ...props }) => {
  let sizeClass = "text-sm"; // Default size.200
  if (size === "size.600") sizeClass = "text-3xl";
  else if (size === "size.500") sizeClass = "text-2xl";
  else if (size === "size.400") sizeClass = "text-xl";
  else if (size === "size.300") sizeClass = "text-base";
  else if (size === "size.100") sizeClass = "text-xs";
  
  return (
    <span className={cn(sizeClass, "font-normal text-muted-foreground", className)} {...props}>
      {children}
    </span>
  );
};

/**
 * Link Text
 * Use for: Interactive text links
 */
export const TextLink = ({ children, className, size, ...props }) => {
  let sizeClass = "text-base"; // Default size.300
  if (size === "size.600") sizeClass = "text-3xl";
  else if (size === "size.500") sizeClass = "text-2xl";
  else if (size === "size.400") sizeClass = "text-xl";
  else if (size === "size.200") sizeClass = "text-sm";
  else if (size === "size.100") sizeClass = "text-xs";
  
  return (
    <span className={cn(sizeClass, "font-normal text-primary hover:underline", className)} {...props}>
      {children}
    </span>
  );
};

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

// Default export with all components for convenience
export default {
  HeadingXXL,
  HeadingXL,
  HeadingL,
  HeadingM,
  HeadingS,
  BodyLarge,
  BodyMedium,
  BodySmall,
  TextEmphasis,
  TextSubtle,
  TextLink
};