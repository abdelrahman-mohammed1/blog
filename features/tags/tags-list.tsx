"use client";

import { useState } from "react";
import { Tags, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeleteTag, useTags } from "@/hooks/use-tags";
import type { Tag } from "@/types/tag";

export function TagsList() {
  const { data, isLoading, isError, error } = useTags();
  const deleteTag = useDeleteTag();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: Column<Tag>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Tags className="size-4 text-indigo-500" />
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
        title="Failed to load tags"
        description={(error as { message?: string })?.message}
      />
    );
  }

  if (!data?.length) {
    return (
      <EmptyState
        icon={Tags}
        title="No tags yet"
        description="Create your first tag using the form above."
      />
    );
  }

  return (
    <>
      <DataTable columns={columns} data={data} keyExtractor={(item) => item._id} />
      <ConfirmDeleteDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete tag?"
        description="This action cannot be undone."
        isLoading={deleteTag.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteTag.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </>
  );
}
