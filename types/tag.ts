export interface Tag {
  _id: string;
  name: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface CreateTagPayload {
  name: string;
}

export interface UpdateTagPayload {
  name: string;
}
