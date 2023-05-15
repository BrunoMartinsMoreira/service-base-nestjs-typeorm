import { DataSource, Repository } from 'typeorm';

export interface IProvider<T> {
  provide: string;
  useFactory: (dataSouce: DataSource) => Repository<T>;
  inject: string[];
}
