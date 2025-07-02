import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(TaskStatus, {
    message: 'Status must be one of: TODO, IN_PROGRESS, COMPLETED, OVERDUE',
  })
  status: TaskStatus;

  @IsEnum(TaskPriority, {
    message: 'Priority must be one of: LOW, MEDIUM, HIGH',
  })
  priority: TaskPriority;

  @IsNotEmpty()
  dueDate: Date;
}
export class UpdateTaskDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status must be one of: TODO, IN_PROGRESS, DONE, CANCELLED',
  })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, {
    message: 'Priority must be one of: LOW, MEDIUM, HIGH, URGENT',
  })
  priority?: TaskPriority;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Finished date must be a valid ISO date string',
    },
  )
  dueDate?: string;

  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'Finished date must be a valid ISO date string',
    },
  )
  finishedDate?: string;
}

export class DeleteTaskDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  userId: string;
}
