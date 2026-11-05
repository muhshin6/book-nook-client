interface AuthErrorLike {
  code?: string;
  message?: string;
  statusText?: string;
}

export function getAuthErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (!error) return fallback;

  const candidate = error as AuthErrorLike;
  const code = candidate.code ?? (typeof candidate === "string" ? candidate : undefined);

  switch (code) {
    case "INVALID_EMAIL_OR_PASSWORD":
      return "Incorrect email or password. Please try again.";
    case "INVALID_EMAIL":
      return "Enter a valid email address.";
    case "USER_ALREADY_EXISTS":
    case "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
      return "An account with this email already exists. Try logging in instead.";
    case "PASSWORD_TOO_SHORT":
      return "Password must be at least 6 characters long.";
    case "PASSWORD_TOO_LONG":
      return "Password is too long.";
    case "EMAIL_NOT_VERIFIED":
      return "Please verify your email address before logging in.";
    case "INVALID_TOKEN":
      return "This link is invalid or has expired. Request a new one.";
    case "TOO_MANY_REQUESTS":
      return "Too many attempts. Please wait a moment and try again.";
    case "access_denied":
      return "You denied access to Google. Please try again.";
    case "unauthorized_client":
    case "redirect_uri_mismatch":
      return "Google sign-in redirect URI is not registered. Add your site's callback URL (e.g. https://book-nook-frontend-iota.vercel.app/api/auth/callback/google) to your Google Cloud Console OAuth client's Authorized Redirect URIs.";
    case "invalid_request":
      return "Invalid Google sign-in request. Please try again.";
    case "server_error":
    case "temporarily_unavailable":
      return "Google sign-in is temporarily unavailable. Please try again later.";
    default:
      return (
        candidate.message ||
        candidate.statusText ||
        fallback
      );
  }
}
