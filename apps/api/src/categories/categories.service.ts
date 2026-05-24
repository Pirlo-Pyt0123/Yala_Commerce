import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  adminFindAll() {
    return this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        isActive: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async adminFindOne(id: number) {
    const cat = await this.prisma.category.findUnique({ where: { id } });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    return cat;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.toSlug(dto.name);
    try {
      return await this.prisma.category.create({ data: { ...dto, slug } });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Ya existe una categoría con ese nombre');
      throw e;
    }
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.adminFindOne(id);
    const data: any = { ...dto };
    if (dto.name) data.slug = this.toSlug(dto.name);
    try {
      return await this.prisma.category.update({ where: { id }, data });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Ya existe una categoría con ese nombre');
      throw e;
    }
  }

  async remove(id: number) {
    await this.adminFindOne(id);
    await this.prisma.category.update({ where: { id }, data: { isActive: false } });
    return { message: 'Categoría desactivada' };
  }

  private toSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
