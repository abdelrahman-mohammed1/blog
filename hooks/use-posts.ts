"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { DEFAULT_PAGE_LIMIT, QUERY_KEYS } from "@/lib/constants";
import { postsService } from "@/services/posts.service";
import type { PaginatedResult, PostsQueryParams } from "@/types/api";
import type {
  CreatePostPayload,
  Post,
  UpdatePostPayload,
} from "@/types/post";

export function usePosts(params?: PostsQueryParams) {
  const queryParams = {
    limit: params?.limit ?? DEFAULT_PAGE_LIMIT,
    page: params?.page ?? 1,
    ...(params?.search ? { search: params.search } : {}),
    ...(params?.categories ? { categories: params.categories } : {}),
    ...(params?.tags ? { tags: params.tags } : {}),
    ...(params?.sort ? { sort: params.sort } : {}),
  };

  return useQuery({
    queryKey: QUERY_KEYS.posts(queryParams),
    queryFn: () => postsService.getAll(queryParams),
    placeholderData: (previousData) => previousData,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.post(id),
    queryFn: () => postsService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsService.create(payload),
    onSuccess: () => {
      toast.success("Post published successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts() });
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to create post");
    },
  });
}

export function useUpdatePost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) =>
      postsService.update(id, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.post(id), updated);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts() });
      toast.success("Post updated successfully");
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message ?? "Failed to update post");
    },
  });
}

export function useIncrementPostViews(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postsService.incrementViews(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post(id) });

      const previousPost = queryClient.getQueryData<Post>(QUERY_KEYS.post(id));
      const previousLists = queryClient.getQueriesData<PaginatedResult<Post>>({
        queryKey: QUERY_KEYS.posts(),
      });

      if (previousPost) {
        queryClient.setQueryData<Post>(QUERY_KEYS.post(id), {
          ...previousPost,
          views: (previousPost.views ?? 0) + 1,
        });
      }

      queryClient.setQueriesData<PaginatedResult<Post>>(
        { queryKey: QUERY_KEYS.posts() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p._id === id ? { ...p, views: (p.views ?? 0) + 1 } : p
            ),
          };
        }
      );

      return { previousPost, previousLists };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post(id), context.previousPost);
      }
      context?.previousLists?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(QUERY_KEYS.post(id), updated);
      queryClient.setQueriesData<PaginatedResult<Post>>(
        { queryKey: QUERY_KEYS.posts() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((p) =>
              p._id === id ? { ...p, views: updated.views } : p
            ),
          };
        }
      );
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.posts() });
      const previous = queryClient.getQueriesData<PaginatedResult<Post>>({
        queryKey: QUERY_KEYS.posts(),
      });

      queryClient.setQueriesData<PaginatedResult<Post>>(
        { queryKey: QUERY_KEYS.posts() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((p) => p._id !== id),
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
      toast.error(error.message ?? "Failed to delete post");
    },
    onSuccess: () => {
      toast.success("Post deleted");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.posts() });
    },
  });
}
