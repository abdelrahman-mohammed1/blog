"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EMOJIS = ["🎉", "📖", "🔥", "✨", "🧠", "👀"];

interface FloatingEmojisProps {
  active: boolean;
  className?: string;
}

export function FloatingEmojis({ active, className }: FloatingEmojisProps) {
  if (!active) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[99] overflow-hidden",
        className
      )}
    >
      {EMOJIS.map((emoji, i) => (
        <motion.span
          key={`${emoji}-${i}`}
          className="absolute text-2xl sm:text-3xl"
          style={{
            left: `${12 + i * 14}%`,
            bottom: "18%",
          }}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -120 - i * 20],
            scale: [0.5, 1.2, 1],
            rotate: [-10, 10, -5],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.08,
            ease: "easeOut",
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}
