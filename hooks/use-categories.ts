"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_PAGE_LIMIT, QUERY_KEYS } from "@/lib/constants";
import { categoriesService } from "@/services/categories.service";
import { DEFAULT_META, type ListQueryParams, type PaginatedResult } from "@/types/api";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";

type CategoriesQueryParams = ListQueryParams & Record<string, unknown>;

export function useCategories(params?: CategoriesQueryParams) {
  const queryParams = {
    limit: params?.limit ?? DEFAULT_PAGE_LIMIT,
    page: params?.page ?? 1,
    ...(params?.search ? { search: params.search } : {}),
  };

  return useQuery({
    queryKey: QUERY_KEYS.categories(queryParams),
    queryFn: () => categoriesService.getAll(queryParams),
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.category(id),
    queryFn: () => categoriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory(listParams?: CategoriesQueryParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoriesService.create(payload),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.categories() });
      const previous = queryClient.getQueriesData<PaginatedResult<Category>>({
        queryKey: QUERY_KEYS.categories(),
      });

      const optimistic: Category = {
        _id: `temp-${Date.now()}`,
        name: newCategory.name,
      };

      queryClient.setQueriesData<PaginatedResult<Category>>(
        { queryKey: QUERY_KEYS.categories() },
        (old) => {
          if (!old) return { data: [optimistic], meta: DEFAULT_META };
          return {
            ...old,
            data: [optimistic, ...old.data],
            meta: { ...old.meta, total: old.meta.total + 1 },
          };
        }
      );

      return { previous };
    },
    onSuccess: (created) => {
      queryClient.setQueriesData<PaginatedResult<Category>>(
        { queryKey: QUERY_KEYS.categories() },
        (old) => {
          if (!old) return old;
          const data = old.data.filter((c) => !c._id.startsWith("temp-"));
          return { ...old, data: [created, ...data] };
        }
      );
      toast.success("Category created successfully");
    },
    onError: (error: { message?: string }, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.message ?? "Failed to create category");
    },
  });
}

export function useUpdateCategory(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCategoryPayload) =>
      categoriesService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.category(id), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories() });
      toast.success("Category updated successfully");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to update category");
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.categories() });
      const previous = queryClient.getQueriesData<PaginatedResult<Category>>({
        queryKey: QUERY_KEYS.categories(),
      });

      queryClient.setQueriesData<PaginatedResult<Category>>(
        { queryKey: QUERY_KEYS.categories() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((c) => c._id !== id),
            meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
          };
        }
      );

      return { previous };
    },
    onError: (error: { message?: string }, _id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.message ?? "Failed to delete category");
    },
    onSuccess: () => {
      toast.success("Category deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.categories() });
    },
  });
}
