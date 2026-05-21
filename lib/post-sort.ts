export const POST_SORT_OPTIONS = [
  { value: "-views", label: "Most viewed" },
  { value: "views", label: "Least viewed" },
  { value: "default", label: "Default order" },
] as const;

export type PostSortValue = (typeof POST_SORT_OPTIONS)[number]["value"];

export const DEFAULT_POST_SORT = "-views" as const;

/** Maps URL `sort` param to select value (default: most viewed). */
export function getSortSelectValue(sort: string): PostSortValue {
  if (sort === "views" || sort === "default") return sort;
  return DEFAULT_POST_SORT;
}

export function getSortLabel(value: string): string {
  return (
    POST_SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Most viewed"
  );
}
