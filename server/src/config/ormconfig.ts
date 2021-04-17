import { ConnectionOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config: ConnectionOptions = {
  type: 'postgres',
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  logging: true,
  synchronize: true,
  entities: ['dist/entities/*.js'],
  migrations: [path.join(__dirname, '../migrations/*')],
};
