import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(email: string, password: string, firstName: string) {
    const existing = await this.findByEmail(email);
    if (existing) {
      throw new ConflictException(
        'Użytkownik z tym adresem e-mail już istnieje',
      );
    }

    return this.prisma.user.create({
      data: {
        email,
        password,
        firstName,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
