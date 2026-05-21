"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { FolderOpen, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DebouncedSearch } from "@/components/shared/debounced-search";
import { EmptyState } from "@/components/shared/empty-state";
import { ListPagination } from "@/components/shared/list-pagination";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Button } from "@/components/ui/button";
import { useUrlParams } from "@/hooks/use-url-params";
import { useCategories, useDeleteCategory } from "@/hooks/use-categories";
import { buildListParams } from "@/lib/query-params";
import { ROUTES } from "@/lib/constants";
import type { Category } from "@/types/category";

export function CategoriesList() {
  const { searchParams, updateParams, page } = useUrlParams();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteCategory = useDeleteCategory();

  const apiParams = useMemo(
    () => buildListParams(searchParams),
    [searchParams],
  );
  const { data, isLoading, isFetching, isError, error } = useCategories({
    page,
    search: apiParams.search as string | undefined,
  });

  const categories = data?.data ?? [];
  const meta = data?.meta;
  const searchValue = searchParams.get("search") ?? "";

  const handleSearch = useCallback(
    (value: string) => updateParams({ search: value || null }),
    [updateParams],
  );

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "Name",
      cell: (item) => (
        <Link
          href={ROUTES.category(item._id)}
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          <FolderOpen className="size-4 text-violet-500" />
          {item.name}
        </Link>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      cell: (item) => (
        <Link
          href={ROUTES.category(item._id)}
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
          href={ROUTES.category(item._id)}
          className="flex items-center gap-2 font-medium transition-colors hover:text-primary"
        >
          {item?.createdAt
            ? new Date(item?.createdAt as string).toLocaleString("en-US", {
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

  // if (isLoading) return <TableSkeleton rows={4} cols={4} />;

  if (isError) {
    return (
      <EmptyState
        title="Failed to load categories"
        description={(error as { message?: string })?.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DebouncedSearch
        value={searchValue}
        onDebouncedChange={handleSearch}
        placeholder="Search categories..."
      />

      {isFetching && !isLoading && (
        <p className="text-xs text-muted-foreground">Updating...</p>
      )}
      <>
        {isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : (
          <>
            {!categories.length ? (
              <EmptyState
                icon={FolderOpen}
                title={
                  searchValue ? "No matching categories" : "No categories yet"
                }
                description={
                  searchValue
                    ? `No results for "${searchValue}"`
                    : "Create your first category using the form above."
                }
              />
            ) : (
              <DataTable
                columns={columns}
                data={categories}
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
          </>
        )}
      </>
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
    </div>
  );
}
