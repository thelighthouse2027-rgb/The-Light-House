import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount = 250, currency = 'EGP' } = body;

    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '61';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || `merchant.${merchantId}`;
    const password = process.env.QNB_API_PASSWORD || 'cb0af0e0fefa7169b4b7374e145fe1c6';

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    // إنشاء session مكتملة مباشرة عبر Hosted Checkout API
    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const orderId = `LH-${Date.now()}`;
    const formattedAmount = (Number(amount) > 0 ? Number(amount) : 250).toFixed(2);
    const paymentCurrency = currency === 'EUR' ? 'EGP' : currency;

    const payload = {
      apiOperation: 'INITIATE_CHECKOUT',
      interaction: {
        operation: 'PURCHASE',
        merchant: {
          name: 'The Light House Diving Center'
        },
        returnUrl: 'https://www.thelighthousee.com/en'
      },
      order: {
        currency: paymentCurrency,
        amount: formattedAmount,
        id: orderId
      }
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (res.ok && (data.result === 'SUCCESS' || data.session?.id)) {
      return NextResponse.json({
        success: true,
        sessionId: data.session.id,
        orderId: orderId
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: data?.error?.explanation || data?.cause || 'Payment initiation failed',
        details: data 
      },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
