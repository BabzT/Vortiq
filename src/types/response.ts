export type ResponseType<T> =
  | { error: false; data: T }
  | { error: true; message: string; statusCode: number };
