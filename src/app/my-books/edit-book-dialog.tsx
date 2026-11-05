"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Save, X } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import type { Book } from "@/types/book";
import { updateBook } from "@/lib/api";
import { getAvailableCopies, getTotalCopies } from "@/lib/books";

const CATEGORY_OPTIONS = [
  "Fiction",
  "Sci-Fi",
  "Fantasy",
  "Classic",
  "Mystery",
  "Non-Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

interface EditBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: (book: Book) => void;
}

export function EditBookDialog({
  book,
  open,
  onOpenChange,
  onSaved,
}: EditBookDialogProps) {
  const [title, setTitle] = React.useState(book.title);
  const [author, setAuthor] = React.useState(book.author);
  const [category, setCategory] = React.useState(book.category || "Fiction");
  const [description, setDescription] = React.useState(book.description ?? "");
  const [totalCopies, setTotalCopies] = React.useState(
    String(getTotalCopies(book))
  );
  const [cover, setCover] = React.useState<File | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);
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

  const currentCopies = getAvailableCopies(book);
  const currentTotal = getTotalCopies(book);
  const borrowedOut = Math.max(0, currentTotal - currentCopies);

  const categories = React.useMemo(
    () =>
      CATEGORY_OPTIONS.includes(category)
        ? CATEGORY_OPTIONS
        : [category, ...CATEGORY_OPTIONS],
    [category]
  );

  function clearCover() {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }

    setCover(null);
    setCoverPreview(null);

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
    setCoverPreview(objectUrl);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    if (!title.trim() || !author.trim()) {
      toast.add({
        type: "error",
        title: "Missing details",
        description: "Title and author are required.",
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
        description: "Total copies must be a whole number between 1 and 999.",
      });
      return;
    }

    if (parsedTotalCopies < borrowedOut) {
      toast.add({
        type: "error",
        title: "Too few copies",
        description: `${borrowedOut} ${
          borrowedOut === 1 ? "copy is" : "copies are"
        } currently borrowed, so the total cannot go below ${borrowedOut}.`,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let image = book.image;

      if (cover) {
        image = await uploadCover(cover);

        if (!image) {
          throw new Error("ImgBB did not return an image URL.");
        }
      }

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("Could not get authentication token.");
      }

      const updated = await updateBook(
        book._id,
        {
          title: title.trim(),
          author: author.trim(),
          category,
          description: description.trim(),
          image,
          totalCopies: parsedTotalCopies,
        },
        data.token,
      );

      toast.add({
        type: "success",
        title: "Book updated",
        description: `“${updated.title}” has been saved.`,
      });

      onSaved(updated);
      onOpenChange(false);
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not update book",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const preview = coverPreview ?? book.image;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit book</DialogTitle>
          <DialogDescription>
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-[130px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="edit-cover">Cover</Label>
              <label
                htmlFor="edit-cover"
                className={cn(
                  "group relative block aspect-2/3 w-full cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-colors",
                  "border-zinc-300 bg-zinc-50 hover:border-[#22844c] dark:border-[#94d5a5]/25 dark:bg-[#111c15] dark:hover:border-[#94d5a5]/60"
                )}
              >
                <Image
                  src={preview}
                  alt={`Cover of ${book.title}`}
                  fill
                  sizes="130px"
                  className="object-cover object-center"
                  unoptimized={preview.startsWith("http")}
                />
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#0a1910]/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <ImagePlus className="size-5" />
                  <span className="text-[11px] font-semibold">Change</span>
                </span>
              </label>

              <input
                ref={fileInputRef}
                id="edit-cover"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverChange}
              />

              {cover ? (
                <button
                  type="button"
                  onClick={clearCover}
                  className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-destructive dark:text-zinc-400"
                >
                  <X className="size-3.5" />
                  Keep original
                </button>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">
                  Book Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={200}
                  required
                  className="h-10 bg-white dark:bg-[#111c15]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="edit-author">
                    Author Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-author"
                    value={author}
                    onChange={(event) => setAuthor(event.target.value)}
                    maxLength={120}
                    required
                    className="h-10 bg-white dark:bg-[#111c15]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      if (value) setCategory(value);
                    }}
                  >
                    <SelectTrigger
                      id="edit-category"
                      className="h-10 w-full bg-white dark:bg-[#111c15]"
                    >
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-total-copies">
                  Total Copies <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-total-copies"
                  type="number"
                  min={Math.max(1, borrowedOut)}
                  max={999}
                  step={1}
                  inputMode="numeric"
                  value={totalCopies}
                  onChange={(event) => setTotalCopies(event.target.value)}
                  required
                  className="h-10 bg-white dark:bg-[#111c15]"
                />
                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {borrowedOut > 0
                    ? `${borrowedOut} ${
                        borrowedOut === 1 ? "copy is" : "copies are"
                      } currently borrowed.`
                    : "How many copies do you have available to lend?"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description">Short Description</Label>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={500}
              rows={4}
              className="min-h-28 bg-white dark:bg-[#111c15]"
            />
          </div>

          <DialogFooter>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
