import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../users/dto/create-task.dto';
import { UpdateTaskDto } from '../users/dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserRole } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard) 
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateTaskDto) {
    if (req.user.role !== UserRole.USER) {
      throw new ForbiddenException('Только пользователи с ролью USER могут создавать задачи');
    }

    if (req.user.userId !== dto.user_id) {
       throw new ForbiddenException('Вы не можете создавать задачи для других пользователей');
    }

    return this.tasksService.create(dto);
  }

  @Get()
  async findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    const task = await this.tasksService.findOne(id);

    
    if (task.user_id !== req.user.userId) {
      throw new ForbiddenException('Редактирование чужих задач запрещено');
    }

    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const task = await this.tasksService.findOne(id);

    if (task.user_id !== req.user.userId) {
      throw new ForbiddenException('Удаление чужих задач запрещено');
    }

    return this.tasksService.remove(id);
  }
}