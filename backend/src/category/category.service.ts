import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Category } from '@prisma/client';
import { UpdateCategoryDto } from './category.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, name?: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(name ? { name: { contains: name } } : {}),
      },
      orderBy: { name: 'asc' },
    });
  }

  async create(userId: string, name: string, color: string): Promise<Category> {
    if (!this.isValidHexColor(color)) {
      throw new BadRequestException(
        'Invalid color. Use hex code like #RRGGBB or #RGB',
      );
    }
    const exists = await this.prisma.category.findFirst({
      where: { userId, name },
    });
    if (exists) {
      throw new BadRequestException('Category name already in use');
    }
    return this.prisma.category.create({
      data: { userId, name, color },
    });
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Category not found');
    }

    const data: Partial<{ name: string; color: string }> = {};
    if (dto.name && dto.name !== existing.name) {
      const dup = await this.prisma.category.findFirst({
        where: { userId, name: dto.name },
      });
      if (dup) {
        throw new BadRequestException('Another category with this name exists');
      }
      data.name = dto.name;
    }
    if (dto.color) {
      if (!this.isValidHexColor(dto.color)) {
        throw new BadRequestException(
          'Invalid color. Use hex code like #RRGGBB or #RGB',
        );
      }
      data.color = dto.color;
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Category> {
    const existing = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException('Category not found');
    }
    return this.prisma.category.delete({
      where: { id },
    });
  }

  private isValidHexColor(color: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
  }
}
