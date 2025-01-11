'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  BarChart3,
  RefreshCw,
  Check,
  AlertCircle,
  Coins,
  BellRing
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, VersionedTransaction } from '@solana/web3.js';
import WalletButton from '@/components/landing/WalletButton';

interface FormData {
  amount: number;
  provider: 'jupiter' | 'solayer';
}

const PROVIDERS = {
  jupiter: {
    name: 'Jupiter',
    description: 'Stake SOL and receive jupSOL',
    apy: '~6.5%'
  },
  solayer: {
    name: 'Solayer',
    description: 'Stake SOL and receive sSOL',
    apy: '~7%'
  }
};

const Stake = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    signature: string;
    provider: string;
  } | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    amount: 0,
    provider: 'jupiter'
  });

  const validateForm = () => {
    if (!formData.amount || formData.amount <= 0) {
      setError('Please enter a valid amount');
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
      const response = await fetch('/api/stake', {
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
        throw new Error(data.error || 'Failed to create staking transaction');
      }

      // Deserialize and sign transaction
      const transaction = VersionedTransaction.deserialize(
        Buffer.from(data.transaction, 'base64')
      );

      // Get latest blockhash
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_URL || 'https://api.devnet.solana.com'
      );
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.message.recentBlockhash = blockhash;

      const signedTx = await signTransaction(transaction);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      // Wait for confirmation
      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      setSuccess({ 
        signature,
        provider: PROVIDERS[formData.provider].name
      });
    } catch (err: any) {
      setError(err.message || 'Failed to stake tokens');
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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500/20 to-rose-500/20 text-pink-400 border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-center gap-2"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">
            Stake SOL
          </h1>
          <p className="text-gray-400 text-lg">
            Stake your SOL tokens to earn rewards
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20">
                <div className="flex items-center justify-center mb-8">
                  <BarChart3 className="w-16 h-16 text-pink-400" />
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(PROVIDERS).map(([key, provider]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-lg border transition-all cursor-pointer ${
                          formData.provider === key
                            ? 'bg-pink-500/20 border-pink-500/40'
                            : 'bg-black/30 border-pink-500/20 hover:border-pink-500/30'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, provider: key as 'jupiter' | 'solayer' }))}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{provider.name}</h3>
                          <div className="px-2 py-1 text-xs rounded-full bg-pink-500/20 text-pink-400">
                            APY {provider.apy}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">{provider.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (SOL)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                        className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-pink-500/20 focus:border-pink-500/50 outline-none"
                        placeholder="Enter amount to stake"
                        min="0"
                        step="0.1"
                      />
                      <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Stake SOL
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">SOL Staked Successfully!</h2>
                <p className="text-gray-400 mb-6">
                  Your SOL has been staked with {success.provider}.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-300 break-all">
                    <span className="text-pink-400">Transaction Signature: </span>
                    {success.signature}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSuccess(null);
                    setFormData(prev => ({
                      ...prev,
                      amount: 0
                    }));
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                >
                  Stake More SOL
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-black to-rose-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default Stake;