import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserRequest } from '../interfaces/userRequest.interface';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
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
}
