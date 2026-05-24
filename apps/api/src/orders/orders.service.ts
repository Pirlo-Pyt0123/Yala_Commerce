import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createFromCart(userId: number, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, price: true, stock: true, isActive: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    // Validate stock for all items before creating the order
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`El producto "${item.product.name}" ya no está disponible`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}`,
        );
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await this.prisma.$transaction(async (tx) => {
      // Decrement stock for each product
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Create the order with a snapshot of prices
      const created = await tx.order.create({
        data: {
          userId,
          total,
          fullName: dto.fullName,
          phone: dto.phone,
          address: dto.address,
          district: dto.district,
          city: dto.city,
          notes: dto.notes,
          paymentMethod: dto.paymentMethod,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true, imageUrl: true } },
            },
          },
        },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return this.format(order);
  }

  async getUserOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return orders.map((o) => this.format(o));
  }

  async getOrder(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, slug: true, imageUrl: true } },
          },
        },
      },
    });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return this.format(order);
  }

  // ── Admin ──────────────────────────────────────────────────────────────────

  async adminFindAll(page = 1, limit = 20) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: { include: { product: { select: { id: true, name: true, slug: true, imageUrl: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count(),
    ]);
    return {
      data: orders.map((o) => ({ ...this.format(o), user: (o as any).user })),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(orderId: number, status: string) {
    const valid = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!valid.includes(status)) throw new NotFoundException('Estado inválido');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Pedido no encontrado');
    return this.prisma.order.update({ where: { id: orderId }, data: { status: status as any } });
  }

  private format(order: any) {
    return {
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      total: Number(order.total).toFixed(2),
      shipping: {
        fullName: order.fullName,
        phone: order.phone,
        address: order.address,
        district: order.district,
        city: order.city,
        notes: order.notes ?? null,
      },
      items: order.items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price).toFixed(2),
        subtotal: (Number(item.price) * item.quantity).toFixed(2),
        product: item.product,
      })),
      createdAt: order.createdAt,
    };
  }
}
