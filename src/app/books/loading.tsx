export default function BooksLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading books"
      className="py-12 lg:py-16 transition-colors duration-200"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto mb-10 max-w-2xl animate-pulse text-center">
          <div className="mx-auto h-3 w-36 rounded bg-zinc-200 dark:bg-white/5" />
          <div className="mx-auto mt-3 h-9 w-72 rounded bg-zinc-200 dark:bg-white/5" />
          <div className="mx-auto mt-3 h-3 w-full max-w-lg rounded bg-zinc-200 dark:bg-white/5" />
        </div>

        <div className="mb-12 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-9 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-white/5"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-white/5 dark:bg-[#111914]"
            >
              <div className="aspect-2/3 w-full animate-pulse bg-zinc-200 dark:bg-zinc-800/50" />
              <div className="space-y-2.5 p-4">
                <div className="h-4 w-14 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800/80" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800/80" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800/60" />
                <div className="mt-3 h-8 w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800/80" />
              </div>
            </div>
          ))}
        </div>

        <span className="sr-only">Loading books...</span>
      </div>
    </div>
  );
}
