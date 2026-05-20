"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { tagsService } from "@/services/tags.service";
import type { CreateTagPayload } from "@/types/tag";

export function useTags() {
  return useQuery({
    queryKey: QUERY_KEYS.tags,
    queryFn: tagsService.getAll,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagsService.create(payload),
    onMutate: async (newTag) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tags });
      const previous = queryClient.getQueryData(QUERY_KEYS.tags);

      queryClient.setQueryData(QUERY_KEYS.tags, (old: unknown) => {
        const list = Array.isArray(old) ? old : [];
        return [
          ...list,
          { _id: `temp-${Date.now()}`, name: newTag.name },
        ];
      });

      return { previous };
    },
    onError: (error: { message?: string }, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.tags, context.previous);
      }
      toast.error(error.message ?? "Failed to create tag");
    },
    onSuccess: () => {
      toast.success("Tag created successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => tagsService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.tags });
      const previous = queryClient.getQueryData(QUERY_KEYS.tags);

      queryClient.setQueryData(QUERY_KEYS.tags, (old: unknown) => {
        const list = Array.isArray(old) ? old : [];
        return list.filter((t: { _id: string }) => t._id !== id);
      });

      return { previous };
    },
    onError: (error: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.tags, context.previous);
      }
      toast.error(error.message ?? "Failed to delete tag");
    },
    onSuccess: () => {
      toast.success("Tag deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tags });
    },
  });
}
