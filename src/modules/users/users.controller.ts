import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { defaultErrorHandler } from 'src/commom/utils/defaultErrorHandler';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { Like } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return this.usersService.store(createUserDto, true, [
        {
          value: { email: createUserDto.email },
          columnName: 'email',
        },
      ]);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllUsersDto) {
    try {
      const orderByParamns =
        query.orderDirection && query.orderName
          ? {
              orderByColumn: query.orderName,
              orderDirection: query.orderDirection,
            }
          : undefined;

      return this.usersService.getAll({
        tableName: 'users',
        page: query?.page,
        perPage: query?.perPage,
        order: orderByParamns,
        whereFilters: [
          query.name ? { name: Like(`%${query.name}%`) } : undefined,
          query.email ? { email: Like(`%${query.email}%`) } : undefined,
        ],
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.usersService.show({
        condition: { id: +id },
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return this.usersService.update({
        condition: { id: +id },
        body: updateUserDto,
      });
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.destroy(+id);
    } catch (error) {
      return defaultErrorHandler(error);
    }
  }
}
