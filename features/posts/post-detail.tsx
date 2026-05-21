"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Fireworks } from "@/components/effects/fireworks";
import { AnimatedViewCount } from "@/components/shared/animated-view-count";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { FloatingEmojis } from "@/components/shared/floating-emojis";
import { PostForm } from "@/features/posts/post-form";
import { useTrackPostView } from "@/hooks/use-track-post-view";
import { usePost } from "@/hooks/use-posts";
import { ROUTES } from "@/lib/constants";
import {
  getCategoryNames,
  getTagNames,
  resolveImageUrl,
} from "@/lib/post-utils";

interface PostDetailProps {
  id: string;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "long",
  }).format(new Date(date));
}

export function PostDetail({ id }: PostDetailProps) {
  const { data: post, isLoading, isError, error } = usePost(id);
  const [editMode, setEditMode] = useState(false);

  const { isCelebrating, pulseViews } = useTrackPostView({
    postId: id,
    enabled: !!post && !editMode,
  });

  if (isLoading) return <CardGridSkeleton count={1} />;

  if (isError || !post) {
    return (
      <EmptyState
        title="Post not found"
        description={(error as { message?: string })?.message}
        action={
          <Link href={ROUTES.posts}>
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 size-4" />
              Back to posts
            </Button>
          </Link>
        }
      />
    );
  }

  if (editMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Edit post</h2>
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </Button>
        </div>
        <PostForm mode="edit" post={post} />
      </div>
    );
  }

  const imageUrl = resolveImageUrl(post.image);
  const categories = getCategoryNames(post);
  const tags = getTagNames(post);
  console.log({ categories, tags , post });
  return (
    <>
      <Fireworks active={isCelebrating} />
      <FloatingEmojis active={isCelebrating} />

      <article className="relative mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href={ROUTES.posts}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to posts
          </Link>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setEditMode(true)}
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/60">
          <div className="relative aspect-[21/9] bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
                unoptimized
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-500/15 to-indigo-500/10">
                <span className="font-heading text-6xl text-muted-foreground/30">
                  {post.title.charAt(0)}
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        <header className="space-y-4">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(post.createdAt)}
            </span>
            <AnimatedViewCount count={post.views ?? 0} pulse={pulseViews} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((name) => (
              <Badge key={name} variant="secondary">
                {name}
              </Badge>
            ))}
            {tags.map((name) => (
              <Badge key={name} variant="outline">
                {name}
              </Badge>
            ))}
          </div>
        </header>

        <div
          className="prose prose-neutral dark:prose-invert max-w-none rounded-2xl border border-border/60 bg-card/40 p-6 sm:p-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
