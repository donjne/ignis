// app/api/portfolio/balance/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const account = searchParams.get('account');
    const tokenAddress = searchParams.get('token');
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

    if (!tokenAddress) {
      const balance = await connection.getBalance(new PublicKey(account));
      return NextResponse.json({
        balance: balance / LAMPORTS_PER_SOL
      });
    }

    const tokenAccount = await connection.getTokenAccountBalance(
      new PublicKey(tokenAddress)
    );

    return NextResponse.json({
      balance: tokenAccount.value.uiAmount || 0
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
