declare namespace Express {
  export interface Request {
    authCtx: {
      userId: number;
      username: string;
    };
  }
}
