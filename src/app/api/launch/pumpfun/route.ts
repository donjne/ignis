// app/api/launch/pumpfun/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import { createTokenTransaction, uploadMetadata } from '@/lib/launchpumptoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      symbol, 
      description, 
      imageUrl,
      twitter,
      telegram,
      website,
      initialLiquiditySOL,
      slippageBps,
      priorityFee,
      wallet
    } = body;

    if (!name || !symbol || !description || !imageUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload metadata
    const metadataResponse = await uploadMetadata(
      name,
      symbol,
      description,
      imageUrl,
      { twitter, telegram, website }
    );

    // Generate mint keypair
    const mintKeypair = Keypair.generate();

    // Create token transaction
    const txResponse = await createTokenTransaction(
      wallet,
      mintKeypair,
      metadataResponse,
      {
        initialLiquiditySOL: initialLiquiditySOL || 0.0001,
        slippageBps: slippageBps || 5,
        priorityFee: priorityFee || 0.00005
      }
    );

    const transactionData = await txResponse.arrayBuffer();
    
    return NextResponse.json({
      success: true,
      transaction: Buffer.from(transactionData).toString('base64'),
      mint: mintKeypair.publicKey.toBase58(),
      metadata: metadataResponse
    });

  } catch (error: any) {
    console.error('Pump.fun launch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to launch token' },
      { status: 500 }
    );
  }
}