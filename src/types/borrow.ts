export type BorrowStatus = "borrowed" | "returned";

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userId: string;
  userName?: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string | null;
  status: BorrowStatus;
  createdAt?: string;
}
