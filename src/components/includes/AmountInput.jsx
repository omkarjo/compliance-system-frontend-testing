import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { IndianRupee } from "lucide-react"
import React from "react"

export function AmountInput({
  placeholder,
  min,
  max,
  className,
  disabled,
  ...field
}) {
  const [internalValue, setInternalValue] = React.useState(
    field.value ? String(field.value) : ""
  )

  React.useEffect(() => {
    // update local state if value changes from outside
    if (
      typeof field.value !== "undefined" &&
      field.value !== internalValue.replace(/,/g, "")
    ) {
      setInternalValue(field.value ? String(field.value) : "")
    }
  }, [field.value])

  // Format the value with commas for UI
  const formattedValue = React.useMemo(() => {
    const num = internalValue.replace(/,/g, "")
    if (num === "") return ""
    return Number(num).toLocaleString("en-IN")
  }, [internalValue])

  // Handle input change (only digits)
  const handleChange = e => {
    const raw = e.target.value.replace(/,/g, "")
    if (/^\d*$/.test(raw)) {
      setInternalValue(raw)
      if (field.onChange) {
        field.onChange({
          ...e,
          target: {
            ...e.target,
            value: raw,
            name: field.name,
          },
        })
      }
    }
  }

  // Prevent arrow key increments
  const handleKeyDown = e => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
    }
    if (field.onKeyDown) {
      field.onKeyDown(e)
    }
  }

  return (
    <div className="flex items-center rounded-md border px-2 bg-white focus-within:ring-1 focus-within:ring-primary gap-2">
      <IndianRupee className="w-5 h-5 text-gray-400" />
      <Input
        type="text"
        inputMode="numeric"
        pattern="\d*"
        placeholder={placeholder}
        min={min}
        max={max}
        className={cn(
          "no-spinners border-0 focus-visible:ring-0 px-0",
          className,
        )}
        disabled={disabled}
        value={formattedValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        name={field.name}
        id={field.name}
        autoComplete="off"
      />
    </div>
  )
}