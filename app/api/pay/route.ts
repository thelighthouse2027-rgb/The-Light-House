import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

function extractGatewayToken(data: Record<string, unknown>): string | null {
  const topSof = data?.sourceOfFunds as Record<string, unknown> | undefined;
  if (typeof topSof?.token === 'string' && topSof.token.trim()) {
    return topSof.token.trim();
  }
  if (typeof data?.token === 'string' && data.token.trim()) {
    return data.token.trim();
  }
  const txs = Array.isArray(data?.transaction) ? data.transaction : [];
  for (let i = txs.length - 1; i >= 0; i--) {
    const tx = txs[i] as Record<string, unknown> | undefined;
    const txSof = tx?.sourceOfFunds as Record<string, unknown> | undefined;
    if (typeof txSof?.token === 'string' && txSof.token.trim()) {
      return txSof.token.trim();
    }
    if (typeof tx?.token === 'string' && tx.token.trim()) {
      return tx.token.trim();
    }
  }
  return null;
}

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

    const data = (await res.json()) as Record<string, unknown>;
    const status = String(data?.status || 'UNKNOWN').toUpperCase();
    const paid = res.ok && status === 'CAPTURED';
    const savedToken = paid ? extractGatewayToken(data) : null;

    const response = NextResponse.json({
      success: res.ok,
      paid,
      status,
      orderId,
      amount: data?.amount ?? null,
      currency: data?.currency ?? null,
      savedToken,
    });

    if (savedToken) {
      const cookieStore = await cookies();
      const existingRaw = cookieStore.get('lh_qnb_tokens')?.value || '[]';
      let existingTokens: string[] = [];
      try {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed)) {
          existingTokens = parsed.filter((t): t is string => typeof t === 'string' && t.length > 0);
        }
      } catch {
        existingTokens = [];
      }

      const updatedTokens = Array.from(new Set([savedToken, ...existingTokens])).slice(0, 5);
      response.cookies.set('lh_qnb_tokens', JSON.stringify(updatedTokens), {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ success: false, paid: false, error: message }, { status: 500 });
  }
}
