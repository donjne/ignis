import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  ImageIcon,
  RefreshCw,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  User
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import WalletButton from '@/components/landing/WalletButton';

interface Creator {
  address: string;
  share: number;
}

interface FormData {
  collectionAddress: string;
  name: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[];
  recipient?: string;
}

const MintNFT = () => {
  const router = useRouter();
  const { publicKey, signTransaction, connected } = useWallet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState<{
    mint: string;
    signature: string;
  } | null>(null);
  
  const [formData, setFormData] = React.useState<FormData>({
    collectionAddress: '',
    name: '',
    uri: '',
    sellerFeeBasisPoints: 500, // 5% default
    creators: [],
    recipient: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'sellerFeeBasisPoints' ? Number(value) : value
    }));
  };

  const addCreator = () => {
    setFormData(prev => ({
      ...prev,
      creators: [...prev.creators, { address: '', share: 0 }]
    }));
  };

  const removeCreator = (index: number) => {
    setFormData(prev => ({
      ...prev,
      creators: prev.creators.filter((_, i) => i !== index)
    }));
  };

  const updateCreator = (index: number, field: 'address' | 'share', value: string) => {
    setFormData(prev => ({
      ...prev,
      creators: prev.creators.map((creator, i) => 
        i === index 
          ? { ...creator, [field]: field === 'share' ? Number(value) : value }
          : creator
      )
    }));
  };

  const validateForm = () => {
    if (!formData.collectionAddress || !formData.name || !formData.uri) {
      setError('Please fill in all required fields');
      return false;
    }
    try {
      new PublicKey(formData.collectionAddress);
    } catch {
      setError('Invalid collection address');
      return false;
    }
    if (formData.recipient) {
      try {
        new PublicKey(formData.recipient);
      } catch {
        setError('Invalid recipient address');
        return false;
      }
    }
    if (formData.creators.length > 0) {
      const totalShares = formData.creators.reduce((sum, creator) => sum + creator.share, 0);
      if (totalShares !== 100) {
        setError('Creator shares must sum to 100%');
        return false;
      }
      if (formData.creators.some(creator => !creator.address)) {
        setError('All creator addresses must be filled');
        return false;
      }
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
      const response = await fetch('/api/mint/nft', {
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
        throw new Error(data.error || 'Failed to mint NFT');
      }

      setSuccess({
        mint: data.mint,
        signature: data.signature
      });
    } catch (err: any) {
      setError(err.message || 'Failed to mint NFT');
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
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/20 hover:border-green-500/40 transition-all flex items-center gap-2"
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
            Mint NFTs
          </h1>
          <p className="text-gray-400 text-lg">
            Mint new NFTs to your existing collection
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl"
          >
            {!success ? (
              <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="flex items-center justify-center mb-8">
                  <ImageIcon className="w-16 h-16 text-green-400" />
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection Address *</label>
                    <input
                      type="text"
                      name="collectionAddress"
                      value={formData.collectionAddress}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                      placeholder="Collection's mint address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">NFT Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                      placeholder="e.g., My NFT #1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Metadata URI *</label>
                    <input
                      type="url"
                      name="uri"
                      value={formData.uri}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                      placeholder="e.g., https://..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Royalty (%)</label>
                    <input
                      type="number"
                      name="sellerFeeBasisPoints"
                      value={formData.sellerFeeBasisPoints / 100}
                      onChange={(e) => handleInputChange({
                        target: {
                          name: 'sellerFeeBasisPoints',
                          value: String(Number(e.target.value) * 100)
                        }
                      } as any)}
                      className="w-full p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="recipient"
                        value={formData.recipient}
                        onChange={handleInputChange}
                        className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                        placeholder="Leave empty to mint to connected wallet"
                      />
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Creators</label>
                      <button
                        type="button"
                        onClick={addCreator}
                        className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Creator
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.creators.map((creator, index) => (
                        <div key={index} className="flex gap-4">
                          <input
                            type="text"
                            value={creator.address}
                            onChange={(e) => updateCreator(index, 'address', e.target.value)}
                            className="flex-grow p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                            placeholder="Creator address"
                          />
                          <input
                            type="number"
                            value={creator.share}
                            onChange={(e) => updateCreator(index, 'share', e.target.value)}
                            className="w-24 p-3 rounded-lg bg-black/50 border border-green-500/20 focus:border-green-500/50 outline-none"
                            placeholder="%"
                            min="0"
                            max="100"
                          />
                          <button
                            type="button"
                            onClick={() => removeCreator(index)}
                            className="p-3 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
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
                    className="w-full p-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Mint NFT
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-4">NFT Minted Successfully!</h2>
                <p className="text-gray-400 mb-6">
                  Your NFT has been minted to the collection.
                </p>
                <div className="bg-black/30 rounded-lg p-4 mb-8">
                  <p className="text-sm text-gray-300 mb-3 break-all">
                    <span className="text-green-400">NFT Address: </span>
                    {success.mint}
                  </p>
                  <p className="text-sm text-gray-300 break-all">
                    <span className="text-green-400">Signature: </span>
                    {success.signature}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSuccess(null);
                    setFormData({
                      collectionAddress: formData.collectionAddress,
                      name: '',
                      uri: '',
                      sellerFeeBasisPoints: 500,
                      creators: [],
                      recipient: ''
                    });
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  Mint Another NFT
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20" />
        <div className="absolute inset-0">
          <div className="grid-animation opacity-10" />
        </div>
      </div>
    </div>
  );
};

export default MintNFT;