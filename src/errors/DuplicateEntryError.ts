export class DuplicateEntryError extends Error {
  constructor(readonly message: string) {
    super(message);
  }
}
