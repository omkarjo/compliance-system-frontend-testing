import { Loader2 } from "lucide-react";

export default function Loading() {
  const title = "Loading...";
  const message = "Please wait while we fetch the data.";
  return (
    <div className="relative flex h-screen flex-col pb-24 items-center justify-center bg-background px-4 text-center text-foreground">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 animate-pulse opacity-10">
        {/* <AlertTriangle className="absolute -top-10 -left-10 h-96 w-96 text-red-400 dark:text-red-500 blur-3xl" /> */}
        {/* <AlertTriangle className="absolute right-0 bottom-10 h-80 w-80 text-yellow-300 dark:text-yellow-500 blur-2xl" /> */}
      </div>

      {/* Icon */}
      <Loader2 className="mb-6 h-16 w-16 text-green-500 dark:text-green-400 drop-shadow-lg animate-spin" />

      {/* Title */}
      <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-sm">
        {title}
      </h1>

      {/* Message */}
      <p className="mt-2 max-w-md text-sm text-muted-foreground ">{message}</p>

      {/* Optional Action */}
    </div>
  );
}
