import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '61';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || `merchant.${merchantId}`;
    const password = process.env.QNB_API_PASSWORD || 'cb0af0e0fefa7169b4b7374e145fe1c6';

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    
    // مسار إنشاء Session فارغ تماماً - ممنوع إرسال أي order هنا
    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({}) // جسم الطلب فارغ تماماً حتى لا يرفضه البنك
    });

    const data = await res.json();

    if (res.ok && data.session?.id) {
      return NextResponse.json({
        success: true,
        sessionId: data.session.id,
        successIndicator: data.successIndicator
      });
    }

    return NextResponse.json(
      { 
        success: false, 
        error: data?.error?.explanation || data?.cause || 'Failed to create session' 
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
