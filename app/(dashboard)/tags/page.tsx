"use client";

import { Suspense } from "react";
import { TagForm } from "@/features/tags/tag-form";
import { TagsList } from "@/features/tags/tags-list";
import { PageHeader } from "@/components/shared/page-header";
import { TableSkeleton } from "@/components/shared/table-skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TagsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tags"
        description="Label and filter your content with tags."
      />

      <Card className="rounded-2xl border-border/60 bg-card/50 shadow-sm backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-heading text-base">Add tag</CardTitle>
        </CardHeader>
        <CardContent>
          <TagForm />
        </CardContent>
      </Card>

      <Suspense fallback={<TableSkeleton rows={4} cols={4} />}>
        <TagsList />
      </Suspense>
    </div>
  );
}
