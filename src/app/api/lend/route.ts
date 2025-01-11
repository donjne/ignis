// app/api/lend/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, VersionedTransaction } from '@solana/web3.js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      amount,
      wallet
    } = body;

    if (!amount || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get lending transaction from Lulo
    const response = await fetch(
      `https://blink.lulo.fi/actions?amount=${amount}&symbol=USDC`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: wallet,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get lending transaction from Lulo');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      transaction: data.transaction
    });

  } catch (error: any) {
    console.error('Lending error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create lending transaction' },
      { status: 500 }
    );
  }
}