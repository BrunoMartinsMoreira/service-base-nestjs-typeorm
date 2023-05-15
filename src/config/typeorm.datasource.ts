import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: false, // DON'T CHANGE IT TO TRUE!!! NEVER!!!
  logging: true,
  migrations: ['dist/database/migrations/*.js'],
  extra: {
    charset: 'utf8_general_ci',
    decimalNumbers: true,
  },
});
