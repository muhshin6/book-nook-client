import * as React from "react";
import Link from "next/link";
import {
  BookText,
  Sparkles,
  Compass,
  BookHeart,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    tagline: "Novels, dramas & heartwarming narratives",
    count: "240+ Books",
    icon: BookText,
    href: "/books?category=Fiction",
    color: "from-emerald-500/10 to-transparent",
  },
  {
    name: "Science",
    tagline: "Sci-Fi, fantasy & futuristic worlds",
    count: "180+ Books",
    icon: Sparkles,
    href: "/books?category=Science",
    color: "from-cyan-500/10 to-transparent",
  },
  {
    name: "History",
    tagline: "Gripping thrillers, whodunits & dark crimes",
    count: "140+ Books",
    icon: Compass,
    href: "/books?category=History",
    color: "from-purple-500/10 to-transparent",
  },
  {
    name: "Kids",
    tagline: "Children's books, picture books & young readers",
    count: "165+ Books",
    icon: BookHeart,
    href: "/books?category=Kids",
    color: "from-rose-500/10 to-transparent",
  },
  {
    name: "Other",
    tagline: "Explore our diverse collection of books",
    count: "100+ Books",
    icon: BookText,
    href: "/books?category=Others",
    color: "from-zinc-500/10 to-transparent",
  },
];

export function TopCategories() {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0a110e] text-zinc-900 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
              Curated Shelves
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Top Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl">
              Browse our neighborhood library by your favorite genre and stumble
              upon your next great read.
            </p>
          </div>
          <Link
            href="/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1b6b3e] dark:text-[#94d5a5] hover:text-[#22844c] dark:hover:text-[#a6e2b5] transition-colors group"
          >
            <span>Explore all categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <Link
                key={index}
                href={cat.href}
                className="group relative p-6 rounded-2xl bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 hover:border-[#22844c]/40 dark:hover:border-[#94d5a5]/30 shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Background accent glow */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#1b6b3e] dark:bg-[#16271c] dark:text-[#94d5a5] flex items-center justify-center border border-emerald-200/80 dark:border-[#94d5a5]/20 group-hover:scale-110 group-hover:bg-[#22844c] group-hover:text-white dark:group-hover:bg-[#94d5a5] dark:group-hover:text-[#0a1910] transition-all duration-300">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-zinc-900 dark:text-white group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-4 border-t border-zinc-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors">
                  <span>Browse titles</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
