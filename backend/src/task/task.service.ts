import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task, TaskStatus, TaskPriority, Prisma } from '@prisma/client';
import { CreateTaskDto, FindTasksDto, UpdateTaskDto } from './task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async get(
    userId: string,
    limit: string,
    includeCompleted?: boolean,
  ): Promise<{
    items: Task[];
    monthDue: { dueDate: Date | null; priority: TaskPriority }[];
  }> {
    const statusFilter = includeCompleted
      ? undefined
      : { not: 'COMPLETED' as Task['status'] };
    const startOfTomorrow = new Date();
    startOfTomorrow.setHours(24, 0, 0, 0);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const items = await this.prisma.task.findMany({
      where: {
        userId,
        status: statusFilter,
        dueDate: { gte: startOfToday, lt: startOfTomorrow },
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
    });
    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0,
    );
    const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
      0,
      0,
      0,
      0,
    );
    const monthDue = await this.prisma.task.findMany({
      where: {
        userId,
        dueDate: { gte: startOfMonth, lt: startOfNextMonth },
        status: { not: 'COMPLETED' as Task['status'] },
      },
      select: { dueDate: true, priority: true },
      orderBy: { dueDate: 'asc' },
    });
    return { items, monthDue };
  }

  async findAll(userId: string, filters: FindTasksDto): Promise<Task[]> {
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(filters.title && {
        title: { contains: filters.title },
      }),
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.status && { status: filters.status }),
      ...(filters.description && {
        description: { contains: filters.description },
      }),
    };

    if (filters.month && filters.year) {
      const month = parseInt(filters.month, 10) - 1;
      const year = parseInt(filters.year, 10);
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      where.dueDate = { gte: start, lt: end };
    }
    if (
      filters.includeCompleted !== undefined &&
      filters.includeCompleted === 'false'
    ) {
      where.status = { not: 'COMPLETED' };
    }

    return this.prisma.task.findMany({
      where,
      orderBy: { dueDate: 'asc' },
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

  async delete(taskId: string, userId: string): Promise<boolean> {
    const existingTask = await this.userTask(taskId, userId);
    if (!existingTask) {
      throw new NotFoundException('Task not found or access denied');
    }
    await this.prisma.task.delete({
      where: { id: taskId },
    });
    return true;
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
