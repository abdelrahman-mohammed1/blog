"use client";

import { Menu, User } from "lucide-react";
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

function resolveTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/posts/") && pathname !== ROUTES.postsNew) {
    return "Post Details";
  }
  if (pathname.startsWith("/tags/")) return "Tag Details";
  if (pathname.startsWith("/categories/")) return "Category Details";
  return "Dashboard";
}

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-5 backdrop-blur-xl sm:px-8">
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
          <h2 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            Manage your blog content
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-muted transition-colors hover:bg-muted/80">
          <User className="size-5 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
