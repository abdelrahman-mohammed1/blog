import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters")
    .regex(/^[a-zA-Z0-9_\-\s\u0600-\u06FF]+$/, "Invalid characters in name"),
});

export const tagSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(/^[a-zA-Z0-9_\-\s\u0600-\u06FF]+$/, "Invalid characters in name"),
});

export const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters")
    .max(50_000, "Content is too long"),
  categories: z.array(z.string()),
  tags: z.string().min(1, "Please select a tag"),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type TagFormValues = z.infer<typeof tagSchema>;
export type PostFormValues = z.infer<typeof postSchema>;
