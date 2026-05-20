export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://blog-moemen-adam.vercel.app";

export const QUERY_KEYS = {
  categories: ["categories"] as const,
  tags: ["tags"] as const,
  posts: ["posts"] as const,
};

export const ROUTES = {
  dashboard: "/dashboard",
  categories: "/categories",
  tags: "/tags",
  posts: "/posts",
  postsNew: "/posts/new",
};

export const POSTS_PAGE_SIZE = 8;
