import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth() {
    const [users, products, categories] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.category.count(),
    ]);
    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      counts: { users, products, categories },
    };
  }
}