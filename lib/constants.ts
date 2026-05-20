export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://blog-moemen-adam.vercel.app";

export const DEFAULT_PAGE_LIMIT = 15;

export const QUERY_KEYS = {
  categories: (params?: Record<string, unknown>) =>
    ["categories", params ?? {}] as const,
  category: (id: string) => ["categories", id] as const,
  tags: (params?: Record<string, unknown>) => ["tags", params ?? {}] as const,
  tag: (id: string) => ["tags", id] as const,
  posts: (params?: Record<string, unknown>) => ["posts", params ?? {}] as const,
  post: (id: string) => ["posts", id] as const,
};

export const ROUTES = {
  dashboard: "/dashboard",
  categories: "/categories",
  tags: "/tags",
  posts: "/posts",
  postsNew: "/posts/new",
  category: (id: string) => `/categories/${id}`,
  tag: (id: string) => `/tags/${id}`,
  post: (id: string) => `/posts/${id}`,
};

export const VIEW_DELAY_MS = 5000;
