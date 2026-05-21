"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Tags, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DebouncedSearch } from "@/components/shared/debounced-search";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";
import { useDeleteTag, useTags } from "@/hooks/use-tags";
import { buildListParams } from "@/lib/query-params";
import { ROUTES } from "@/lib/constants";
import type { Tag } from "@/types/tag";

export function TagsList() {
  const { searchParams, updateParams, page } = useUrlParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteTag = useDeleteTag();

  const apiParams = useMemo(
    () => buildListParams(searchParams),
    [searchParams],
  );
  const { data, isLoading, isFetching, isError, error } = useTags({
    page,
    search: apiParams.search as string | undefined,
  });

  const tags = data?.data ?? [];
  const meta = data?.meta;
  const searchValue = searchParams.get("search") ?? "";

  const handleSearch = useCallback(
    (value: string) => updateParams({ search: value || null }),
    [updateParams],
  );

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
  const columns: Column<Tag>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={ROUTES.tag(item._id)}
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          <Tags className="size-4 text-indigo-500" />
          {item.name}
        </Link>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cell: (item) => (
        <Link
          href={ROUTES.tag(item._id)}
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          {item.slug ?? "—"}
        </Link>
      ),
    },
    {
      key: "created",
      header: "Created",
      cell: (item) => (
        <Link
          href={ROUTES.tag(item._id)}
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          {item?.createdAt
            ? new Date(item?.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </Link>
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

  if (isLoading) return <TableSkeleton rows={4} cols={4} />;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load tags"
        description={(error as { message?: string })?.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DebouncedSearch
        value={searchValue}
        onDebouncedChange={handleSearch}
        placeholder="Search tags..."
      />

      {isFetching && !isLoading && (
        <p className="text-xs text-muted-foreground">Updating...</p>
      )}

      {!tags.length ? (
        <EmptyState
          icon={Tags}
          title={searchValue ? "No matching tags" : "No tags yet"}
          description={
            searchValue
              ? `No results for "${searchValue}"`
              : "Create your first tag using the form above."
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={tags}
          keyExtractor={(item) => item._id}
        />
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
    </div>
  );
}
