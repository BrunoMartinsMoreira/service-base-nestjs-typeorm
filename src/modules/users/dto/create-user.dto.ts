import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'nome deve ser uma string' })
  name: string;

  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Envie um email válido' })
  email: string;

  @IsOptional()
  @IsInt({ message: 'Idade deve ser um inteiro' })
  age: number;

  @IsOptional()
  @IsDateString()
  bithDate: Date;

  @IsOptional()
  @IsEmail({}, { message: 'Envie um email válido' })
  about: string;
}
