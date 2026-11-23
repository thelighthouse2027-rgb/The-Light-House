import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

async function getLiveEurToEgpRate(): Promise<number> {
  const fallbackRate = Number(process.env.EUR_TO_EGP_RATE || 54);
  const markup = Number(process.env.EUR_TO_EGP_MARKUP || 0);

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      const liveRate = Number(data?.rates?.EGP);
      if (Number.isFinite(liveRate) && liveRate > 0) {
        return Number((liveRate + markup).toFixed(4));
      }
    }
  } catch {
    // Fallback to configured rate
  }

  return fallbackRate;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      amount = 20,
      description = 'The Light House Diving & Safari Booking',
      locale = 'en',
      tokens: bodyTokens = [],
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

    const cookieStore = await cookies();
    let cookieTokens: string[] = [];
    try {
      const parsed = JSON.parse(cookieStore.get('lh_qnb_tokens')?.value || '[]');
      if (Array.isArray(parsed)) {
        cookieTokens = parsed.filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
      }
    } catch {
      cookieTokens = [];
    }

    const clientTokens = Array.isArray(bodyTokens)
      ? bodyTokens.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
      : [];

    const savedTokens = Array.from(new Set([...cookieTokens, ...clientTokens])).slice(0, 5);

    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
    const orderId = `LH-${Date.now()}`;

    const eurAmount = Number(amount) > 0 ? Number(amount) : 20;
    const rate = await getLiveEurToEgpRate();
    const egpAmount = (eurAmount * rate).toFixed(2);
    const safeLocale = typeof locale === 'string' && /^[a-z]{2}$/i.test(locale) ? locale : 'en';

    const endpoint = `https://${host}/api/rest/version/${version}/merchant/${merchantId}/session`;

    const interaction: Record<string, unknown> = {
      operation: 'PURCHASE',
      merchant: {
        name: 'The Light House Diving Center',
        url: 'https://www.thelighthousee.com',
      },
      saveCardForCredentialOnFile: 'PAYER_INITIATED_PAYMENTS',
      returnUrl: `https://www.thelighthousee.com/${safeLocale}/payment/callback?orderId=${orderId}`,
    };

    if (savedTokens.length > 0) {
      interaction.tokens = savedTokens;
    }

    const payload = {
      apiOperation: 'INITIATE_CHECKOUT',
      checkoutMode: 'WEBSITE',
      interaction,
      order: {
        id: orderId,
        amount: egpAmount,
        currency: 'EGP',
        description: String(description).slice(0, 120),
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

    if (res.ok && data?.session?.id) {
      return NextResponse.json({
        success: true,
        orderId,
        sessionId: data.session.id,
        successIndicator: data.successIndicator,
        checkoutScriptUrl: `https://${host}/static/checkout/checkout.min.js`,
        exchangeRate: rate,
        egpAmount,
        hasSavedCards: savedTokens.length > 0,
      });
    }

    const detailedError = [data?.error?.explanation, data?.error?.field]
      .filter(Boolean)
      .join(' — ');

    return NextResponse.json(
      {
        success: false,
        error: detailedError || 'Failed to initiate payment',
        details: data,
      },
      { status: res.status || 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
