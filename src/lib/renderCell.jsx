import UserBadge from "@/components/common/includes/UserBadge";
import {
  currencyFormatter,
  getCountryDetails,
  getPhoneDetails,
} from "@/lib/formatter";
import { File } from "lucide-react";
import { Link } from "react-router-dom";

export const renderCell = (key, label, type, icon, data) => {
  const renderLabel = () => (
    <td className="mb-4 flex items-center gap-2 text-muted-foreground">
      {/* {icon && icon} */}
      {label}:
    </td>
  );

  if (!data) return null;
  const value = data[key];
  if (!value && value !== false)
    return (
      <tr key={key}>
        <td className="mb-4 flex items-center gap-2 text-muted-foreground">
          {renderLabel()}
        </td>
        <td className="pb-4 text-foreground">--</td>
      </tr>
    );

  if (type === "file" && !value.length) return null;

  switch (type) {
    case "date":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4 text-foreground">
            {new Date(value).toLocaleDateString("EN-IN")}
          </td>
        </tr>
      );

    case "currency":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4 text-foreground">{currencyFormatter(value)}</td>
        </tr>
      );

    case "file":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            {Array.isArray(value) &&
              value.map((file, index) => (
                <Link
                  key={index}
                  to={file.drive_link || "#"}
                  className="my-1 flex items-center gap-2"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <File size={20} className="text-muted-foreground" />
                  <span className="text-primary hover:underline">
                    {file.name}
                  </span>
                </Link>
              ))}
          </td>
        </tr>
      );

    case "phone": {
      const { formatted, flag: phoneFlag } = getPhoneDetails(value);
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            <span className="flex items-center gap-2">
              {/* {phoneFlag} */}
              {formatted ? (
                <span className="text-sm font-medium text-foreground">{formatted}</span>
              ) : (
                <span className="text-destructive">{value}</span>
              )}
            </span>
          </td>
        </tr>
      );
    }
    case "country": {
      const { name, flag: countryFlag } = getCountryDetails(value);
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            <span className="flex items-center gap-2">
              {/* {countryFlag} */}
              {name ? (
                <span className="text-sm font-medium text-foreground">{name}</span>
              ) : (
                <span className="text-destructive">{value}</span>
              )}
            </span>
          </td>
        </tr>
      );
    }

    case "textarea":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            <span className="text-sm text-foreground break-words whitespace-pre-line">
              {/* {typeof value === "string"
                ? value
                    .split(/(.{20})/)
                    .filter(Boolean)
                    .join("\n")
                : value} */}
              {value}
            </span>
          </td>
        </tr>
      );

    case "boolean":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4 text-foreground">{value ? "Yes" : "No"}</td>
        </tr>
      );

    case "user":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-2">
            <UserBadge name={value} className="justify-start" />
          </td>
        </tr>
      );

    case "link":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            <Link to={`#`} className="text-primary hover:underline">
              {value}
            </Link>
          </td>
        </tr>
      );

    default:
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="max-w-1/2 pb-4 text-foreground break-words">{value}</td>
        </tr>
      );
  }
};
