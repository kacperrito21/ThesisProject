import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  DeleteCategoryDto,
  UpdateCategoryDto,
} from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return await this.categoryService.create(dto.userId, dto.name, dto.color);
  }
  @Patch()
  async update(@Body() dto: UpdateCategoryDto) {
    return await this.categoryService.update(
      dto.userId,
      dto.currentName,
      dto.newName,
      dto.newColor,
    );
  }
  @Delete()
  async delete(@Body() dto: DeleteCategoryDto) {
    return await this.categoryService.delete(dto.userId, dto.name);
  }
}
