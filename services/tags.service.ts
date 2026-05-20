import type { Tag, CreateTagPayload } from "@/types/tag";
import { api, unwrapList } from "./api";

export const tagsService = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await api.get<unknown>("/tags");
    return unwrapList<Tag>(data);
  },

  create: async (payload: CreateTagPayload): Promise<Tag> => {
    const { data } = await api.post<Tag>("/tags", payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
