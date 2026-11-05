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
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;
  const errorParam = Array.isArray(params.error)
    ? params.error[0]
    : params.error;
  const next = getSafeNextPath(nextParam);
  const initialError = errorParam
    ? "Google sign-in could not be completed. Please try again."
    : null;

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
