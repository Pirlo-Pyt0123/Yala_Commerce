import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const { search, category, page = 1, limit = 12, minPrice, maxPrice } = query;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        name: { contains: search, mode: 'insensitive' },
      }),
      ...(category && {
        category: { slug: category },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { name: true, slug: true } } },
    });

    if (!product || !product.isActive) {
      throw new NotFoundException(`Producto "${slug}" no encontrado`);
    }

    return product;
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  async adminFindAll(query: QueryProductsDto) {
    const { search, category, page = 1, limit = 20 } = query;

    const where: Prisma.ProductWhereInput = {
      ...(search && { name: { contains: search, mode: 'insensitive' } }),
      ...(category && { category: { slug: category } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async adminFindOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(dto: CreateProductDto) {
    const slug = this.toSlug(dto.name);
    try {
      return await this.prisma.product.create({
        data: { ...dto, slug },
        include: { category: { select: { id: true, name: true, slug: true } } },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Ya existe un producto con ese nombre');
      throw e;
    }
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.adminFindOne(id);
    const data: Prisma.ProductUpdateInput = { ...dto };
    if (dto.name) data.slug = this.toSlug(dto.name);
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
        include: { category: { select: { id: true, name: true, slug: true } } },
      });
    } catch (e: any) {
      if (e.code === 'P2002') throw new ConflictException('Ya existe un producto con ese nombre');
      throw e;
    }
  }

  async remove(id: number) {
    await this.adminFindOne(id);
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { message: 'Producto desactivado' };
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
