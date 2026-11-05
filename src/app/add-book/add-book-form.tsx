"use client";

import * as React from "react";
import Link from "next/link";
import {
  BookPlus,
  ImagePlus,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { MAX_IMAGE_BYTES, uploadCover } from "@/lib/imgbb";
import { cn } from "@/lib/utils";
import { addBook } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { BOOK_CATEGORIES, type BookCategory } from "@/lib/categories";

const CATEGORIES = BOOK_CATEGORIES;
type Category = BookCategory;

interface AddBookFormProps {
  user: {
    name: string;
    email: string;
  };
}

export function AddBookForm({ user }: AddBookFormProps) {
  const [title, setTitle] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [category, setCategory] = React.useState<Category>("Fiction");
  const [description, setDescription] = React.useState("");
  const [totalCopies, setTotalCopies] = React.useState("1");
  const [cover, setCover] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const previewRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, []);

  function clearCover() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    setCover(null);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextCover = event.target.files?.[0];

    if (!nextCover) return;

    if (!nextCover.type.startsWith("image/")) {
      toast.add({
        type: "error",
        title: "Unsupported file",
        description: "Choose a JPG, PNG, WEBP, or another image file.",
      });
      event.target.value = "";
      return;
    }

    if (nextCover.size > MAX_IMAGE_BYTES) {
      toast.add({
        type: "error",
        title: "Image is too large",
        description: "Choose an image smaller than 8 MB.",
      });
      event.target.value = "";
      return;
    }

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const objectUrl = URL.createObjectURL(nextCover);
    previewRef.current = objectUrl;
    setCover(nextCover);
    setPreview(objectUrl);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!cover) {
      toast.add({
        type: "error",
        title: "Cover image required",
        description: "Choose a cover image before adding the book.",
      });
      return;
    }

    const parsedTotalCopies = Number.parseInt(totalCopies, 10);

    if (
      !Number.isInteger(parsedTotalCopies) ||
      parsedTotalCopies < 1 ||
      parsedTotalCopies > 999
    ) {
      toast.add({
        type: "error",
        title: "Invalid copy count",
        description: "Total copies must be between 1 and 999.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload image to ImgBB
      const image = await uploadCover(cover);

      if (!image) {
        throw new Error("Image upload failed.");
      }

      // 2. Create book object
      const book = {
        title,
        author,
        category,
        description,
        totalCopies: parsedTotalCopies,
        image,
        userName: user.name,
        userEmail: user.email,
      };

      // 3. Send data to backend
      const { data, error } = await authClient.token();
      if (error || !data?.token) {
        throw new Error("Could not get authentication token.");
      }
      await addBook(book, data.token);

      // 4. Success notification
      toast.add({
        type: "success",
        title: "Book added",
        description: `“${title}” is now available on the community shelf.`,
      });

      // 5. Reset form
      setTitle("");
      setAuthor("");
      setCategory("Fiction");
      setDescription("");
      setTotalCopies("1");
      clearCover();
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not add book",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="py-12 lg:py-16 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b87333] dark:text-[#c88d5e]">
            Community Shelf
          </span>
          <h1 className="mt-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Add a Book
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Share a title from your shelf so a neighbour can borrow it next.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white dark:bg-[#0e1712] border border-zinc-200 dark:border-white/5 p-6 sm:p-8 lg:p-10 shadow-lg dark:shadow-2xl"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="cover">Book Image</Label>
                <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Required
                </span>
              </div>

              <label
                htmlFor="cover"
                className={cn(
                  "group relative block aspect-2/3 w-full cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors",
                  preview
                    ? "border-transparent bg-zinc-100 dark:bg-[#16231b]"
                    : "border-zinc-300 bg-zinc-50 hover:border-[#22844c] hover:bg-emerald-50/60 dark:border-[#94d5a5]/25 dark:bg-[#111c15] dark:hover:border-[#94d5a5]/60 dark:hover:bg-[#142319]",
                )}
              >
                {preview ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Selected book cover preview"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#0a1910]/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                      <ImagePlus className="size-6" />
                      <span className="text-xs font-semibold">
                        Change image
                      </span>
                    </span>
                  </>
                ) : (
                  <span className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                    <ImagePlus className="size-8 text-[#22844c] dark:text-[#94d5a5]" />
                    <span className="font-serif text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      Upload cover
                    </span>
                    <span className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                      JPG, PNG or WEBP
                      <br />
                      up to 8 MB
                    </span>
                  </span>
                )}
              </label>

              <input
                ref={fileInputRef}
                id="cover"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverChange}
              />

              {cover ? (
                <div className="flex items-start justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="min-w-0 truncate">{cover.name}</span>
                  <button
                    type="button"
                    onClick={clearCover}
                    className="inline-flex shrink-0 items-center gap-1 font-medium text-zinc-500 hover:text-destructive dark:text-zinc-400"
                  >
                    <X className="size-3.5" />
                    Remove
                  </button>
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Uploaded to ImgBB when you add the book.
                </p>
              )}
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Book Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. The Night Circus"
                  maxLength={200}
                  required
                  className="h-10 bg-white dark:bg-[#111c15]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="author">
                    Author Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    placeholder="e.g. Erin Morgenstern"
                    maxLength={120}
                    required
                    className="h-10 bg-white dark:bg-[#111c15]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      if (value) setCategory(value as Category);
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      className="h-10 w-full bg-white dark:bg-[#111c15]"
                    >
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalCopies">
                  Total Copies <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalCopies"
                  type="number"
                  min={1}
                  max={999}
                  step={1}
                  inputMode="numeric"
                  value={totalCopies}
                  onChange={(event) => setTotalCopies(event.target.value)}
                  required
                  className="h-10 bg-white dark:bg-[#111c15]"
                />
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  How many copies do you have available to lend?
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">
                    Short Description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    {description.length}/500
                  </span>
                </div>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this book about, and why should a neighbour borrow it?"
                  maxLength={500}
                  required
                  rows={4}
                  className="min-h-28 bg-white dark:bg-[#111c15]"
                />
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/5 dark:bg-[#111c15]">
                <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  <LockKeyhole className="size-3.5" />
                  Added by you
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userName">User Name</Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        id="userName"
                        value={user.name}
                        readOnly
                        aria-readonly="true"
                        className="h-10 pl-9 bg-white/70 dark:bg-[#0e1712]/70"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                      <Input
                        id="userEmail"
                        type="email"
                        value={user.email}
                        readOnly
                        aria-readonly="true"
                        className="h-10 pl-9 bg-white/70 dark:bg-[#0e1712]/70"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                  These details come from your signed-in account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-end dark:border-white/5">
            <Link
              href="/books"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 px-6 text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-200 dark:bg-[#142319] dark:text-[#94d5a5] dark:hover:bg-[#1a2f22]"
            >
              Cancel
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 bg-[#22844c] text-white shadow-md transition-all hover:bg-[#1a6e3e] active:scale-[0.98] dark:bg-[#94d5a5] dark:text-[#0a1910] dark:hover:bg-[#a6e2b5]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Adding book...
                </>
              ) : (
                <>
                  <BookPlus />
                  Add Book
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
