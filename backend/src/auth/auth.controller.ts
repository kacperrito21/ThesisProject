import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

interface JwtPayload {
  sub: string;
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('verify')
  @UseGuards(AuthGuard)
  verify(@Req() req: Request) {
    const user = (req as any).user as JwtPayload;
    return { valid: true, user };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;

    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const payload = { email, sub: user.id };
    const jwtOptions: jwt.SignOptions = { expiresIn: '1h' };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new InternalServerErrorException('Missing JWT secret');

    const token = jwt.sign(payload, secret, jwtOptions);
    return res.status(200).json({ token });
  }
}
