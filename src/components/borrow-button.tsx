"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { ApiError, borrowBook, getBorrowStatus, returnBook } from "@/lib/api";
import { cn } from "@/lib/utils";

type BorrowState = "checking" | "borrowed" | "available";

export function BorrowButton({
  bookId,
  bookTitle,
  copies,
}: {
  bookId: string;
  bookTitle: string;
  copies: number;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [borrowState, setBorrowState] = React.useState<BorrowState>("checking");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const userId = session?.user?.id;

  React.useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    const checkBorrowStatus = async () => {
      try {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
          if (isMounted) setBorrowState("available");
          return;
        }

        const { borrowed } = await getBorrowStatus(bookId, data.token);

        if (isMounted) {
          setBorrowState(borrowed ? "borrowed" : "available");
        }
      } catch {
        if (isMounted) {
          setBorrowState("available");
        }
      }
    };

    void checkBorrowStatus();

    return () => {
      isMounted = false;
    };
  }, [bookId, userId]);

  const isChecking = Boolean(userId) && borrowState === "checking";
  const isBorrowed = borrowState === "borrowed";
  const isUnavailable = !isBorrowed && copies <= 0;

  function handleClick() {
    if (isPending || isChecking || isSubmitting || isUnavailable) return;

    if (!session?.user) {
      const next = `/books/${bookId}`;
      router.push(`/sign-in?next=${encodeURIComponent(next)}`);
      return;
    }

    if (isBorrowed) {
      void handleReturn();
      return;
    }

    setIsDialogOpen(true);
  }

  async function handleReturn() {
    setIsSubmitting(true);

    try {
      await returnBook(bookId, session?.session?.token);
      setBorrowState("available");
      toast.add({
        type: "success",
        title: "Book returned",
        description: "Thanks for bringing it back to the community shelf.",
      });
      router.refresh();
    } catch (error) {
      showError("Could not return book", error);
    } finally {
      setIsSubmitting(false);
    }
  }

 async function handleConfirmBorrow(event: React.FormEvent<HTMLFormElement>) {
   event.preventDefault();

   if (isSubmitting) return;

   setIsSubmitting(true);

   try {
     if (!session?.user?.email) {
       throw new Error("Not signed in.");
     }

     // Get JWT token from Better Auth
     const { data, error } = await authClient.token();

     if (error || !data?.token) {
       throw new Error("Could not get authentication token.");
     }

     await borrowBook(
       bookId,
       session.user.email,
       session.user.name,
       data.token,
     );

     setBorrowState("borrowed");
     setIsDialogOpen(false);

     toast.add({
       type: "success",
       title: "Book borrowed",
       description: `“${bookTitle}” is yours to read. Return it when you are finished.`,
     });

     router.refresh();
   } catch (error) {
     showError("Could not borrow book", error);

     if (error instanceof ApiError) {
       if (error.code === "ALREADY_BORROWED") {
         setBorrowState("borrowed");
         setIsDialogOpen(false);
       }

       if (error.code === "NOT_AVAILABLE") {
         setIsDialogOpen(false);
         router.refresh();
       }
     }
   } finally {
     setIsSubmitting(false);
   }
 }

  function showError(title: string, error: unknown) {
    toast.add({
      type: "error",
      title,
      description:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    });
  }

  const isBusy = isPending || isChecking || isSubmitting;

  let label = "Borrow This Book";

  if (isPending || isChecking) {
    label = "Checking availability...";
  } else if (isSubmitting) {
    label = isBorrowed ? "Returning..." : "Borrowing...";
  } else if (isBorrowed) {
    label = "Return Book";
  } else if (isUnavailable) {
    label = "Not Available";
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={isBusy || isUnavailable}
        aria-busy={isBusy}
        aria-haspopup={isBorrowed ? undefined : "dialog"}
        className={cn(
          "flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed",
          isUnavailable
            ? "bg-zinc-200 text-zinc-500 dark:bg-[#16211b] dark:text-zinc-500"
            : isBorrowed
              ? "bg-[#b87333] text-white hover:bg-[#a5652b] dark:bg-[#c88d5e] dark:text-[#0a1910] dark:hover:bg-[#d69f72]"
              : "bg-[#22844c] text-white hover:bg-[#1a6e3e] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
        )}
      >
        {(isPending || isChecking || isSubmitting) && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {label}
      </button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-[#1b6b3e] dark:bg-[#1c2f22] dark:text-[#94d5a5]">
              <BookOpen className="size-5" />
            </div>
            <DialogTitle>Borrow “{bookTitle}”</DialogTitle>
            <DialogDescription>
              Confirm the details below to borrow this copy. Your name and email
              are read-only and come from your account.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmBorrow} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="borrow-user-name">User Name</Label>
              <Input
                id="borrow-user-name"
                value={session?.user.name ?? ""}
                readOnly
                aria-readonly="true"
                className="h-10 bg-zinc-50 dark:bg-[#111c15]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="borrow-user-email">Email</Label>
              <Input
                id="borrow-user-email"
                type="email"
                value={session?.user.email ?? ""}
                readOnly
                aria-readonly="true"
                className="h-10 bg-zinc-50 dark:bg-[#111c15]"
              />
            </div>

            <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs leading-relaxed text-zinc-500 dark:border-white/5 dark:bg-[#111c15] dark:text-zinc-400">
              Borrow date is recorded when you confirm. The return date stays
              empty until you return the book.
            </p>

            <DialogFooter className="px-0 pt-1">
              <DialogClose
                render={<Button type="button" variant="outline" />}
                disabled={isSubmitting}
              >
                Cancel
              </DialogClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#22844c] text-white hover:bg-[#1a6e3e] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Borrow"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

