import { Controller, Get, Post, Param, ParseIntPipe, Body, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthRequest = { user: { id: number; email: string; role: string } };

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

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
}
