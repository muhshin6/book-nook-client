"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { validatePassword } from "@/lib/password";
import { cn } from "@/lib/utils";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const passwordError = validatePassword(password);

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword: password,
        token,
      });

      if (resetError) {
        setError(
          getAuthErrorMessage(resetError, "Could not reset your password.")
        );
        setIsSubmitting(false);
        return;
      }

      toast.add({
        type: "success",
        title: "Password updated",
        description: "Log in with your new password.",
      });
      router.push("/sign-in");
      router.refresh();
    } catch (resetError) {
      setError(
        getAuthErrorMessage(resetError, "Could not reset your password.")
      );
      setIsSubmitting(false);
    }
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
        <Label htmlFor="reset-password">New password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="reset-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a new password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            className="h-10 bg-white pr-10 pl-9 dark:bg-[#111c15]"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        <ul className="space-y-1 pt-1" aria-label="Password requirements">
          {[
            { ok: passwordChecks.length, label: "At least 6 characters" },
            {
              ok: passwordChecks.uppercase,
              label: "At least one uppercase letter",
            },
            {
              ok: passwordChecks.lowercase,
              label: "At least one lowercase letter",
            },
          ].map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "text-xs",
                rule.ok
                  ? "text-[#22844c] dark:text-[#94d5a5]"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {rule.ok ? "✓" : "•"} {rule.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-confirm-password">Confirm password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="reset-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
            Updating password...
          </>
        ) : (
          "Update password"
        )}
      </Button>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
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
