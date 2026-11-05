import type { Book } from "@/types/book";

/**
 * The API stores the lendable count as `availableCopies`. Older records (and
 * some UI code) still use `copies`, so fall back through both before assuming
 * a single copy is on the shelf.
 */
export function getAvailableCopies(book: Book): number {
  const value = book.availableCopies ?? book.copies ?? book.totalCopies ?? 1;

  return Math.max(0, Math.floor(value));
}

export function getTotalCopies(book: Book): number {
  const available = getAvailableCopies(book);
  const total = book.totalCopies ?? available;

  return Math.max(available, Math.floor(total));
}
