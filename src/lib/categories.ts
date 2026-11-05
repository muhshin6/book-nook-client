export const BOOK_CATEGORIES = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export const ALL_CATEGORY = "All";

export const CATEGORY_FILTERS = [ALL_CATEGORY, ...BOOK_CATEGORIES] as const;
