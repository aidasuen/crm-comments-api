import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from '../users/dto/create-comment.dto'; 
import { UpdateCommentDto } from '../users/dto/update-comment.dto'; 
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateCommentDto) {
    if (req.user.role !== UserRole.AUTHOR) {
      throw new ForbiddenException('Только пользователи с ролью автор могут оставлять комментарии');
    }

    if (req.user.userId !== dto.user_id) {
      throw new ForbiddenException('Нельзя оставлять комментарий от имени другого пользователя');
    }

    return this.commentsService.create(dto);
  }

  @Get('task/:taskId')
  async findByTask(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    const comment = await this.commentsService.findOne(id);

    if (comment.user_id !== req.user.userId) {
      throw new ForbiddenException('Вы не можете редактировать чужой комментарий');
    }

    return this.commentsService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const comment = await this.commentsService.findOne(id);

    if (comment.user_id !== req.user.userId) {
      throw new ForbiddenException('Вы не можете удалить чужой комментарий');
    }

    return this.commentsService.remove(id);
  }
}