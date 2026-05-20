"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

const titles: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.categories]: "Categories",
  [ROUTES.tags]: "Tags",
  [ROUTES.posts]: "Posts",
  [ROUTES.postsNew]: "Create Post",
};

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 rounded-xl lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage your blog content
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-sm font-semibold text-violet-600 dark:text-violet-300 sm:flex">
          MA
        </div>
      </div>
    </header>
  );
}
