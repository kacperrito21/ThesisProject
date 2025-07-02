import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CategoryController } from './category.controller';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService],
  exports: [CategoryService],
})
export class CategoryModule {}
