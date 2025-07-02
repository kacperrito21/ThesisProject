import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, DeleteTaskDto, UpdateTaskDto } from './task.dto';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto) {
    return await this.taskService.create(
      dto.userId,
      dto.categoryId,
      dto.title,
      dto.description,
      dto.status,
      dto.priority,
      dto.dueDate,
    );
  }

  @Patch()
  async update(@Body() dto: UpdateTaskDto) {
    return await this.taskService.update(
      dto.id,
      dto.userId,
      dto.categoryId,
      dto.title,
      dto.description,
      dto.status,
      dto.priority,
      dto.dueDate,
      dto.finishedDate,
    );
  }

  @Delete()
  async delete(@Body() dto: DeleteTaskDto) {
    return await this.taskService.delete(dto.id, dto.userId);
  }
}
