import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from '../users/dto/create-task.dto';
import { UpdateTaskDto } from '../users/dto/update-task.dto';
import { UserRole } from '../common/enums/role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepo: Repository<Task>,
    private usersService: UsersService, 
  ) {}

  async create(dto: CreateTaskDto) {
    const user = await this.usersService.findOne(dto.user_id);
    
    
    if (user.role !== UserRole.USER) {
      throw new ForbiddenException('Только пользователи с ролью USER могут создавать задачи');
    }

    const task = this.tasksRepo.create(dto);
    return this.tasksRepo.save(task);
  }

  async findAll() {
    return this.tasksRepo.find({
      order: { created_at: 'DESC' },
      relations: ['user'], 
    });
  }

  async findOne(id: string) {
    const task = await this.tasksRepo.findOne({ 
      where: { id },
      relations: ['comments'] 
    });
    if (!task) throw new NotFoundException('Задача не найдена');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.tasksRepo.save(task);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    await this.tasksRepo.remove(task);
    return { message: 'Задача удалена' };
  }
}