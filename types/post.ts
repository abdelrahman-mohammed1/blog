export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  categories: string[] | CategoryRef[];
  tags: string | TagRef;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRef {
  _id: string;
  name?: string;
}

export interface TagRef {
  _id: string;
  name?: string;
}

export interface CreatePostPayload {
  title: string;
  slug: string;
  content: string;
  categories: string[];
  tags: string;
}
