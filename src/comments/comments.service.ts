import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from '../users/dto/update-comment.dto';
import { CreateCommentDto } from '../users/dto/create-comment.dto';
import { UserRole } from '../common/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
    private usersService: UsersService,
  ) {}
   
  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) {
      throw new NotFoundException(`Комментарий с ID ${id} не найден`);
    }
    return comment;
  }
  
  async create(dto: CreateCommentDto) {
    const user = await this.usersService.findOne(dto.user_id);
    
    if (user.role !== UserRole.AUTHOR) {
      throw new ForbiddenException('Только пользователи с ролью AUTHOR могут оставлять комментарии');
    }

    const comment = this.commentsRepo.create(dto);
    return this.commentsRepo.save(comment);
  }

  async findByTask(taskId: string) {
    return this.commentsRepo.find({
      where: { task_id: taskId },
      order: { created_at: 'DESC' }
    });
  }
  async update(id: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findOne(id); 
    Object.assign(comment, dto);            
    return this.commentsRepo.save(comment); 
  }

  async remove(id: string) {
  const comment = await this.findOne(id);
  await this.commentsRepo.remove(comment);
  return { message: 'Комментарий удален успешно' };
}}