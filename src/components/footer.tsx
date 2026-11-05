import * as React from "react";
import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#f2f6f2] dark:bg-[#070e0a] border-t border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#22844c] dark:bg-[#94d5a5] flex items-center justify-center text-white dark:text-[#0a1910] shadow-sm">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                BookNook
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-sm">
              BookNook is a small online library, online. Connect with nearby
              readers, borrow beloved books for free, and give every paperback a
              second life.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-zinc-900 dark:text-white font-semibold mb-4 text-base">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  All Books
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-in"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Join Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-serif text-zinc-900 dark:text-white font-semibold mb-4 text-base">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/books?category=Fiction"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Fiction
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Science"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Science
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=History"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  History
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Kids"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  href="/books?category=Others"
                  className="hover:text-[#22844c] dark:hover:text-[#94d5a5] transition-colors"
                >
                  Others
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            © {new Date().getFullYear()} BookNook. Built for readers everywhere.
          </p>
          <p className="flex items-center gap-1">
            Crafted with{" "}
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for
            physical books
          </p>
        </div>
      </div>
    </footer>
  );
}
