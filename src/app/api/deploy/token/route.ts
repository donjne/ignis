// app/api/deploy/token/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { deployToken } from '@/lib/token';
import { Connection } from '@solana/web3.js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, uri, symbol, decimals, initialSupply, wallet } = body;

    if (!name || !uri || !symbol || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    const result = await deployToken(
      connection,
      wallet,
      name,
      uri,
      symbol,
      decimals || 9,
      initialSupply
    );

    return NextResponse.json({
      success: true,
      mint: result.mint.toBase58()
    });

  } catch (error: any) {
    console.error('Token deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Token deployment failed' },
      { status: 500 }
    );
  }
}