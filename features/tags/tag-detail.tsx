"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Pencil, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { TagForm } from "@/features/tags/tag-form";
import { useTag } from "@/hooks/use-tags";
import { ROUTES } from "@/lib/constants";

interface TagDetailProps {
  id: string;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
    new Date(date)
  );
}

export function TagDetail({ id }: TagDetailProps) {
  const { data: tag, isLoading, isError, error } = useTag(id);
  const [editMode, setEditMode] = useState(false);

  if (isLoading) return <TableSkeleton rows={3} cols={2} />;

  if (isError || !tag) {
    return (
      <EmptyState
        title="Tag not found"
        description={(error as { message?: string })?.message}
        action={
          <Link href={ROUTES.tags}>
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 size-4" />
              Back to tags
            </Button>
          </Link>
        }
      />
    );
  }

  if (editMode) {
    return (
      <div className="mx-auto max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold">Edit tag</h2>
          <Button variant="ghost" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </div>
        <TagForm
          mode="edit"
          tagId={tag._id}
          defaultValues={{ name: tag.name }}
          onSuccess={() => setEditMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href={ROUTES.tags}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to tags
      </Link>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10">
              <Tags className="size-7 text-indigo-500" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">{tag.name}</h1>
              {tag.slug && (
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  /{tag.slug}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => setEditMode(true)}
          >
            <Pencil className="mr-2 size-4" />
            Edit
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="mt-1 flex items-center gap-2 text-sm font-medium">
              <Calendar className="size-4" />
              {formatDate(tag.createdAt)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">ID</p>
            <Badge variant="secondary" className="mt-1 font-mono text-xs">
              {tag._id}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
