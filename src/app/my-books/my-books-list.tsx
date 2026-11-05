"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookPlus,
  Copy,
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";

import type { Book } from "@/types/book";
import { EditBookDialog } from "./edit-book-dialog";
import { getMyBooks, deleteBook } from "@/lib/api";
import { getAvailableCopies, getTotalCopies } from "@/lib/books";

export function MyBooksList() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const userEmail = session?.user?.email ?? "";
  const [books, setBooks] = React.useState<Book[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);
  const [editingBook, setEditingBook] = React.useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    if (isPending || !userEmail) {
      return;
    }

    getMyBooks(userEmail, session?.session?.token)
      .then((data) => {
        if (isMounted) {
          setBooks(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your books. Please try again."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

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

  function handleSaved(updated: Book) {
    setBooks((current) =>
      current.map((book) => (book._id === updated._id ? updated : book))
    );
    router.refresh();
  }

  async function handleDelete() {
    if (!deletingBook || isDeleting) return;

    setIsDeleting(true);

    try {
      // Get JWT token from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Could not get authentication token.");
      }

      const token = data.token;

      // Delete book using JWT
      await deleteBook(deletingBook._id, token);

      setBooks((current) =>
        current.filter((book) => book._id !== deletingBook._id),
      );

      toast.add({
        type: "success",
        title: "Book deleted",
        description: `“${deletingBook.title}” has been removed from the shelf.`,
      });

      setDeletingBook(null);
      router.refresh();
    } catch (err) {
      toast.add({
        type: "error",
        title: "Could not delete book",
        description:
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="py-12 lg:py-16 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
              Your Shelf
            </span>
            <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
              My Books
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              Manage the titles you have shared. Edit details or remove a book
              from the community shelf.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#22844c] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#1a6e3e] active:scale-[0.98] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
          >
            <BookPlus className="size-4" />
            Add a Book
          </Link>
        </div>

        {showLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/5 dark:bg-[#0e1712]"
              >
                <div className="h-36 w-24 shrink-0 animate-pulse rounded-lg bg-zinc-100 dark:bg-[#16231b]" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-3 w-16 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                  <div className="h-3 w-2/5 animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                  <div className="h-8 w-full animate-pulse rounded bg-zinc-100 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : activeError ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <BookOpen className="mx-auto mb-3 size-12 text-[#22844c] opacity-40 dark:text-[#94d5a5]" />
            <h2 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
              Could not load your books
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
        ) : books.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/5 dark:bg-[#0e1712]">
            <BookOpen className="mx-auto mb-3 size-12 text-[#22844c] opacity-40 dark:text-[#94d5a5]" />
            <h2 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
              No books yet
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Books you add to the community shelf will appear here so you can
              edit or delete them.
            </p>
            <Link
              href="/add-book"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#22844c] px-4 py-2 text-sm font-semibold text-white dark:bg-[#94d5a5] dark:text-[#0a1910]"
            >
              <BookPlus className="size-4" />
              Add your first book
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const copies = getAvailableCopies(book);
              const totalCopies = getTotalCopies(book);

              return (
                <article
                  key={book._id}
                  className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#22844c]/40 hover:shadow-lg dark:border-white/5 dark:bg-[#0e1712] dark:shadow-none dark:hover:border-[#94d5a5]/30"
                >
                  <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-[#16231b]">
                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      sizes="96px"
                      className="object-cover object-center"
                      unoptimized={book.image.startsWith("http")}
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="mb-1.5 inline-flex w-fit rounded border border-emerald-200/80 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-[#1b6b3e] dark:border-[#86efac]/20 dark:bg-[#16271c] dark:text-[#86efac]">
                      {book.category || "General"}
                    </span>

                    <Link
                      href={`/books/${book._id}`}
                      className="font-serif text-base font-semibold leading-snug text-zinc-900 transition-colors hover:text-[#22844c] line-clamp-2 dark:text-white dark:hover:text-[#94d5a5]"
                    >
                      {book.title}
                    </Link>

                    <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                      by {book.author}
                    </p>

                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Copy className="size-3.5" />
                      {copies} of {totalCopies}{" "}
                      {totalCopies === 1 ? "copy" : "copies"} available
                    </p>

                    <div className="mt-auto flex gap-2 pt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingBook(book)}
                        className="flex-1"
                      >
                        <Pencil />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingBook(book)}
                        className="flex-1"
                      >
                        <Trash2 />
                        Delete
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {editingBook ? (
        <EditBookDialog
          key={editingBook._id}
          book={editingBook}
          open
          onOpenChange={(open) => {
            if (!open) setEditingBook(null);
          }}
          onSaved={handleSaved}
        />
      ) : null}

      <AlertDialog
        open={Boolean(deletingBook)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeletingBook(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <Trash2 />
          </AlertDialogMedia>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this book?</AlertDialogTitle>
            <AlertDialogDescription>
              “{deletingBook?.title}” will be permanently removed from the
              database and will no longer be visible to anyone. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                void handleDelete();
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 />
                  Delete Book
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
