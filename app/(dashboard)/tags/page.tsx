"use client";

import { TagForm } from "@/features/tags/tag-form";
import { TagsList } from "@/features/tags/tags-list";
import { PageHeader } from "@/components/shared/page-header";
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
          <CardTitle className="text-base">Add tag</CardTitle>
        </CardHeader>
        <CardContent>
          <TagForm />
        </CardContent>
      </Card>

      <TagsList />
    </div>
  );
}
