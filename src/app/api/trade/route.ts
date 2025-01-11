// app/api/trade/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { getMint } from "@solana/spl-token";

const JUP_API = "https://quote-api.jup.ag/v6";
const JUP_REFERRAL_ADDRESS = "REFER4ZgmyYx9c6He5XfaTMiGfdLwRnkV4RPp9t9iF3"; // Replace with actual address

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      inputMint,
      outputMint,
      inputAmount,
      slippageBps = 100,
      wallet
    } = body;

    if (!inputMint || !outputMint || !inputAmount || !wallet) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    // Check if input token is native SOL
    const isNativeSol = inputMint === "So11111111111111111111111111111111111111112";
    
    // Get input token decimals
    const inputDecimals = isNativeSol 
      ? 9 
      : (await getMint(connection, new PublicKey(inputMint))).decimals;

    // Calculate the scaled amount
    const scaledAmount = inputAmount * Math.pow(10, inputDecimals);

    // Get quote from Jupiter
    const quoteResponse = await (
      await fetch(
        `${JUP_API}/quote?` +
        `inputMint=${inputMint}` +
        `&outputMint=${outputMint}` +
        `&amount=${scaledAmount}` +
        `&slippageBps=${slippageBps}` +
        `&onlyDirectRoutes=true` +
        `&maxAccounts=20`,
      )
    ).json();

    // Get swap transaction
    const { swapTransaction } = await (
      await fetch(`${JUP_API}/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse,
          userPublicKey: wallet,
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: "auto",
        }),
      })
    ).json();

    return NextResponse.json({
      success: true,
      transaction: swapTransaction,
      quote: quoteResponse
    });

  } catch (error: any) {
    console.error('Trade error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create trade' },
      { status: 500 }
    );
  }
}