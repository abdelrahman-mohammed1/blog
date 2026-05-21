"use client";

import { motion } from "framer-motion";
import { Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  getCategoryNames,
  getTagNames,
  resolveImageUrl,
} from "@/lib/post-utils";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  index?: number;
  onDelete?: (id: string) => void;
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PostCard({ post, index = 0, onDelete }: PostCardProps) {
  const imageUrl = resolveImageUrl(post.image);
  const categories = getCategoryNames(post);
  const tags = getTagNames(post);

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className="group relative"
    >
      <Link
        href={ROUTES.post(post._id)}
        className="block overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/25 hover:shadow-xl hover:shadow-violet-500/5"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-500/10 via-muted to-indigo-500/10">
              <span className="font-heading text-4xl text-muted-foreground/40">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-heading line-clamp-2 text-lg font-bold tracking-tight text-white sm:text-xl">
              {post.title}
            </h3>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Eye className="size-3.5" />
              {post.views ?? 0}
            </span>
          </div>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {post.content.replace(/<[^>]+>/g, "").slice(0, 160)}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((name) => (
              <Badge
                key={`cat-${name}`}
                variant="secondary"
                className="rounded-md text-xs"
              >
                {name}
              </Badge>
            ))}
            {tags.map((name) => (
              <Badge
                key={`tag-${name}`}
                variant="outline"
                className="rounded-md text-xs"
              >
                {name}
              </Badge>
            ))}
          </div>
        </div>
      </Link>

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 z-10 size-8 rounded-lg bg-background/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:text-destructive"
          onClick={(e) => {
            e.preventDefault();
            onDelete(post._id);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </motion.article>
  );
}
