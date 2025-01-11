// lib/SwapService.ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { mplCore, fetchAsset } from '@metaplex-foundation/mpl-core';
import { generateSigner, publicKey as toPublicKey, Signer } from '@metaplex-foundation/umi';
import { fetchToken, findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface SwapError extends Error {
  code?: string;
  details?: any;
}

export class SwapService {
  private static SWAP_PROGRAM_ID = 'YOUR_PROGRAM_ID';
  private static TOKEN_MINT = 'YOUR_TOKEN_MINT';
  private static COLLECTION = 'YOUR_COLLECTION';
  private static TOKEN_PER_NFT = 100;
  
  private umi;
  private connection: Connection;
  private wallet?: WalletContextState;

  constructor(wallet?: WalletContextState) {
    this.connection = new Connection('https://api.devnet.solana.com');
    this.umi = createUmi('https://api.devnet.solana.com')
      .use(mplTokenMetadata())
      .use(mplCore());
    
    if (wallet) {
      this.wallet = wallet;
    }
  }

  async swapNftForTokens(nftMint: string): Promise<string> {
    try {
      if (!this.wallet?.publicKey || !this.wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }

      // 1. Verify NFT ownership and collection
      await this.verifyNftOwnership(nftMint);

      // 2. Create swap instruction
      const swapInstruction = await this.createSwapNftInstruction(nftMint);

      // 3. Create and send transaction
      const transaction = new Transaction().add(swapInstruction);
      transaction.feePayer = this.wallet.publicKey;
      
      const latestBlockhash = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;

      const signedTx = await this.wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      await this.connection.confirmTransaction(signature);

      return signature;

    } catch (error) {
      console.error('NFT to tokens swap failed:', error);
      throw this.handleError(error);
    }
  }

  async swapTokensForNft(nftMint: string): Promise<string> {
    try {
      if (!this.wallet?.publicKey || !this.wallet.signTransaction) {
        throw new Error('Wallet not connected');
      }

      // 1. Verify token balance
      const balance = await this.getTokenBalance();
      if (balance < SwapService.TOKEN_PER_NFT) {
        throw new Error('Insufficient token balance');
      }

      // 2. Create swap instruction
      const swapInstruction = await this.createSwapTokenInstruction(nftMint);

      // 3. Create and send transaction
      const transaction = new Transaction().add(swapInstruction);
      transaction.feePayer = this.wallet.publicKey;
      
      const latestBlockhash = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockhash.blockhash;

      const signedTx = await this.wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTx.serialize());
      await this.connection.confirmTransaction(signature);

      return signature;

    } catch (error) {
      console.error('Tokens to NFT swap failed:', error);
      throw this.handleError(error);
    }
  }

  async getTokenBalance(): Promise<number> {
    try {
      if (!this.wallet?.publicKey) {
        return 0;
      }

      const tokenAccount = findAssociatedTokenPda(this.umi, {
        mint: toPublicKey(SwapService.TOKEN_MINT),
        owner: toPublicKey(this.wallet.publicKey.toBase58())
      });

      try {
        const token = await fetchToken(this.umi, tokenAccount);
        return Number(token.amount);
      } catch (error: any) {
        if (error.name === 'AccountNotFoundError') {
          return 0;
        }
        throw error;
      }
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return 0;
    }
  }

  async getAvailableNftMints(): Promise<string[]> {
    try {
      if (!this.wallet?.publicKey) {
        return [];
      }

      // You would implement this based on your smart contract's state
      // This could query for NFTs in the swap pool or owned by the user
      return [];
    } catch (error) {
      console.error('Failed to get available NFTs:', error);
      return [];
    }
  }

  private async verifyNftOwnership(nftMint: string): Promise<boolean> {
    try {
      if (!this.wallet?.publicKey) {
        throw new Error('Wallet not connected');
      }

      const asset = await fetchAsset(this.umi, toPublicKey(nftMint));
      
      if (asset.updateAuthority.toString() !== this.wallet.publicKey.toString()) {
        throw new Error('NFT not owned by wallet');
      }

      // Add additional collection verification if needed

      return true;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async createSwapNftInstruction(nftMint: string): Promise<any> {
    // This would create the instruction based on your smart contract's interface
    throw new Error('Not implemented');
  }

  private async createSwapTokenInstruction(nftMint: string): Promise<any> {
    // This would create the instruction based on your smart contract's interface
    throw new Error('Not implemented');
  }

  private handleError(error: any): SwapError {
    const swapError: SwapError = new Error(error.message || 'Swap failed');
    swapError.code = error.code || 'UNKNOWN_ERROR';
    swapError.details = error;
    return swapError;
  }

  getTokensPerNft(): number {
    return SwapService.TOKEN_PER_NFT;
  }
}