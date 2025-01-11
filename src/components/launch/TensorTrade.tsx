import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  RefreshCw,
  Handshake,
  AlertCircle,
  ListPlus,
  XCircle,
  Check,
  Search
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Transaction, PublicKey, Connection } from '@solana/web3.js';
import WalletButton from '@/components/landing/WalletButton';

interface FormData {
  nftMint: string;
  price: number;
}

const TensorTrade = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    signature: string;
    action: 'listed' | 'delisted';
  } | null>(null);
  const [action, setAction] = React.useState<'list' | 'delist'>('list');
  
  const [formData, setFormData] = React.useState<FormData>({
    nftMint: '',
    price: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    if (!formData.nftMint) {
      setError('Please enter an NFT mint address');
      return false;
    }
    try {
      new PublicKey(formData.nftMint);
    } catch {
      setError('Invalid NFT mint address');
      return false;
    }
    if (action === 'list' && (!formData.price || formData.price <= 0)) {
      setError('Please enter a valid price');
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
      const response = await fetch('/api/tensor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...formData,
          wallet: publicKey?.toBase58()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transaction');
      }

      // Deserialize and sign transaction
      const transaction = Transaction.from(
        Buffer.from(data.transaction, 'base64')
      );

      const signedTx = await signTransaction(transaction);

      // Add any extra signers from Tensor SDK
      if (data.extraSigners?.length) {
        signedTx.sign(...data.extraSigners);
      }

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
        action: action === 'list' ? 'listed' : 'delisted'
      });
    } catch (err: any) {
      setError(err.message || `Failed to ${action} NFT`);
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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex items-center gap-2"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Trade on Tensor
          </h1>
          <p className="text-gray-400 text-lg">
            List and delist your NFTs on Tensor marketplace
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
                <div className="flex items-center justify-between mb-8">
                  <Handshake className="w-8 h-8 text-cyan-400" />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAction('list')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        action === 'list'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-black/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      <ListPlus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setAction('delist')}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        action === 'delist'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-black/30 text-gray-400 hover:text-white'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">NFT Mint Address *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="nftMint"
                        value={formData.nftMint}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                        placeholder="NFT's mint address"
                        required
                      />
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {action === 'list' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Price (SOL) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                        placeholder="Enter price in SOL"
                        min="0"
                        step="any"
                        required={action === 'list'}
                      />
                    </div>
                  )}

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
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {action === 'list' ? <ListPlus className="w-5 h-5 mr-2" /> : <XCircle className="w-5 h-5 mr-2" />}
                        {action === 'list' ? 'List NFT' : 'Delist NFT'}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">NFT {success.action} Successfully!</h2>
                  <p className="text-gray-400 mb-6">
                    Your NFT has been {success.action} on Tensor.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-300 break-all">
                      <span className="text-cyan-400">Transaction Signature: </span>
                      {success.signature}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSuccess(null);
                      setFormData({
                        nftMint: '',
                        price: 0
                      });
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                  >
                    {action === 'list' ? 'List Another NFT' : 'Delist Another NFT'}
                  </motion.button>
                </motion.div>
              )}
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
  
  export default TensorTrade;