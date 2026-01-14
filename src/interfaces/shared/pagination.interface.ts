export interface PaginationQuery {
  page: number;
  limit: number;
  search?: string;
  role?:"user" |"vendor"
}


export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

