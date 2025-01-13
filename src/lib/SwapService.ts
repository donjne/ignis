import { 
  releaseV1, 
  captureV1, 
  fetchEscrowV1 
} from '@metaplex-foundation/mpl-hybrid';
import { 
  fetchToken, 
  findAssociatedTokenPda,
  createTokenIfMissing
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';
import { fetchAsset, fetchCollection } from '@metaplex-foundation/mpl-core';
import { type SwapConfig } from '../types/swapConfig';
import { EscrowSetupService } from './EscrowSetupService';

export interface SwapError extends Error {
  code?: string;
  details?: any;
}

export class SwapService {
  private escrowSetupService: EscrowSetupService;
  private config: SwapConfig;
  public readonly umi;

  constructor(config: SwapConfig) {
    this.config = config;
    this.escrowSetupService = new EscrowSetupService(config);
    this.umi = this.escrowSetupService.umi;
  }

  async setupAndValidateEscrow() {
    try {
      console.log('Starting escrow setup and validation...');

      const escrowData = await this.validateEscrow().catch(async () => {
        console.log('Escrow not found, initializing new escrow...');
        await this.escrowSetupService.initializeEscrow();
        await this.escrowSetupService.addDelegates();
        await this.escrowSetupService.fundEscrow();
        return await this.validateEscrow();
      });

      return escrowData;
    } catch (error) {
      console.error('Escrow setup and validation failed:', error);
      throw this.handleError(error);
    }
  }

  private async validateEscrow() {
    try {
      const escrowData = await fetchEscrowV1(
        this.umi,
        this.escrowSetupService.escrowAddress
      );

      if (!escrowData) {
        throw new Error('Escrow data not found');
      }

      // Additional validation
      if (
        escrowData.collection.toString() !== this.config.collection ||
        escrowData.token.toString() !== this.config.tokenMint ||
        escrowData.authority.toString() !== this.config.authority ||
        Number(escrowData.amount) !== this.config.tokenPerNft
      ) {
        throw new Error('Escrow configuration mismatch');
      }

      return escrowData;
    } catch (error) {
      console.error('Escrow validation failed:', error);
      throw error;
    }
  }

  private async getEscrowTokenBalance(): Promise<number> {
    const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
      mint: publicKey(this.config.tokenMint),
      owner: publicKey(this.escrowSetupService.escrowAddress)
    });

    const token = await fetchToken(this.umi, escrowTokenAccount);
    return Number(token.amount);
  }

  async swapNftForTokens(nftMint: string) {
    try {
      await this.verifyCollection();
      await this.setupAndValidateEscrow();

      // Get token account for the wallet
      const walletTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.umi.identity.publicKey
      });

      // Get fee wallet's token account
      const feeTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: publicKey(this.config.authority)
      });

      console.log('Creating token account if needed...');
      const createTokenAccountTx = await createTokenIfMissing(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.umi.identity.publicKey,
        token: walletTokenAccount,
      });

      // Wait for token account creation to be confirmed
      if (createTokenAccountTx.items.length > 0) {
        await createTokenAccountTx.sendAndConfirm(this.umi);
      }

      // Execute the NFT to tokens swap
      const tx = await releaseV1(this.umi, {
        owner: this.umi.identity,
        escrow: publicKey(this.escrowSetupService.escrowAddress),
        asset: publicKey(nftMint),
        collection: publicKey(this.config.collection),
        feeProjectAccount: publicKey(this.config.authority),
        feeTokenAccount: feeTokenAccount,
        token: publicKey(this.config.tokenMint),
      });

      return await tx.sendAndConfirm(this.umi);
    } catch (error) {
      console.error('NFT to tokens swap failed:', error);
      throw this.handleError(error);
    }
  }

  async swapTokensForNft(nftMint: string) {
    try {
      await this.setupAndValidateEscrow();

      const walletTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.umi.identity.publicKey
      });

      const feeTokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: publicKey(this.config.authority)
      });

      const tx = await captureV1(this.umi, {
        owner: this.umi.identity,
        escrow: this.escrowSetupService.escrowAddress,
        asset: publicKey(nftMint),
        collection: publicKey(this.config.collection),
        feeProjectAccount: publicKey(this.config.authority),
        feeTokenAccount: feeTokenAccount,
        token: publicKey(this.config.tokenMint),
      });

      return await tx.sendAndConfirm(this.umi);
    } catch (error) {
      console.error('Tokens to NFT swap failed:', error);
      throw this.handleError(error);
    }
  }

  private handleError(error: any): SwapError {
    const swapError: SwapError = new Error(error.message || 'Swap failed');
    swapError.code = error.code || 'UNKNOWN_ERROR';
    swapError.details = error;
    return swapError;
  }

  async getAvailableNftMints(): Promise<string[]> {
    // This would typically fetch from your backend or blockchain
    // For now returning an empty array as placeholder
    return [];
  }

  async getTokenBalance(): Promise<number> {
    try {
      const tokenAccount = findAssociatedTokenPda(this.umi, {
        mint: publicKey(this.config.tokenMint),
        owner: this.umi.identity.publicKey
      });
  
      try {
        const token = await fetchToken(this.umi, tokenAccount);
        return Number(token.amount);
      } catch (error: any) {
        // If account doesn't exist, return 0 balance
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

  async verifyCollection() {
    try {
      console.log('Verifying collection...');
      const collection = publicKey(this.config.collection);
      
      const collectionData = await fetchCollection(this.umi, collection);
      console.log('Collection data:', collectionData);

      const isValid = collectionData.updateAuthority.toString() === this.config.authority;

      if (!isValid) {
        throw new Error('Collection authority mismatch');
      }

      return true;
    } catch (error) {
      console.error('Collection verification failed:', error);
      throw this.handleError(error);
    }
  }

  getTokensPerNft(): number {
    return this.config.tokenPerNft;
  }

  async getEscrowAddress(): Promise<string> {
    return this.escrowSetupService.escrowAddress.toString();
  }
  
  async getAssociatedAccounts() {
    const escrowTokenAccount = findAssociatedTokenPda(this.umi, {
      mint: publicKey(this.config.tokenMint),
      owner: publicKey(this.escrowSetupService.escrowAddress)
    });
  
    const feeTokenAccount = findAssociatedTokenPda(this.umi, {
      mint: publicKey(this.config.tokenMint),
      owner: publicKey(this.config.authority)
    });
  
    return {
      escrowTokenAccount: escrowTokenAccount.toString(),
      feeTokenAccount: feeTokenAccount.toString()
    };
  }
}