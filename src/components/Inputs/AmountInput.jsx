import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IndianRupee } from "lucide-react";
import React from "react";

export default function AmountInput({
  placeholder,
  min,
  max,
  className,
  disabled,
  ...field
}) {
  const [rawValue, setRawValue] = React.useState(
    field.value ? String(field.value) : "",
  );

  React.useEffect(() => {
    if (typeof field.value !== "undefined" && field.value !== rawValue) {
      setRawValue(field.value ? String(field.value) : "");
    }
  }, [field.value]);

  const formatIndian = (num) => {
    if (!num) return "";
    return Number(num).toLocaleString("en-IN");
  };

  const handleChange = (e) => {
    const digits = e.target.value.replace(/\D/g, ""); // only numbers
    setRawValue(digits);

    if (field.onChange) {
      field.onChange({
        ...e,
        target: {
          ...e.target,
          value: digits, // pass raw digits to form
          name: field.name,
        },
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
    }
    if (field.onKeyDown) field.onKeyDown(e);
  };

  return (
    <div className="focus-within:ring-primary flex items-center gap-2 rounded-md border bg-white px-2 focus-within:ring-1">
      <div className="border-r pr-2">
        <IndianRupee className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        min={min}
        max={max}
        className={cn(
          "no-spinners border-0 px-0 focus-visible:ring-0",
          className,
        )}
        // disabled={disabled}
        value={formatIndian(rawValue)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        name={field.name}
        id={field.name}
        autoComplete="off"
      />
    </div>
  );
}
