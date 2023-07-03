export class UserPasswordMatchesError extends Error {
  constructor(username: string) {
    super(`Password didn't match for username: '${username}'`);
    Object.setPrototypeOf(this, UserPasswordMatchesError.prototype);
  }
}
