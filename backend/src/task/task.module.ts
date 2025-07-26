import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../../prisma/prisma.service';
import { TaskController } from './tak.controller';
import { TasksCronService } from './task-cron.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, PrismaService, TasksCronService],
  exports: [TaskService],
})
export class TaskModule {}
