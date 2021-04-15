import { Anime } from './../entities/Anime';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';

dotenv.config();

export const config: ConnectionOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  synchronize: true,
  entities: [Anime],
  migrations: [path.join(__dirname, './migrations/*')],
};
