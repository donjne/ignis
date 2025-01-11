"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  ArrowDown,
  Wallet,
  ImageIcon,
  Coins,
} from 'lucide-react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/landing/WalletButton';
import { SwapService } from '@/lib/SwapService';
import { toast } from 'react-hot-toast';

interface SwapDirection {
  from: 'token' | 'nft';
  to: 'token' | 'nft';
}

const SwapPage: React.FC = () => {
  const { publicKey, connected } = useWallet() as WalletContextState;
  const [isLoading, setIsLoading] = useState(false);
  const [swapDirection, setSwapDirection] = useState<SwapDirection>({
    from: 'token',
    to: 'nft'
  });
  const [selectedNft, setSelectedNft] = useState<string>('');
  const [availableNfts, setAvailableNfts] = useState<string[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokensPerNft, setTokensPerNft] = useState<number>(0);

  const swapService = new SwapService();

  useEffect(() => {
    if (connected && publicKey) {
      fetchBalancesAndNfts();
    }
  }, [connected, publicKey]);

  const fetchBalancesAndNfts = async () => {
    try {
      const [nftMints, balance, rate] = await Promise.all([
        swapService.getAvailableNftMints(),
        swapService.getTokenBalance(),
        swapService.getTokensPerNft()
      ]);

      setAvailableNfts(nftMints);
      setTokenBalance(balance);
      setTokensPerNft(rate);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch swap data');
    }
  };

  const handleSwapDirectionToggle = () => {
    setSwapDirection(prev => ({
      from: prev.to,
      to: prev.from
    }));
    // Reset selections
    setSelectedNft('');
    setTokenAmount('');
  };

  const handleSwap = async () => {
    if (!connected) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsLoading(true);
    try {
      if (swapDirection.from === 'nft') {
        await swapService.swapNftForTokens(selectedNft);
        toast.success('Successfully swapped NFT for tokens!');
      } else {
        await swapService.swapTokensForNft(selectedNft);
        toast.success('Successfully swapped tokens for NFT!');
      }
      // Refresh balances
      await fetchBalancesAndNfts();
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error(error.message || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <WalletButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Swap Assets
          </h1>
          <p className="text-gray-400 text-lg">
            Swap between tokens and NFTs seamlessly
          </p>
        </motion.div>

        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-xl blur-xl" />
            
            <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20">
              {/* Swap Direction Toggle */}
              <div className="flex justify-end mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSwapDirectionToggle}
                  className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    key={swapDirection.from}
                  >
                    <RefreshCw className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                </motion.button>
              </div>

              {/* From Section */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-medium text-gray-300">From</h3>
                <div className="p-4 rounded-lg bg-black/50 border border-cyan-500/20">
                  {swapDirection.from === 'token' ? (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Amount</span>
                        <span className="text-sm text-gray-400">
                          Balance: {tokenBalance.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <input
                          type="number"
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className="w-full bg-black/50 border border-cyan-500/20 rounded-lg p-3 text-white"
                          placeholder="Enter token amount"
                        />
                        <Coins className="w-6 h-6 text-cyan-400" />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Select NFT</span>
                      </div>
                      <select
                        value={selectedNft}
                        onChange={(e) => setSelectedNft(e.target.value)}
                        className="w-full bg-black/50 border border-cyan-500/20 rounded-lg p-3 text-white"
                      >
                        <option value="">Select an NFT</option>
                        {availableNfts.map((nft) => (
                          <option key={nft} value={nft}>
                            {nft.slice(0, 8)}...{nft.slice(-8)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center my-4">
                <ArrowDown className="w-6 h-6 text-cyan-400" />
              </div>

              {/* To Section */}
              <div className="space-y-4 mb-8">
                <h3 className="text-lg font-medium text-gray-300">To</h3>
                <div className="p-4 rounded-lg bg-black/50 border border-cyan-500/20">
                  {swapDirection.to === 'token' ? (
                    <div className="flex items-center justify-between">
                      <span>You will receive: {tokensPerNft.toLocaleString()} tokens</span>
                      <Coins className="w-6 h-6 text-cyan-400" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>You will receive: 1 NFT</span>
                      <ImageIcon className="w-6 h-6 text-cyan-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSwap}
                disabled={isLoading || !connected}
                className="w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium 
                        hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center
                        disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  'Swap'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-teal-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default SwapPage;