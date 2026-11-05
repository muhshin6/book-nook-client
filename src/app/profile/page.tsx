import * as React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowLeft, Mail, UserRound } from "lucide-react";

import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (!session?.user) {
    redirect("/sign-in?next=/profile");
  }

  const user = session.user;
  const initials = user.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="py-10 lg:py-16 transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 hover:text-[#22844c] dark:text-zinc-400 dark:hover:text-[#94d5a5] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 rounded-2xl p-6 sm:p-8 shadow-lg dark:shadow-2xl">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt={user.name}
                className="size-20 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10"
              />
            ) : (
              <span className="flex size-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-[#1b6b3e] ring-1 ring-zinc-200 dark:bg-[#1c2f22] dark:text-[#94d5a5] dark:ring-white/10">
                {initials}
              </span>
            )}

            <div className="min-w-0">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {user.name}
              </h1>
              <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                {user.email}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 border-t border-zinc-200 pt-6 dark:border-white/5 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-[#16221b]">
              <UserRound className="size-4 shrink-0 text-[#22844c] dark:text-[#94d5a5]" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Name</p>
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-white/5 dark:bg-[#16221b]">
              <Mail className="size-4 shrink-0 text-[#22844c] dark:text-[#94d5a5]" />
              <div className="min-w-0">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Email</p>
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
