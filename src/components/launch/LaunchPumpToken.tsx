'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Rocket,
  RefreshCw,
  Check,
  AlertCircle,
  Upload,
  Twitter,
  Globe,
  MessageCircle,
  Coins
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletButton from '@/components/landing/WalletButton';
import { Connection, VersionedTransaction } from '@solana/web3.js';

interface FormData {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  twitter?: string;
  telegram?: string;
  website?: string;
  initialLiquiditySOL: number;
  slippageBps: number;
  priorityFee: number;
}

const LaunchPumpToken = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    signature: string;
    mint: string;
    metadataUri: string;
  } | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    twitter: '',
    telegram: '',
    website: '',
    initialLiquiditySOL: 0.0001,
    slippageBps: 5,
    priorityFee: 0.00005
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['initialLiquiditySOL', 'slippageBps', 'priorityFee'].includes(name) 
        ? Number(value)
        : value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.symbol || !formData.description || !formData.imageUrl) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.initialLiquiditySOL < 0.0001) {
      setError('Initial liquidity must be at least 0.0001 SOL');
      return false;
    }
    if (formData.symbol.length > 10) {
      setError('Symbol must be 10 characters or less');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess(null);

    try {
      // First, get the transaction from our API
      const response = await fetch('/api/launch/pumpfun', {
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
        throw new Error(data.error || 'Failed to create transaction');
      }

      // Deserialize and sign the transaction
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(data.transaction, 'base64')
      );

      const signedTx = await signTransaction(transaction);

      // Send the signed transaction
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );

      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      await connection.confirmTransaction(signature);

      setSuccess({
        signature,
        mint: data.mint,
        metadataUri: data.metadata.metadataUri
      });
    } catch (err: any) {
      setError(err.message || 'Failed to launch token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/launch')}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-2"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
            Launch on Pump.fun
          </h1>
          <p className="text-gray-400 text-lg">
            Create and launch your token with automatic liquidity
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20">
                <div className="flex items-center justify-center mb-8">
                  <Rocket className="w-16 h-16 text-red-400" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Token Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                      placeholder="e.g., My Pump Token"
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
                      className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                      placeholder="e.g., MPT"
                      required
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none min-h-[100px]"
                      placeholder="Describe your token..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Token Image URL *</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                      placeholder="e.g., https://..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Twitter</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                          placeholder="@username"
                        />
                        <Twitter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Telegram</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="telegram"
                          value={formData.telegram}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                          placeholder="t.me/..."
                        />
                        <MessageCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Website</label>
                      <div className="relative">
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                          placeholder="https://..."
                        />
                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Initial Liquidity (SOL)</label>
                      <input
                        type="number"
                        name="initialLiquiditySOL"
                        value={formData.initialLiquiditySOL}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                        min="0.0001"
                        step="0.0001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Slippage (basis points)</label>
                      <input
                        type="number"
                        name="slippageBps"
                        value={formData.slippageBps}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                        min="1"
                        max="1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Priority Fee (SOL)</label>
                      <input
                        type="number"
                        name="priorityFee"
                        value={formData.priorityFee}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-black/50 border border-red-500/20 focus:border-red-500/50 outline-none"
                        min="0.00001"
                        step="0.00001"
                      />
                    </div>
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
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Rocket className="w-5 h-5 mr-2" />
                        Launch Token
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Token Launched Successfully!</h2>
                <p className="text-gray-400 mb-6">
                  Your token has been created and launched on Pump.fun.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-300 mb-3 break-all">
                    <span className="text-red-400">Mint Address: </span>
                    {success.mint}
                  </p>
                  <p className="text-sm text-gray-300 mb-3 break-all">
                    <span className="text-red-400">Signature: </span>
                    {success.signature}
                  </p>
                  <p className="text-sm text-gray-300 break-all">
                    <span className="text-red-400">Metadata URI: </span>
                    {success.metadataUri}
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
                      description: '',
                      imageUrl: '',
                      twitter: '',
                      telegram: '',
                      website: '',
                      initialLiquiditySOL: 0.0001,
                      slippageBps: 5,
                      priorityFee: 0.00005
                    });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                >
                  Launch Another Token
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default LaunchPumpToken;