import { IsString, IsUUID, MinLength, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  user_id: string; 

  @IsUUID()
  task_id: string; 

  @IsString()
  @MinLength(1, { message: 'Текст комментария должен быть минимум 1 символ' })
  @MaxLength(1000, { message: 'Текст комментария не может быть длиннее 1000 символов' })
  text: string;}
