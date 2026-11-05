import * as React from "react";
import { Search, Send, BookOpenCheck, Repeat2 } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Browse & Discover",
    description:
      "Explore curated shelves shared by neighbours right around your block. Filter by genre, author, or community recommendations.",
    icon: Search,
  },
  {
    step: "02",
    title: "Request a Copy",
    description:
      "Send a quick borrow request with a single tap. Coordinate a convenient porch handoff or neighborhood cafe meeting.",
    icon: Send,
  },
  {
    step: "03",
    title: "Read at Your Pace",
    description:
      "Enjoy the physical pages for up to 14 days with zero late fines. Track your lending period right in your dashboard.",
    icon: BookOpenCheck,
  },
  {
    step: "04",
    title: "Return or Pass Along",
    description:
      "Hand the book back with a personal note or pass it along to the next local reader in line. Keep good stories circulating.",
    icon: Repeat2,
  },
];

export function HowBorrowingWorks() {
  return (
    <section className="py-16 sm:py-24 bg-[#f6f9f6] dark:bg-[#070e0a] border-y border-zinc-200 dark:border-white/5 relative overflow-hidden transition-colors duration-200">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#22844c]/5 dark:bg-[#94d5a5]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
            Simple & Sustainable
          </span>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            How Borrowing Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            A friendly, zero-cost way to share physical books with fellow readers in your neighbourhood.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative p-6 rounded-2xl bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 hover:border-[#22844c]/40 dark:hover:border-[#94d5a5]/30 shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
              >
                {/* Step badge & icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-2xl font-bold text-[#22844c]/30 dark:text-[#94d5a5]/40 group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#1b6b3e] dark:bg-[#16271c] dark:text-[#94d5a5] flex items-center justify-center border border-emerald-200/80 dark:border-[#94d5a5]/20 group-hover:bg-[#22844c] group-hover:text-white dark:group-hover:bg-[#94d5a5] dark:group-hover:text-[#0a1910] transition-colors duration-300">
                      <Icon className="w-5 h-5 stroke-2" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom subtle progress line */}
                <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-white/5">
                  <div className="h-1 w-full bg-zinc-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#22844c] to-[#b87333] dark:from-[#94d5a5] dark:to-[#c88d5e] transition-all duration-500"
                      style={{ width: `${(index + 1) * 25}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
