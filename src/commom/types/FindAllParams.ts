import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindAllParams {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'O parametro take deve ser um número' })
  @Min(1, { message: 'O parametro take deve ser no mínimo 1' })
  @Type(() => Number)
  perPage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'O parametro page deve ser um número' })
  @Min(1, { message: 'O parametro page deve ser no mínimo 1' })
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Nome da ordenação deve ser uma string' })
  orderName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: 'Orderdirection deve ser "ASC" ou "DESC"' })
  orderDirection?: 'ASC' | 'DESC';
}
