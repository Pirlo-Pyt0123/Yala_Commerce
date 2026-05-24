import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto, UpdateItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

type AuthRequest = { user: { id: number; email: string; role: string } };

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cart: CartService) {}

  @Get()
  getCart(@Request() req: AuthRequest) {
    return this.cart.getCart(req.user.id);
  }

  @Post('items')
  addItem(@Request() req: AuthRequest, @Body() dto: AddItemDto) {
    return this.cart.addItem(req.user.id, dto);
  }

  @Patch('items/:productId')
  updateItem(
    @Request() req: AuthRequest,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpdateItemDto,
  ) {
    return this.cart.updateItem(req.user.id, productId, dto);
  }

  @Delete('items/:productId')
  removeItem(
    @Request() req: AuthRequest,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.cart.removeItem(req.user.id, productId);
  }

  @Delete()
  clearCart(@Request() req: AuthRequest) {
    return this.cart.clearCart(req.user.id);
  }
}
