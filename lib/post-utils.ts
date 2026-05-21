import { API_BASE_URL } from "@/lib/constants";
import type { CategoryRef, Post, TagRef } from "@/types/post";

export function resolveImageUrl(image?: string): string | null {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = image.startsWith("/") ? image : `/${image}`;
  return `${base}${path}`;
}

export function normalizeRefs<T extends { _id: string; name?: string }>(
  items: string[] | T[] | undefined
): T[] {
  if (!items?.length) return [];
  if (typeof items[0] === "string") {
    return (items as string[]).map((id) => ({ _id: id } as T));
  }
  return items as T[];
}

export function getCategoryNames(post: Post): string[] {
  return normalizeRefs<CategoryRef>(post.categories).map(
    (c) => c.name ?? c._id.slice(-6)
  );
}

export function getTagNames(post: Post): string[] {
  return normalizeRefs<TagRef>(post.tags).map((t) => t?.name ?? t?._id?.slice(-6));
}

export function getCategoryIds(post: Post): string[] {
  return normalizeRefs<CategoryRef>(post.categories).map((c) => c._id);
}

export function getTagIds(post: Post): string[] {
  return normalizeRefs<TagRef>(post.tags).map((t) => t._id);
}

export function buildPostFormData(values: {
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  image?: File | null;
}): FormData {
  const formData = new FormData();
  formData.append("title", values.title);
  formData.append("content", values.content);
  values.categories.forEach((category) => {
    formData.append("categories", category);
  });
  values.tags.forEach((tag) => {
    formData.append("tags", tag);
  });
  if (values.image) {
    formData.append("image", values.image);
  }
  return formData;
}
