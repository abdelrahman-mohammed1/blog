import type { CreatePostPayload, Post } from "@/types/post";
import { api, unwrapList } from "./api";

export const postsService = {
  getAll: async (): Promise<Post[]> => {
    const { data } = await api.get<unknown>("/posts");
    return unwrapList<Post>(data);
  },

  create: async (payload: CreatePostPayload): Promise<Post> => {
    const { data } = await api.post<Post>("/posts", payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
