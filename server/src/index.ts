import 'reflect-metadata';
import { HelloResolver } from './resolvers/hello';
import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { config } from './config/ormconfig';

dotenv.config();

const main = async () => {
  const conn = await createConnection(config);

  await conn.runMigrations();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
    }),
  });

  apolloServer.applyMiddleware({ app });

  app.get('/', (_, res) => [res.status(200).json({ msg: 'Hello' })]);

  app.listen(process.env.SERVER_PORT || 3000, () => {
    console.log(`Server is running on ${process.env.SERVER_PORT || 3000} 🚀`);
  });
};

main().catch(err => {
  console.log(`Server err: ${err}`);
});
