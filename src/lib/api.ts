import type { Book } from "@/types/book";
import type { Borrow } from "@/types/borrow";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_SERVER_BASE_URL is not set.");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init?: RequestInit,
  token?: string,
): Promise<T> {
  const headers = new Headers(init?.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let body: { message?: string; code?: string } = {};

    try {
      body = await res.json();
    } catch {}

    throw new ApiError(
      body.message || `Request failed with status ${res.status}`,
      body.code,
      res.status,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export async function getAllBooks(category?: string): Promise<Book[]> {
  const books = await request<Book[]>("/books");
  if (!category || category === "All") return books;
  return books.filter(
    (b) => b.category?.toLowerCase() === category.toLowerCase(),
  );
}

export async function getBookById(id: string): Promise<Book | null> {
  try {
    return await request<Book>(`/books/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function getLatestBooks(limit: number): Promise<Book[]> {
  return request<Book[]>(`/books?sort=createdAt:desc&limit=${limit}`);
}

export async function addBook(
  book: {
    title: string;
    author: string;
    category: string;
    description: string;
    totalCopies: number;
    image: string;
    userName: string;
    userEmail: string;
  },
  token?: string,
): Promise<void> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  await request<void>(
    "/books",
    {
      method: "POST",
      body: JSON.stringify(book),
    },
    token,
  );
}

export async function borrowBook(
  bookId: string,
  userEmail: string,
  userName?: string,
  token?: string,
): Promise<void> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  await request<void>(
    "/borrows",
    {
      method: "POST",
      body: JSON.stringify({ bookId, userEmail, userName }),
    },
    token,
  );
}

export async function getBorrowStatus(
  bookId: string,
  token?: string,
): Promise<{ borrowed: boolean }> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }

  const borrows = await request<Borrow[]>("/borrows", { method: "GET" }, token);

  return {
    borrowed: borrows.some(
      (borrow) => borrow.bookId === bookId && borrow.status === "borrowed",
    ),
  };
}

export async function returnBook(
  borrowId: string,
  token?: string,
): Promise<void> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  await request<void>(`/borrows/${borrowId}`, { method: "DELETE" }, token);
}

export async function getMyBooks(
  userEmail: string,
  token?: string,
): Promise<Book[]> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  return request<Book[]>(
    `/books?userEmail=${encodeURIComponent(userEmail)}`,
    undefined,
    token,
  );
}

export async function deleteBook(
  bookId: string,
  token?: string,
): Promise<void> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  await request<void>(`/books/${bookId}`, { method: "DELETE" }, token);
}

export async function updateBook(
  bookId: string,
  data: Partial<Book>,
  token?: string,
): Promise<Book> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  const result = await request<{ book: Book }>(
    `/books/${bookId}`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    token,
  );
  return result.book;
}

export async function getMyBorrows(
  userEmail: string,
  token?: string,
): Promise<Borrow[]> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }
  return request<Borrow[]>(
    `/borrows?userEmail=${encodeURIComponent(userEmail)}`,
    { method: "GET" },
    token,
  );
}

export async function deleteBorrow(id: string, token?: string): Promise<void> {
  if (!token) {
    throw new ApiError(
      "Authentication required. Please sign in again.",
      "UNAUTHORIZED",
      401,
    );
  }

  return request<void>(
    `/borrows/${id}`,
    {
      method: "DELETE",
    },
    token,
  );
}
