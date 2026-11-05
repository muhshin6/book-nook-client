import * as React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="py-12 lg:py-20 transition-colors duration-200">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5"
            aria-label="BookNook home"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#22844c] text-white shadow-sm transition-transform duration-200 group-hover:scale-105 dark:bg-[#94d5a5] dark:text-[#0a1910]">
              <BookOpen className="size-4.5 stroke-[2.2]" />
            </span>
            <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900 transition-colors group-hover:text-[#22844c] dark:text-white dark:group-hover:text-[#94d5a5]">
              BookNook
            </span>
          </Link>

          <h1 className="mt-7 font-serif text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-lg sm:p-8 dark:border-white/5 dark:bg-[#0e1712] dark:shadow-2xl">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
