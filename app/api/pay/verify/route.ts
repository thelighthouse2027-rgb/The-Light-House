import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId') || '';

    if (!/^LH-\d+$/.test(orderId)) {
      return NextResponse.json(
        { success: false, paid: false, error: 'Invalid orderId' },
        { status: 400 }
      );
    }

    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '100';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || `merchant.${merchantId}`;
    const password = process.env.QNB_API_PASSWORD;

    if (!password) {
      return NextResponse.json(
        { success: false, paid: false, error: 'Missing QNB_API_PASSWORD' },
        { status: 500 }
      );
    }

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/order/${encodeURIComponent(orderId)}`;

    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
      },
      cache: 'no-store',
    });

    const data = await res.json();
    const status = String(data?.status || 'UNKNOWN').toUpperCase();
    const paid = res.ok && status === 'CAPTURED';

    return NextResponse.json({
      success: res.ok,
      paid,
      status,
      orderId,
      amount: data?.amount ?? null,
      currency: data?.currency ?? null,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ success: false, paid: false, error: message }, { status: 500 });
  }
}
