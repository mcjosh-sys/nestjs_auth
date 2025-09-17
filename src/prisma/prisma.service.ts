import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from 'lib/generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL', {
      infer: true,
    });
    const adapter = new PrismaNeon({ connectionString });
    super({ adapter });
  }
}
