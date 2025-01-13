import { create } from 'zustand';
import { SwapConfig } from '../types/swapConfig';

interface SwapConfigStore {
  config: SwapConfig | null;
  setConfig: (config: SwapConfig) => void;
  isConfigured: boolean;
}

export const useSwapConfig = create<SwapConfigStore>((set) => ({
  config: null,
  setConfig: (config) => set({ config, isConfigured: true }),
  isConfigured: false,
}));