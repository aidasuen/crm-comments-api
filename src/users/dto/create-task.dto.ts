import { IsString, IsUUID, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsUUID('4', { message: 'user_id должен быть валидным UUID' })
  @IsNotEmpty({ message: 'user_id обязателен' })
  user_id: string; 

  @IsString()
  @IsNotEmpty({ message: 'Заголовок задачи не может быть пустым' })
  @MinLength(3, { message: 'Заголовок должен быть минимум 3 символа' })
  title: string; // 

  @IsString()
  @IsNotEmpty({ message: 'Описание задачи не может быть пустым' })
  @MinLength(1, { message: 'Описание задачи должно быть минимум 1 символ' })
  @MaxLength(1000, { message: 'Описание задачи не может быть длиннее 1000 символов' })
  description: string; 
}