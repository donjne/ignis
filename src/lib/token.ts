// lib/tokens.ts

import { Connection, PublicKey } from "@solana/web3.js";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity } from "@metaplex-foundation/umi";
import {
  createFungible,
  mintV1,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  fromWeb3JsKeypair,
  fromWeb3JsPublicKey,
  toWeb3JsPublicKey,
} from "@metaplex-foundation/umi-web3js-adapters";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";

/**
 * Deploy a new SPL token
 * @param connection Solana connection instance
 * @param wallet User's wallet keypair
 * @param name Name of the token
 * @param uri URI for the token metadata
 * @param symbol Symbol of the token
 * @param decimals Number of decimals for the token (default: 9)
 * @param initialSupply Initial supply to mint (optional)
 * @returns Object containing token mint address
 */
export async function deployToken(
  connection: Connection,
  wallet: any, // We'll type this properly based on your wallet implementation
  name: string,
  uri: string,
  symbol: string,
  decimals: number = 9,
  initialSupply?: number,
): Promise<{ mint: PublicKey }> {
  try {
    // Create UMI instance
    const umi = createUmi(connection.rpcEndpoint).use(mplToolbox());
    umi.use(keypairIdentity(fromWeb3JsKeypair(wallet)));

    // Create new token mint
    const mint = generateSigner(umi);
    let builder = createFungible(umi, {
      name,
      uri,
      symbol,
      sellerFeeBasisPoints: {
        basisPoints: BigInt(0),
        identifier: "%",
        decimals: 2,
      },
      decimals,
      mint,
    });

    if (initialSupply) {
      builder = builder.add(
        mintV1(umi, {
          mint: mint.publicKey,
          tokenStandard: TokenStandard.Fungible,
          tokenOwner: fromWeb3JsPublicKey(wallet.publicKey),
          amount: initialSupply * Math.pow(10, decimals),
        }),
      );
    }

    await builder.sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

    return {
      mint: toWeb3JsPublicKey(mint.publicKey),
    };
  } catch (error: any) {
    throw new Error(`Token deployment failed: ${error.message}`);
  }
}