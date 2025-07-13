import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task, TaskStatus, TaskPriority } from '@prisma/client';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async get(
    userId: string,
    limit: string,
    includeCompleted?: boolean,
  ): Promise<Task[]> {
    console.log(includeCompleted);
    const statusFilter = includeCompleted
      ? undefined
      : { not: 'COMPLETED' as Task['status'] };
    console.log(statusFilter);
    return this.prisma.task.findMany({
      where: { userId, status: statusFilter },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });
  }

  async create(userId: string, dto: CreateTaskDto): Promise<Task> {
    if (dto.categoryId) {
      const categoryExists = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          userId,
        },
      });

      if (!categoryExists) {
        throw new NotFoundException('Category not found or access denied');
      }
    }
    const dueDateParsed =
      typeof dto.dueDate === 'string' ? new Date(dto.dueDate) : dto.dueDate;
    return this.prisma.task.create({
      data: {
        userId,
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        dueDate: dueDateParsed,
      },
    });
  }

  async update(
    taskId: string,
    userId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const existingTask = await this.userTask(taskId, userId);
    if (!existingTask) {
      throw new NotFoundException('Task not found or access denied');
    }
    const updateData: Partial<{
      categoryId: string;
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
      dueDate: Date | null;
      finishedDate: Date;
    }> = {};

    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.dueDate !== undefined) {
      updateData.dueDate =
        typeof dto.dueDate === 'string' ? new Date(dto.dueDate) : dto.dueDate;
    }
    if (dto.finishedDate !== undefined) {
      updateData.finishedDate =
        typeof dto.finishedDate === 'string'
          ? new Date(dto.finishedDate)
          : dto.finishedDate;
    }
    return this.prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async delete(taskId: string, userId: string): Promise<Task> {
    const existingTask = await this.userTask(taskId, userId);
    if (!existingTask) {
      throw new NotFoundException('Task not found or access denied');
    }
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }

  async userTask(taskId: string, userId: string): Promise<Task | null> {
    return this.prisma.task.findFirst({
      where: {
        id: taskId,
        userId,
      },
    });
  }
}
