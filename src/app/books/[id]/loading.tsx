export default function BookDetailsLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading book details"
      className="py-10 lg:py-16 transition-colors duration-200"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="mb-8 h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />

        <div className="grid grid-cols-1 gap-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg sm:p-8 md:grid-cols-12 lg:gap-12 lg:p-10 dark:border-white/5 dark:bg-[#0e1712] dark:shadow-2xl">
          <div className="flex flex-col items-center md:col-span-5">
            <div className="aspect-2/3 w-full max-w-sm animate-pulse rounded-xl bg-zinc-200 dark:bg-[#16231b]" />
            <div className="mt-5 h-14 w-full max-w-sm animate-pulse rounded-lg bg-zinc-100 dark:bg-white/5" />
          </div>

          <div className="space-y-4 md:col-span-7">
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
              <div className="h-6 w-16 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
            </div>
            <div className="h-10 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
            <div className="h-5 w-2/5 animate-pulse rounded bg-zinc-200 dark:bg-white/5" />
            <div className="space-y-2 pt-4">
              <div className="h-4 w-full animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
            </div>
            <div className="mt-6 h-20 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-white/5" />
            <div className="mt-8 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row dark:border-white/5">
              <div className="h-12 flex-1 animate-pulse rounded-xl bg-zinc-200 dark:bg-white/5" />
              <div className="h-12 w-36 animate-pulse rounded-xl bg-zinc-100 dark:bg-white/5" />
            </div>
          </div>
        </div>

        <span className="sr-only">Loading book details...</span>
      </div>
    </div>
  );
}
