"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DebouncedSearch } from "@/components/shared/debounced-search";
import { EmptyState } from "@/components/shared/empty-state";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { ListPagination } from "@/components/shared/list-pagination";
import { useUrlParams } from "@/hooks/use-url-params";
import { useDeletePost, usePosts } from "@/hooks/use-posts";
import { buildPostsParams } from "@/lib/query-params";
import { ROUTES } from "@/lib/constants";
import { PostCard } from "@/features/posts/post-card";
import { PostsFilters } from "@/features/posts/posts-filters";

export function PostsList() {
  const { searchParams, updateParams, page } = useUrlParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deletePost = useDeletePost();

  const apiParams = useMemo(
    () => buildPostsParams(searchParams),
    [searchParams],
  );

  const { data, isLoading, isFetching, isError, error } = usePosts({
    page,
    search: apiParams.search as string | undefined,
    category: apiParams.category as string | undefined,
    tag: apiParams.tag as string | undefined,
    sort: (apiParams.sort as "views" | "-views") ?? "-views",
  });

  const posts = data?.data ?? [];
  const meta = data?.meta;
  const searchValue = searchParams.get("search") ?? "";

  const handleSearch = useCallback(
    (value: string) => {
      updateParams({ search: value || null });
    },
    [updateParams],
  );

  if (isLoading) return <CardGridSkeleton count={6} />;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load posts"
        description={(error as { message?: string })?.message}
      />
    );
  }

  const hasFilters =
    !!searchValue ||
    !!searchParams.get("category") ||
    !!searchParams.get("tag") ||
    !!searchParams.get("sort");

  if (!posts.length && !hasFilters) {
    return (
      <EmptyState
        icon={FileText}
        title="No posts yet"
        description="Start writing your first blog post."
        action={
          <Link
            href={ROUTES.postsNew}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="size-4" />
            Create Post
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <DebouncedSearch
          value={searchValue}
          onDebouncedChange={handleSearch}
          placeholder="Search posts..."
        />
        <PostsFilters
          category={searchParams.get("category") ?? ""}
          tag={searchParams.get("tag") ?? ""}
          sort={searchParams.get("sort") ?? ""}
          onCategoryChange={(v) => updateParams({ category: v || null })}
          onTagChange={(v) => updateParams({ tag: v || null })}
          onSortChange={(v) =>
            updateParams({
              sort: v === null || v === "-views" ? null : v,
            })
          }
        />
      </div>

      {isFetching && !isLoading && (
        <p className="text-xs text-muted-foreground">Updating...</p>
      )}

      {posts.length === 0 ? (
        <EmptyState
          title="No matching posts"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard
              key={post._id}
              post={post}
              index={index}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      {meta && (
        <ListPagination
          meta={meta}
          onPageChange={(p) =>
            updateParams({ page: String(p) }, { resetPage: false })
          }
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete post?"
        description="This will permanently remove the post."
        isLoading={deletePost.isPending}
        onConfirm={() => {
          if (deleteId) {
            deletePost.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
