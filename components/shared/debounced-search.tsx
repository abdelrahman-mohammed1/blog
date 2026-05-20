"use client";

import { useEffect, useRef, useState } from "react";
import { SearchInput } from "@/components/shared/search-input";
import { useDebounce } from "@/hooks/use-debounce";

interface DebouncedSearchProps {
  placeholder?: string;
  value: string;
  onDebouncedChange: (value: string) => void;
  className?: string;
  delay?: number;
}

export function DebouncedSearch({
  placeholder,
  value,
  onDebouncedChange,
  className,
  delay = 400,
}: DebouncedSearchProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, delay);
  const onDebouncedChangeRef = useRef(onDebouncedChange);

  useEffect(() => {
    onDebouncedChangeRef.current = onDebouncedChange;
  }, [onDebouncedChange]);

  // Sync from URL when user navigates back/forward or clears filters externally
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Only push to URL when debounced value differs from current URL param
  useEffect(() => {
    if (debounced === value) return;
    onDebouncedChangeRef.current(debounced);
  }, [debounced, value]);

  return (
    <SearchInput
      value={local}
      onChange={setLocal}
      placeholder={placeholder}
      className={className}
    />
  );
}
