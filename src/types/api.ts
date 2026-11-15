/** Success envelope every backend route returns. */
export interface CustomResponse<T> {
  status_code: number;
  message: string;
  result: T;
}

/** Error envelope: `error` is a list of field errors on a 422. */
export interface CustomError {
  status_code: number;
  message: string;
  error: string | { field: string | null; msg: string }[] | null;
}
