import * as React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AddBookForm } from "./add-book-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Add a Book",
};

export default async function AddBookPage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect("/sign-in?next=/add-book");
  }

  return (
    <AddBookForm
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
    />
  );
}
