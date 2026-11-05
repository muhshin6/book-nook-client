export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export async function uploadCover(file: File): Promise<string> {
  const apiKey =
    process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Image upload is not configured. Add NEXT_PUBLIC_IMGBB_API_KEY or IMGBB_API_KEY to your environment."
    );
  }

  const body = new FormData();
  body.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body }
  );

  const result = (await response.json().catch(() => null)) as {
    success?: boolean;
    data?: { url?: string; display_url?: string };
    error?: { message?: string };
  } | null;

  if (!response.ok || !result?.success || !result.data) {
    throw new Error(
      result?.error?.message ?? "Image upload failed. Please try again."
    );
  }

  return result.data.display_url ?? result.data.url ?? "";
}
