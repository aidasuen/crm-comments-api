import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from '../users/dto/create-task.dto';

@Controller('tasks')
export class TasksController {
 
  constructor(private readonly tasksService: TasksService) {}

  
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

 
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
}