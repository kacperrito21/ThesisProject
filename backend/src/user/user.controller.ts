import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserRequest } from '../interfaces/userRequest.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getLoggedInUser(@UserDecorator() user: UserRequest) {
    return this.userService.findById(user.sub);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(
      dto.email,
      dto.password,
      dto.firstName,
    );
    return { id: user.id, email: user.email };
  }
  @Patch()
  @UseGuards(AuthGuard)
  async update(@UserDecorator() user: UserRequest, @Body() dto: UpdateUserDto) {
    return await this.userService.update(user.sub, dto);
  }
}
