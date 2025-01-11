// app/api/portfolio/domains/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { TldParser } from "@onsol/tldparser";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    const isMainnet = searchParams.get('network') === 'mainnet';

    if (!account) {
      return NextResponse.json(
        { error: 'Account address is required' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || `https://api.${isMainnet ? 'mainnet-beta' : 'devnet'}.solana.com`
    );

    const domains = await new TldParser(connection)
      .getParsedAllUserDomains(new PublicKey(account));

    return NextResponse.json({
      domains: domains.map(domain => domain.domain)
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}