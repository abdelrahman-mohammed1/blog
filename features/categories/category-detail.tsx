"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, FolderOpen, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { CategoryForm } from "@/features/categories/category-form";
import { useCategory } from "@/hooks/use-categories";
import { ROUTES } from "@/lib/constants";

interface CategoryDetailProps {
  id: string;
}

function formatDate(date?: string) {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CategoryDetail({ id }: CategoryDetailProps) {
  const { data: category, isLoading, isError, error } = useCategory(id);
  const [editMode, setEditMode] = useState(false);

  if (isLoading) return <TableSkeleton rows={3} cols={2} />;

  if (isError || !category) {
    return (
      <EmptyState
        title="Category not found"
        description={(error as { message?: string })?.message}
        action={
          <Link href={ROUTES.categories}>
            <Button variant="outline" className="rounded-xl">
              <ArrowLeft className="mr-2 size-4" />
              Back to categories
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
          <h2 className="font-heading text-xl font-semibold">Edit category</h2>
          <Button variant="ghost" onClick={() => setEditMode(false)}>
            Cancel
          </Button>
        </div>
        <CategoryForm
          mode="edit"
          categoryId={category._id}
          defaultValues={{ name: category.name }}
          onSuccess={() => setEditMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <Link
        href={ROUTES.categories}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to categories
      </Link>

      <div className="rounded-2xl border border-border/60 bg-card/50 p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-violet-500/10">
              <FolderOpen className="size-7 text-violet-500" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold">
                {category.name}
              </h1>
              {category.slug && (
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  /{category.slug}
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
              {formatDate(category.createdAt)}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">ID</p>
            <Badge variant="secondary" className="mt-1 font-mono text-xs">
              {category._id}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
