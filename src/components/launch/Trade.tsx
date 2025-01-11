import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  RefreshCw,
  Share2,
  AlertCircle,
  ChevronDown,
  ArrowDownUp,
  Settings,
  Check
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, VersionedTransaction } from '@solana/web3.js';
import WalletButton from '@/components/landing/WalletButton';

interface FormData {
  inputMint: string;
  outputMint: string;
  inputAmount: number;
  slippageBps: number;
}

// Common token list - extend as needed
const TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  // Add more tokens as needed
};

const TOKEN_INFO = {
  [TOKENS.SOL]: { symbol: 'SOL', name: 'Solana', decimals: 9 },
  [TOKENS.USDC]: { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  // Add more token info as needed
};

const Trade = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    signature: string;
  } | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    inputMint: TOKENS.USDC,
    outputMint: TOKENS.SOL,
    inputAmount: 0,
    slippageBps: 100, // 1% default
  });

  const [quote, setQuote] = React.useState<any>(null);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'slippageBps' ? Number(value) : 
              name === 'inputAmount' ? Number(value) : value
    }));
  };

  const switchTokens = () => {
    setFormData(prev => ({
      ...prev,
      inputMint: prev.outputMint,
      outputMint: prev.inputMint,
      inputAmount: 0
    }));
    setQuote(null);
  };

  const validateForm = () => {
    if (!formData.inputAmount || formData.inputAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (formData.inputMint === formData.outputMint) {
      setError('Please select different tokens');
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
      const response = await fetch('/api/trade', {
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
        throw new Error(data.error || 'Failed to create trade');
      }

      // Deserialize and sign transaction
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

      setSuccess({ signature });
    } catch (err: any) {
      setError(err.message || 'Failed to execute trade');
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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/20 hover:border-yellow-500/40 transition-all flex items-center gap-2"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400">
            Trade Tokens
          </h1>
          <p className="text-gray-400 text-lg">
            Swap tokens instantly using Jupiter Exchange
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-8">
                  <Share2 className="w-8 h-8 text-yellow-400" />
                  <button
                    type="button"
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-black/30 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {showSettings && (
                  <div className="mb-6 p-4 rounded-lg bg-black/30">
                    <label className="block text-sm font-medium mb-2">
                      Slippage Tolerance (%)
                    </label>
                    <input
                      type="number"
                      name="slippageBps"
                      value={formData.slippageBps / 100}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'slippageBps',
                          value: String(Number(e.target.value) * 100)
                        }
                      } as any)}
                      className="w-full p-3 rounded-lg bg-black/50 border border-yellow-500/20 focus:border-yellow-500/50 outline-none"
                      min="0.01"
                      max="100"
                      step="0.01"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">You Pay</label>
                    <div className="flex gap-4">
                      <select
                        name="inputMint"
                        value={formData.inputMint}
                        onChange={(e) => handleInputChange({
                          target: {
                            name: 'inputMint',
                            value: e.target.value
                          }
                        } as any)}
                        className="w-1/3 p-3 rounded-lg bg-black/50 border border-yellow-500/20 focus:border-yellow-500/50 outline-none"
                      >
                        {Object.entries(TOKENS).map(([symbol, address]) => (
                          <option key={address} value={address}>
                            {symbol}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name="inputAmount"
                        value={formData.inputAmount}
                        onChange={handleInputChange}
                        className="flex-1 p-3 rounded-lg bg-black/50 border border-yellow-500/20 focus:border-yellow-500/50 outline-none"
                        placeholder="0.00"
                        min="0"
                        step="any"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={switchTokens}
                      className="p-2 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <ArrowDownUp className="w-5 h-5 text-yellow-400" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">You Receive</label>
                    <div className="flex gap-4">
                      <select
                        name="outputMint"
                        value={formData.outputMint}
                        onChange={(e) => handleInputChange({
                          target: {
                            name: 'outputMint',
                            value: e.target.value
                          }
                        } as any)}
                        className="w-1/3 p-3 rounded-lg bg-black/50 border border-yellow-500/20 focus:border-yellow-500/50 outline-none"
                      >
                        {Object.entries(TOKENS).map(([symbol, address]) => (
                          <option key={address} value={address}>
                            {symbol}
                          </option>
                        ))}
                      </select>
                      <div className="flex-1 p-3 rounded-lg bg-black/50 border border-yellow-500/20 text-gray-400">
                        {quote ? quote.outAmount : '0.00'}
                      </div>
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
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        Swap Tokens
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">Trade Executed Successfully!</h2>
                <p className="text-gray-400 mb-6">
                  Your token swap has been completed.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-300 break-all">
                    <span className="text-yellow-400">Transaction Signature: </span>
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
                      inputAmount: 0
                    }));
                    setQuote(null);
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-medium hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300"
                >
                  Make Another Trade
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/20 via-black to-amber-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default Trade;