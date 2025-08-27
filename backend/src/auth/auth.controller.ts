import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  UnauthorizedException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthGuard } from './auth.guard';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as process from 'node:process';
import { UserDecorator } from '../decorators/user.decorator';
import { UserRequest } from '../interfaces/userRequest.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('verify')
  @UseGuards(AuthGuard)
  verify(@UserDecorator() user: UserRequest) {
    return { valid: true, user };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new UnauthorizedException(
        'Taki użytkownik nie istnieje w aplikacji',
      );
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      throw new UnauthorizedException('Hasło niepoprawne, spróbuj ponownie');

    const payload = { email, sub: user.id };
    const jwtOptions: jwt.SignOptions = { expiresIn: '7d' };

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new InternalServerErrorException('Missing JWT secret');
    const isProd = process.env.NODE_ENV === 'production';
    const domain = isProd ? process.env.DOMAIN : undefined;
    const token = jwt.sign(payload, secret, jwtOptions);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.SAME_SITE as
        | 'lax'
        | 'strict'
        | 'none'
        | boolean
        | undefined,
      ...(domain ? { domain } : {}),
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, firstName: user.firstName });
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; firstName: string },
    @Res() res: Response,
  ) {
    const { email, password, firstName } = body;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException(
        'Użytkownik o podanym adresie e-mail znajduje się już w aplikacji',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 14);

    const user = await this.userService.create(
      email,
      hashedPassword,
      firstName,
    );

    const payload = { email, sub: user.id };
    const jwtOptions: jwt.SignOptions = { expiresIn: '1h' };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new InternalServerErrorException('Missing JWT secret');

    const token = jwt.sign(payload, secret, jwtOptions);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.SAME_SITE as
        | 'lax'
        | 'strict'
        | 'none'
        | boolean
        | undefined,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ success: true });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    const isProd = process.env.NODE_ENV === 'production';
    const domain = isProd ? process.env.DOMAIN : undefined;
    res.clearCookie('token', {
      domain: process.env.DOMAIN ?? 'api.tackly.org',
      path: '/',
    });
    res.clearCookie('token', { ...(domain ? { domain } : {}), path: '/' });
    res.status(200).json({ success: true });
  }
}
