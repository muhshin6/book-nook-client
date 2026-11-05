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
    case "unable_to_link_account":
    case "account_not_linked":
      return "Your Google account could not be linked to an existing BookNook account. Try signing in with your email and password instead.";
    case "account_already_linked_to_different_user":
      return "This Google account is already linked to a different BookNook account.";
    case "email_does_not_match":
      return "The email from Google does not match this account.";
    case "email_not_found":
      return "Google did not share an email address. Grant access to your email and try again.";
    case "email_not_verified":
      return "Please verify your email address before logging in.";
    case "unable_to_get_user_info":
    case "invalid_code":
    case "no_code":
    case "nonce_binding_missing":
    case "no_callback_url":
      return "Google sign-in could not be completed. Please try again.";
    case "oauth_provider_not_found":
    case "issuer_missing":
    case "issuer_mismatch":
      return "Google sign-in is not configured correctly. Please try again later.";
    default:
      return (
        candidate.message ||
        candidate.statusText ||
        fallback
      );
  }
}
