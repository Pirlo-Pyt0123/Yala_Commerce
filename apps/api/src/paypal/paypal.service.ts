import { Injectable, BadGatewayException } from '@nestjs/common';

@Injectable()
export class PaypalService {
  private readonly baseUrl: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly exchangeRate: number;

  constructor() {
    const mode = process.env.PAYPAL_MODE ?? 'sandbox';
    this.baseUrl =
      mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
    this.clientId = process.env.PAYPAL_CLIENT_ID ?? '';
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? '';
    this.exchangeRate = Number(process.env.PAYPAL_EXCHANGE_RATE ?? '6.96');
  }

  bsToUsd(amountBs: number): string {
    return (amountBs / this.exchangeRate).toFixed(2);
  }

  private async getAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const res = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!res.ok) throw new BadGatewayException('Error autenticando con PayPal');
    const data = await res.json();
    return data.access_token as string;
  }

  async createOrder(amountUSD: string, referenceId: string): Promise<string> {
    const token = await this.getAccessToken();

    const res = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: referenceId,
            amount: { currency_code: 'USD', value: amountUSD },
          },
        ],
      }),
    });

    if (!res.ok) throw new BadGatewayException('Error creando orden en PayPal');
    const data = await res.json();
    return data.id as string;
  }

  async captureOrder(paypalOrderId: string): Promise<any> {
    const token = await this.getAccessToken();

    const res = await fetch(
      `${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new BadGatewayException(
        (err as any)?.message ?? 'Error capturando pago en PayPal',
      );
    }

    return res.json();
  }
}
