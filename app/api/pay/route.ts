import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      amount = 20,
      description = 'The Light House Diving & Safari Booking',
      locale = 'en',
    } = body;

    const host = process.env.QNB_MPGS_HOST || 'qnbalahli.test.gateway.mastercard.com';
    const version = process.env.QNB_API_VERSION || '100';
    const merchantId = process.env.QNB_MERCHANT_ID || 'NWTOKEN';
    const username = process.env.QNB_API_USERNAME || `merchant.${merchantId}`;
    const password = process.env.QNB_API_PASSWORD;

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Missing QNB_API_PASSWORD environment variable' },
        { status: 500 }
      );
    }

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    const timestamp = Date.now();
    const orderId = `LH-${timestamp}`;
    const txRef = `LH-TX-${timestamp}`;

    const eurAmount = Number(amount) > 0 ? Number(amount) : 20;
    const rate = Number(process.env.EUR_TO_EGP_RATE || 54);
    const egpAmount = (eurAmount * rate).toFixed(2);
    const safeLocale = typeof locale === 'string' && /^[a-z]{2}$/i.test(locale) ? locale : 'en';

    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const payload = {
      apiOperation: 'INITIATE_CHECKOUT',
      checkoutMode: 'PAYMENT_LINK',
      paymentLink: {
        numberOfAllowedAttempts: '5',
      },
      interaction: {
        operation: 'PURCHASE',
        displayControl: {
          billingAddress: 'HIDE',
          shipping: 'HIDE',
          customerEmail: 'OPTIONAL',
        },
        merchant: {
          name: 'The Light House Diving Center',
          url: 'https://www.thelighthousee.com',
        },
        returnUrl: `https://www.thelighthousee.com/${safeLocale}/payment/callback?orderId=${orderId}`,
      },
      order: {
        id: orderId,
        amount: egpAmount,
        currency: 'EGP',
        description: String(description).slice(0, 120),
      },
      transaction: {
        reference: txRef,
      },
    };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data?.paymentLink?.url) {
      return NextResponse.json({
        success: true,
        orderId,
        paymentLinkId: data.paymentLink.id,
        successIndicator: data.successIndicator,
        redirectUrl: data.paymentLink.url,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data?.error?.explanation || 'Failed to initiate payment',
        details: data,
      },
      { status: res.status || 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
