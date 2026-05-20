import type { ListQueryParams, PaginatedResult } from "@/types/api";
import type { CreateTagPayload, Tag, UpdateTagPayload } from "@/types/tag";
import { api, unwrapPaginated, unwrapSingle } from "./api";

export const tagsService = {
  getAll: async (params?: ListQueryParams): Promise<PaginatedResult<Tag>> => {
    const { data } = await api.get<unknown>("/tags", { params });
    return unwrapPaginated<Tag>(data);
  },

  getById: async (id: string): Promise<Tag> => {
    const { data } = await api.get<unknown>(`/tags/${id}`);
    return unwrapSingle<Tag>(data);
  },

  create: async (payload: CreateTagPayload): Promise<Tag> => {
    const { data } = await api.post<unknown>("/tags", payload);
    return unwrapSingle<Tag>(data);
  },

  update: async (id: string, payload: UpdateTagPayload): Promise<Tag> => {
    const { data } = await api.put<unknown>(`/tags/${id}`, payload);
    return unwrapSingle<Tag>(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
