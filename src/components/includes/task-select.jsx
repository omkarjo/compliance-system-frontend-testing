import { Badge } from "@/components/ui/badge";
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
import { fastapiDateFormatter } from "@/lib/formatter";
import { getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { useSearchTask } from "@/query/taskQuery";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function TaskSelectBadge({ task = {}, className }) {
  const style = getStatusStyle(task?.state);
  const { bgColor, textColor, borderColor } = style;

  return (
    <div className={cn("flex items-center justify-between gap-1", className)}>
      <div className="max-w-xs truncate text-sm font-medium">
        {task.description}
      </div>
      <Badge className={cn("border text-xs", textColor, bgColor, borderColor)}>
        {task.state}
      </Badge>
    </div>
  );
}

const TaskCommandList = ({
  tasks,
  selectedValue,
  handleSelect,
  isLoading,
  search,
  setSearch,
}) => (
  <Command className="border-0">
    <CommandInput
      placeholder="Search task..."
      value={search}
      onValueChange={setSearch}
      autoFocus
    />
    <CommandList>
      <CommandEmpty>{isLoading ? "Loading..." : "No task found"}</CommandEmpty>
      <CommandGroup>
        {tasks.map((task) => (
          <CommandItem
            key={task.value}
            onSelect={() => handleSelect(task.value)}
            className="my-0.5 flex items-center justify-between"
            value={`${task.label.toLowerCase()} ${task.id?.toLowerCase()}`}
          >
            <TaskSelectBadge
              task={task.original}
              className="max-w-[calc(100%-1.5rem)]"
            />{" "}
            <Check
              className={cn(
                "ml-2 h-4 w-4 flex-shrink-0",
                selectedValue === task.value ? "opacity-100" : "opacity-0",
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

export default function TaskSelect({
  defaultValue,
  onValueChange = () => {},
  className,
  isFilter = false,
  buttonText = "Select Task",
  returnFullObject = false,
  start_date = null,
  end_date = null,
  id = "",
}) {

  console.log("TaskSelect", { start_date, end_date });
  const [open, setOpen] = useState(isFilter);
  const [search, setSearch] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const debouncedSearch = useDebounce(search, 500);
  const popoverId = `task-popover-${id}`;
  const commandId = `task-command-${id}`;

  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  const { data, isLoading } = useSearchTask({
    searchTerm: debouncedSearch,
    filters: [
      ...(start_date
        ? [
            {
              filterid: "start_date",
              optionid: fastapiDateFormatter(start_date),
            },
          ]
        : []),
      ...(end_date
        ? [
            {
              filterid: "end_date",
              optionid: fastapiDateFormatter(end_date),
            },
          ]
        : []),
    ],
  });

  const tasks = useMemo(() => {
    if (!data?.data) return [];
    return data?.data.map((task) => ({
      value: task.compliance_task_id,
      label: task.description,
      id: task.compliance_task_id,
      original: task,
    }));
  }, [data]);

  useEffect(() => {
    const foundTask = tasks.find((task) => task.value === selectedValue);
    if (foundTask) {
      setSelectedTaskData(foundTask);
    }
  }, [tasks, selectedValue]);

  const handleSelect = (value) => {
    const selectedTask = tasks.find((task) => task.value === value);
    setSelectedValue(value);

    if (returnFullObject && selectedTask) {
      onValueChange({
        id: selectedTask.id,
        value: selectedTask.value,
        label: selectedTask.label,
        original: selectedTask.original,
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
          <TaskCommandList
            tasks={tasks}
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
            {selectedTaskData ? (
              <TaskSelectBadge
                task={selectedTaskData.original}
                className="max-w-[calc(100%-1.5rem)]"
              />
            ) : (
              buttonText
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" id={commandId}>
          <TaskCommandList
            tasks={tasks}
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
