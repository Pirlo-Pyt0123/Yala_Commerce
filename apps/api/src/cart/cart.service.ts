import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/cart.dto';

const CART_INCLUDE = {
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          imageUrl: true,
          stock: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreate(userId: number) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: CART_INCLUDE,
    });
  }

  async getCart(userId: number) {
    const cart = await this.getOrCreate(userId);
    return this.format(cart);
  }

  async addItem(userId: number, dto: AddItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });
    if (!product || !product.isActive)
      throw new NotFoundException('Producto no encontrado');
    if (product.stock < dto.quantity)
      throw new BadRequestException('Stock insuficiente');

    const cart = await this.getOrCreate(userId);

    const existing = cart.items.find((i) => i.productId === dto.productId);

    if (existing) {
      const newQty = existing.quantity + dto.quantity;
      if (product.stock < newQty)
        throw new BadRequestException('Stock insuficiente');

      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.productId, quantity: dto.quantity },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: number, productId: number, dto: UpdateItemDto) {
    const cart = await this.getOrCreate(userId);
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new NotFoundException('Producto no está en el carrito');

    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (product && product.stock < dto.quantity)
      throw new BadRequestException('Stock insuficiente');

    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
    });

    return this.getCart(userId);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await this.getOrCreate(userId);
    const item = cart.items.find((i) => i.productId === productId);
    if (!item) throw new NotFoundException('Producto no está en el carrito');

    await this.prisma.cartItem.delete({ where: { id: item.id } });
    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreate(userId);
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return this.getCart(userId);
  }

  private format(cart: Awaited<ReturnType<typeof this.getOrCreate>>) {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );
    return {
      id: cart.id,
      items: cart.items,
      totalItems: cart.items.reduce((s, i) => s + i.quantity, 0),
      subtotal: subtotal.toFixed(2),
    };
  }
}
