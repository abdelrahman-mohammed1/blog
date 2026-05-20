"use client";

import { use } from "react";
import { CategoryDetail } from "@/features/categories/category-detail";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <CategoryDetail id={id} />;
}
