import { Controller, Get, Post, Patch, Delete, Param, Query, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  // Public
  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.products.findAll(query);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.products.findBySlug(slug);
  }

  // Admin
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/all')
  adminFindAll(@Query() query: QueryProductsDto) {
    return this.products.adminFindAll(query);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin/:id')
  adminFindOne(@Param('id', ParseIntPipe) id: number) {
    return this.products.adminFindOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('admin')
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('admin/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.products.remove(id);
  }
}
