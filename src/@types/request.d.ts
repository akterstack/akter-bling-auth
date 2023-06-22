declare namespace Express {
  export interface Request {
    authCtx?: {
      username: string;
    };
  }
}
