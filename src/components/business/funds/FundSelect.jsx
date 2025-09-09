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
import { useGetFunds } from "@/react-query/query/Funds/useGetFunds";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

const FundCommandList = ({
  funds,
  selectedValue,
  handleSelect,
  isLoading,
  search,
  setSearch,
}) => (
  <Command className="border-0">
    <CommandInput
      placeholder="Search by scheme or AIF name"
      value={search}
      onValueChange={setSearch}
      autoFocus
    />
    <CommandList>
      <CommandEmpty>{isLoading ? "Loading..." : "No fund found"}</CommandEmpty>
      <CommandGroup>
        {funds.map((fund) => (
          <CommandItem
            key={fund.value}
            onSelect={() => handleSelect(fund.value)}
            className="flex items-center justify-between"
            value={`${fund.label.toLowerCase()} ${fund.aif.toLowerCase()}`}
          >
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium">{fund.label}</span>
              <span className="text-muted-foreground truncate text-xs">
                {fund.aif} - {fund.legal_structure}
              </span>
            </div>
            <Check
              className={cn(
                "ml-2 h-4 w-4 flex-shrink-0",
                selectedValue === fund.value ? "opacity-100" : "opacity-0",
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

export default function FundSelect({
  name,
  defaultValue,
  onValueChange = () => {},
  className,
  isFilter = false,
  buttonText = "Select Fund",
  returnFullObject = false,
  id = "",
}) {
  const [open, setOpen] = useState(isFilter);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedFundData, setSelectedFundData] = useState(null);
  const debouncedSearch = useDebounce(search, 500);
  const popoverId = `fund-popover-${id}`;
  const commandId = `fund-command-${id}`;

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const { data, isLoading } = useGetFunds({
    search: debouncedSearch,
    pageIndex: 0,
    pageSize: 1000,
  });

  const funds = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((fund) => ({
      value: String(fund.fund_id),
      label: fund.scheme_name,
      aif: fund.aif_name,
      legal_structure: fund.legal_structure,
      scheme_status: fund.scheme_status,
    }));
  }, [data]);

  useEffect(() => {
    const foundFund = funds.find((f) => f.value === selectedValue);
    if (foundFund) {
      setSelectedFundData(foundFund);
    }
  }, [funds, selectedValue]);

  const handleSelect = (value) => {
    const selectedFund = funds.find((f) => f.value === value);
    setSelectedValue(value);

    if (returnFullObject && selectedFund) {
      onValueChange({
        id: selectedFund.value,
        name: selectedFund.label,
        aif: selectedFund.aif,
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
          <FundCommandList
            funds={funds}
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
              "w-full justify-between text-left font-normal bg-transparent hover:bg-accent hover:text-accent-foreground dark:bg-transparent",
              !selectedValue && "text-muted-foreground",
              className,
            )}
          >
            {selectedFundData ? (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium">
                  {selectedFundData.label}
                </span>
                {/* <span className="text-muted-foreground truncate text-xs">
                  {selectedFundData.aif}
                </span> */}
              </div>
            ) : (
              buttonText
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          id={commandId}
        >
          <FundCommandList
            funds={funds}
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
