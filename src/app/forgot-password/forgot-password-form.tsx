"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter the email address for your account.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { error: requestError } = await authClient.requestPasswordReset({
        email: trimmedEmail,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (requestError) {
        const message = getAuthErrorMessage(
          requestError,
          "Could not request a password reset."
        );
        setError(message);
        toast.add({
          type: "error",
          title: "Reset request failed",
          description: message,
        });
        setIsSubmitting(false);
        return;
      }

      setIsSent(true);
      toast.add({
        type: "success",
        title: "Check your email",
        description:
          "If an account exists for that address, a reset link has been generated.",
      });
    } catch (requestError) {
      const message = getAuthErrorMessage(
        requestError,
        "Could not request a password reset."
      );
      setError(message);
      toast.add({
        type: "error",
        title: "Reset request failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-[#22844c] dark:bg-[#142318] dark:text-[#94d5a5]">
          <MailCheck className="size-6" />
        </div>
        <div>
          <h2 className="font-serif text-lg font-semibold text-zinc-900 dark:text-white">
            Reset link generated
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            If an account exists for <strong>{email.trim()}</strong>, a reset
            link has been created. In local development, the link is printed in
            the terminal running the Next.js server.
          </p>
        </div>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#22844c] hover:underline dark:text-[#94d5a5]"
        >
          <ArrowLeft className="size-4" />
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="forgot-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            className="h-10 bg-white pl-9 dark:bg-[#111c15]"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full gap-2 bg-[#22844c] text-white shadow-md transition-all hover:bg-[#1a6e3e] active:scale-[0.99] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Remembered your password?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-[#22844c] hover:underline dark:text-[#94d5a5]"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
