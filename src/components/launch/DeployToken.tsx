'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Coins,
  RefreshCw,
  Rocket,
  Check,
  AlertCircle
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/landing/WalletButton';
import { Connection } from '@solana/web3.js';

interface FormData {
  name: string;
  symbol: string;
  uri: string;
  decimals: number;
  initialSupply?: number;
}

const DeployToken = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{mint: string} | null>(null);
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    symbol: '',
    uri: '',
    decimals: 9,
    initialSupply: undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'decimals' || name === 'initialSupply' 
        ? value === '' ? '' : Number(value)
        : value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.symbol || !formData.uri) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.symbol.length > 10) {
      setError('Symbol must be 10 characters or less');
      return false;
    }
    if (formData.decimals < 0 || formData.decimals > 9) {
      setError('Decimals must be between 0 and 9');
      return false;
    }
    if (formData.initialSupply && formData.initialSupply <= 0) {
      setError('Initial supply must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) {
      setError('Please connect your wallet first');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess(null);

    try {
      const response = await fetch('/api/deploy/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          wallet: publicKey?.toBase58()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deploy token');
      }

      setSuccess({ mint: data.mint });
    } catch (err: any) {
      setError(err.message || 'Failed to deploy token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hub
          </button>
          <WalletButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
            Deploy Your Token
          </h1>
          <p className="text-gray-400 text-lg">
            Create and deploy your own SPL token with custom parameters
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20">
                <div className="flex items-center justify-center mb-8">
                  <Coins className="w-16 h-16 text-blue-400" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Token Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-blue-500/20 focus:border-blue-500/50 outline-none"
                      placeholder="e.g., My Token"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Token Symbol *</label>
                    <input
                      type="text"
                      name="symbol"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-blue-500/20 focus:border-blue-500/50 outline-none"
                      placeholder="e.g., MTK"
                      required
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Metadata URI *</label>
                    <input
                      type="url"
                      name="uri"
                      value={formData.uri}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-blue-500/20 focus:border-blue-500/50 outline-none"
                      placeholder="e.g., https://..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Decimals</label>
                    <input
                      type="number"
                      name="decimals"
                      value={formData.decimals}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-blue-500/20 focus:border-blue-500/50 outline-none"
                      min="0"
                      max="9"
                    />
                    <p className="text-xs text-gray-400 mt-1">Number of decimal places (0-9)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Initial Supply</label>
                    <input
                      type="number"
                      name="initialSupply"
                      value={formData.initialSupply || ''}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-blue-500/20 focus:border-blue-500/50 outline-none"
                      placeholder="Optional"
                      min="0"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading || !connected}
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Deploy Token
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Token Deployed Successfully!</h2>
                <p className="text-gray-400 mb-6">
                  Your token has been created and deployed to the network.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-300 break-all">
                    <span className="text-blue-400">Mint Address: </span>
                    {success.mint}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSuccess(null);
                    setFormData({
                      name: '',
                      symbol: '',
                      uri: '',
                      decimals: 9,
                      initialSupply: undefined
                    });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Deploy Another Token
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-indigo-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default DeployToken;