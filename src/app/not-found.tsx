import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16 transition-colors duration-200">
      <div className="max-w-lg text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-50 text-[#22844c] ring-1 ring-emerald-200/80 dark:bg-[#16271c] dark:text-[#94d5a5] dark:ring-[#94d5a5]/20">
          <BookOpen className="size-8" aria-hidden="true" />
        </span>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
          404 Error
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          This page is missing from our shelves
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          The page you are looking for may have been moved, removed, or never
          existed. Let&apos;s get you back to the books.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#22844c] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1a6e3e] active:scale-[0.98] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5] sm:w-auto"
          >
            <Home className="size-4" aria-hidden="true" />
            Back to Home
          </Link>
          <Link
            href="/books"
            className="inline-flex w-full items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-100 active:scale-[0.98] dark:border-white/5 dark:bg-[#111c15] dark:text-zinc-300 dark:hover:bg-[#16271c] dark:hover:text-white sm:w-auto"
          >
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
