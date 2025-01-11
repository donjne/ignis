// app/api/deploy/collection/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair } from '@solana/web3.js';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  createCollection,
  mplCore,
  ruleSet,
} from "@metaplex-foundation/mpl-core";
import {
  fromWeb3JsKeypair,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, uri, royaltyBasisPoints, creators, secretKey } = body;

    if (!name || !uri) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create connection and initialize wallet
    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );
    
    const wallet = Keypair.fromSecretKey(
      new Uint8Array(Object.values(JSON.parse(secretKey)))
    );

    // Initialize Umi
    const umi = createUmi(connection.rpcEndpoint).use(mplCore());
    umi.use(keypairIdentity(fromWeb3JsKeypair(wallet)));

    // Generate collection signer
    const collectionSigner = generateSigner(umi);

    // Format creators
    const formattedCreators = creators?.map((creator: any) => ({
      address: publicKey(creator.address),
      percentage: creator.percentage,
    })) || [
      {
        address: publicKey(wallet.publicKey.toString()),
        percentage: 100,
      },
    ];

    // Create collection
    const tx = await createCollection(umi, {
      collection: collectionSigner,
      name,
      uri,
      plugins: [
        {
          type: "Royalties",
          basisPoints: royaltyBasisPoints || 500, // Default 5%
          creators: formattedCreators,
          ruleSet: ruleSet("None"), // Compatibility rule set
        },
      ],
    }).sendAndConfirm(umi);

    return NextResponse.json({
      success: true,
      collectionAddress: toWeb3JsPublicKey(collectionSigner.publicKey).toBase58(),
      signature: tx.signature
    });

  } catch (error: any) {
    console.error('Collection deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Collection deployment failed' },
      { status: 500 }
    );
  }
}