import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { MyBorrowsTable } from "./my-borrows-table";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Borrows",
  description: "Track the books you have borrowed and return them here.",
};

export default async function MyBorrowsPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect("/sign-in?next=/my-borrows");
  }

  return <MyBorrowsTable />;
}
