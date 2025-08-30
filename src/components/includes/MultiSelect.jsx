import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";

export function MultiSelect({
  field,
  formField,
  isSubmitting,
  disabledFields,
  specialProps,
}) {
  const [open, setOpen] = useState(false);
  console.log(specialProps  );

  const toggleOption = (val) => {
    const selected = new Set(field.value ?? []);
    if (selected.has(val)) {
      if ((formField?.min ?? 0) >= selected.size) return;
      selected.delete(val);
    } else {
      if ((formField?.max ?? Infinity) <= selected.size) return;
      selected.add(val);
    }
    field.onChange(Array.from(selected));
  };

  const options = useMemo(() => {
    return specialProps?.options || formField?.options || [];
  }, [specialProps, formField]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={
            isSubmitting ||
            formField?.disabled ||
            disabledFields?.includes(field.name)
          }
        >
          {field.value?.length ? (
            <div className="flex flex-wrap gap-1">
              {field.value.map((val) => {
                const opt = formField?.options?.find((o) => o.value === val);
                return (
                  <Badge key={val} variant="secondary" className="rounded-md">
                    {opt?.label ?? val}
                  </Badge>
                );
              })}
            </div>
          ) : (
            <span className="text-muted-foreground">
              {formField?.placeholder || "Select options"}
            </span>
          )}
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandGroup>
              {options && options.length > 0 ? (
                options.map((option) => {
                  const selected = field.value?.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })
              ) : (
                <CommandItem disabled>No options available</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
