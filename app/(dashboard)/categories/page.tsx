"use client";

import { CategoryForm } from "@/features/categories/category-form";
import { CategoriesList } from "@/features/categories/categories-list";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Organize your blog posts with categories."
      />

      <Card className="rounded-2xl border-border/60 bg-card/50 shadow-sm backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-base">Add category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>

      <CategoriesList />
    </div>
  );
}
