import * as React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AuthShell } from "@/components/auth/auth-shell";
import { auth, isGoogleAuthEnabled } from "@/lib/auth";
import { getSafeNextPath } from "@/lib/redirect";
import { SignUpForm } from "./sign-up-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign Up",
};

interface SignUpPageProps {
  searchParams: Promise<{
    next?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
    error_code?: string | string[];
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  // BetterAuth appends `error=<code>` to the callback URL, so an older link
  // that already had a placeholder can arrive as an array — the real code is
  // the last entry.
  const errorParam = Array.isArray(params.error)
    ? params.error[params.error.length - 1]
    : params.error;
  const errorDescription = Array.isArray(params.error_description)
    ? params.error_description[params.error_description.length - 1]
    : params.error_description;
  const errorCode = Array.isArray(params.error_code)
    ? params.error_code[params.error_code.length - 1]
    : params.error_code;
  const next = getSafeNextPath(nextParam);
  // Pass the real code through so getAuthErrorMessage can map it to a message.
  const initialError =
    errorCode ??
    errorParam ??
    (errorDescription ? `Google sign-in error: ${errorDescription}` : null);

  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);

  if (session?.user) {
    redirect(next);
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join BookNook to borrow from neighbours and share the books you love."
      footer={
        <span>
          By registering you agree to keep shared books in good condition.
        </span>
      }
    >
      <SignUpForm
        next={next}
        googleEnabled={isGoogleAuthEnabled}
        initialError={initialError}
      />
    </AuthShell>
  );
}
