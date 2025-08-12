export interface IBaseModel {
  _id?: string;

  createdAt?: string;
  updatedAt?: string;
}

export enum EVoteType {
  UP = "up",
  DOWN = "down",
}

export interface IBasePageQuery {
  page: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}
