import 'reflect-metadata';
import { EpisodeResolver } from './resolvers/episode';
import { ApolloContext } from './types/apolloContext';
import { UserResolver } from './resolvers/user';
import { AnimeResolver } from './resolvers/anime';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { config } from './config/ormconfig';
import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import cors from 'cors';

dotenv.config();

const main = async () => {
  const conn = await createConnection(config);
  await conn.runMigrations();

  const port = process.env.SERVER_PORT || 3000;

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      credentials: true,
      origin: 'http://localhost:4000',
    })
  );

  app.use(
    session({
      name: process.env.COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      secret: process.env.SESSION_SECRET!,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 days,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [AnimeResolver, UserResolver, EpisodeResolver],
    }),
    context: ({ req, res }): ApolloContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(port, () => {
    console.log(`Server is running on ${port} 🚀`);
  });
};

main().catch(err => {
  console.log(`Server err: ${err}`);
});
