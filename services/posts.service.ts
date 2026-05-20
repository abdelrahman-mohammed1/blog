import { buildPostFormData } from "@/lib/post-utils";
import type { PostsQueryParams } from "@/types/api";
import type { PaginatedResult } from "@/types/api";
import type {
  CreatePostPayload,
  Post,
  PostFormValues,
  UpdatePostPayload,
} from "@/types/post";
import { api, unwrapPaginated, unwrapSingle } from "./api";

function toFormValues(
  payload: CreatePostPayload | UpdatePostPayload
): PostFormValues {
  return {
    title: payload.title,
    content: payload.content,
    categories: payload.categories,
    tags: payload.tags,
    image: "image" in payload && payload.image ? payload.image : null,
  };
}

export const postsService = {
  getAll: async (
    params?: PostsQueryParams
  ): Promise<PaginatedResult<Post>> => {
    const { data } = await api.get<unknown>("/posts", { params });
    return unwrapPaginated<Post>(data);
  },

  getById: async (id: string): Promise<Post> => {
    const { data } = await api.get<unknown>(`/posts/${id}`);
    return unwrapSingle<Post>(data);
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const formData = buildPostFormData(toFormValues(payload));
    const { data } = await api.post<unknown>("/posts", formData);
    return unwrapSingle<Post>(data);
  },

  update: async (id: string, payload: UpdatePostPayload): Promise<Post> => {
    const formData = buildPostFormData(toFormValues(payload));
    const { data } = await api.put<unknown>(`/posts/${id}`, formData);
    return unwrapSingle<Post>(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  incrementViews: async (id: string): Promise<Post> => {
    const { data } = await api.patch<unknown>(`/posts/${id}/view`);
    return unwrapSingle<Post>(data);
  },
};
