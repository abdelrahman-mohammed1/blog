"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectBadgesProps {
  items: { _id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function MultiSelectBadges({
  items,
  selected,
  onToggle,
  loading,
  emptyMessage = "No items available.",
  className,
}: MultiSelectBadgesProps) {
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading...</p>
    );
  }

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => {
        const isSelected = selected.includes(item._id);
        return (
          <Badge
            key={item._id}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "cursor-pointer rounded-lg px-3 py-1.5 text-sm transition-all",
              "hover:scale-[1.02] hover:shadow-sm",
              isSelected && "bg-primary/90"
            )}
            onClick={() => onToggle(item._id)}
          >
            {item.name}
            {isSelected && <X className="ml-1.5 size-3" />}
          </Badge>
        );
      })}
    </div>
  );
}
