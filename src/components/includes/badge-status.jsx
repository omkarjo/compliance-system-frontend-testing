import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CircleCheckBig,
  Construction,
  LockOpen,
  ShieldAlert,
  Siren,
  View,
  Watch,
} from "lucide-react";

const validStatus = {
  neutral: {
    className: "bg-sky-300 hover:bg-sky-300 border border-sky-300",
    icon: <Watch />,
  },
  info: {
    className: "bg-yellow-300 hover:bg-yellow-300 border border-yellow-300",
    icon: <View />,
  },
  sucess: {
    className: "bg-green-300 hover:bg-green-300 border border-green-300",
    icon: <CircleCheckBig />,
  },
  danger: {
    className: "bg-red-300 hover:bg-red-300 border border-red-300",
    icon: <Siren />,
  },
  // OPEN: {
  //   className: "bg-yellow-300 hover:bg-yellow-300 border border-yellow-300",
  //   icon: <LockOpen />,
  //   text: "Open",
  // },
  // BLOCK: {
  //   className: "bg-purple-300 hover:bg-purple-300 border border-purple-300",
  //   icon: <ShieldAlert />,
  //   text: "Blocked",
  // },
  // ERROR: {
  //   className: "bg-red-300 hover:bg-red-300 border border-red-200",
  //   icon: <Construction />,
  //   text: "Invalid",
  // },
};

export default function BadgeStatusTask({
  type,
  text,
  className: classNameProp,
}) {
  let custom_type = "info";
  switch (custom_type) {
    case "Open":
      custom_type = "neutral";
      break;
    case "Pending":
      custom_type = "info";
      break;
    case "Completed":
      custom_type = "sucess";
      break;
    case "Overdue":
      custom_type = "danger";
      break;
    case "Blocked":
      custom_type = "danger";
      break;
    default:
      custom_type = "info";
      break;
  }
  const Ftype = type || custom_type;
  const { className, icon } = validStatus[Ftype];

  if (!text) {
    return null;
  }

  return (
    <Badge
      className={cn(
        className,
        "flex items-center space-x-2 rounded p-2 text-black opacity-80",
        classNameProp,
      )}
    >
      {icon}
      <span>{text}</span>
    </Badge>
  );
}
