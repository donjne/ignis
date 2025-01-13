import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  mplHybrid, 
  initEscrowV1,
  fetchEscrowV1,
  MPL_HYBRID_PROGRAM_ID
} from '@metaplex-foundation/mpl-hybrid';
import { 
  createTokenIfMissing,
  transferTokens,
  findAssociatedTokenPda,
  SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
  fetchToken,
  mplToolbox
} from '@metaplex-foundation/mpl-toolbox';
import { web3JsEddsa } from '@metaplex-foundation/umi-eddsa-web3js';
import { publicKey, sol } from '@metaplex-foundation/umi';
import { string, publicKey as publicKeySerializer } from '@metaplex-foundation/umi/serializers';
import { addCollectionPlugin, mplCore } from '@metaplex-foundation/mpl-core';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { type SwapConfig } from '../types/swapConfig';

export class EscrowSetupService {
  public umi;
  public escrowAddress;
  private config: SwapConfig;

  constructor(config: SwapConfig) {
    this.config = config;
    
    this.umi = createUmi('https://api.devnet.solana.com')
      .use(web3JsEddsa())
      .use(mplHybrid())
      .use(mplToolbox())
      .use(mplCore())
      .use(mplTokenMetadata());

    // Calculate escrow PDA
    this.escrowAddress = this.umi.eddsa.findPda(
      MPL_HYBRID_PROGRAM_ID,
      [
        string({ size: 'variable' }).serialize('escrow'),
        publicKeySerializer().serialize(publicKey(this.config.collection)),
      ]
    );
  }

  async initializeEscrow() {
    try {
      console.log('Initializing escrow...');
      
      // Get fee wallet's token account
      const feeTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: publicKey(this.config.authority)
      });

      const tx = await initEscrowV1(this.umi, {
        name: this.config.escrowName,
        uri: this.config.baseUri,
        escrow: this.escrowAddress,
        collection: publicKey(this.config.collection),
        token: publicKey(this.config.tokenMint),
        feeLocation: publicKey(this.config.authority),
        feeAta: feeTokenAccount,
        min: this.config.minIndex,
        max: this.config.maxIndex,
        amount: this.config.tokenPerNft,
        feeAmount: this.config.tokenFee,
        solFeeAmount: sol(this.config.solFee).basisPoints,
        path: 0,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
      });

      const signature = await tx.sendAndConfirm(this.umi);
      console.log('Escrow initialized successfully:', signature);
      
      return signature;
    } catch (error) {
      console.error('Failed to initialize escrow:', error);
      throw error;
    }
  }

  async fundEscrow() {
    try {
      console.log('Starting escrow funding process...');

      // Get source token account (your wallet's token account)
      const sourceTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.umi.identity.publicKey
      });

      

      // Get escrow's token account
      const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: publicKey(this.escrowAddress)
      });

      // Check source token balance
      const sourceToken = await fetchToken(this.umi, sourceTokenAccount);
      if (Number(sourceToken.amount) < this.config.initialFundingAmount) {
        throw new Error('Insufficient token balance for funding');
      }

      const tx = await createTokenIfMissing(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.escrowAddress,
        token: escrowTokenAccount,
        payer: this.umi.identity,
      }).add(
        transferTokens(this.umi, {
          source: sourceTokenAccount,
          destination: escrowTokenAccount,
          amount: this.config.initialFundingAmount,
        })
      );

      const signature = await tx.sendAndConfirm(this.umi);
      console.log('Escrow funded successfully:', signature);

      return signature;
    } catch (error) {
      console.error('Failed to fund escrow:', error);
      throw error;
    }
  }

  async addDelegates() {
    try {
      console.log('Adding delegates to collection...');
      
      // You might want to make these configurable as well
      const delegates = [
        publicKey("5jD4WTmGYmJG6e9JjRvJX8Svk5Ph2rxqwPjrqky33rRg"),
        publicKey("2BAnwcKZHzohvMjwZ4ekxN2vmrgLF955d8U1cw1XvHVz")
      ];

      await addCollectionPlugin(this.umi, {
        collection: publicKey(this.config.collection),
        plugin: {
          type: 'UpdateDelegate',
          additionalDelegates: delegates,
          authority: { 
            type: 'Address', 
            address: publicKey(this.config.authority) 
          },
        },
      }).sendAndConfirm(this.umi);
  
      console.log('Successfully added delegates to collection');
    } catch (error) {
      console.error('Failed to add delegates:', error);
      throw error;
    }
  }
}