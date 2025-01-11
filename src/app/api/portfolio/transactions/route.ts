// app/api/portfolio/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    const cursor = searchParams.get('cursor');
    const filter = searchParams.get('filter');
    const isMainnet = searchParams.get('network') === 'mainnet';

    if (!account) {
      return NextResponse.json(
        { error: 'Account address is required' },
        { status: 400 }
      );
    }

    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) {
      throw new Error("Helius API key not provided");
    }

    const url = `https://${isMainnet ? 'mainnet' : 'devnet'}.helius-rpc.com/v0/addresses/${account}/transactions`;
    const apiUrl = `${url}?api-key=${heliusApiKey}${filter ? `&type=${filter}` : ''}${cursor ? `&before=${cursor}` : ''}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    return NextResponse.json({
      transactions: data,
      oldest: data[data.length - 1]?.signature || ''
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
