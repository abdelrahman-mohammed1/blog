"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-categories";
import { useTags } from "@/hooks/use-tags";
import {
  DEFAULT_POST_SORT,
  getSortLabel,
  getSortSelectValue,
  POST_SORT_OPTIONS,
  type PostSortValue,
} from "@/lib/post-sort";

interface PostsFiltersProps {
  category: string;
  tag: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string | null) => void;
}

export function PostsFilters({
  category,
  tag,
  sort,
  onCategoryChange,
  onTagChange,
  onSortChange,
}: PostsFiltersProps) {
  const { data: categoriesData } = useCategories({ limit: 100, page: 1 });
  const { data: tagsData } = useTags({ limit: 100, page: 1 });

  const categories = categoriesData?.data ?? [];
  const tags = tagsData?.data ?? [];

  const sortValue = getSortSelectValue(sort);
  const sortLabel = getSortLabel(sortValue);

  const categoryLabel = category
    ? (categories.find((c) => c._id === category)?.name ?? "Category")
    : "All categories";

  const tagLabel = tag
    ? (tags.find((t) => t._id === tag)?.name ?? "Tag")
    : "All tags";

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={category || "all"}
        onValueChange={(v) => onCategoryChange(v === "all" || !v ? "" : v)}
      >
        <SelectTrigger className="h-11 w-[180px] rounded-xl">
          <SelectValue placeholder="Category">{categoryLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c._id} value={c._id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={tag || "all"}
        onValueChange={(v) => onTagChange(v === "all" || !v ? "" : v)}
      >
        <SelectTrigger className="h-11 w-[180px] rounded-xl">
          <SelectValue placeholder="Tag">{tagLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tags</SelectItem>
          {tags.map((t) => (
            <SelectItem key={t._id} value={t._id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sortValue}
        onValueChange={(v) => {
          const next = (v as PostSortValue) || DEFAULT_POST_SORT;
          if (next === DEFAULT_POST_SORT) onSortChange(null);
          else onSortChange(next);
        }}
      >
        <SelectTrigger className="h-11 w-[200px] rounded-xl">
          <SelectValue placeholder="Sort by views">{sortLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {POST_SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
