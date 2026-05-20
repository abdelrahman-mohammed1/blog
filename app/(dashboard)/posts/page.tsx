"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { PostsList } from "@/features/posts/posts-list";
import { ROUTES } from "@/lib/constants";

function PostsListFallback() {
  return <CardGridSkeleton count={6} />;
}

export default function PostsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Posts"
        description="Browse, search, and manage all your blog posts."
        action={
          <Link
            href={ROUTES.postsNew}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="size-4" />
            New Post
          </Link>
        }
      />

      <Suspense fallback={<PostsListFallback />}>
        <PostsList />
      </Suspense>
    </div>
  );
}
