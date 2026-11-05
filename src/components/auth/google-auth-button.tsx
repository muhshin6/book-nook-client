"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.32 2.98-7.41Z"
        fill="#4285F4"
      />
      <path
        d="M12 21.99c2.7 0 4.96-.89 6.62-2.42l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.81-1.76-5.6-4.13H3.06v2.62A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.86a6 6 0 0 1 0-3.72V7.52H3.06a10 10 0 0 0 0 8.96l3.34-2.62Z"
        fill="#FBBC05"
      />
      <path
        d="M12 6.01c1.47 0 2.79.51 3.83 1.5l2.87-2.88A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.94 5.52l3.34 2.62C7.19 7.77 9.4 6.01 12 6.01Z"
        fill="#EA4335"
      />
    </svg>
  );
}

interface GoogleAuthButtonProps {
  callbackURL: string;
  errorCallbackURL: string;
  enabled: boolean;
  label?: string;
}

export function GoogleAuthButton({
  callbackURL,
  errorCallbackURL,
  enabled,
  label = "Continue with Google",
}: GoogleAuthButtonProps) {
  const [isPending, setIsPending] = React.useState(false);

  async function handleClick() {
    if (!enabled) {
      toast.add({
        type: "error",
        title: "Google sign-in unavailable",
        description:
          "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local to enable Google authentication.",
      });
      return;
    }

    setIsPending(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL,
      });

      if (error) {
        toast.add({
          type: "error",
          title: "Google sign-in failed",
          description: getAuthErrorMessage(
            error,
            "Could not start Google authentication.",
          ),
        });
        setIsPending(false);
      }
      // On success BetterAuth redirects the browser to Google, so the button
      // stays in its pending state until the navigation happens.
    } catch (error) {
      toast.add({
        type: "error",
        title: "Google sign-in failed",
        description: getAuthErrorMessage(
          error,
          "Could not start Google authentication.",
        ),
      });
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      className="h-10 w-full gap-2 bg-white text-zinc-800 hover:bg-zinc-50 dark:bg-[#111c15] dark:text-zinc-100 dark:hover:bg-[#16231b]"
    >
      {isPending ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {isPending ? "Redirecting to Google..." : label}
    </Button>
  );
}
