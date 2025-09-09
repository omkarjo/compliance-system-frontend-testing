import { getStatusIcon as getStatusIconComponent } from "@/components/icons";

export const getStatusStyle = (state) => {
  let statusClass, bgSecondaryColor;

  switch (state?.toLowerCase()) {
    case "open":
      statusClass = "status-open";
      bgSecondaryColor = "bg-[var(--palette-5-blue-400)]";
      break;
    case "pending":
      statusClass = "status-pending";
      bgSecondaryColor = "bg-[var(--palette-5-400)]";
      break;
    case "review":
    case "review required":
      statusClass = "status-review";
      bgSecondaryColor = "bg-yellow-600 dark:bg-yellow-400";
      break;
    case "completed":
      statusClass = "status-completed";
      bgSecondaryColor = "bg-green-600 dark:bg-green-400";
      break;
    case "overdue":
      statusClass = "status-overdue";
      bgSecondaryColor = "bg-red-600 dark:bg-red-400";
      break;
    case "blocked":
      statusClass = "status-blocked";
      bgSecondaryColor = "bg-red-600 dark:bg-red-400";
      break;
    default:
      statusClass = "status-open";
      bgSecondaryColor = "bg-[var(--palette-5-blue-400)]";
      break;
  }

  return { statusClass, bgSecondaryColor };
};

export const getStatusIcon = (state, className = "text-current", size = 16) => {
  const IconComponent = getStatusIconComponent(state);
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} />;
};
