"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Library, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

import type { Borrow } from "@/types/borrow";
import { getMyBorrows, returnBook } from "@/lib/api";

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function MyBorrowsTable() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userEmail = session?.user?.email ?? "";
  const [borrows, setBorrows] = React.useState<Borrow[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [returningId, setReturningId] = React.useState<string | null>(null);

 React.useEffect(() => {
   let isMounted = true;

   if (isPending || !userEmail) {
     return;
   }

   const fetchBorrows = async () => {
     try {
       const { data, error } = await authClient.token();

       if (error || !data?.token) {
         throw new Error("Could not get authentication token.");
       }

       const borrowsData = await getMyBorrows(userEmail, data.token);

       if (isMounted) {
         setBorrows(borrowsData);
       }
     } catch (err) {
       if (isMounted) {
         setError(
           err instanceof Error
             ? err.message
             : "Could not load your borrows. Please try again.",
         );
       }
     } finally {
       if (isMounted) {
         setIsLoading(false);
       }
     }
   };

   fetchBorrows();

   return () => {
     isMounted = false;
   };
 }, [reloadKey, userEmail, session?.session?.token, isPending]);

  const activeError =
    error ??
    (!isPending && !userEmail
      ? "Your session could not be loaded. Please sign in again."
      : null);
  const showLoading = isLoading || isPending;

  function handleRetry() {
    setError(null);
    setIsLoading(true);
    setReloadKey((key) => key + 1);
  }

 async function handleReturn(borrow: Borrow) {
   if (returningId) return;

   setReturningId(borrow._id);

   try {
     // Get JWT token from Better Auth
     const { data, error } = await authClient.token();

     if (error || !data?.token) {
       throw new Error("Authentication failed. Please sign in again.");
     }

     // Return book using JWT
     await returnBook(borrow._id, data.token);

     const returnedAt = new Date().toISOString();

     setBorrows((current) =>
       current.map((item) =>
         item._id === borrow._id
           ? {
               ...item,
               status: "returned",
               returnDate: returnedAt,
             }
           : item,
       ),
     );

     toast.add({
       type: "success",
       title: "Book returned",
       description: `“${borrow.bookTitle}” is back with its owner.`,
     });

     router.refresh();
   } catch (err) {
     toast.add({
       type: "error",
       title: "Could not return book",
       description:
         err instanceof Error
           ? err.message
           : "Something went wrong. Please try again.",
     });
   } finally {
     setReturningId(null);
   }
 }

  const hasBorrows = borrows.length > 0;

  return (
    <div className="py-12 lg:py-16 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
            Reading History
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            My Borrows
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Every book you have borrowed from the community, with its borrow and
            return dates.
          </p>
        </div>

        {showLoading ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <div className="space-y-4 p-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-16 w-12 animate-pulse rounded bg-zinc-100 dark:bg-[#16231b]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                    <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                  </div>
                  <div className="h-8 w-24 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                </div>
              ))}
            </div>
          </div>
        ) : activeError ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <Library className="mx-auto mb-3 size-12 text-[#22844c] opacity-40 dark:text-[#94d5a5]" />
            <h2 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
              Could not load your borrows
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {activeError}
            </p>
            <Button
              type="button"
              onClick={handleRetry}
              className="mt-5 bg-[#22844c] text-white hover:bg-[#1a6e3e] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
            >
              Try again
            </Button>
          </div>
        ) : !hasBorrows ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <BookOpen className="mx-auto mb-3 size-12 text-[#22844c] opacity-40 dark:text-[#94d5a5]" />
            <h2 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
              Nothing borrowed yet
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Borrow a book from the community and it will show up here with its
              dates.
            </p>
            <Link
              href="/books"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#22844c] px-4 py-2 text-sm font-semibold text-white dark:bg-[#94d5a5] dark:text-[#0a1910]"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/80 dark:bg-[#111c15]">
                  <TableHead className="w-20 pl-4">Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Borrow Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead className="pr-4 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrows.map((borrow) => {
                  const isReturned = borrow.status === "returned";
                  const isReturning = returningId === borrow._id;

                  return (
                    <TableRow key={borrow._id}>
                      <TableCell className="py-3 pl-4">
                        <div className="relative h-16 w-12 overflow-hidden rounded border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-[#16231b]">
                          {borrow.bookImage ? (
                            <Image
                              src={borrow.bookImage}
                              alt={borrow.bookTitle}
                              fill
                              sizes="48px"
                              className="object-cover object-center"
                              unoptimized={borrow.bookImage.startsWith("http")}
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-zinc-400">
                              <BookOpen className="size-4" />
                            </span>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="min-w-48 whitespace-normal">
                        <Link
                          href={`/books/${borrow.bookId}`}
                          className="font-serif font-semibold text-zinc-900 transition-colors hover:text-[#22844c] dark:text-white dark:hover:text-[#94d5a5]"
                        >
                          {borrow.bookTitle || "Untitled book"}
                        </Link>
                        <p className="mt-1">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                              isReturned
                                ? "bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400"
                                : "bg-emerald-50 text-[#1b6b3e] dark:bg-[#16271c] dark:text-[#86efac]"
                            }`}
                          >
                            {isReturned ? "Returned" : "Borrowed"}
                          </span>
                        </p>
                      </TableCell>

                      <TableCell className="text-zinc-600 dark:text-zinc-300">
                        {formatDate(borrow.borrowDate)}
                      </TableCell>

                      <TableCell className="text-zinc-600 dark:text-zinc-300">
                        {formatDate(borrow.returnDate)}
                      </TableCell>

                      <TableCell className="pr-4 text-right">
                        {isReturned ? (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            Completed
                          </span>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => void handleReturn(borrow)}
                            disabled={isReturning}
                            className="border-[#22844c]/30 text-[#1b6b3e] hover:bg-emerald-50 dark:border-[#94d5a5]/30 dark:text-[#94d5a5] dark:hover:bg-[#142319]"
                          >
                            {isReturning ? (
                              <>
                                <Loader2 className="animate-spin" />
                                Returning...
                              </>
                            ) : (
                              <>
                                <RotateCcw />
                                Return Book
                              </>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
