import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  async create(userId: string, name: string, color: string): Promise<Category> {
    const existing = await this.findByName(name, userId);
    if (!existing) {
      throw new Error('User with this category name already exists');
    }
    if (!this.isValidHexColor(color)) {
      throw new Error(
        'Invalid color format. Must be a valid hex code like #RRGGBB or #RGB',
      );
    }
    return this.prisma.category.create({
      data: {
        userId,
        name,
        color,
      },
    });
  }
  async update(
    userId: string,
    currentName: string,
    newName?: string,
    newColor?: string,
  ): Promise<Category> {
    const existing = await this.findByName(currentName, userId);
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    const updateData: Partial<{ name: string; color: string }> = {};

    if (newName) {
      const nameExists = await this.findByName(newName, userId);
      if (nameExists && nameExists.id !== existing.id) {
        throw new BadRequestException(
          'Another category with this name already exists',
        );
      }
      updateData.name = newName;
    }

    if (newColor) {
      if (!this.isValidHexColor(newColor)) {
        throw new BadRequestException(
          'Invalid color format. Must be a valid hex code like #RRGGBB or #RGB',
        );
      }
      updateData.color = newColor;
    }

    return this.prisma.category.update({
      where: { name_userId: { name: currentName, userId } },
      data: updateData,
    });
  }
  async delete(userId: string, name: string) {
    const existing = await this.findByName(name, userId);
    if (!existing) {
      throw new Error('Category not found');
    }

    return this.prisma.category.delete({
      where: { name_userId: { name, userId } },
    });
  }
  async findByName(name: string, userId: string): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { name_userId: { name, userId: userId } },
    });
  }
  isValidHexColor(color: string): boolean {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
  }
}
