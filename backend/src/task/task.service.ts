import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Task, TaskStatus, TaskPriority } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}
  async create(
    userId: string,
    categoryId: string,
    title: string,
    description: string,
    status: TaskStatus,
    priority: TaskPriority,
    dueDate: string | Date | null,
  ): Promise<Task> {
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        id: categoryId,
        userId,
      },
    });
    if (!categoryExists) {
      throw new NotFoundException('Category with this name does not exist');
    }
    const dueDateParsed =
      typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    return this.prisma.task.create({
      data: {
        userId,
        categoryId,
        title,
        description,
        status,
        priority,
        dueDate: dueDateParsed,
      },
    });
  }
  async update(
    taskId: string,
    userId: string,
    categoryId?: string,
    title?: string,
    description?: string,
    status?: TaskStatus,
    priority?: TaskPriority,
    dueDate?: string | Date | null,
    finishedDate?: string | Date,
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

    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) {
      updateData.dueDate =
        typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    }
    if (finishedDate !== undefined) {
      updateData.finishedDate =
        typeof finishedDate === 'string'
          ? new Date(finishedDate)
          : finishedDate;
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
