"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_PAGE_LIMIT, QUERY_KEYS } from "@/lib/constants";
import { tagsService } from "@/services/tags.service";
import { DEFAULT_META, type ListQueryParams, type PaginatedResult } from "@/types/api";
import type { CreateTagPayload, Tag, UpdateTagPayload } from "@/types/tag";

type TagsQueryParams = ListQueryParams & Record<string, unknown>;

export function useTags(params?: TagsQueryParams) {
  const queryParams = {
    limit: params?.limit ?? DEFAULT_PAGE_LIMIT,
    page: params?.page ?? 1,
    ...(params?.search ? { search: params.search } : {}),
  };

  return useQuery({
    queryKey: QUERY_KEYS.tags(queryParams),
    queryFn: () => tagsService.getAll(queryParams),
  });
}

export function useTag(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.tag(id),
    queryFn: () => tagsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTag(listParams?: TagsQueryParams) {
  const queryClient = useQueryClient();
  const queryKey = QUERY_KEYS.tags({
    limit: listParams?.limit ?? DEFAULT_PAGE_LIMIT,
    page: listParams?.page ?? 1,
    ...(listParams?.search ? { search: listParams.search } : {}),
  });

  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagsService.create(payload),
    onMutate: async (newTag) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tags() });
      const previous = queryClient.getQueriesData<PaginatedResult<Tag>>({
        queryKey: QUERY_KEYS.tags(),
      });

      const optimistic: Tag = {
        _id: `temp-${Date.now()}`,
        name: newTag.name,
      };

      queryClient.setQueriesData<PaginatedResult<Tag>>(
        { queryKey: QUERY_KEYS.tags() },
        (old) => {
          if (!old) return { data: [optimistic], meta: DEFAULT_META };
          return {
            ...old,
            data: [optimistic, ...old.data],
            meta: { ...old.meta, total: old.meta.total + 1 },
          };
        }
      );

      return { previous, queryKey };
    },
    onSuccess: (created) => {
      queryClient.setQueriesData<PaginatedResult<Tag>>(
        { queryKey: QUERY_KEYS.tags() },
        (old) => {
          if (!old) return old;
          const data = old.data.filter((t) => !t._id.startsWith("temp-"));
          return { ...old, data: [created, ...data] };
        }
      );
      toast.success("Tag created successfully");
    },
    onError: (error: { message?: string }, _vars, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(error.message ?? "Failed to create tag");
    },
  });
}

export function useUpdateTag(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTagPayload) => tagsService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.tag(id), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags() });
      toast.success("Tag updated successfully");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to update tag");
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagsService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tags() });
      const previous = queryClient.getQueriesData<PaginatedResult<Tag>>({
        queryKey: QUERY_KEYS.tags(),
      });

      queryClient.setQueriesData<PaginatedResult<Tag>>(
        { queryKey: QUERY_KEYS.tags() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((t) => t._id !== id),
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
      toast.error(error.message ?? "Failed to delete tag");
    },
    onSuccess: () => {
      toast.success("Tag deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags() });
    },
  });
}
