import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getAllBooks } from "@/lib/api";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "Browse physical books shared by readers in your neighbourhood.",
};

interface BooksPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category || "All";
  const books = await getAllBooks(
    currentCategory !== "All" ? currentCategory : undefined
  );

  const categories = [
    "All",
    "Fiction",
    "Science",
    "History",
    "Kids",
    "Others",
  ];

  return (
    <div className="py-12 lg:py-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
            BookNook Collection
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            All Available Books
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Browse physical copies shared by fellow readers. Pick what sparks your curiosity and request to borrow it today.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive =
              (cat === "All" && !resolvedParams.category) ||
              resolvedParams.category === cat;
            return (
              <Link
                key={cat}
                href={
                  cat === "All"
                    ? "/books"
                    : `/books?category=${encodeURIComponent(cat)}`
                }
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#22844c] text-white dark:bg-[#94d5a5] dark:text-[#0a1910] shadow-sm font-semibold"
                    : "bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 border border-zinc-200 dark:bg-[#111c15] dark:text-zinc-300 dark:hover:text-white dark:hover:bg-[#16271c] dark:border-white/5"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 max-w-lg mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-[#22844c] dark:text-[#94d5a5] mx-auto opacity-40 mb-3" />
            <h3 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
              No books found
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              No titles available under this category yet.
            </p>
            <Link
              href="/books"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-[#22844c] text-white dark:bg-[#94d5a5] dark:text-[#0a1910] text-xs font-semibold"
            >
              Clear Filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="group rounded-xl overflow-hidden bg-white dark:bg-[#111914] border border-zinc-200 dark:border-white/5 hover:border-[#22844c]/40 dark:hover:border-[#94d5a5]/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:shadow-none flex flex-col"
              >
                <div className="aspect-2/3 relative w-full overflow-hidden bg-zinc-100 dark:bg-[#16231b]">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    unoptimized={book.image.startsWith("http")}
                  />
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3 bg-white dark:bg-[#111914] transition-colors">
                  <div className="space-y-1">
                    <div className="mb-1.5">
                      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-[#1b6b3e] border border-emerald-200/80 dark:bg-[#16271c] dark:text-[#86efac] dark:border-[#86efac]/20">
                        {book.category || "General"}
                      </span>
                    </div>
                    <h3
                      className="font-serif font-semibold text-zinc-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors"
                      title={book.title}
                    >
                      {book.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      by {book.author}
                    </p>
                  </div>

                  <Link
                    href={`/books/${book._id}`}
                    className="mt-1 w-full inline-flex items-center justify-center py-2 px-3 rounded-lg bg-[#22844c] hover:bg-[#1a6e3e] text-white dark:bg-[#94d5a5] dark:hover:bg-[#a6e2b5] dark:text-[#0a1910] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.98]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
