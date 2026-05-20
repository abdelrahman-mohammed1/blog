"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/lib/constants";
import { postsService } from "@/services/posts.service";
import type { CreatePostPayload } from "@/types/post";

export function usePosts() {
  return useQuery({
    queryKey: QUERY_KEYS.posts,
    queryFn: postsService.getAll,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsService.create(payload),
    onSuccess: () => {
      toast.success("Post published successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to create post");
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts });
      const previous = queryClient.getQueryData(QUERY_KEYS.posts);

      queryClient.setQueryData(QUERY_KEYS.posts, (old: unknown) => {
        const list = Array.isArray(old) ? old : [];
        return list.filter((p: { _id: string }) => p._id !== id);
      });

      return { previous };
    },
    onError: (error: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEYS.posts, context.previous);
      }
      toast.error(error.message ?? "Failed to delete post");
    },
    onSuccess: () => {
      toast.success("Post deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts });
    },
  });
}
