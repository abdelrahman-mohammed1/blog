export interface Category {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name: string;
}
