"use client";

import { useState } from "react";
import { FolderOpen, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@/types/category";

export function CategoriesList() {
  const { data, isLoading, isError, error } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <FolderOpen className="size-4 text-violet-500" />
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
    {
      key: "id",
      header: "ID",
      cell: (item) => (
        <Badge variant="secondary" className="font-mono text-xs">
          {item._id.slice(-8)}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-16 text-right",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
          onClick={() => setDeleteId(item._id)}
          disabled={item._id.startsWith("temp-")}
        >
          <Trash2 className="size-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <TableSkeleton rows={4} cols={3} />;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load categories"
        description={(error as { message?: string })?.message}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No categories yet"
        description="Create your first category using the form above."
      />
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(item) => item._id}
      />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete category?"
        description="This action cannot be undone. Posts linked to this category may be affected."
        isLoading={deleteCategory.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteCategory.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
