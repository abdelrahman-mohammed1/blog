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

const imageFileSchema = z
  .custom<File>((val) => val instanceof File, "Image is required")
  .refine((file) => file.size <= 5 * 1024 * 1024, "Image must be under 5MB")
  .refine(
    (file) =>
      ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      ),
    "Only JPEG, PNG, WebP, or GIF images are allowed",
  );

export const postCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  content: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  image: imageFileSchema,
});

export const postUpdateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),
  content: z.string(),
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  image: z
    .custom<
      File | null | undefined
    >((val) => val === null || val === undefined || val instanceof File)
    .optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
export type TagFormValues = z.infer<typeof tagSchema>;
export type PostCreateFormValues = z.infer<typeof postCreateSchema>;
export type PostUpdateFormValues = z.infer<typeof postUpdateSchema>;
