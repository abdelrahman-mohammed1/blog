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

interface PostsFiltersProps {
  category: string;
  tag: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
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

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={category || "all"}
        onValueChange={(v) => onCategoryChange(v === "all" || !v ? "" : v)}
      >
        <SelectTrigger className="h-11 w-[180px] rounded-xl">
          <SelectValue placeholder="Category" />
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
          <SelectValue placeholder="Tag" />
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
        value={sort || "default"}
        onValueChange={(v) => onSortChange(v === "default" || !v ? "" : v)}
      >
        <SelectTrigger className="h-11 w-[200px] rounded-xl">
          <SelectValue placeholder="Sort by views" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default order</SelectItem>
          <SelectItem value="views_desc">Most viewed</SelectItem>
          <SelectItem value="views_asc">Least viewed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
