export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly errors: string[],
    readonly originalError?: Error
  ) {
    super(originalError?.message);
  }
}
