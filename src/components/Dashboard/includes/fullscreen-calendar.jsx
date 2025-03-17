import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react";
import * as React from "react";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

// Dummy data for tasks
const data = [
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "SEBI",
    compliance_task_id: "6acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-14T20:21:13.762787Z",
    deadline: "2025-03-04T23:59:59Z",
    dependent_task_id: null,
    description:
      "Libero ipsum velit aut. Rerum voluptas cumque dolores molestiae id aliquam. Dolorem voluptatem ipsum sed omnis.",
    recurrence: "Monthly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "Open",
    updated_at: "2025-03-14",
    name: "Task 1",
  },
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "Finance",
    compliance_task_id: "7acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-15T20:21:13.762787Z",
    deadline: "2025-03-15T23:59:59Z",
    dependent_task_id: null,
    description:
      "Doloremque voluptatem ipsum sed omnis. Rerum voluptas cumque dolores molestiae id aliquam.",
    recurrence: "Weekly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "In Progress",
    updated_at: "2025-03-17",
    name: "Task 2",
  },
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "Finance",
    compliance_task_id: "7acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-15T20:21:13.762787Z",
    deadline: "2025-03-15T23:59:59Z",
    dependent_task_id: null,
    description:
      "Doloremque voluptatem ipsum sed omnis. Rerum voluptas cumque dolores molestiae id aliquam.",
    recurrence: "Weekly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "In Progress",
    updated_at: "2025-03-17",
    name: "Task 2",
  },
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "Finance",
    compliance_task_id: "7acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-15T20:21:13.762787Z",
    deadline: "2025-03-15T23:59:59Z",
    dependent_task_id: null,
    description:
      "Doloremque voluptatem ipsum sed omnis. Rerum voluptas cumque dolores molestiae id aliquam.",
    recurrence: "Weekly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "In Progress",
    updated_at: "2025-03-17",
    name: "Task 2",
  },
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "Finance",
    compliance_task_id: "7acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-15T20:21:13.762787Z",
    deadline: "2025-03-15T23:59:59Z",
    dependent_task_id: null,
    description:
      "Doloremque voluptatem ipsum sed omnis. Rerum voluptas cumque dolores molestiae id aliquam.",
    recurrence: "Weekly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "In Progress",
    updated_at: "2025-03-17",
    name: "Task 2",
  },
  {
    approver_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    assignee_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    category: "Finance",
    compliance_task_id: "7acad3a8-36af-4f66-bad7-f205ef781a99",
    created_at: "2025-03-15T20:21:13.762787Z",
    deadline: "2025-03-15T23:59:59Z",
    dependent_task_id: null,
    description:
      "Doloremque voluptatem ipsum sed omnis. Rerum voluptas cumque dolores molestiae id aliquam.",
    recurrence: "Weekly",
    reviewer_id: "21cc867b-fbac-4e52-918d-bd8df8491c79",
    state: "In Progress",
    updated_at: "2025-03-17",
    name: "Task 2",
  },
];

