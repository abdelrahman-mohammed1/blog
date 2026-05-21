export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginationMeta {
  limit: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

export interface ApiSuccessResponse<T> {
  status: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export const DEFAULT_META: PaginationMeta = {
  limit: 15,
  current_page: 1,
  last_page: 1,
  from: 0,
  to: 0,
  total: 0,
};

export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PostsQueryParams extends ListQueryParams {
  categories?: string;
  tags?: string;
  sort?: "views" | "-views";
}
