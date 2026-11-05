import type { Metadata } from "next";

import { Banner } from "@/components/banner";
import { NewArrivals } from "@/components/new-arrivals";
import { HowBorrowingWorks } from "@/components/how-borrowing-works";
import { TopCategories } from "@/components/top-categories";
import { ReaderReviews } from "@/components/reader-reviews";
import { getLatestBooks } from "@/lib/api";
import type { Book } from "@/types/book";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  let initialBooks: Book[] = [];
  try {
    initialBooks = await getLatestBooks(10);
  } catch (err) {
    console.error("Failed to load initial books:", err);
  }

  return (
    <>
      <Banner />
      <NewArrivals initialBooks={initialBooks} />
      <HowBorrowingWorks />
      <TopCategories />
      <ReaderReviews />
    </>
  );
}
