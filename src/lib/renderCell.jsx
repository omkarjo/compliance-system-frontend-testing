import UserBadge from "@/components/includes/user-badge";
import {
  currencyFormatter,
  getCountryDetails,
  getPhoneDetails,
} from "@/lib/formatter";
import { File } from "lucide-react";
import { Link } from "react-router-dom";

export const renderCell = (key, label, type, icon, data) => {
  if (!data) return null;
  const value = data[key];
  if (!value && value !== false) return null;

  if (type === "file" && !value.length) return null;

  const renderLabel = () => (
    <td className="mb-4 flex items-center gap-2 text-gray-500">
      {/* {icon && icon} */}
      {label}:
    </td>
  );

  switch (type) {
    case "date":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">
            {new Date(value).toLocaleDateString("EN-IN")}
          </td>
        </tr>
      );

    case "currency":
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="pb-4">{currencyFormatter(value)}</td>
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
                  <File size={20} className="text-gray-500" />
                  <span className="text-blue-600/60 hover:underline">
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
                <span className="text-sm font-medium">{formatted}</span>
              ) : (
                <span className="text-red-500">{value}</span>
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
                <span className="text-sm font-medium">{name}</span>
              ) : (
                <span className="text-red-500">{value}</span>
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
            <span className="text-sm break-words whitespace-pre-line">
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
          <td className="pb-4">{value ? "Yes" : "No"}</td>
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
            <Link to={`#`} className="text-blue-600/60 hover:underline">
              {value}
            </Link>
          </td>
        </tr>
      );

    default:
      return (
        <tr key={key}>
          {renderLabel()}
          <td className="max-w-1/2 pb-4 break-words">{value}</td>
        </tr>
      );
  }
};
