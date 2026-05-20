"use client";

import { use } from "react";
import { TagDetail } from "@/features/tags/tag-detail";

export default function TagDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <TagDetail id={id} />;
}
