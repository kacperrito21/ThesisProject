import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto, FindTasksDto, UpdateTaskDto } from './task.dto';
import { UserDecorator } from '../decorators/user.decorator';
import { UserRequest } from '../interfaces/userRequest.interface';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('recent')
  getRecentTasks(
    @UserDecorator() user: UserRequest,
    @Query('amount') amount: string,
    @Query('includeCompleted') includeCompleted?: boolean,
  ) {
    return this.taskService.get(user.sub, amount, includeCompleted);
  }

  @Get()
  async findAll(
    @UserDecorator() user: UserRequest,
    @Query() filters: FindTasksDto,
  ) {
    return this.taskService.findAll(user.sub, filters);
  }

  @Post()
  async create(@UserDecorator() user: UserRequest, @Body() dto: CreateTaskDto) {
    return await this.taskService.create(user.sub, dto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UserDecorator() user: UserRequest,
    @Body() dto: UpdateTaskDto,
  ) {
    return await this.taskService.update(id, user.sub, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @UserDecorator() user: UserRequest) {
    return await this.taskService.delete(id, user.sub);
  }
}
