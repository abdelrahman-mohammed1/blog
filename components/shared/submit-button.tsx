"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading?: boolean;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function SubmitButton({
  isLoading,
  children,
  className,
  disabled,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        "h-11 rounded-xl cursor-pointer px-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
      {children}
    </Button>
  );
}
