import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from './providers/users.providers';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ServiceBase } from 'src/commom/utils/service.base';

/**
 * Exemplo de uso da classe em um service, todas os métodos de crud
 * são herdados do ServiceBase, podendo focar aqui nas regras de negócio
 */
@Injectable()
export class UsersService extends ServiceBase<User> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly usersRepository: Repository<User>,
  ) {
    super(usersRepository);
  }
}
