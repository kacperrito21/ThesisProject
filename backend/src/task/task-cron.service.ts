import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksCronService {
  private readonly logger = new Logger(TasksCronService.name);

  constructor(private prisma: PrismaService) {}

  @Cron('0 0 * * *')
  async markOverdueTasks() {
    const now = new Date();

    const result = await this.prisma.task.updateMany({
      where: {
        dueDate: { lt: now },
        status: { in: ['TODO'] },
      },
      data: {
        status: 'OVERDUE',
      },
    });
    this.logger.log(` Zaktualizowano ${result.count} zadań na OVERDUE`);
  }
}
