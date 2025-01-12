// app/api/deploy/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner } from "@metaplex-foundation/umi";
import {
  createFungible,
  mintV1,
  TokenStandard,
  mplTokenMetadata
} from "@metaplex-foundation/mpl-token-metadata";
import { fromWeb3JsPublicKey, toWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

export async function POST(req: NextRequest) {
  try {
    const { name, uri, symbol, decimals, initialSupply, walletAddress } = await req.json();

    if (!name || !uri || !symbol || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
    );

    const umi = createUmi(connection.rpcEndpoint)
    .use(mplTokenMetadata())
    .use(mplToolbox());
    const mint = generateSigner(umi);
    const walletSigner = umi.identity;
    const walletPubKey = new PublicKey(walletAddress);

    const builder = createFungible(umi, {
      name,
      uri,
      symbol,
      sellerFeeBasisPoints: {
        basisPoints: BigInt(0),
        identifier: "%",
        decimals: 2,
      },
      decimals: decimals || 9,
      mint,
      authority: walletSigner,
      payer: walletSigner
    });

    if (initialSupply) {
      builder.add(
        mintV1(umi, {
          mint: mint.publicKey,
          tokenStandard: TokenStandard.Fungible,
          tokenOwner: fromWeb3JsPublicKey(walletPubKey),
          amount: initialSupply * Math.pow(10, decimals || 9),
        })
      );
    }

    const tx = await builder.buildWithLatestBlockhash(umi);

    return NextResponse.json({
      transaction: Buffer.from(tx.serializedMessage).toString('base64'),
      mint: toWeb3JsPublicKey(mint.publicKey).toBase58()
    });

  } catch (error: any) {
    console.error('Token deployment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create token transaction' },
      { status: 500 }
    );
  }
}