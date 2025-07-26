import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { UserDecorator } from '../decorators/user.decorator';
import { UserRequest } from '../interfaces/userRequest.interface';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(
    @UserDecorator() user: UserRequest,
    @Query('name') name?: string,
  ) {
    return await this.categoryService.findAll(user.sub, name);
  }

  @Post()
  async create(
    @UserDecorator() user: UserRequest,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.create(user.sub, dto.name, dto.color);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @UserDecorator() user: UserRequest,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, user.sub, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @UserDecorator() user: UserRequest) {
    return this.categoryService.delete(id, user.sub);
  }
}
