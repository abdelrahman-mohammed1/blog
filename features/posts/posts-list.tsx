"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useDeletePost, usePosts } from "@/hooks/use-posts";
import { POSTS_PAGE_SIZE, ROUTES } from "@/lib/constants";
import type { Post } from "@/types/post";
import { motion } from "framer-motion";

function getTagId(post: Post): string {
  if (typeof post.tags === "string") return post.tags;
  return post.tags?._id ?? "";
}

function getTagName(post: Post): string {
  if (typeof post.tags === "object" && post.tags?.name) return post.tags.name;
  return getTagId(post).slice(-6) || "—";
}

export function PostsList() {
  const { data, isLoading, isError, error } = usePosts();
  const deletePost = useDeletePost();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = debouncedSearch.toLowerCase().trim();
    if (!q) return data;
    return data.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
    );
  }, [data, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * POSTS_PAGE_SIZE,
    currentPage * POSTS_PAGE_SIZE
  );

  if (isLoading) return <TableSkeleton rows={5} cols={4} />;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load posts"
        description={(error as { message?: string })?.message}
      />
    );
  }

  if (!data?.length) {
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
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts..."
          className="h-11 rounded-xl pl-10"
        />
      </div>

      {paginated.length === 0 ? (
        <EmptyState
          title="No matching posts"
          description={`No results for "${debouncedSearch}"`}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
          {paginated.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 p-5 shadow-sm backdrop-blur-md transition-all hover:border-violet-500/30 hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-semibold tracking-tight">
                    {post.title}
                  </h3>
                  <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
                    /{post.slug}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  onClick={() => setDeleteId(post._id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <p className="line-clamp-3 text-sm text-muted-foreground">
                {post.content}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{getTagName(post)}</Badge>
                {Array.isArray(post.categories) &&
                  post.categories.length > 0 && (
                    <Badge variant="outline">
                      {post.categories.length} categor
                      {post.categories.length === 1 ? "y" : "ies"}
                    </Badge>
                  )}
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

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
