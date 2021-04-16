import { Redis } from 'ioredis';
import { Request, Response } from 'express';

export type ApolloContext = {
  req: Request;
  res: Response;
  redis: Redis;
};
