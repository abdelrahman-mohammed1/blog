"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  FolderOpen,
  PenSquare,
  Tags,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/hooks/use-categories";
import { usePosts } from "@/hooks/use-posts";
import { useTags } from "@/hooks/use-tags";
import { ROUTES } from "@/lib/constants";

const quickLinks = [
  {
    href: ROUTES.postsNew,
    label: "New Post",
    icon: PenSquare,
    description: "Write and publish content",
  },
  {
    href: ROUTES.categories,
    label: "Categories",
    icon: FolderOpen,
    description: "Organize your posts",
  },
  {
    href: ROUTES.tags,
    label: "Tags",
    icon: Tags,
    description: "Label your content",
  },
  {
    href: ROUTES.posts,
    label: "All Posts",
    icon: FileText,
    description: "Browse published posts",
  },
];

export default function DashboardPage() {
  const { data: posts } = usePosts();
  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const stats = [
    { label: "Posts", value: posts?.length ?? 0 },
    { label: "Categories", value: categories?.length ?? 0 },
    { label: "Tags", value: tags?.length ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back"
        description="Manage posts, categories, and tags from your modern CMS dashboard."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="rounded-2xl border-border/60 bg-card/60 shadow-sm backdrop-blur-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <Link href={link.href}>
                <Card className="group rounded-2xl border-border/60 bg-card/50 transition-all hover:border-violet-500/40 hover:shadow-md">
                  <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 transition-transform group-hover:scale-105">
                      <Icon className="size-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{link.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
