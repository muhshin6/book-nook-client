"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Book } from "@/types/book";
import { getLatestBooks } from "@/lib/api";

interface NewArrivalsProps {
  initialBooks?: Book[];
}

export function NewArrivals({ initialBooks = [] }: NewArrivalsProps) {
  const [books, setBooks] = React.useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = React.useState(initialBooks.length === 0);
  const [imgErrors, setImgErrors] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    let isMounted = true;
    const fetchLatest = async () => {
      try {
        const data = await getLatestBooks(12);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setBooks(data);
        }
      } catch {
        // Express might be offline or slow; keep initialBooks or fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchLatest();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0a110e] text-zinc-900 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            New Arrivals
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            The latest books added by our readers.
          </p>
        </motion.div>

        {/* Dynamic Cards Grid */}
        <div className="mt-12">
          {isLoading && books.length === 0 ? (
            /* Loading Skeletons */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
            >
              {[...Array(10)].map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-xl overflow-hidden bg-zinc-100 dark:bg-[#111914] border border-zinc-200 dark:border-white/5 animate-pulse flex flex-col"
                >
                  <div className="aspect-2/3 bg-zinc-200 dark:bg-zinc-800/50 w-full" />
                  <div className="p-4 space-y-2.5">
                    <div className="h-4 w-14 bg-zinc-200 dark:bg-zinc-800/80 rounded" />
                    <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800/80 rounded" />
                    <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800/60 rounded" />
                    <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-800/80 rounded-lg mt-3" />
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5"
            >
              {books.slice(0, 10).map((book, idx) => {
                const hasImageError = imgErrors[book._id];
                return (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                    className="group rounded-xl overflow-hidden bg-white dark:bg-[#111914] border border-zinc-200 dark:border-white/5 hover:border-[#22844c]/40 dark:hover:border-[#94d5a5]/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl dark:shadow-none flex flex-col"
                  >
                    {/* Book Cover Image */}
                    <div className="aspect-2/3 relative w-full overflow-hidden bg-zinc-100 dark:bg-[#16231b]">
                      {!hasImageError && book.image ? (
                        <Image
                          src={book.image}
                          alt={book.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          onError={() =>
                            setImgErrors((prev) => ({
                              ...prev,
                              [book._id]: true,
                            }))
                          }
                          unoptimized={book.image.startsWith("http")}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-zinc-100 dark:bg-[#15231b]">
                          <BookOpen className="w-8 h-8 text-[#22844c] dark:text-[#94d5a5] opacity-50 mb-2" />
                          <span className="text-xs font-serif font-semibold text-zinc-700 dark:text-zinc-300 line-clamp-2">
                            {book.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Book Details Content */}
                    <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between gap-3 bg-white dark:bg-[#111914] transition-colors">
                      <div className="space-y-1">
                        {/* Category Badge */}
                        <div className="mb-1.5">
                          <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-[#1b6b3e] border border-emerald-200/80 dark:bg-[#16271c] dark:text-[#86efac] dark:border-[#86efac]/20">
                            {book.category || "General"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          className="font-serif font-semibold text-zinc-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors"
                          title={book.title}
                        >
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          by {book.author}
                        </p>
                      </div>

                      {/* View Details Button */}
                      <Link
                        href={`/books/${book._id}`}
                        className="mt-1 w-full inline-flex items-center justify-center py-2 px-3 rounded-lg bg-[#22844c] hover:bg-[#1a6e3e] text-white dark:bg-[#94d5a5] dark:hover:bg-[#a6e2b5] dark:text-[#0a1910] text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-[0.98]"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>

        {/* See All Books Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/books"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-emerald-50/70 border border-zinc-300 hover:border-[#22844c] text-[#1b6b3e] shadow-sm dark:bg-[#142319] dark:hover:bg-[#1a2f22] dark:border-[#94d5a5]/30 dark:hover:border-[#94d5a5] dark:text-[#94d5a5] text-sm font-semibold transition-all duration-200 hover:shadow-md active:scale-[0.98] group"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
