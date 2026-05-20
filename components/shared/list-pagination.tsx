"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PaginationMeta } from "@/types/api";
import { cn } from "@/lib/utils";

interface ListPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  className?: string;
}

export function ListPagination({
  meta,
  onPageChange,
  className,
}: ListPaginationProps) {
  const { current_page, last_page, from, to, total } = meta;

  if (last_page <= 1 && total <= meta.limit) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{from || 0}</span>
        {" – "}
        <span className="font-medium text-foreground">{to || 0}</span> of{" "}
        <span className="font-medium text-foreground">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="mr-2 text-sm text-muted-foreground">
          Page {current_page} of {last_page}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={current_page <= 1}
          onClick={() => onPageChange(current_page - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg"
          disabled={current_page >= last_page}
          onClick={() => onPageChange(current_page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
