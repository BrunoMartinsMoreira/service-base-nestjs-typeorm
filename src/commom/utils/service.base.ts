import { HttpStatus, Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { IDefaultResponse } from '../types/DefaultResponse';
import { DefaultMessages } from '../types/DefaultMessages';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Pagination } from '../types/Pagination';
import { httpExceptionHandler } from './httpExceptionHandler';

@Injectable()
export class ServiceBase<T> {
  constructor(protected repository: Repository<T>) {}

  async getAll(paramns: {
    tableName: string;
    whereFilters?: FindOptionsWhere<T>[];
    order?: {
      orderByColumn?: string;
      orderDirection?: 'ASC' | 'DESC';
    };
    relationsEntities?: string[];
    perPage?: number;
    page?: number;
  }): Promise<Pagination<T>> {
    const { page, perPage, whereFilters, order, relationsEntities, tableName } =
      paramns;

    const skipValue = page === 1 ? 0 : perPage * (page - 1);
    const skip = page ? skipValue : undefined;
    const takeValue = paramns.perPage ?? 10;

    let query = this.repository.createQueryBuilder(tableName).select();

    if (whereFilters.length)
      for (const condition of whereFilters) {
        query = condition !== undefined ? query.where(condition) : query;
      }

    if (relationsEntities)
      for (const relation of relationsEntities) {
        query.leftJoinAndSelect(`${tableName}.${relation}`, `${relation}`);
      }

    query = order
      ? query.orderBy(
          `${tableName}.${order.orderByColumn}`,
          order.orderDirection,
          'NULLS LAST',
        )
      : query.orderBy(`${tableName}.createdAt`, 'DESC', 'NULLS LAST');

    const [result, total] = await query
      .skip(skip)
      .take(takeValue)
      .getManyAndCount();

    const lastPage = Math.ceil(total / perPage);

    return {
      total,
      lastPage,
      page: page || null,
      perPage: perPage || null,
      data: result,
      message: [DefaultMessages.QUERY_SUCCESS],
    };
  }

  async store(
    body: DeepPartial<T>,
    validateUnique?: boolean,
    validateUniqueValues?: {
      value: FindOptionsWhere<T>;
      columnName: string;
    }[],
  ): Promise<IDefaultResponse<T>> {
    if (validateUnique)
      for (const item of validateUniqueValues) {
        await this.validateUnique({
          condition: item?.value,
          errorMessage: `${item.columnName} já está sendo utilizado`,
        });
      }

    const newData = this.repository.create(body);
    await this.repository.save(newData);

    return {
      message: [DefaultMessages.CREATED],
      data: newData,
    };
  }

  async show(params: {
    condition?: FindOptionsWhere<T>;
    relationsEntities?: string[];
  }): Promise<IDefaultResponse<T>> {
    const { condition, relationsEntities } = params;

    await this.validateExists({
      condition,
      errorMessage: DefaultMessages.DATA_NOT_FOUND,
    });

    const data = await this.repository.findOne({
      where: condition ?? undefined,
      relations: relationsEntities ?? [],
    });

    return {
      message: [DefaultMessages.QUERY_SUCCESS],
      data,
    };
  }

  async destroy(
    condition: string | string[] | number | number[] | FindOptionsWhere<T>,
  ): Promise<IDefaultResponse<T>> {
    const result = await this.repository.delete(condition);
    if (result.affected > 0)
      return {
        message: [DefaultMessages.DELETED],
        data: null,
      };

    return httpExceptionHandler(
      DefaultMessages.DATA_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }

  async update(paramns: {
    condition: FindOptionsWhere<T>;
    body: QueryDeepPartialEntity<T>;
    validateUnique?: boolean;
    validateUniqueValues?: {
      value: any;
      columnName: string;
    }[];
  }): Promise<IDefaultResponse<T>> {
    const { validateUnique, validateUniqueValues } = paramns;
    if (validateUnique)
      for (const item of validateUniqueValues) {
        await this.validateUnique({
          condition: item?.value,
          errorMessage: `${item.columnName} já está sendo utilizado`,
        });
      }

    const result = await this.repository.update(
      paramns.condition,
      paramns.body,
    );

    if (result.affected > 0) {
      const data = await this.repository.findOne({
        where: paramns.condition as any,
      });
      return {
        message: [DefaultMessages.UPDATED],
        data: data,
      };
    }

    return httpExceptionHandler(
      DefaultMessages.DATA_NOT_FOUND,
      HttpStatus.NOT_FOUND,
    );
  }

  public async validateExists(params: {
    condition: FindOptionsWhere<T>;
    errorMessage: string;
  }): Promise<void> {
    const { errorMessage, condition } = params;
    const data = await this.repository.findOne({ where: condition });

    if (!data) return httpExceptionHandler(errorMessage, HttpStatus.NOT_FOUND);
  }

  async validateUnique(paramns: {
    condition: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    errorMessage: string;
  }) {
    const conflictAlreadyExists = await this.repository.findOne({
      where: paramns.condition,
    });

    if (conflictAlreadyExists)
      return httpExceptionHandler(paramns.errorMessage, HttpStatus.CONFLICT);
  }
}
