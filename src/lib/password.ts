export const PASSWORD_RULES = [
  "At least 6 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
] as const;

export function validatePassword(password: string): string | null {
  if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter.";
  }

  return null;
}
