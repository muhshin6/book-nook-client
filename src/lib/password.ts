export const PASSWORD_RULES = [
  { key: "length", label: "At least 6 characters" },
  { key: "uppercase", label: "At least one uppercase letter" },
  { key: "lowercase", label: "At least one lowercase letter" },
] as const;

export type PasswordChecks = Record<
  (typeof PASSWORD_RULES)[number]["key"],
  boolean
>;

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
  };
}

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
