import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { MyBooksList } from "./my-books-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Books",
  description: "Manage the books you have shared with the BookNook community.",
};

export default async function MyBooksPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect("/sign-in?next=/my-books");
  }

  return <MyBooksList />;
}
