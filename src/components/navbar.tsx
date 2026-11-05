"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  BookPlus,
  Loader2,
  LogOut,
  Moon,
  Sun,
  UserRound,
  X,
  Menu,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import { useTheme } from "@/provider/theme-provider";
import { authClient } from "@/lib/auth-client";

interface NavbarProps {
  activeTab?: string;
}

export function Navbar({ activeTab }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const currentTab =
    activeTab || (pathname?.startsWith("/books") ? "All Books" : "Home");

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const user = session?.user;
  const isAuthPage = Boolean(
    pathname &&
      [
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
      ].includes(pathname),
  );
  const nextTarget = isAuthPage ? "/" : pathname || "/";
  const signInHref =
    nextTarget === "/"
      ? "/sign-in"
      : `/sign-in?next=${encodeURIComponent(nextTarget)}`;
  const signUpHref =
    nextTarget === "/"
      ? "/sign-up"
      : `/sign-up?next=${encodeURIComponent(nextTarget)}`;

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.add({
          type: "error",
          title: "Sign out failed",
          description: error.message || "Please try again.",
        });
        return;
      }

      setMobileMenuOpen(false);
      toast.add({
        type: "success",
        title: "Signed out",
        description: "You have been logged out of BookNook.",
      });
      router.push("/");
      router.refresh();
    } catch {
      toast.add({
        type: "error",
        title: "Sign out failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSigningOut(false);
    }
  }

  const initials = user?.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0d1410]/95 backdrop-blur-md border-b border-zinc-200 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left Side: Brand & Main Navigation */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#22844c] dark:bg-[#94d5a5] flex items-center justify-center text-white dark:text-[#0a1910] shadow-sm transition-transform duration-200 group-hover:scale-105">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-[#22844c] dark:group-hover:text-[#94d5a5] transition-colors">
              BookNook
            </span>
          </Link>

          {/* Nav Links */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                currentTab === "Home"
                  ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/books"
              className={`text-sm font-medium transition-colors ${
                currentTab === "All Books"
                  ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              All Books
            </Link>

            {user ? (
              <>
                <Link
                  href="/add-book"
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith("/add-book")
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  Add a Book
                </Link>

                <Link
                  href="/my-books"
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith("/my-books")
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  My Books
                </Link>
                <Link
                  href="/my-borrows"
                  className={`text-sm font-medium transition-colors ${
                    pathname?.startsWith("/my-borrows")
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  My Borrows
                </Link>
              </>
            ) : null}
          </nav>
        </div>

        {/* Right Side: Theme Toggle + Auth */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 stroke-2 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 stroke-2 text-zinc-700" />
            )}
          </button>

          {isPending ? (
            <span
              aria-hidden="true"
              className="h-8 w-28 animate-pulse rounded-md bg-zinc-100 dark:bg-white/5"
            />
          ) : user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open user menu"
                  className="rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#22844c]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0d1410]"
                >
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt={user.name}
                      className="size-9 rounded-full object-cover ring-1 ring-zinc-200 dark:ring-white/10"
                    />
                  ) : (
                    <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#1b6b3e] ring-1 ring-zinc-200 dark:bg-[#1c2f22] dark:text-[#94d5a5] dark:ring-white/10">
                      {initials}
                    </span>
                  )}
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-2 py-1.5">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={<Link href="/profile" />}
                    className="cursor-pointer gap-2 px-2 py-1.5"
                  >
                    <UserRound className="size-4" />
                    My Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    variant="destructive"
                    disabled={isSigningOut}
                    onClick={handleSignOut}
                    className="cursor-pointer gap-2 px-2 py-1.5"
                  >
                    {isSigningOut ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <LogOut className="size-4" />
                    )}
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                href={signInHref}
                className="px-4 py-1.5 rounded-md text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-[#16221b] border border-zinc-200 dark:border-zinc-700/60 transition-all"
              >
                Login
              </Link>

              {/* Register Button */}
              <Link
                href={signUpHref}
                className="px-4 py-1.5 rounded-md text-sm font-semibold text-white dark:text-[#0a1910] bg-[#22844c] hover:bg-[#1a6e3e] dark:bg-[#94d5a5] dark:hover:bg-[#a6e2b5] transition-all shadow-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-300" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden border-t border-zinc-200 dark:border-white/5 bg-white dark:bg-[#0d1410] px-6 py-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <nav aria-label="Mobile" className="flex flex-col space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${
                currentTab === "Home"
                  ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              href="/books"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${
                currentTab === "All Books"
                  ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              }`}
            >
              All Books
            </Link>
            {user ? (
              <>
                <Link
                  href="/my-books"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-1 transition-colors ${
                    pathname?.startsWith("/my-books")
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  My Books
                </Link>
                <Link
                  href="/my-borrows"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-1 transition-colors ${
                    pathname?.startsWith("/my-borrows")
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  My Borrows
                </Link>
                <Link
                  href="/add-book"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`inline-flex items-center gap-1.5 text-sm font-medium py-1 transition-colors ${
                    pathname === "/add-book"
                      ? "text-[#22844c] dark:text-[#94d5a5] font-semibold"
                      : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  <BookPlus className="size-4" />
                  Add Book
                </Link>
              </>
            ) : null}
          </nav>

          {isPending ? (
            <span
              aria-hidden="true"
              className="block h-9 w-full animate-pulse rounded-md bg-zinc-100 dark:bg-white/5"
            />
          ) : user ? (
            <div className="space-y-3 border-t border-zinc-200 pt-3 dark:border-white/5">
              <div className="flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#1b6b3e] dark:bg-[#1c2f22] dark:text-[#94d5a5]">
                    {initials}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {user.email}
                  </p>
                </div>
              </div>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-zinc-100 py-2 text-sm font-medium text-zinc-700 dark:border-zinc-700/60 dark:bg-[#16221b] dark:text-zinc-200"
              >
                <UserRound className="size-4" />
                My Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-zinc-200 bg-zinc-100 py-2 text-sm font-medium text-zinc-700 disabled:opacity-50 dark:border-zinc-700/60 dark:bg-[#16221b] dark:text-zinc-200"
              >
                {isSigningOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LogOut className="size-4" />
                )}
                Sign out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-zinc-200 dark:border-white/5 flex items-center gap-3">
              <Link
                href={signInHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-[#16221b] border border-zinc-200 dark:border-zinc-700/60 text-zinc-700 dark:text-zinc-200 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                href={signUpHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 rounded-md bg-[#22844c] hover:bg-[#1a6e3e] dark:bg-[#94d5a5] text-white dark:text-[#0a1910] text-sm font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
