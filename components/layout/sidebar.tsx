"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  PenSquare,
  PodcastIcon,
  Tags,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const navItems = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.posts, label: "Posts", icon: FileText },
  { href: ROUTES.categories, label: "Categories", icon: FolderOpen },
  { href: ROUTES.tags, label: "Tags", icon: Tags },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border/60 px-6">
        <div className="flex size-9 items-center justify-center rounded-xl bg-violet-500 shadow-xl shadow-violet-500/20">
          <PodcastIcon className="size-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight">Blog</p>
          <p className="text-xs text-muted-foreground">Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item, index) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.dashboard &&
              pathname.startsWith(item.href) &&
              item.href !== ROUTES.postsNew) ||
            (item.href === ROUTES.postsNew && pathname === ROUTES.postsNew);

          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0 transition-colors",
                    isActive ? "text-violet-500" : "group-hover:text-foreground"
                  )}
                />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        <p className="text-xs text-muted-foreground">
          Built by Moemen Adam {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
