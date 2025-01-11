// app/api/stake/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, VersionedTransaction } from '@solana/web3.js';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      amount,
      provider,
      wallet
    } = body;

    if (!amount || !provider || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let transactionData;

    if (provider === 'jupiter') {
      const response = await fetch(
        `https://worker.jup.ag/blinks/swap/So11111111111111111111111111111111111111112/jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v/${amount}`,
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
      transactionData = await response.json();
    } else if (provider === 'solayer') {
      const response = await fetch(
        `https://app.solayer.org/api/action/restake/ssol?amount=${amount}`,
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Staking request failed");
      }
      
      transactionData = await response.json();
    } else {
      throw new Error('Invalid staking provider');
    }

    return NextResponse.json({
      success: true,
      transaction: transactionData.transaction
    });

  } catch (error: any) {
    console.error('Staking error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create staking transaction' },
      { status: 500 }
    );
  }
}