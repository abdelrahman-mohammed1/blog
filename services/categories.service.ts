import type { Category, CreateCategoryPayload } from "@/types/category";
import { api, unwrapList } from "./api";

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await api.get<unknown>("/categories");
    return unwrapList<Category>(data);
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const { data } = await api.post<Category>("/categories", payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
