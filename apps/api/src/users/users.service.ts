import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async create(data: {
    email: string;
    password: string;
    name: string;
    roleId: number;
  }) {
    return this.prisma.user.create({ data, include: { role: true } });
  }

  async getCustomerRoleId(): Promise<number> {
    const role = await this.prisma.role.findUnique({ where: { name: 'customer' } });
    if (!role) throw new Error('Role "customer" not found — run db:seed first');
    return role.id;
  }
}