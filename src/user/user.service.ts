import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await hash(password);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findOne(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async updateTokens(userId: string, hashedAccessToken: string | null, hashedRefreshToken: string | null) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { hashedAccessToken, hashedRefreshToken },
    });
  }
}
