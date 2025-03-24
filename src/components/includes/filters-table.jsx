import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ListFilter, User, X } from "lucide-react";
import { motion } from "motion/react";
import { nanoid } from "nanoid";
import * as React from "react";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import UserSelect from "./user-select";
import { format } from "date-fns";

const AnimateChangeInHeight = ({ children, className }) => {
  const containerRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: 0.1, damping: 0.2, ease: "easeIn" }}
    >
      <div ref={containerRef}>{children}</div>
    </motion.div>
  );
};

const FilterComponent = ({
  filterOptions,
  setFilters: setFiltersProps,
  setSearchOptions,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef(null);
  const [filters, setFilters] = useState([]);
  const [selectedRelation, setSelectedRelation] = useState({});
  const [dateRange, setDateRange] = useState(null);

  const handleFilterSelect = useCallback(
    (filterId) => {
      const filter = filterOptions.find((opt) => opt.id === filterId);
      if (!filter) return;
      
      setSelectedFilter(filter);

      if (filter.type === "date_range" || filter.type === "user_select") {
        setOpen(true);
      } else {
        if (filter.relation?.length > 0) {
          setSelectedRelation((prev) => ({
            ...prev,
            [filterId]: filter.relation[0],
          }));
        }
        setCommandInput("");
        commandInputRef.current?.focus();
      }
    },
    [filterOptions],
  );

  useEffect(() => {
    if (setSearchOptions && selectedFilter) {
      setSearchOptions({
        filterId: selectedFilter.id,
        search: commandInput,
      });
    }
  }, [setSearchOptions, selectedFilter, commandInput]);

  const handleOptionSelect = useCallback((option) => {
    if (!selectedFilter) return;
    
    const existingFilter = filters.find(
      (filter) =>
        filter.filterId === selectedFilter.id &&
        filter.optionId === option.id,
    );

    if (existingFilter) {
      setSelectedFilter(null);
      setCommandInput("");
      setOpen(false);
      return;
    }

    const newFilter = {
      id: nanoid(),
      filterId: selectedFilter.id,
      filterName: selectedFilter.name,
      filterIcon: selectedFilter.icon || <User />,
      relation:
        selectedRelation[selectedFilter.id] ||
        (selectedFilter.relation && selectedFilter.relation[0]),
      optionId: option.id,
      optionLabel: option.label,
      optionIcon: option.icon,
    };

    const filterProps = {
      filterid: selectedFilter.id,
      optionid: option.id,
    };
    
    setFiltersProps((prev) => [...prev, filterProps]);
    setFilters((prev) => [...prev, newFilter]);
    setSelectedFilter(null);
    setCommandInput("");
    setOpen(false);
  }, [selectedFilter, filters, selectedRelation, setFiltersProps]);

  const handleUserSelect = useCallback((userData) => {
    if (!selectedFilter || !userData) return;
    
    const newFilter = {
      id: nanoid(),
      filterId: selectedFilter.id,
      filterName: selectedFilter.name,
      filterIcon: selectedFilter.icon || <User />,
      optionId: userData.id,
      optionLabel: userData.name,
      optionIcon: null,
      filterType: "user_select",
      userData: userData,
    };

    setFiltersProps((prev) => [
      ...prev,
      {
        filterid: selectedFilter.id,
        optionid: userData.id,
        optionData: userData,
      },
    ]);

    setFilters((prev) => [...prev, newFilter]);
    setOpen(false);
    setSelectedFilter(null);
  }, [selectedFilter, setFiltersProps]);

  const handleDateRangeSelect = useCallback((range) => {
    if (!range?.from || !range?.to || !selectedFilter) return;
    
    const newFilter = {
      id: nanoid(),
      filterId: selectedFilter.id,
      filterName: selectedFilter.name,
      filterIcon: selectedFilter.icon || <User />,
      relation: null,
      optionId: null,
      optionLabel: `From: ${format(range.from, "dd/MM/yyyy")} To: ${format(range.to, "dd/MM/yyyy")}`,
      optionIcon: null,
      filterType: "date_range",
    };

    setFiltersProps((prev) => [
      ...prev,
      {
        filterid: "start_date",
        optionid: range.from.toLocaleDateString("en-CA"),
      },
      {
        filterid: "end_date",
        optionid: range.to.toLocaleDateString("en-CA"),
      },
    ]);

    setFilters((prev) => [...prev, newFilter]);
    setOpen(false);
    setSelectedFilter(null);
    setDateRange(null);
  }, [selectedFilter, setFiltersProps]);

  const handleRelationChange = useCallback((filterId, relation) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, relation } : filter,
      ),
    );
  }, []);

  const removeFilter = useCallback((filterId) => {
    const filterToRemove = filters.find((filter) => filter.id === filterId);
    if (!filterToRemove) return;
    
    setFilters((prev) => prev.filter((filter) => filter.id !== filterId));

    if (filterToRemove.filterType === "date_range") {
      setFiltersProps((prev) =>
        prev.filter(
          (filter) =>
            filter.filterid !== "start_date" &&
            filter.filterid !== "end_date",
        ),
      );
    } else {
      setFiltersProps((prev) =>
        prev.filter(
          (filter) =>
            !(
              filter.filterid === filterToRemove.filterId &&
              filter.optionid === filterToRemove.optionId
            ),
        ),
      );
    }
  }, [filters, setFiltersProps]);

  const clearAllFilters = useCallback(() => {
    setFilters([]);
    setFiltersProps([]);
  }, [setFiltersProps]);

  const generateFilterFields = useCallback(
    (filter) => {
      switch (filter.type) {
        case "component":
          return (
            <CommandItem
              key={`filter-component-${filter.id}`}
              value={filter.id}
              onSelect={() => handleFilterSelect(filter.id)}
            >
              {filter.icon ? 
                React.cloneElement(filter.icon, {
                  className: "size-3.5 me-2",
                }) : 
                <User className="size-3.5 me-2" />
              }
              {filter.name}
            </CommandItem>
          );
        case "divider":
          return <CommandSeparator key={`filter-divider-${filter.id}`} />;
        case "date_range":
        case "user_select":
          return (
            <CommandItem
              key={`filter-${filter.type}-${filter.id}`}
              value={filter.id}
              onSelect={() => handleFilterSelect(filter.id)}
            >
              {filter.icon ? 
                React.cloneElement(filter.icon, {
                  className: "size-3.5 me-2",
                }) : 
                <User className="size-3.5 me-2" />
              }
              {filter.name}
            </CommandItem>
          );
        default:
          return null;
      }
    },
    [handleFilterSelect],
  );

  const popoverCloseHandler = useCallback((open) => {
    setOpen(open);
    if (!open) {
      setTimeout(() => {
        setSelectedFilter(null);
        setCommandInput("");
        setDateRange(null);
      }, 200);
    }
  }, []);

  const renderFilterContent = useMemo(() => {
    if (selectedFilter?.type === "user_select") {
      return (
        <div className="p-2">
          <UserSelect 
            isFilter={true}
            returnFullObject={true}
            onValueChange={handleUserSelect} 
          />
        </div>
      );
    } 
    
    if (selectedFilter?.type === "date_range") {
      return (
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={(range) => {
            setDateRange(range);
            handleDateRangeSelect(range);
          }}
          initialFocus
        />
      );
    }
    
    return (
      <>
        <CommandInput
          placeholder={selectedFilter ? selectedFilter.name : "Filter..."}
          className="h-9"
          value={commandInput}
          onInputCapture={(e) => setCommandInput(e.currentTarget.value)}
          ref={commandInputRef}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {selectedFilter?.options?.map((option, index) => (
            <CommandItem
              key={`cm-item-${option.id}-${index}`}
              value={option.id}
              onSelect={() => handleOptionSelect(option)}
            >
              {option.icon ? 
                React.cloneElement(option.icon, {
                  className: "size-3.5 me-2",
                }) : 
                null
              }
              {option.label}
            </CommandItem>
          ))}

          {!selectedFilter &&
            filterOptions.map((filter) => generateFilterFields(filter))}
        </CommandList>
      </>
    );
  }, [
    selectedFilter, 
    dateRange, 
    commandInput, 
    handleUserSelect, 
    handleDateRangeSelect, 
    handleOptionSelect, 
    filterOptions, 
    generateFilterFields
  ]);

  return (
    <div className="flex justify-end gap-2">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="flex items-center gap-[1px] text-xs">
            <div className="bg-muted flex shrink-0 items-center gap-1.5 rounded-l px-1.5 py-1">
              {filter.filterIcon ? 
                React.cloneElement(filter.filterIcon, { className: "size-3.5" }) :
                <User className="size-3.5" />
              }
              {filter.filterName}
            </div>

            {filterOptions.find((opt) => opt.id === filter.filterId)?.relation?.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-muted hover:bg-muted/50 text-muted-foreground hover:text-primary shrink-0 px-1.5 py-1 transition">
                  {filter.relation}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-fit min-w-fit">
                  {filterOptions
                    .find((opt) => opt.id === filter.filterId)
                    ?.relation.map((rel) => (
                      <DropdownMenuItem
                        key={rel}
                        onClick={() => handleRelationChange(filter.id, rel)}
                      >
                        {rel}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div className="bg-muted text-muted-foreground flex shrink-0 items-center gap-1.5 rounded-none px-1.5 py-1">
              {filter.optionIcon ? 
                React.cloneElement(filter.optionIcon, { className: "size-3.5" }) : 
                null
              }
              {filter.optionLabel}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeFilter(filter.id)}
              className="bg-muted text-muted-foreground hover:text-primary hover:bg-muted/50 h-6 w-6 shrink-0 rounded-l-none rounded-r-sm transition"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </div>

      {filters.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="group h-6 items-center rounded-sm text-xs transition"
          onClick={clearAllFilters}
        >
          Clear
        </Button>
      )}

      <Popover open={open} onOpenChange={popoverCloseHandler}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className={cn(
              "group flex h-6 items-center gap-1.5 rounded-sm text-xs transition",
              filters.length > 0 && "w-8",
            )}
          >
            <ListFilter className="text-muted-foreground group-hover:text-primary size-4 shrink-0 transition-all" />
            {!filters.length && "Filter"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="me-2 w-[250px] p-0">
          <AnimateChangeInHeight>
            <Command>
              {renderFilterContent}
            </Command>
          </AnimateChangeInHeight>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterComponent;