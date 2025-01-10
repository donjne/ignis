"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  Image as ImageIcon, 
  ChevronRight, 
  Upload, 
  Check, 
  RefreshCw,
  Rocket,
  ArrowLeft
} from 'lucide-react';

interface FormData {
  type: string;
  name: string;
  symbol: string;
  uri: string;
  collectionName?: string;
  collectionSymbol?: string;
  royalties?: number;
  numberOfNfts?: number;
}

const LaunchPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [assetType, setAssetType] = useState<'token' | 'nft' | 'collection' | ''>('');
  const [formData, setFormData] = useState<FormData>({
    type: '',
    name: '',
    symbol: '',
    uri: '',
    royalties: 5,
    numberOfNfts: 1
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Here we'll integrate with the blockchain
      // This is where your provided scripts will be integrated
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      console.log('Form submitted:', formData);
      setStep(3);
    } catch (err) {
      setError('An error occurred during creation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const AssetTypeSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setAssetType('token');
          setStep(2);
          setFormData({ ...formData, type: 'token' });
        }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
      >
        <Coins className="w-12 h-12 mb-4 text-cyan-400" />
        <h3 className="text-xl font-bold mb-2">Create Token</h3>
        <p className="text-gray-400 text-sm">Launch your own token with custom parameters</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setAssetType('collection');
          setStep(2);
          setFormData({ ...formData, type: 'collection' });
        }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
      >
        <ImageIcon className="w-12 h-12 mb-4 text-cyan-400" />
        <h3 className="text-xl font-bold mb-2">Create Collection</h3>
        <p className="text-gray-400 text-sm">Create an NFT collection to mint multiple NFTs</p>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setAssetType('nft');
          setStep(2);
          setFormData({ ...formData, type: 'nft' });
        }}
        className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
      >
        <ImageIcon className="w-12 h-12 mb-4 text-cyan-400" />
        <h3 className="text-xl font-bold mb-2">Create NFTs</h3>
        <p className="text-gray-400 text-sm">Mint NFTs to an existing collection</p>
      </motion.button>
    </div>
  );

  const CreationForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <button 
        onClick={() => setStep(1)}
        className="flex items-center text-cyan-400 mb-6 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Selection
      </button>

      <div className="space-y-6">
        {assetType === 'token' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Create Token</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Token Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., My Token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Token Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., MTK"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., https://..."
                />
              </div>
            </div>
          </>
        )}

        {assetType === 'collection' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Create NFT Collection</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collection Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., My Collection"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collection Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., MYCOL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Royalties (%)</label>
                <input
                  type="number"
                  value={formData.royalties}
                  onChange={(e) => setFormData({ ...formData, royalties: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </>
        )}

        {assetType === 'nft' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Create NFTs</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Collection Address</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="Collection Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of NFTs</label>
                <input
                  type="number"
                  value={formData.numberOfNfts}
                  onChange={(e) => setFormData({ ...formData, numberOfNfts: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
                  placeholder="e.g., https://..."
                />
              </div>
            </div>
          </>
        )}

        {error && (
          <div className="text-red-400 text-sm mt-4">
            {error}
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full p-4 mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              Launch {assetType === 'token' ? 'Token' : assetType === 'collection' ? 'Collection' : 'NFTs'}
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  const SuccessScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
        <Check className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Creation Successful!</h2>
      <p className="text-gray-400 mb-8">
        Your {assetType === 'token' ? 'token' : assetType === 'collection' ? 'collection' : 'NFTs'} have been created successfully.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setStep(1);
          setAssetType('');
          setFormData({
            type: '',
            name: '',
            symbol: '',
            uri: '',
            royalties: 5,
            numberOfNfts: 1
          });
        }}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
      >
        Create Another
      </motion.button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Launch Your Digital Assets
          </h1>
          <p className="text-gray-400 text-lg">
            Create tokens and NFTs with just a few clicks
          </p>
        </motion.div>

        <div className="flex justify-center items-center">
          <AnimatePresence mode="wait">
            {step === 1 && <AssetTypeSelector />}
            {step === 2 && <CreationForm />}
            {step === 3 && <SuccessScreen />}
          </AnimatePresence>
        </div>
      </div>
    </div>
    );
};