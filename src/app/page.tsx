import type { Metadata } from "next";

import { Banner } from "@/components/banner";
import { NewArrivals } from "@/components/new-arrivals";
import { HowBorrowingWorks } from "@/components/how-borrowing-works";
import { TopCategories } from "@/components/top-categories";
import { ReaderReviews } from "@/components/reader-reviews";
export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <>
      <Banner />
      <NewArrivals />
      <HowBorrowingWorks />
      <TopCategories />
      <ReaderReviews />
    </>
  );
}
