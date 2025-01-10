import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export interface WalletContextState {
  network: WalletAdapterNetwork;
  endpoint: string;
}