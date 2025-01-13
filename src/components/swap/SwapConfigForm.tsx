"use client"
import React, { useState } from 'react';
import { useSwapConfig } from '../../contexts/swapConfigContext';
import { ArrowLeft, Info } from 'lucide-react';
import { SwapConfig } from '@/types/swapConfig';
import { useRouter } from 'next/navigation';

const tooltips: Record<keyof SwapConfig, string> = {
  collection: "The public key of the NFT collection that will be used for swapping",
  tokenMint: "The token mint address that users will receive when swapping their NFTs",
  authority: "The authority address that controls the escrow and receives fees",
  escrowName: "A name for your escrow account for easy identification",
  tokenPerNft: "The amount of tokens users will receive for each NFT they swap",
  tokenFee: "The fee amount in tokens charged for each swap",
  baseUri: "The base URI for NFT metadata",
  minIndex: "The minimum index for NFT minting",
  maxIndex: "The maximum index for NFT minting",
  solFee: "The fee amount in SOL charged for each swap",
  initialFundingAmount: "Initial amount of tokens to fund the escrow with"
};

interface FormFieldProps {
  name: keyof SwapConfig;
  label: string;
  type?: string;
  placeholder?: string;
}

const SwapConfigForm = ({ isModifying = false }: { isModifying?: boolean }) => {
  const router = useRouter();
  const { setConfig } = useSwapConfig();
  const [activeTooltip, setActiveTooltip] = useState<keyof SwapConfig | null>(null);
  const [formData, setFormData] = useState<SwapConfig>({
    collection: '',
    tokenMint: '',
    authority: '',
    baseUri: '',
    minIndex: 0,
    maxIndex: 9999,
    tokenPerNft: 100000,
    tokenFee: 1000,
    solFee: 0.1,
    escrowName: '',
    initialFundingAmount: 1000000
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfig(formData);
  };

  const handleBack = () => {
    if (isModifying) {
      // Go back to swap interface
      window.history.back();
    } else {
      // Go back to home page
      router.push('/');
    }
  };

  const FormField: React.FC<FormFieldProps> = ({ 
    name, 
    label, 
    type = "text", 
    placeholder 
  }) => (
    <div className="space-y-2 relative">
      <div className="flex items-center gap-2">
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-200"
        >
          {label}
        </label>
        <button
          type="button"
          onMouseEnter={() => setActiveTooltip(name)}
          onMouseLeave={() => setActiveTooltip(null)}
          className="p-1 hover:bg-cyan-500/20 rounded-full transition-colors"
        >
          <Info className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
      {activeTooltip === name && (
        <div className="absolute z-10 top-8 left-0 w-64 p-2 bg-gray-900 rounded-md shadow-lg border border-cyan-500/20">
          <p className="text-sm text-gray-300">{tooltips[name]}</p>
        </div>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleInputChange}
        className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                 placeholder-gray-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400">
              {isModifying ? 'Back to Swap' : 'Back to Home'}
            </span>
          </button>
          <h2 className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 font-bold">
            Configure Swap
          </h2>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField 
                name="collection" 
                label="Collection Address"
                placeholder="Collection public key"
              />
              <FormField 
                name="tokenMint" 
                label="Token Mint"
                placeholder="Token mint address"
              />
              <FormField 
                name="authority" 
                label="Authority"
                placeholder="Authority address"
              />
              <FormField 
                name="escrowName" 
                label="Escrow Name"
                placeholder="Name for the escrow"
              />
              <FormField 
                name="tokenPerNft" 
                label="Tokens per NFT"
                type="number"
              />
              <FormField 
                name="tokenFee" 
                label="Token Fee"
                type="number"
              />
              <FormField 
                name="solFee" 
                label="SOL Fee"
                type="number"
              />
              <FormField 
                name="initialFundingAmount" 
                label="Initial Funding"
                type="number"
              />
            </div>

            <button
              type="submit"
              className="w-full p-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium 
                      hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            >
              Save Configuration
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SwapConfigForm;