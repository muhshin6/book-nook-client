"use client";

import * as React from "react";

// Keep your existing Theme type and ThemeContext
export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined,
);

const THEME_EVENT = "booknook-theme-change";

function getThemeSnapshot(): Theme {
  try {
    const savedTheme = localStorage.getItem("booknook-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  } catch {}

  return "dark";
}

// Server and initial hydration always use the same theme.
function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;

    root.classList.toggle("dark", t === "dark");
    root.classList.toggle("light", t === "light");
  };

  React.useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem("booknook-theme", newTheme);
    } catch {}

    applyTheme(newTheme);

    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}