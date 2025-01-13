export interface SwapConfig {
    collection: string;
    tokenMint: string;
    authority: string;
    baseUri: string;
    minIndex: number;
    maxIndex: number;
    tokenPerNft: number;
    tokenFee: number;
    solFee: number;
    escrowName: string;
    initialFundingAmount: number;
  }