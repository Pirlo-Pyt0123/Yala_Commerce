import { IsString, IsNotEmpty, IsOptional, MinLength, Matches } from 'class-validator';

export class ShippingFormDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsString() @IsNotEmpty() @Matches(/^\d{7,15}$/, { message: 'Teléfono inválido' }) phone: string;
  @IsString() @MinLength(5) address: string;
  @IsString() @IsNotEmpty() district: string;
  @IsString() @IsNotEmpty() city: string;
  @IsOptional() @IsString() notes?: string;
}

export class CapturePaypalDto extends ShippingFormDto {
  @IsString() @IsNotEmpty() paypalOrderId: string;
}
