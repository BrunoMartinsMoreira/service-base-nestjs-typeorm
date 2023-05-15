import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './providers/users.providers';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ServiceBase } from 'src/commom/utils/service.base';

@Injectable()
export class UsersService extends ServiceBase<User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
