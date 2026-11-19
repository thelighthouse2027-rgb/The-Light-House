import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '61';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || `merchant.${merchantId}`;
    const password = process.env.QNB_API_PASSWORD || 'cb0af0e0fefa7169b4b7374e145fe1c6';

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    // طلب إنشاء Session فارغ تماماً وفق مواصفات MPGS الرسمية
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({})
    });

    const data = await res.json();

    if (res.ok && data.session?.id) {
      return NextResponse.json({
        success: true,
        sessionId: data.session.id,
        successIndicator: data.successIndicator,
        merchantId: merchantId
      });
    }

    console.error('QNB MPGS Session Error:', JSON.stringify(data));

    return NextResponse.json(
      { 
        success: false, 
        error: data?.error?.explanation || data?.cause || 'QNB session creation failed',
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

export async function GET() {
  return NextResponse.json({ 
    status: 'Ready', 
    message: 'QNB MPGS Gateway Endpoint is active' 
  });
}
