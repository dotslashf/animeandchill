import { Session, SessionData } from 'express-session';
import { Redis } from 'ioredis';
import { Request, Response } from 'express';

export type ApolloContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
};
