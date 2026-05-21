"use client";

import { motion } from "framer-motion";
import {
  FileText,
  FolderOpen,
  LayoutDashboard,
  PodcastIcon,
  Tags,
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

function isNavActive(pathname: string, href: string) {
  if (href === ROUTES.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/50 bg-sidebar/90 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-[4.5rem] items-center gap-3 border-b border-border/50 px-7 py-5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500 shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02]">
          <PodcastIcon className="size-[18px] text-white" />
        </div>
        <div className="space-y-0.5">
          <p className="font-heading text-[15px] font-bold tracking-tight">
            Blog CMS
          </p>
          <p className="text-[11px] text-muted-foreground">Content studio</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-5 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Menu
        </p>
        <div className="flex flex-col gap-3.5">
        {navItems.map((item, index) => {
          const isActive = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                className={cn(
                  "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm ring-1 ring-border/50"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-violet-500" />
                )}
                <Icon
                  className={cn(
                    "size-[18px] shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-violet-500"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                <span className="tracking-tight">{item.label}</span>
              </motion.div>
            </Link>
          );
        })} 
        </div>
      </nav>

      <div className="border-t border-border/50 px-7 py-5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Built by Moemen Adam · {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}
