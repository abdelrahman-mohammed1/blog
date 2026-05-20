"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const updateParams = useCallback(
    (
      updates: Record<string, string | null | undefined>,
      options?: { resetPage?: boolean }
    ) => {
      const next = new URLSearchParams(searchParamsKey);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      });

      if (options?.resetPage !== false) {
        const hasNonPageChange = Object.keys(updates).some((k) => k !== "page");
        if (hasNonPageChange) {
          next.delete("page");
        }
      }

      const nextQs = next.toString();

      // Skip navigation when nothing changed — prevents RSC refetch loops
      if (nextQs === searchParamsKey) {
        return;
      }

      const href = nextQs ? `${pathname}?${nextQs}` : pathname;
      router.replace(href, { scroll: false });
    },
    [searchParamsKey, pathname, router]
  );

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  const page = Number(searchParams.get("page") ?? "1") || 1;

  return { searchParams, updateParams, get, page };
}
