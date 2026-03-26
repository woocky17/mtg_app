export interface CardFilters {
  name?: string;
  color?: string;
  rarity?: string;
  type?: string;
  set?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
