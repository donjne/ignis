// app/api/portfolio/transfer/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  getMint,
} from "@solana/spl-token";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      from,
      to,
      amount,
      mint,
      isMainnet
    } = body;

    if (!from || !to || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || `https://api.${isMainnet ? 'mainnet-beta' : 'devnet'}.solana.com`
    );

    let transaction: Transaction;

    if (!mint) {
      // Transfer native SOL
      transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(from),
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );
    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(
        new PublicKey(mint),
        new PublicKey(from)
      );
      
      const toAta = await getAssociatedTokenAddress(
        new PublicKey(mint),
        new PublicKey(to)
      );

      const mintInfo = await getMint(connection, new PublicKey(mint));
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      transaction = new Transaction().add(
        createTransferInstruction(
          fromAta,
          toAta,
          new PublicKey(from),
          adjustedAmount
        )
      );
    }

    const blockhash = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash.blockhash;
    transaction.feePayer = new PublicKey(from);

    return NextResponse.json({
      transaction: transaction.serialize({ requireAllSignatures: false }).toString('base64')
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create transfer transaction' },
      { status: 500 }
    );
  }
}