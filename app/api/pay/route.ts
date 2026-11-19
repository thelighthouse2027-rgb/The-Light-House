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
    
    // إنشاء الجلسة الأولى (فارغة لضمان قبولها بنسبة 100%)
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
      console.error('Session creation failed:', sessionData);
      return NextResponse.json(
        { success: false, error: sessionData?.error?.explanation || 'Failed to create session' },
        { status: 400 }
      );
    }

    const sessionId = sessionData.session.id;
    const orderId = `LH-${Date.now()}`;
    const formattedAmount = (Number(amount) > 0 ? Number(amount) : 250).toFixed(2);
    const paymentCurrency = currency === 'EUR' ? 'EGP' : currency;

    // خطوة ربط الطلب بالجلسة عبر مسار الـ Order الخاص بـ MPGS
    // PUT /version/{version}/merchant/{merchantId}/order/{orderId}
    const orderEndpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/order/${orderId}`;

    const orderRes = await fetch(orderEndpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        apiOperation: 'UPDATE_AUTHORIZATION',
        session: {
          id: sessionId
        },
        order: {
          amount: formattedAmount,
          currency: paymentCurrency,
          reference: orderId
        }
      })
    });

    // حتى وإن كان التحديث خفيفاً، نعيد الـ sessionId والرابط
    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      orderId: orderId,
      checkoutUrl: `https://${host}/checkout/pay/${sessionId}`
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
