"use client"
import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowDown, Settings } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { SwapService } from '@/lib/SwapService';
import { toast } from 'react-hot-toast';
import { useSwapConfig } from '@/contexts/swapConfigContext';
import WalletButton from '@/components/landing/WalletButton';
import SwapConfigForm from '@/components/swap/SwapConfigForm';
import SwapAddresses from './SwapAddresses';

interface SwapDirection {
  from: 'token' | 'nft';
  to: 'token' | 'nft';
}

const SwapPage: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { config, isConfigured } = useSwapConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [swapDirection, setSwapDirection] = useState<SwapDirection>({
    from: 'token',
    to: 'nft'
  });
  const [selectedNft, setSelectedNft] = useState<string>('');
  const [availableNfts, setAvailableNfts] = useState<string[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokensPerNft, setTokensPerNft] = useState<number>(0);
  const [escrowAddress, setEscrowAddress] = useState<string>('');

  useEffect(() => {
    if (connected && publicKey && isConfigured && config) {
      fetchBalancesAndNfts();
    }
  }, [connected, publicKey, isConfigured, config]);

  const fetchBalancesAndNfts = async () => {
    if (!config) return;
    
    try {
      const swapService = new SwapService(config);
      const [nftMints, balance, rate, escrowAddr] = await Promise.all([
        swapService.getAvailableNftMints(),
        swapService.getTokenBalance(),
        swapService.getTokensPerNft(),
        swapService.getEscrowAddress()
      ]);

      setAvailableNfts(nftMints);
      setTokenBalance(balance);
      setTokensPerNft(rate);
      setEscrowAddress(escrowAddr);
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
    setSelectedNft('');
    setTokenAmount('');
  };

  const handleSwap = async () => {
    if (!connected) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!config) {
      toast.error('Please configure swap settings first');
      return;
    }

    setIsLoading(true);
    try {
      const swapService = new SwapService(config);
      
      if (swapDirection.from === 'nft') {
        if (!selectedNft) {
          throw new Error('Please select an NFT');
        }
        await swapService.swapNftForTokens(selectedNft);
        toast.success('Successfully swapped NFT for tokens!');
      } else {
        if (!selectedNft || !tokenAmount) {
          throw new Error('Please enter token amount and select NFT');
        }
        await swapService.swapTokensForNft(selectedNft);
        toast.success('Successfully swapped tokens for NFT!');
      }
      await fetchBalancesAndNfts();
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error(error.message || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConfigured || showConfig) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <SwapConfigForm />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between mb-8">
          <button
            onClick={() => setShowConfig(true)}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors"
          >
            <Settings className="w-6 h-6 text-cyan-400" />
          </button>
          <WalletButton />
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Swap Assets
          </h1>
          <p className="text-gray-400 text-lg">
            Swap between tokens and NFTs seamlessly
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="relative bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-cyan-500/20">
            {/* Swap Direction Toggle */}
            <div className="flex justify-end mb-6">
              <button
                onClick={handleSwapDirectionToggle}
                className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors"
              >
                <RefreshCw className="w-6 h-6 text-cyan-400" />
              </button>
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
                    <input
                      type="number"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full bg-black/50 border border-cyan-500/20 rounded-lg p-3 text-white"
                      placeholder="Enter token amount"
                    />
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
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>You will receive: 1 NFT</span>
                  </div>
                )}
              </div>
            </div>

            {/* Swap Button */}
            <button
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
            </button>
          </div>
        </div>
      </div>
      <SwapAddresses escrowAddress={escrowAddress} />
    </div>
  );
};

export default SwapPage;