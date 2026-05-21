"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Eye } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedViewCountProps {
  count: number;
  pulse?: boolean;
  className?: string;
}

export function AnimatedViewCount({
  count,
  pulse = false,
  className,
}: AnimatedViewCountProps) {
  const spring = useSpring(count, {
    stiffness: 120,
    damping: 18,
    mass: 0.6,
  });

  const display = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    spring.set(count);
  }, [count, spring]);

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-foreground",
        className
      )}
      animate={
        pulse
          ? {
              scale: [1, 1.12, 1],
            }
          : undefined
      }
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <Eye className="size-4 text-violet-500" />
      <motion.span className="tabular-nums">{display}</motion.span>
      <span className="text-muted-foreground">views</span>
    </motion.span>
  );
}
