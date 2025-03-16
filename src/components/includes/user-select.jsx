"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
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
import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useGetUserbyName } from "@/query/userQuerry";
import { Check, ChevronsUpDown } from "lucide-react";
import { useMemo, useState } from "react";

export default function UserSelect({
  defaultValue,
  onValueChange = () => {},
  className,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedValue, setSelectedValue] = useState(defaultValue || "");

  const { data, isLoading } = useGetUserbyName({
    searchTerm: debouncedSearch,
  });

  const users = useMemo(() => {
    if (!data) return [];
    return data?.map((user) => ({
      value: user.UserId,
      label: user.UserName,
    }));
  }, [data]);

  return (
    <Popover open={open} onOpenChange={setOpen} className="">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedValue && "text-muted-foreground",
            className,
          )}
        >
          {selectedValue
            ? users.find((user) => user.value === selectedValue)?.label ||
              "Select User"
            : "Select User"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput
            placeholder="Search user..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Loading..." : "No user found"}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.value}
                  value={user.value}
                  onSelect={(currentValue) => {
                    setSelectedValue(currentValue);
                    console.log(currentValue);
                    onValueChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {user.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedValue === user.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
