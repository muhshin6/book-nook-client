import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-16"
    >
      <Loader2
        aria-hidden="true"
        className="size-10 animate-spin text-[#22844c] dark:text-[#94d5a5]"
      />
      <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        Loading...
      </p>
    </div>
  );
}
