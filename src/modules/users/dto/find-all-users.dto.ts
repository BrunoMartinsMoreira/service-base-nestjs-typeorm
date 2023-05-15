import { IsOptional, IsString, IsEmail } from 'class-validator';
import { FindAllParams } from 'src/commom/types/FindAllParams';

export class FindAllUsersDto extends FindAllParams {
  @IsOptional()
  @IsString({ message: 'nome deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Envie um email válido' })
  email?: string;
}
