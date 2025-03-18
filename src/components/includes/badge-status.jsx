import { Badge } from "@/components/ui/badge";
import { getStatusIcon, getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";

export default function BadgeStatusTask({
  type,
  text,
  className: classNameProp,
}) {
 
  const status = type || text;
  const { bgColor, textColor, borderColor } = getStatusStyle(status);
  const icon = getStatusIcon(status);

  return (
    <Badge
      className={cn(
        bgColor,
        textColor,
        borderColor,
        "flex items-center space-x-2 rounded p-2 opacity-80",
        classNameProp,
      )}
    >
      {icon}
      <span>{text}</span>
    </Badge>
  );
}