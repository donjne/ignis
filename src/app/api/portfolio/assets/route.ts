// app/api/portfolio/assets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    const cursor = searchParams.get('cursor') || '1';
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

    const url = `https://${isMainnet ? 'mainnet' : 'devnet'}.helius-rpc.com/?api-key=${heliusApiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "getAssetsByOwner",
        params: {
          limit: 1000,
          ownerAddress: account,
          page: parseInt(cursor),
          sortBy: {
            sortBy: "created",
            sortDirection: "desc",
          },
        },
        id: "get-assets-" + account
      }),
    });

    const data = await response.json();
    return NextResponse.json(data.result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
