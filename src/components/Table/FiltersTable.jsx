/**
 * FiltersTable.jsx
 *
 * Advanced filter controls for DataTable, compatible with modular DataTable.
 * Accepts `filterOptions`, and uses table state for filter management.
 */

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
import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import AnimateChangeInHeight from "./AnimateChangeInHeight";
import UserSelect from "@/components/Select/UserSelect";

/**
 * @param {{
 *   table: any, // React Table instance
 *   filterOptions: Array<{
 *     id: string,
 *     name: string,
 *     icon?: React.ReactNode,
 *     type?: string,
 *     relation?: string[],
 *     options?: Array<{id: string, label: string, icon?: React.ReactNode}>,
 *   }>,
 *   inline?: boolean, // Show filter chips inline
 *   buttonOnly?: boolean, // Show only the filter button
 * }} props
 */
const FiltersTable = ({ table, filterOptions, inline = false, buttonOnly = false }) => {
  // Use table state for filters
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [commandInput, setCommandInput] = useState("");
  const commandInputRef = useRef(null);
  const [selectedRelation, setSelectedRelation] = useState({});
  const [dateRange, setDateRange] = useState(null);

  // Get current filters from table state
  const filters = table.getState().columnFilters || [];
  const setFilters = table.setColumnFilters;

  const clearAllFilters = useCallback(() => {
    setFilters([]);
  }, [setFilters]);

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

  const handleOptionSelect = useCallback(
    (option) => {
      if (!selectedFilter) return;
      // Don't clear all filters - allow stacking
      setFilters((prev) => [
        ...prev,
        {
          filterid: selectedFilter.id,
          optionid: option.id,
        },
      ]);
      setSelectedFilter(null);
      setCommandInput("");
      setOpen(false);
    },
    [selectedFilter, setFilters],
  );

  const handleUserSelect = useCallback(
    (userData) => {
      if (!selectedFilter || !userData) return;
      // Don't clear all filters - allow stacking
      setFilters((prev) => [
        ...prev,
        {
          filterid: selectedFilter.id,
          optionid: userData.id,
          optionData: userData,
        },
      ]);
      setOpen(false);
      setSelectedFilter(null);
    },
    [selectedFilter, setFilters],
  );

  const handleDateRangeSelect = useCallback(
    (range) => {
      if (!range?.from || !range?.to || !selectedFilter) return;
      // Remove any existing date filters first, then add new ones
      setFilters((prev) => [
        ...prev.filter(f => f.filterid !== "start_date" && f.filterid !== "end_date"),
        {
          filterid: "start_date",
          optionid: range.from.toLocaleDateString("en-CA"),
        },
        {
          filterid: "end_date",
          optionid: range.to.toLocaleDateString("en-CA"),
        },
      ]);
      setOpen(false);
      setSelectedFilter(null);
      setDateRange(null);
    },
    [selectedFilter, setFilters],
  );

  const handleRelationChange = useCallback((filterId, relation) => {
    setSelectedRelation((prev) => ({
      ...prev,
      [filterId]: relation,
    }));
    // Could update filter if needed (if using relation in filter object)
  }, []);

  const removeFilter = useCallback(
    (filterObj) => {
      if (!filterObj) return;
      if (filterObj.filterid === "start_date" || filterObj.filterid === "end_date") {
        setFilters((prev) =>
          prev.filter(
            (filter) =>
              filter.filterid !== "start_date" && filter.filterid !== "end_date"
          )
        );
      } else {
        setFilters((prev) =>
          prev.filter(
            (filter) =>
              !(filter.filterid === filterObj.filterid && filter.optionid === filterObj.optionid)
          )
        );
      }
    },
    [setFilters],
  );

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
              {filter.icon ? (
                React.cloneElement(filter.icon, {
                  className: "size-3.5 me-2",
                })
              ) : (
                <User className="me-2 size-3.5" />
              )}
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
              {filter.icon ? (
                React.cloneElement(filter.icon, {
                  className: "size-3.5 me-2",
                })
              ) : (
                <User className="me-2 size-3.5" />
              )}
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
            buttonText="Select user"
          />
        </div>
      );
    }
    if (selectedFilter?.type === "date_range") {
      return (
        <Calendar
          mode="range"
          captionLayout="dropdown"
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
              {option.icon
                ? React.cloneElement(option.icon, {
                    className: "size-3.5 me-2",
                  })
                : null}
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
    generateFilterFields,
  ]);

  // Get rendered filter chips from table state
  const filterChips = useMemo(() => {
    // Group date filters together
    const dateFilters = filters.filter(f => f.filterid === "start_date" || f.filterid === "end_date");
    const otherFilters = filters.filter(f => f.filterid !== "start_date" && f.filterid !== "end_date");
    
    const chips = [];
    
    // Handle date range filter specially
    if (dateFilters.length > 0) {
      const startDate = dateFilters.find(f => f.filterid === "start_date");
      const endDate = dateFilters.find(f => f.filterid === "end_date");
      const dateRangeFilterDef = filterOptions.find(opt => opt.type === "date_range");
      
      if (dateRangeFilterDef && (startDate || endDate)) {
        chips.push(
          <div key="date-range" className={cn(
            "flex items-center gap-[1px] text-xs",
            inline && "bg-accent rounded-full"
          )}>
            <div className={cn(
              "flex shrink-0 items-center gap-1 px-2 py-0.5",
              inline 
                ? "bg-accent text-accent-foreground rounded-l-full h-6" 
                : "bg-muted rounded-l py-1"
            )}>
              {dateRangeFilterDef.icon
                ? React.cloneElement(dateRangeFilterDef.icon, { className: "size-3" })
                : <User className="size-3" />}
              <span className="text-xs font-medium">{dateRangeFilterDef.name}</span>
            </div>
            <div className={cn(
              "flex shrink-0 items-center gap-1 px-2 py-0.5 text-xs",
              inline 
                ? "bg-accent text-accent-foreground h-6" 
                : "bg-muted text-muted-foreground rounded-none py-1"
            )}>
              <span className="text-xs">
                {startDate && endDate 
                  ? `${startDate.optionid} - ${endDate.optionid}`
                  : startDate 
                    ? `From ${startDate.optionid}` 
                    : `Until ${endDate.optionid}`
                }
              </span>
            </div>
            <button
              onClick={() => removeFilter({ filterid: "start_date" })}
              className={cn(
                "shrink-0 transition flex items-center justify-center",
                inline 
                  ? "bg-accent hover:bg-accent/80 text-muted-foreground hover:text-accent-foreground w-5 h-6 rounded-r-full" 
                  : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted/50 h-6 w-6 rounded-l-none rounded-r-sm"
              )}
            >
              <X className="size-3" />
            </button>
          </div>
        );
      }
    }
    
    // Handle other filters
    otherFilters.forEach((filterObj, idx) => {
      const filterDef = filterOptions.find(opt => opt.id === filterObj.filterid);
      const optionDef = filterDef?.options?.find(opt => opt.id === filterObj.optionid);
      
      // Handle cases where filter definition is not found
      if (!filterDef) {
        console.warn(`Filter definition not found for filterid: ${filterObj.filterid}`);
        return;
      }
      
      chips.push(
        <div key={`filter-${idx}`} className={cn(
          "flex items-center gap-[1px] text-xs",
          inline && "bg-accent rounded-full"
        )}>
          <div className={cn(
            "flex shrink-0 items-center gap-1 px-2 py-0.5",
            inline 
              ? "bg-accent text-accent-foreground rounded-l-full h-6" 
              : "bg-muted rounded-l py-1"
          )}>
            {filterDef?.icon
              ? React.cloneElement(filterDef.icon, { className: "size-3" })
              : <User className="size-3" />}
            <span className="text-xs font-medium">{filterDef?.name}</span>
          </div>

          {filterDef?.relation?.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                "shrink-0 px-1.5 py-1 transition text-xs",
                inline 
                  ? "bg-accent text-muted-foreground hover:bg-accent/80" 
                  : "bg-muted hover:bg-muted/50 text-muted-foreground hover:text-primary"
              )}>
                {selectedRelation[filterDef.id] || filterDef.relation[0]}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-fit min-w-fit">
                {filterDef.relation.map((rel) => (
                  <DropdownMenuItem
                    key={rel}
                    onClick={() => handleRelationChange(filterDef.id, rel)}
                  >
                    {rel}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className={cn(
            "flex shrink-0 items-center gap-1 px-2 py-0.5 text-xs",
            inline 
              ? "bg-accent text-accent-foreground h-6" 
              : "bg-muted text-muted-foreground rounded-none py-1"
          )}>
            {optionDef?.icon
              ? React.cloneElement(optionDef.icon, {
                  className: "size-3",
                })
              : null}
            <span className="text-xs">{optionDef?.label || filterObj.optionid}</span>
          </div>

          <button
            onClick={() => removeFilter(filterObj)}
            className={cn(
              "shrink-0 transition flex items-center justify-center",
              inline 
                ? "bg-accent hover:bg-accent/80 text-muted-foreground hover:text-accent-foreground w-5 h-6 rounded-r-full" 
                : "bg-muted text-muted-foreground hover:text-primary hover:bg-muted/50 h-6 w-6 rounded-l-none rounded-r-sm"
            )}
          >
            <X className="size-3" />
          </button>
        </div>
      );
    });
    
    return chips;
  }, [filters, filterOptions, selectedRelation, handleRelationChange, removeFilter, inline]);

  // If inline mode, only show filter chips
  if (inline) {
    return (
      <div className="flex flex-wrap items-center gap-1">
        {filterChips}
        {filters.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground transition-colors text-xs ml-1"
            title="Clear all filters"
          >
            Clear
          </button>
        )}
      </div>
    );
  }

  // If buttonOnly mode, only show the filter button (no chips)
  if (buttonOnly) {
    return (
      <Popover open={open} onOpenChange={popoverCloseHandler}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            size="sm"
            className={cn(
              "group flex h-7 px-2 items-center gap-1 rounded-md text-xs transition-colors hover:bg-accent",
              filters.length > 0 && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
          >
            <ListFilter className="size-3.5 shrink-0 transition-all" />
            {filters.length > 0 ? `${filters.length}` : "Filter"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="end">
          <AnimateChangeInHeight>
            <Command>{renderFilterContent}</Command>
          </AnimateChangeInHeight>
        </PopoverContent>
      </Popover>
    );
  }

  // Default mode (original layout)
  return (
    <div className="flex justify-end gap-2">
      <div className="flex flex-wrap gap-2">
        {filterChips}
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
            <Command>{renderFilterContent}</Command>
          </AnimateChangeInHeight>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FiltersTable;