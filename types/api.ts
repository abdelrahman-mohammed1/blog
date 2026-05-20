export interface ApiError {
  message: string;
  status?: number;
}

export type ApiListResponse<T> = T[] | { data: T[]; items?: T[] };
