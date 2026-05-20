import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/lib/constants";
import {
  DEFAULT_META,
  type ApiSuccessResponse,
  type PaginatedResult,
  type PaginationMeta,
} from "@/types/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  timeout: 30_000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Something went wrong";

    return Promise.reject({
      message,
      status: error.response?.status,
    });
  }
);

export function unwrapPaginated<T>(response: unknown): PaginatedResult<T> {
  if (response && typeof response === "object") {
    const obj = response as ApiSuccessResponse<T[]>;
    if (Array.isArray(obj.data)) {
      return {
        data: obj.data,
        meta: obj.meta ?? { ...DEFAULT_META, total: obj.data.length },
      };
    }
  }

  if (Array.isArray(response)) {
    return {
      data: response as T[],
      meta: { ...DEFAULT_META, total: (response as T[]).length },
    };
  }

  return { data: [], meta: DEFAULT_META };
}

export function unwrapSingle<T>(response: unknown): T {
  if (response && typeof response === "object") {
    const obj = response as ApiSuccessResponse<T>;
    if ("data" in obj && obj.data !== undefined && obj.data !== null) {
      return obj.data as T;
    }
    return response as T;
  }
  return response as T;
}

/** @deprecated Use unwrapPaginated */
export function unwrapList<T>(data: unknown): T[] {
  return unwrapPaginated<T>(data).data;
}
