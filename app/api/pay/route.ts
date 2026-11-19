import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { amount = 250, currency = 'EGP', serviceName = 'Diving Service' } = body;

    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '100';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || 'merchant.NWTOKEN';
    const password = process.env.QNB_API_PASSWORD || 'cb0af0e0fefa7169b4b7374e145fe1c6';

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const orderId = `LH-${Date.now()}`;

    const payload = {
      apiOperation: 'INITIATE_CHECKOUT',
      checkoutMode: 'WEBSITE',
      interaction: {
        operation: 'PURCHASE',
        merchant: {
          name: 'The Light House Diving Center',
          url: 'https://www.thelighthousee.com'
        },
        returnUrl: 'https://www.thelighthousee.com/en'
      },
      order: {
        currency: currency,
        amount: Number(amount).toFixed(2),
        id: orderId,
        description: serviceName
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

    if (data.result === 'SUCCESS') {
      return NextResponse.json({
        success: true,
        sessionId: data.session?.id,
        successIndicator: data.successIndicator,
        orderId: orderId
      });
    }

    return NextResponse.json(
      { success: false, error: 'QNB session creation failed', details: data },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Ready', 
    message: 'QNB MPGS Gateway Endpoint is active' 
  });
}
