import { IsString, IsNotEmpty, IsOptional, IsIn, MinLength, Matches } from 'class-validator';

const PAYMENT_METHODS = ['COD', 'PAYPAL', 'CARD', 'QR'] as const;
export type PaymentMethod = typeof PAYMENT_METHODS[number];

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{7,15}$/, { message: 'Teléfono inválido' })
  phone: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsIn(PAYMENT_METHODS, { message: `Método de pago inválido. Opciones: ${PAYMENT_METHODS.join(', ')}` })
  paymentMethod: PaymentMethod;
}
