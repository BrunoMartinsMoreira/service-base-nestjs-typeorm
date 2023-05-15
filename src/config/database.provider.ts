import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './datasource.provider';

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/**/database/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: true,
        extra: {
          charset: 'utf8_general_ci',
          decimalNumbers: true,
        },
      });

      return dataSource.initialize();
    },
  },
];
