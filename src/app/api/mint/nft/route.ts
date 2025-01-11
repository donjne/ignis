// app/api/mint/nft/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import { create, mplCore, fetchCollection } from "@metaplex-foundation/mpl-core";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      collectionAddress,
      name,
      uri,
      sellerFeeBasisPoints,
      creators,
      recipient,
      wallet
    } = body;

    if (!collectionAddress || !name || !uri) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create connection
    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    // Initialize Umi
    const umi = createUmi(connection.rpcEndpoint).use(mplCore());
    
    // Convert collection address to PublicKey
    const collectionMint = new PublicKey(collectionAddress);

    // Convert to UMI format
    const umiCollectionMint = fromWeb3JsPublicKey(collectionMint);

    // Fetch the existing collection
    const collection = await fetchCollection(umi, umiCollectionMint);

    // Generate a new signer for the NFT
    const assetSigner = generateSigner(umi);

    // Format metadata
    const metadata = {
      name,
      uri,
      sellerFeeBasisPoints: sellerFeeBasisPoints || 0,
      creators: creators?.map((creator: any) => ({
        address: creator.address,
        share: creator.share,
      }))
    };

    // Create the NFT
    const tx = await create(umi, {
      asset: assetSigner,
      collection: collection,
      name: metadata.name,
      uri: metadata.uri,
      owner: fromWeb3JsPublicKey(new PublicKey(recipient || wallet)),
    });

    const signature = await tx.sendAndConfirm(umi);

    return NextResponse.json({
      success: true,
      mint: toWeb3JsPublicKey(assetSigner.publicKey).toBase58(),
      signature: signature.signature.toString()
    });

  } catch (error: any) {
    console.error('NFT minting error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mint NFT' },
      { status: 500 }
    );
  }
}