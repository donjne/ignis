// app/api/portfolio/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account address is required' },
        { status: 400 }
      );
    }

    const heliusApiKey = process.env.HELIUS_API_KEY;
    if (!heliusApiKey) {
      console.error('Missing Helius API key');
      return NextResponse.json(
        { error: 'Configuration error' },
        { status: 500 }
      );
    }

    const url = `https://api.helius.xyz/v0/addresses/${account}/transactions`;
    console.log('Fetching from:', url); // Debug log

    const response = await fetch(url);
    if (!response.ok) {
      console.error('Helius API error:', await response.text());
      throw new Error('Failed to fetch transactions from Helius');
    }

    const data = await response.json();
    return NextResponse.json({
      transactions: data,
      oldest: data[data.length - 1]?.signature || ''
    });
  } catch (error: any) {
    console.error('Transaction API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
