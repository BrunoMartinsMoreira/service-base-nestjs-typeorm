import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { DATA_SOURCE } from 'src/config/datasource.provider';
import { IProvider } from 'src/commom/types/IProvider';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const usersProviders: IProvider<User>[] = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: [DATA_SOURCE],
  },
];
