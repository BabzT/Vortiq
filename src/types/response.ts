export type ResponseType<T> =
  | { error: false; data: T }
  | { error: true; message: string; statusCode: number };

export interface ResponseTypeWithPagination<T> {
  error: false;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