export function FullScreenCalendar() {

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  );

  const defaultViewMode = localStorage.getItem("viewMode-calendar") || "month";

  const [viewMode, setViewMode] = React.useState(defaultViewMode);
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Get days for month view
  const monthDays = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  // Get days for week view - centered around selected day
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDay),
    end: endOfWeek(selectedDay),
  });

  // Use appropriate days based on view mode
  const days = viewMode === "month" ? monthDays : weekDays;

  function previousPeriod() {
    if (viewMode === "month") {
      const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
      setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
    } else {
      const prevWeekDay = add(selectedDay, { weeks: -1 });
      setSelectedDay(prevWeekDay);
    }
  }

  function nextPeriod() {
    if (viewMode === "month") {
      const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
      setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    } else {
      const nextWeekDay = add(selectedDay, { weeks: 1 });
      setSelectedDay(nextWeekDay);
    }
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
  }

  // Define the date range text for the header
  const dateRangeText = viewMode === "month" 
    ? `${format(firstDayCurrentMonth, "MMM d, yyyy")} - ${format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}`
    : `${format(weekDays[0], "MMM d, yyyy")} - ${format(weekDays[6], "MMM d, yyyy")}`;

  // Animation variants for view transitions
  const calendarVariants = {
    initial: { 
      opacity: 0,
      y: 20,
    },
    animate: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "month" ? "week" : "month");
    localStorage.setItem("viewMode-calendar", viewMode === "month" ? "week" : "month");
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="bg-muted hidden w-20 flex-col items-center justify-center rounded-lg border p-0.5 md:flex">
              <h1 className="text-muted-foreground p-1 text-xs uppercase">
                {format(today, "MMM")}
              </h1>
              <div className="bg-background flex w-full items-center justify-center rounded-lg border p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-foreground text-lg font-semibold">
                {viewMode === "month" 
                  ? format(firstDayCurrentMonth, "MMMM, yyyy")
                  : `Week of ${format(weekDays[0], "MMMM d, yyyy")}`}
              </h2>
              <p className="text-muted-foreground text-sm">
                {dateRangeText}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Label htmlFor="viewMode" className="flex items-center gap-2">
              <span className="capitalize">{viewMode}</span>
              
                <Switch
                  id="viewMode"
                  checked={viewMode === "month"}
                  onCheckedChange={toggleViewMode}
                />
            </Label>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <Separator orientation="vertical" className="hidden h-6 lg:block" />

          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousPeriod}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label={`Navigate to previous ${viewMode}`}
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextPeriod}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label={`Navigate to next ${viewMode}`}
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs leading-6 font-semibold lg:flex-none">
          <div className="border-r py-2.5">Sun</div>
          <div className="border-r py-2.5">Mon</div>
          <div className="border-r py-2.5">Tue</div>
          <div className="border-r py-2.5">Wed</div>
          <div className="border-r py-2.5">Thu</div>
          <div className="border-r py-2.5">Fri</div>
          <div className="py-2.5">Sat</div>
        </div>

        {/* Calendar Days with Animation */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <AnimatePresence mode="wait">
            <motion.div 
              key={viewMode}
              variants={calendarVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
            >
              {/* Desktop View */}
              <div className={cn("hidden w-full border-x lg:grid lg:grid-cols-7", {
                "grid-rows-5": viewMode === "month",
                "grid-rows-1": viewMode === "week",
              })}>
                {days.map((day, dayIdx) => (
                  <div
                    key={day.toString() + dayIdx}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      dayIdx === 0 && colStartClasses[getDay(day)],
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "bg-accent/50 text-muted-foreground",
                      "hover:bg-muted relative flex flex-col border-r border-b focus:z-10",
                      !isEqual(day, selectedDay) && "hover:bg-accent/75",
                      // Adjust the height based on the view mode
                      viewMode === "week" ? "" : "",
                    )}
                  >
                    <header className="flex items-center justify-between p-2.5">
                      <button
                        type="button"
                        className={cn(
                          isEqual(day, selectedDay) && "text-primary-foreground",
                          !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            isSameMonth(day, firstDayCurrentMonth) &&
                            "text-foreground",
                          !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            !isSameMonth(day, firstDayCurrentMonth) &&
                            "text-muted-foreground",
                          isEqual(day, selectedDay) &&
                            isToday(day) &&
                            "bg-primary border-none",
                          isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            "bg-foreground",
                          (isEqual(day, selectedDay) || isToday(day)) &&
                            "font-semibold",
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs hover:border",
                        )}
                      >
                        <time dateTime={format(day, "yyyy-MM-dd")}>
                          {format(day, "d")}
                        </time>
                      </button>
                    </header>
                    <div className="flex-1 p-2.5">
                      {data
                        .filter((task) =>
                          isSameDay(new Date(task.deadline), new Date(day)),
                        )
                        .map((task) => (
                          <HoverCard key={task.compliance_task_id}>
                            <HoverCardTrigger>
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className={cn("my-1 bg-muted/50 flex flex-col items-start gap-1 rounded-lg border p-2 text-xs leading-tight", {
                                  "my-2": viewMode === "week",
                                })}
                              >
                                <p className="leading-none font-medium">
                                  {task.name}
                                </p>
                              </motion.div>
                            </HoverCardTrigger>
                            <HoverCardContent
                              className="z-50 w-64 rounded-lg border bg-white p-4 shadow-lg"
                              side="top"
                              align="center"
                            >
                              <p className="font-semibold">{task.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {task.description}
                              </p>
                              <p className="text-xs">
                                <strong>Category:</strong> {task.category}
                              </p>
                              <p className="text-xs">
                                <strong>State:</strong> {task.state}
                              </p>
                              <p className="text-xs">
                                <strong>Recurrence:</strong> {task.recurrence}
                              </p>
                              <p className="text-xs">
                                <strong>Deadline:</strong>{" "}
                                {format(new Date(task.deadline), "MMM d, yyyy")}
                              </p>
                            </HoverCardContent>
                          </HoverCard>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile View */}
              <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
                {days.map((day, dayIdx) => (
                  <button
                    onClick={() => setSelectedDay(day)}
                    key={day.toString() + dayIdx}
                    type="button"
                    className={cn(
                      isEqual(day, selectedDay) && "text-primary-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-muted-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "hover:bg-muted flex h-14 flex-col border-r border-b px-3 py-2 focus:z-10",
                      // Adjust height for week view
                      viewMode === "week" ? "h-24" : "h-14",
                    )}
                  >
                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={cn(
                        "ml-auto flex size-6 items-center justify-center rounded-full",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-primary text-primary-foreground",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </time>
                    {/* Task indicators */}
                    {data
                      .filter((task) => isSameDay(new Date(task.deadline), new Date(day)))
                      .map((task) => (
                        <motion.span
                          key={task.compliance_task_id}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          className="bg-muted-foreground mx-0.5 mt-1 h-1.5 w-1.5 rounded-full"
                        />
                      ))}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}