export interface Tag {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTagPayload {
  name: string;
}
