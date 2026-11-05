"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { authClient } from "@/lib/auth-client";


interface SignInFormProps {
  next: string;
  googleEnabled: boolean;
  initialError?: string | null;
}

export function SignInForm({
  next,
  googleEnabled,
  initialError,
}: SignInFormProps) {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  // Resolve the OAuth error code to a human message once, so the alert box
  // never renders a raw code from the query string.
  const initialMessage = initialError
    ? getAuthErrorMessage(
        initialError,
        "Google sign-in could not be completed. Please try again."
      )
    : null;
  const [formError, setFormError] = React.useState<string | null>(initialMessage);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const signUpHref =
    next === "/" ? "/sign-up" : `/sign-up?next=${encodeURIComponent(next)}`;

  // No `error` param here: BetterAuth appends the real error code to this URL,
  // so a placeholder would collide with it and hide the actual cause.
  const googleErrorHref =
    next === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(next)}`;

  React.useEffect(() => {
    if (!initialMessage) return;
    toast.add({
      type: "error",
      title: "Google sign-in failed",
      description: initialMessage,
    });
  }, [initialMessage]);

  function showError(message: string) {
    setFormError(message);
    toast.add({
      type: "error",
      title: "Login failed",
      description: message,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      showError("Enter your email and password to continue.");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signIn.email({
        email: trimmedEmail,
        password,
        rememberMe: true,
        callbackURL: next,
      });

      if (error) {
        showError(getAuthErrorMessage(error, "Could not log you in."));
        setIsSubmitting(false);
        return;
      }

      toast.add({
        type: "success",
        title: "Welcome back",
        description: "You are now signed in.",
      });
      router.replace(next);
      router.refresh();
    } catch (error) {
      showError(getAuthErrorMessage(error, "Could not log you in."));
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
        >
          {formError}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="login-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(formError) && !email.trim()}
            className="h-10 bg-white pl-9 dark:bg-[#111c15]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="login-password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-[#22844c] hover:underline dark:text-[#94d5a5]"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(formError) && !password}
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
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full gap-2 bg-[#22844c] text-white shadow-md transition-all hover:bg-[#1a6e3e] active:scale-[0.99] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            Login
            <ArrowRight />
          </>
        )}
      </Button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-zinc-200 dark:border-white/10" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:bg-[#0e1712] dark:text-zinc-500">
            or
          </span>
        </div>
      </div>

      <GoogleAuthButton
        callbackURL={next}
        errorCallbackURL={googleErrorHref}
        enabled={googleEnabled}
        label="Login with Google"
      />

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        New to BookNook?{" "}
        <Link
          href={signUpHref}
          className="font-semibold text-[#22844c] hover:underline dark:text-[#94d5a5]"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
