export class UserLoginNotFoundError extends Error {
  constructor(username: string) {
    super(`User login details not found for username: '${username}'`);
    Object.setPrototypeOf(this, UserLoginNotFoundError.prototype);
  }
}
