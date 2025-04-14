import {
  AlertTriangle,
  CheckCircle,
  Circle,
  Hourglass,
  View,
  Watch,
  XCircle,
} from "lucide-react";

export const getStatusStyle = (state) => {
  let bgColor, textColor, borderColor, bgSecondaryColor;

  switch (state?.toLowerCase()) {
    case "open":
      bgColor = "bg-blue-50";
      bgSecondaryColor = "bg-blue-400";
      textColor = "text-blue-700";
      borderColor = "border-blue-200";
      break;
    case "pending":
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      borderColor = "border-blue-200";
      bgSecondaryColor = "bg-blue-400";
      break;
    case "review":
    case "review required":
      bgColor = "bg-yellow-50";
      textColor = "text-yellow-700";
      borderColor = "border-yellow-200";
      bgSecondaryColor = "bg-yellow-400";
      break;
    case "completed":
      bgColor = "bg-green-50";
      textColor = "text-green-700";
      borderColor = "border-green-200";
      bgSecondaryColor = "bg-green-400";
      break;
    case "overdue":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-200";
      bgSecondaryColor = "bg-red-400";
      break;
    case "blocked":
      bgColor = "bg-red-50";
      textColor = "text-red-700";
      borderColor = "border-red-200";
      bgSecondaryColor = "bg-red-400";
      break;
    default:
      bgColor = "bg-blue-50";
      textColor = "text-blue-700";
      borderColor = "border-blue-200";
      bgSecondaryColor = "bg-blue-400";
      break;
  }

  return { bgColor, textColor, borderColor, bgSecondaryColor };
};

export const getStatusIcon = (state) => {
  switch (state) {
    case "Open":
      return <Circle size={16} className="text-gray-600" />;
    case "Pending":
      return <Watch size={16} className="text-blue-600" />;
    case "Review":
    case "Review Required":
      return <View size={16} className="text-yellow-600" />;
    case "Completed":
      return <CheckCircle size={16} className="text-green-600" />;
    case "Overdue":
      return <AlertTriangle size={16} className="text-red-600" />;
    case "Blocked":
      return <XCircle size={16} className="text-red-600" />;
    default:
      return <Circle size={16} className="text-blue-600" />;
  }
};
