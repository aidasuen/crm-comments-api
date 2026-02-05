import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email: string;

  @IsNotEmpty({ message: 'Пароль не может быть пустым' })
  @MinLength(6, { message: 'Пароль слишком короткий (мин. 6 символов)' })
  password: string;

  @IsEnum(UserRole, { message: 'Роль должна быть либо AUTHOR, либо USER' })
  role: UserRole;
}
