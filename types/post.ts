import type { CategoryRef, TagRef } from "./refs";

export type { CategoryRef, TagRef } from "./refs";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  categories: string[] | CategoryRef[];
  tags: string[] | TagRef[];
  views: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreatePostPayload {
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  image: File;
}

export interface UpdatePostPayload {
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  image?: File;
}

export interface PostFormValues {
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  image?: File | null;
}
