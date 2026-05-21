import type { PostsQueryParams } from "@/types/api";
import { DEFAULT_PAGE_LIMIT } from "@/lib/constants";
import { DEFAULT_POST_SORT } from "@/lib/post-sort";

export function buildListParams(
  searchParams: URLSearchParams,
  defaults?: { limit?: number }
): Record<string, string | number> {
  const params: Record<string, string | number> = {
    limit: defaults?.limit ?? DEFAULT_PAGE_LIMIT,
  };

  const page = searchParams.get("page");
  if (page) params.page = Number(page) || 1;

  const search = searchParams.get("search");
  if (search?.trim()) params.search = search.trim();

  return params;
}

export function buildPostsParams(
  searchParams: URLSearchParams
): PostsQueryParams & Record<string, string | number> {
  const base = buildListParams(searchParams) as PostsQueryParams &
    Record<string, string | number>;

  const categories = searchParams.get("categories");
  if (categories) base.categories = categories;

  const tags = searchParams.get("tags");
  if (tags) base.tags = tags;

  const sort = searchParams.get("sort");
  if (sort === "views" || sort === "-views") {
    base.sort = sort;
  } else if (sort !== "default" && (!sort || sort === "")) {
    // No param in URL → default: most viewed
    base.sort = DEFAULT_POST_SORT;
  }

  return base;
}

export function setSearchParam(
  params: URLSearchParams,
  key: string,
  value: string | null
) {
  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
}
