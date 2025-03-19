import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getStatusStyle } from "@/lib/getStatusStyleIcon";
import { cn } from "@/lib/utils";
import { useGetTask } from "@/query/taskQuerry";
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
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircleIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TriangleAlert,
} from "lucide-react";
import * as React from "react";
import TaskAccordion from "../includes/accordion-task";
import TaskHoverCard from "../includes/card-hower-task";

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const MAX_TASKS_PER_DAY = 3;

export default function ViewCalendarTaskFM() {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = React.useState(today);
  const [currentMonth, setCurrentMonth] = React.useState(
    format(today, "MMM-yyyy"),
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const defaultViewMode =
    localStorage.getItem("viewMode-calendar") || (isDesktop ? "month" : "week");
  const [viewMode, setViewMode] = React.useState(defaultViewMode);
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const [selectedTask, setSelectedTask] = React.useState(null);

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
    setSelectedTask(null);
    if (viewMode === "month") {
      const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
      setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
    } else if (viewMode === "week") {
      const prevWeekDay = add(selectedDay, { weeks: -1 });
      setSelectedDay(prevWeekDay);
    } else if (viewMode === "day") {
      const prevDay = add(selectedDay, { days: -1 });
      setSelectedDay(prevDay);
    }
  }

  function nextPeriod() {
    setSelectedTask(null);
    if (viewMode === "month") {
      const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
      setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
    } else if (viewMode === "week") {
      const nextWeekDay = add(selectedDay, { weeks: 1 });
      setSelectedDay(nextWeekDay);
    } else if (viewMode === "day") {
      const nextDay = add(selectedDay, { days: 1 });
      setSelectedDay(nextDay);
    }
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    setSelectedDay(today);
    setSelectedTask(null);
  }

  // Define the date range text for the header
  const dateRangeText =
    viewMode === "month"
      ? `${format(firstDayCurrentMonth, "MMM d, yyyy")} - ${format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}`
      : viewMode === "week"
        ? `${format(weekDays[0], "MMM d, yyyy")} - ${format(weekDays[6], "MMM d, yyyy")}`
        : `${format(selectedDay, "EEEE, MMM d, yyyy")}`;

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
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Handle view mode change
  const handleViewModeChange = (value) => {
    setViewMode(value);
    localStorage.setItem("viewMode-calendar", value);
    setSelectedDay(today);
    setSelectedTask(null);
  };

  const getFilters = React.useCallback(() => {
    return [
      {
        filterid: "start_date",
        optionid: format(
          viewMode === "day"
            ? add(selectedDay, { days: -1 })
            : startOfWeek(
                viewMode === "week" ? selectedDay : firstDayCurrentMonth,
              ),
          "yyyy-MM-dd",
        ),
      },
      {
        filterid: "end_date",
        optionid: format(
          viewMode === "day"
            ? add(selectedDay, { days: 0 })
            : endOfWeek(
                viewMode === "week"
                  ? selectedDay
                  : endOfMonth(firstDayCurrentMonth),
              ),
          "yyyy-MM-dd",
        ),
      },
    ];
  }, [viewMode, selectedDay, firstDayCurrentMonth]);

  // Data fetching with React Query
  const {
    data: queryData,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetTask({
    filters: getFilters(),
    pageSize: 100,
    pageIndex: 0,
  });

  // Use the actual data when loaded, or empty array when loading
  const tasksData = React.useMemo(() => {
    return isLoading ? [] : queryData?.data || [];
  }, [isLoading, queryData]);

  // Get tasks for the selected day
  const dayViewTasks = React.useMemo(() => {
    return tasksData.filter((task) =>
      isSameDay(new Date(task.deadline), selectedDay),
    );
  }, [tasksData, selectedDay]);

  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (viewMode === "day") {
          setViewMode("week");
        } else if (viewMode === "week") {
          setViewMode("month");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewMode]);

  // Loading skeleton for day view
  const DayViewSkeleton = () => (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse space-y-2 rounded-md border p-4">
          <div className="h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="h-3 w-1/2 rounded bg-gray-200"></div>
          <div className="h-3 w-2/3 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );

  // Error component

  return (
    <div className="my-4 flex flex-1 flex-col">
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
                  : viewMode === "week"
                    ? `Week of ${format(weekDays[0], "MMMM d, yyyy")}`
                    : format(selectedDay, "MMMM d, yyyy")}
              </h2>
              <p className="text-muted-foreground text-sm">{dateRangeText}</p>
            </div>
          </div>
          <div className="mx-2 ml-auto flex items-center gap-4">
            <Select value={viewMode} onValueChange={handleViewModeChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
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

      {isError && (
        <ErrorDisplay refetch={refetch} error={error?.response?.data?.detail} />
      )}

      {/* Calendar Grid */}
      {!isError && (
        <div className="lg:flex lg:flex-auto lg:flex-col">
          {/* Week Days Header - Hide in Day View */}
          {viewMode !== "day" && (
            <div className="grid grid-cols-7 border text-center text-xs leading-6 font-semibold lg:flex-none">
              <div className="border-r py-2.5">Sun</div>
              <div className="border-r py-2.5">Mon</div>
              <div className="border-r py-2.5">Tue</div>
              <div className="border-r py-2.5">Wed</div>
              <div className="border-r py-2.5">Thu</div>
              <div className="border-r py-2.5">Fri</div>
              <div className="py-2.5">Sat</div>
            </div>
          )}

          {/* Calendar Views with Animation */}
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
                {/* DAY VIEW - FIXED */}
                {viewMode === "day" && (
                  <div className="flex h-full w-full flex-col rounded-md border">
                    <div className="bg-muted/30 flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        <span className="font-medium">
                          {format(selectedDay, "EEEE, MMMM d, yyyy")}
                        </span>
                      </div>
                      <div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-1 text-xs",
                            isToday(selectedDay)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted",
                          )}
                        >
                          {isToday(selectedDay) ? "Today" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Task List for Day View with loading state */}
                    <div
                      className="flex flex-col overflow-y-auto p-4"
                      style={{ maxHeight: "calc(100vh - 200px)" }}
                    >
                      {isLoading ? (
                        <DayViewSkeleton />
                      ) : dayViewTasks.length > 0 ? (
                        <div className="space-y-8">
                          {dayViewTasks.map((task) => (
                            <TaskAccordion
                              defaultOpen={
                                selectedTask?.compliance_task_id ===
                                task?.compliance_task_id
                              }
                              key={task.compliance_task_id}
                              data={task}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState viewMode="day" />
                      )}
                    </div>
                  </div>
                )}

                {/* MONTH & WEEK VIEW - Desktop */}
                {viewMode !== "day" && (
                  <div
                    className={cn(
                      "hidden w-full border-x lg:grid lg:grid-cols-7",
                      {
                        "grid-rows-5": viewMode === "month",
                        "grid-rows-1": viewMode === "week",
                      },
                    )}
                  >
                    {days.map((day, dayIdx) => (
                      <div
                        key={day.toString() + dayIdx}
                        onClick={() => {
                          setSelectedDay(day);
                          setSelectedTask(null);
                          setViewMode("day");
                        }}
                        className={cn(
                          "cursor-pointer",
                          dayIdx === 0 && colStartClasses[getDay(day)],
                          !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            !isSameMonth(day, firstDayCurrentMonth) &&
                            "bg-accent/50 text-muted-foreground",
                          "hover:bg-muted relative flex flex-col border-r border-b focus:z-10",
                          !isEqual(day, selectedDay) && "hover:bg-accent/75",
                        )}
                      >
                        <header className="flex items-center justify-between p-2.5">
                          <button
                            type="button"
                            className={cn(
                              isEqual(day, selectedDay) &&
                                "text-primary-foreground",
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
                          {isLoading ? (
                            // Show loading indicators in grid cells
                            <div className="flex animate-pulse flex-col space-y-1">
                              <div className="h-2 w-full rounded bg-gray-200"></div>
                              <div className="h-2 w-3/4 rounded bg-gray-200"></div>
                            </div>
                          ) : (
                            tasksData
                              .filter((task) =>
                                isSameDay(
                                  new Date(task.deadline),
                                  new Date(day),
                                ),
                              )
                              .map((task, idx, arr) => {
                                if (
                                  viewMode === "month" &&
                                  idx > MAX_TASKS_PER_DAY
                                ) {
                                  return null;
                                }

                                if (
                                  viewMode === "month" &&
                                  idx === MAX_TASKS_PER_DAY
                                ) {
                                  return (
                                    <div
                                      key={task.compliance_task_id}
                                      className="mt-1 flex items-center justify-start"
                                    >
                                      <span className="text-muted-foreground rounded-full px-2 py-0.5 text-sm font-semibold">
                                        +{arr.length - MAX_TASKS_PER_DAY}
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <TaskHoverCard
                                    key={task.compliance_task_id}
                                    task={task}
                                    onClick={() => {
                                      setSelectedDay(day);
                                      setSelectedTask(task);
                                      setViewMode("day");
                                    }}
                                  />
                                );
                              })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* MONTH & WEEK VIEW - Mobile */}
                {viewMode !== "day" && (
                  <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x lg:hidden">
                    {days.map((day, dayIdx) => {
                      const dayTasks = isLoading
                        ? []
                        : tasksData.filter((task) =>
                            isSameDay(new Date(task.deadline), new Date(day)),
                          );

                      const hasOverdueTasks = dayTasks.some(
                        (task) => task.state === "Overdue",
                      );

                      return (
                        <button
                          onClick={() => {
                            setSelectedDay(day);
                            setViewMode("day");
                            setSelectedTask(null);
                          }}
                          key={day.toString() + dayIdx}
                          type="button"
                          className={cn(
                            isEqual(day, selectedDay) &&
                              "text-primary-foreground",
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
                            "hover:bg-muted relative flex w-full flex-col border-r border-b px-2 py-1 focus:z-10",
                            viewMode === "week" ? "h-20" : "h-12",
                          )}
                        >
                          {hasOverdueTasks && (
                            <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-red-200" />
                          )}

                          <time
                            dateTime={format(day, "yyyy-MM-dd")}
                            className={cn(
                              "ml-auto flex size-5 items-center justify-center rounded-full text-sm",
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

                          {isLoading ? (
                            // Mobile loading indicator
                            <div className="mt-1 flex animate-pulse space-x-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                            </div>
                          ) : (
                            <>
                              {/* Task indicators with status colors */}
                              <div className="mt-1 flex flex-wrap justify-end gap-0.5">
                                {dayTasks.map((task, idx) => {
                                  const { bgSecondaryColor } = getStatusStyle(
                                    task.state,
                                  );

                                  const randomDuration =
                                    Math.floor(Math.random() * 2) + 1;

                                  return (
                                    <motion.span
                                      key={task.compliance_task_id}
                                      initial={{ scale: 0.8 }}
                                      animate={{ scale: 1.5 }}
                                      transition={{
                                        duration: randomDuration,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                      }}
                                      className={`${bgSecondaryColor} mx-0.5 mt-0.5 h-1.5 w-1.5 rounded-full`}
                                    />
                                  );
                                })}
                              </div>

                              {/* In week view, we have more space to show the first overdue task */}
                              {viewMode === "week" && hasOverdueTasks && (
                                <div className="mt-0.5 flex items-center text-xs text-red-600">
                                  <TriangleAlert size={8} className="mr-0.5" />
                                  <span className="truncate text-xs">
                                    Overdue
                                  </span>
                                </div>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}

const ErrorDisplay = (refetch, errorMessage) => (
  <div className="flex flex-col items-center justify-center rounded-lg bg-red-50 p-6 text-center md:p-8">
    <AlertCircleIcon className="mb-2 h-10 w-10 text-red-500" />
    <h3 className="mb-2 text-lg font-medium">Error loading tasks</h3>
    <p className="mb-4 text-sm text-gray-500">
      {errorMessage || "There was a problem fetching your tasks."}
    </p>
    <Button onClick={() => refetch()} variant="outline" size="sm">
      Try Again
    </Button>
  </div>
);

// Empty state component
const EmptyState = ({ viewMode }) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <CalendarIcon className="mb-2 h-10 w-10 text-gray-400" />
    <h3 className="mb-2 text-lg font-medium">No tasks scheduled</h3>
    <p className="text-sm text-gray-500">
      {viewMode === "day"
        ? "There are no tasks scheduled for this day."
        : "No tasks found for the selected time period."}
    </p>
  </div>
);
