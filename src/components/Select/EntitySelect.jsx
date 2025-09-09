"use client"

import { useState, useEffect, useMemo } from "react"
import useDebounce from "@/hooks/useDebounce"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSearchEntities } from "@/react-query/query/Entities/useGetEntities"

function EntityBadge({ entity, className }) {
  return (
    <div className={cn("flex items-center justify-between gap-1", className)}>
      <div className="truncate text-sm font-medium">{entity.entity_name}</div>
      <Badge variant="secondary" className="text-xs">{entity.entity_type}</Badge>
    </div>
  )
}

function EntityCommandList({
  entities,
  selectedValue,
  handleSelect,
  isLoading,
  search,
  setSearch,
}) {
  return (
    <Command className="border-0">
      <CommandInput
        placeholder="Search entity..."
        value={search}
        onValueChange={setSearch}
        autoFocus
      />
      <CommandList>
        <CommandEmpty>{isLoading ? "Loading..." : "No entity found"}</CommandEmpty>
        <CommandGroup>
          {entities.map((entity) => (
            <CommandItem
              key={entity.value}
              onSelect={() => handleSelect(entity.value)}
              className="my-0.5 flex items-center justify-between"
              value={entity.label.toLowerCase()}
            >
              <EntityBadge entity={entity.original} className="max-w-[calc(100%-1.5rem)]" />
              <Check
                className={cn(
                  "ml-2 h-4 w-4 flex-shrink-0",
                  selectedValue === entity.value ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

export default function EntitySelect({
  defaultValue,
  onValueChange = () => {},
  className,
  isFilter = false,
  buttonText = "Select Entity",
  returnFullObject = false,
  id = "",
}) {
  const [open, setOpen] = useState(isFilter)
  const [search, setSearch] = useState("")
  const [selectedValue, setSelectedValue] = useState("")
  const [selectedEntity, setSelectedEntity] = useState(null)

  const debouncedSearch = useDebounce(search, 300)
  const popoverId = `entity-popover-${id}`
  const commandId = `entity-command-${id}`

  const { data, isLoading } = useSearchEntities(debouncedSearch)

  const entities = useMemo(() => {
    if (!data) return []
    return data.map((entity) => ({
      value: entity.entity_id,
      label: entity.entity_name,
      original: entity,
    }))
  }, [data])

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue)
    }
  }, [defaultValue])

  useEffect(() => {
    const found = entities.find((e) => e.value === selectedValue)
    if (found) setSelectedEntity(found)
  }, [entities, selectedValue])

  const handleSelect = (value) => {
    const selected = entities.find((e) => e.value === value)
    setSelectedValue(value)

    if (returnFullObject && selected) {
      onValueChange({
        id: selected.value,
        value: selected.value,
        label: selected.label,
        original: selected.original,
      })
    } else {
      onValueChange(value)
    }

    if (!isFilter) setOpen(false)
  }

  if (isFilter) {
    return (
      <div className={cn("w-full", className)}>
        <div className="rounded-md border">
          <EntityCommandList
            entities={entities}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
          />
        </div>
      </div>
    )
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
              className
            )}
          >
            {selectedEntity ? (
              <EntityBadge entity={selectedEntity.original} className="max-w-[calc(100%-1.5rem)]" />
            ) : (
              buttonText
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" id={commandId}>
          <EntityCommandList
            entities={entities}
            selectedValue={selectedValue}
            handleSelect={handleSelect}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
