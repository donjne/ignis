// app/api/tensor/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey, Transaction, Keypair } from '@solana/web3.js';
import { TensorSwapSDK } from "@tensor-oss/tensorswap-sdk";
import { AnchorProvider, Wallet, BN } from "@coral-xyz/anchor";
// import { BN } from "bn.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      action,
      nftMint,
      price,
      wallet,
      secretKey
    } = body;

    if (!nftMint || !wallet || !secretKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (action === 'list' && !price) {
      return NextResponse.json(
        { error: 'Price is required for listing' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    // Create wallet from secret key
    const walletKeypair = Keypair.fromSecretKey(
      new Uint8Array(Object.values(JSON.parse(secretKey)))
    );
    
    const provider = new AnchorProvider(
      connection,
      new Wallet(walletKeypair),
      AnchorProvider.defaultOptions()
    );

    const tensorSwapSdk = new TensorSwapSDK({ provider });
    const mintPubkey = new PublicKey(nftMint);

    if (action === 'list') {
      const priceInLamports = new BN(price * 1e9);
      const nftSource = await getAssociatedTokenAddress(
        mintPubkey,
        new PublicKey(wallet)
      );

      const { tx } = await tensorSwapSdk.list({
        nftMint: mintPubkey,
        nftSource,
        owner: new PublicKey(wallet),
        price: priceInLamports,
        tokenProgram: TOKEN_PROGRAM_ID,
        payer: new PublicKey(wallet),
      });

      const transaction = new Transaction();
      transaction.add(...tx.ixs);

      return NextResponse.json({
        success: true,
        transaction: transaction.serialize({ requireAllSignatures: false }),
        extraSigners: tx.extraSigners
      });
    } 
    else if (action === 'delist') {
      const nftDest = await getAssociatedTokenAddress(
        mintPubkey,
        new PublicKey(wallet),
        false,
        TOKEN_PROGRAM_ID
      );

      const { tx } = await tensorSwapSdk.delist({
        nftMint: mintPubkey,
        nftDest,
        owner: new PublicKey(wallet),
        tokenProgram: TOKEN_PROGRAM_ID,
        payer: new PublicKey(wallet),
        authData: null,
      });

      const transaction = new Transaction();
      transaction.add(...tx.ixs);

      return NextResponse.json({
        success: true,
        transaction: transaction.serialize({ requireAllSignatures: false }),
        extraSigners: tx.extraSigners
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Tensor trade error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process Tensor trade' },
      { status: 500 }
    );
  }
}