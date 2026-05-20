"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PostForm } from "@/features/posts/post-form";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create Post"
        description="Write and publish a new blog post with categories and tags."
      />
      <PostForm />
    </div>
  );
}
