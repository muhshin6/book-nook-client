import * as React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
};

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const rawToken = Array.isArray(params.token) ? params.token[0] : params.token;
  const rawError = Array.isArray(params.error) ? params.error[0] : params.error;
  const token = rawToken?.trim();

  if (!token || rawError) {
    return (
      <AuthShell
        title="Invalid reset link"
        subtitle="This password reset link is missing, invalid, or has expired."
      >
        <div className="space-y-5 text-center">
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Request a new reset link and use the newest email to finish
            changing your password.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#22844c] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#1a6e3e] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
          >
            Request a new link
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Your new password must meet all of the requirements below."
    >
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
