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
import { useGetUserbyName } from "@/query/userQuery";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import UserBadge from "./user-badge";

const UserCommandList = ({
  users,
  selectedValue,
  handleSelect,
  isLoading,
  search,
  setSearch,
}) => (
  <Command className="border-0">
    <CommandInput
      placeholder="Search by name"
      value={search}
      onValueChange={setSearch}
      autoFocus
    />
    <CommandList>
      <CommandEmpty>
        {isLoading ? "Loading..." : "No user found"}
      </CommandEmpty>
      <CommandGroup>
        {users.map((user) => (
          <CommandItem
            key={user.value}
            onSelect={() => handleSelect(user.value)}
            className="flex items-center justify-between"
            value={`${user.label.toLowerCase()} ${user.email.toLowerCase()}`}
          >
            <UserBadge
              name={user.label}
              email={user.email}
              avatar={user.avatar}
            />
            <Check
              className={cn(
                "ml-2 h-4 w-4 flex-shrink-0",
                selectedValue === user.value ? "opacity-100" : "opacity-0",
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

export default function UserSelect({
  defaultValue,
  onValueChange = () => {},
  className,
  isFilter = false,
  buttonText = "Select User",
  returnFullObject = false,
  id = "",
}) {
  const [open, setOpen] = useState(isFilter);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedUserData, setSelectedUserData] = useState(null);
  const debouncedSearch = useDebounce(search, 500);
  const popoverId = `user-popover-${id}`;
  const commandId = `user-command-${id}`;

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const { data, isLoading } = useGetUserbyName({
    searchTerm: debouncedSearch,
  });

  const users = useMemo(() => {
    if (!data) return [];
    return data.map((user) => ({
      value: user.UserId,
      label: user.UserName,
      email: user.email || "",
    }));
  }, [data]);

  useEffect(() => {
    const foundUser = users.find((user) => user.value === selectedValue);
    if (foundUser) {
      setSelectedUserData(foundUser);
    }
  }, [users, selectedValue]);

  const handleSelect = (value) => {
    const selectedUser = users.find((user) => user.value === value);
    setSelectedValue(value);

    if (returnFullObject && selectedUser) {
      onValueChange({
        id: selectedUser.value,
        name: selectedUser.label,
        email: selectedUser.email,
      });
    } else {
      onValueChange(value);
    }

    if (!isFilter) {
      setOpen(false);
    }
  };

  if (isFilter) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-md border">
          <UserCommandList
            users={users}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen} id={popoverId}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-controls={commandId}
            className={cn(
              "w-full justify-between text-left font-normal",
              !selectedValue && "text-muted-foreground",
              className,
            )}
          >
            {selectedUserData ? (
              <div className="flex items-center truncate">
                <span className="me-1 font-medium">
                  {selectedUserData.label}
                </span>
                {selectedUserData.email && (
                  <span className="text-muted-foreground truncate text-xs">
                    {"("}
                    {selectedUserData.email}
                    {")"}
                  </span>
                )}
              </div>
            ) : (
              buttonText
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" id={commandId}>
          <UserCommandList
            users={users}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}