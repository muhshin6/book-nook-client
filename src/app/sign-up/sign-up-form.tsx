"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Eye,
  EyeOff,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { validatePassword } from "@/lib/password";
import { cn } from "@/lib/utils";

interface SignUpFormProps {
  next: string;
  googleEnabled: boolean;
  initialError?: string | null;
}

interface FieldErrors {
  name?: string;
  email?: string;
  image?: string;
  password?: string;
}

function isValidImageUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function SignUpForm({
  next,
  googleEnabled,
  initialError,
}: SignUpFormProps) {
  const router = useRouter();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [image, setImage] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(
    initialError ?? null
  );
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const signInHref =
    next === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(next)}`;

  const googleErrorHref =
    next === "/"
      ? "/sign-up?error=google"
      : `/sign-up?error=google&next=${encodeURIComponent(next)}`;

  React.useEffect(() => {
    if (!initialError) return;
    toast.add({
      type: "error",
      title: "Google sign-in failed",
      description: getAuthErrorMessage(
        initialError,
        "Google sign-in could not be completed. Please try again."
      ),
    });
  }, [initialError]);

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };

  function showError(message: string) {
    setFormError(message);
    toast.add({
      type: "error",
      title: "Registration failed",
      description: message,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedImage = image.trim();

    const nextErrors: FieldErrors = {};

    if (!trimmedName) {
      nextErrors.name = "Enter your name.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Enter your email address.";
    }

    if (trimmedImage && !isValidImageUrl(trimmedImage)) {
      nextErrors.image = "Enter a valid http(s) image URL.";
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      nextErrors.password = passwordError;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setFormError(
        nextErrors.password ??
          "Please fix the highlighted fields before continuing."
      );
      toast.add({
        type: "error",
        title: "Registration failed",
        description: nextErrors.password ?? "Please check the form fields.",
      });
      return;
    }

    setFieldErrors({});
    setFormError(null);
    setIsSubmitting(true);

    try {
      const { error } = await authClient.signUp.email({
        name: trimmedName,
        email: trimmedEmail,
        password,
        image: trimmedImage || undefined,
      });

      if (error) {
        showError(
          getAuthErrorMessage(error, "Could not create your account.")
        );
        setIsSubmitting(false);
        return;
      }

      toast.add({
        type: "success",
        title: "Account created",
        description: "Log in with your new email and password.",
      });

      router.push(signInHref);
      router.refresh();
    } catch (error) {
      showError(getAuthErrorMessage(error, "Could not create your account."));
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
        <Label htmlFor="register-name">Name</Label>
        <div className="relative">
          <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.name)}
            className="h-10 bg-white pl-9 dark:bg-[#111c15]"
          />
        </div>
        {fieldErrors.name ? (
          <p className="text-xs text-destructive">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.email)}
            className="h-10 bg-white pl-9 dark:bg-[#111c15]"
          />
        </div>
        {fieldErrors.email ? (
          <p className="text-xs text-destructive">{fieldErrors.email}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="register-image">Photo URL</Label>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Optional
          </span>
        </div>
        <div className="relative">
          <ImageIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="register-image"
            type="url"
            inputMode="url"
            autoComplete="photo"
            placeholder="https://example.com/photo.jpg"
            value={image}
            onChange={(event) => setImage(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.image)}
            className="h-10 bg-white pl-9 dark:bg-[#111c15]"
          />
        </div>
        {fieldErrors.image ? (
          <p className="text-xs text-destructive">{fieldErrors.image}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
          <Input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={Boolean(fieldErrors.password)}
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
                "flex items-center gap-1.5 text-xs",
                rule.ok
                  ? "text-[#22844c] dark:text-[#94d5a5]"
                  : "text-zinc-500 dark:text-zinc-400"
              )}
            >
              {rule.ok ? (
                <Check className="size-3.5" />
              ) : (
                <X className="size-3.5" />
              )}
              {rule.label}
            </li>
          ))}
        </ul>

        {fieldErrors.password ? (
          <p className="text-xs text-destructive">{fieldErrors.password}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-10 w-full gap-2 bg-[#22844c] text-white shadow-md transition-all hover:bg-[#1a6e3e] active:scale-[0.99] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Creating account...
          </>
        ) : (
          "Register"
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
        callbackURL={signInHref}
        errorCallbackURL={googleErrorHref}
        enabled={googleEnabled}
        label="Register with Google"
      />

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href={signInHref}
          className="font-semibold text-[#22844c] hover:underline dark:text-[#94d5a5]"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
