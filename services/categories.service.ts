import type { ListQueryParams, PaginatedResult } from "@/types/api";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/category";
import { api, unwrapPaginated, unwrapSingle } from "./api";

export const categoriesService = {
  getAll: async (
    params?: ListQueryParams,
  ): Promise<PaginatedResult<Category>> => {
    const { data } = await api.get<unknown>("/categories", { params });
    return unwrapPaginated<Category>(data);
  },

  getById: async (id: string): Promise<Category> => {
    const { data } = await api.get<unknown>(`/categories/${id}`);
    return unwrapSingle<Category>(data);
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post<unknown>("/categories", payload);
    return unwrapSingle<Category>(data);
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<Category> => {
    const { data } = await api.patch<unknown>(`/categories/${id}`, payload);
    return unwrapSingle<Category>(data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
