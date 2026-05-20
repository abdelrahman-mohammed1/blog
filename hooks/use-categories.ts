"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { categoriesService } from "@/services/categories.service";
import type { CreateCategoryPayload } from "@/types/category";

export function useCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.categories,
    queryFn: categoriesService.getAll,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesService.create(payload),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.categories });
      const previous = queryClient.getQueryData(QUERY_KEYS.categories);

      queryClient.setQueryData(
        QUERY_KEYS.categories,
        (old: typeof previous) => {
          const list = Array.isArray(old) ? old : [];
          return [
            ...list,
            {
              _id: `temp-${Date.now()}`,
              name: newCategory.name,
            },
          ];
        }
      );

      return { previous };
    },
    onError: (error: { message?: string }, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.categories, context.previous);
      }
      toast.error(error.message ?? "Failed to create category");
    },
    onSuccess: () => {
      toast.success("Category created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.categories });
      const previous = queryClient.getQueryData(QUERY_KEYS.categories);

      queryClient.setQueryData(QUERY_KEYS.categories, (old: unknown) => {
        const list = Array.isArray(old) ? old : [];
        return list.filter((c: { _id: string }) => c._id !== id);
      });

      return { previous };
    },
    onError: (error: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.categories, context.previous);
      }
      toast.error(error.message ?? "Failed to delete category");
    },
    onSuccess: () => {
      toast.success("Category deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories });
    },
  });
}
