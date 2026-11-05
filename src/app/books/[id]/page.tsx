import * as React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { BorrowButton } from "@/components/borrow-button";
import { auth } from "@/lib/auth";
import { getBookById } from "@/lib/api";
import { getAvailableCopies, getTotalCopies } from "@/lib/books";
import {
  ArrowLeft,
  Star,
  Calendar,
  ShieldCheck,
  HeartHandshake,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface BookDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: BookDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return { title: "Book Not Found" };
  }

  return {
    title: book.title,
    description:
      book.description ||
      `Borrow ${book.title} by ${book.author} from a neighbour on BookNook.`,
  };
}

export default async function BookDetailsPage({ params }: BookDetailsProps) {
  const { id } = await params;

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/books/${id}`)}`);
  }

  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const ownerName = book.userName?.trim() || "A BookNook neighbour";
  const ownerInitial = ownerName.charAt(0).toUpperCase();
  const copies = getAvailableCopies(book);
  const totalCopies = getTotalCopies(book);
  const isAvailable = copies > 0;

  return (
    <div className="py-10 lg:py-16 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Back navigation */}
        <Link
          href="/books"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 hover:text-[#22844c] dark:text-zinc-400 dark:hover:text-[#94d5a5] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to All Books</span>
        </Link>

        {/* Book Details Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg dark:shadow-2xl">
          {/* Book Cover */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="aspect-2/3 w-full max-w-sm relative rounded-xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-[#16231b]">
              <Image
                src={book.image}
                alt={book.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                priority
                className="object-cover object-center"
                unoptimized={book.image.startsWith("http")}
              />
            </div>

            {/* Status Badge */}
            <div
              className={`mt-5 flex w-full max-w-sm items-center justify-between gap-3 rounded-lg border p-3 text-xs ${
                isAvailable
                  ? "border-emerald-200/80 bg-emerald-50 text-[#1b6b3e] dark:border-[#94d5a5]/20 dark:bg-[#142318] dark:text-[#86efac]"
                  : "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
              }`}
            >
              <span className="flex items-center gap-1.5 font-semibold">
                {isAvailable ? (
                  <CheckCircle className="h-4 w-4 text-[#22844c] dark:text-[#86efac]" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {isAvailable ? "Available for Borrowing" : "Not Available"}
              </span>
              <span className="text-right text-zinc-500 dark:text-zinc-400">
                {isAvailable
                  ? `${copies} of ${totalCopies} ${
                      totalCopies === 1 ? "copy" : "copies"
                    } available`
                  : "All copies are currently borrowed"}
              </span>
            </div>
          </div>

          {/* Book Information */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-50 text-[#1b6b3e] border border-emerald-200/80 dark:bg-[#16291c] dark:text-[#86efac] dark:border-[#86efac]/20">
                  {book.category}
                </span>
                {book.rating && (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded border border-amber-200 dark:border-amber-500/20 font-medium">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                    {book.rating}
                  </span>
                )}
                {book.publishedYear && (
                  <span className="inline-flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded">
                    <Calendar className="w-3.5 h-3.5" />
                    {book.publishedYear}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                {book.title}
              </h1>
              <p className="mt-2 text-base sm:text-lg text-[#1b6b3e] dark:text-[#94d5a5] font-medium">
                by {book.author}
              </p>

              {/* Synopsis */}
              <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-white/5">
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  About this Book
                </h3>
                <p className="mt-2 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {book.description ||
                    "This treasured title is available from a community member in your neighbourhood. Borrowing helps reduce waste, fosters local connection, and gives stories endless new life."}
                </p>
              </div>

              {/* Added by */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/5 dark:bg-[#111c15]">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#1b6b3e] ring-1 ring-zinc-200 dark:bg-[#1c2f22] dark:text-[#94d5a5] dark:ring-white/10">
                  {ownerInitial}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Added by
                  </p>
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {ownerName}
                  </p>
                  {book.userEmail ? (
                    <a
                      href={`mailto:${book.userEmail}`}
                      className="mt-0.5 inline-flex max-w-full items-center gap-1 truncate text-xs text-zinc-500 transition-colors hover:text-[#22844c] dark:text-zinc-400 dark:hover:text-[#94d5a5]"
                    >
                      <Mail className="size-3 shrink-0" />
                      <span className="truncate">{book.userEmail}</span>
                    </a>
                  ) : (
                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      Shared with the community
                    </p>
                  )}
                </div>
              </div>

              {/* Borrowing Highlights */}
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#111c15] border border-zinc-200 dark:border-white/5 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22844c] dark:text-[#94d5a5]" />
                  <span>Free Community Loan</span>
                </div>
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-[#111c15] border border-zinc-200 dark:border-white/5 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#22844c] dark:text-[#94d5a5]" />
                  <span>Porch or Cafe Handoff</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 flex flex-col sm:flex-row gap-3">
              <BorrowButton
                bookId={book._id}
                bookTitle={book.title}
                copies={copies}
              />
              <Link
                href="/books"
                className="py-3 px-6 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 dark:bg-[#142319] dark:hover:bg-[#1a2f22] dark:border-[#94d5a5]/30 dark:text-[#94d5a5] font-semibold text-sm transition-all active:scale-[0.98] text-center"
              >
                Browse More
              </Link>
            </div>
          </div> 
        </div>
      </div>
    </div>
  );
}
