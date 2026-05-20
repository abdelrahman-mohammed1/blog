"use client";

import { use } from "react";
import { PostDetail } from "@/features/posts/post-detail";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <PostDetail id={id} />;
}
