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
    
    // إنشاء الجلسة بطلب فارغ حتى يقبلها مسار Session v61
    const sessionEndpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const sessionRes = await fetch(sessionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({})
    });

    const sessionData = await sessionRes.json();

    if (!sessionRes.ok || !sessionData.session?.id) {
      return NextResponse.json(
        { success: false, error: sessionData?.error?.explanation || 'Session creation failed' },
        { status: 400 }
      );
    }

    const sessionId = sessionData.session.id;
    const orderId = `LH-${Date.now()}`;
    const formattedAmount = (Number(amount) > 0 ? Number(amount) : 250).toFixed(2);
    const paymentCurrency = currency === 'EUR' ? 'EGP' : currency;

    // إرجاع البيانات للواجهة لتمريرها في Checkout.configure
    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      orderId: orderId,
      amount: formattedAmount,
      currency: paymentCurrency
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: 'Ready' });
}
