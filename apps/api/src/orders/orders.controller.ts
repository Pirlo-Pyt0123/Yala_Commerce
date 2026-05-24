import { Controller, Get, Post, Patch, Param, ParseIntPipe, Body, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

type AuthRequest = { user: { id: number; email: string; role: string } };

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  // User routes
  @Post()
  create(@Request() req: AuthRequest, @Body() dto: CreateOrderDto) {
    return this.orders.createFromCart(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: AuthRequest) {
    return this.orders.getUserOrders(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.orders.getOrder(req.user.id, id);
  }

  // Admin routes
  @UseGuards(AdminGuard)
  @Get('admin/all')
  adminFindAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.orders.adminFindAll(Number(page ?? 1), Number(limit ?? 20));
  }

  @UseGuards(AdminGuard)
  @Patch('admin/:id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.orders.updateStatus(id, status);
  }
}
