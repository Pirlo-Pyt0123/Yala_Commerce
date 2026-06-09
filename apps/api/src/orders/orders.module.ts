import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PaypalModule } from '../paypal/paypal.module';

@Module({
  imports: [PaypalModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
