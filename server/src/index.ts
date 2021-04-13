import 'reflect-metadata';
import { HelloResolver } from './resolvers/hello';
// import { createConnection } from 'typeorm';
import * as dotenv from 'dotenv';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

dotenv.config();

const main = async () => {
  // const conn = await createConnection({
  //   type: 'postgres',
  //   database: process.env.DB_NAME,
  //   username: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   logging: true,
  //   synchronize: true,
  //   entities: [],
  // });
  // tes

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
