import type { PostsQueryParams } from "@/types/api";
import { DEFAULT_PAGE_LIMIT } from "@/lib/constants";

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

  const category = searchParams.get("category");
  if (category) base.category = category;

  const tag = searchParams.get("tag");
  if (tag) base.tag = tag;

  const sort = searchParams.get("sort");
  if (sort === "views" || sort === "-views") {
    base.sort = sort;
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
