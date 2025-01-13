"use client"
import React, { useState } from 'react';
import { useSwapConfig } from '../../contexts/swapConfigContext';

const SwapConfigForm = () => {
  const { setConfig } = useSwapConfig();
  const [formData, setFormData] = useState({
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
    // const requiredFields = ['collection', 'tokenMint', 'authority', 'escrowName'];
    // const missingFields = requiredFields.filter(field => !formData[field]);
    
    // if (missingFields.length > 0) {
    //     alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
    //     return;
    // }
    setConfig(formData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400 font-bold mb-6">
          Configure Swap
        </h2>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor="collection" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Collection Address
                </label>
                <input
                  id="collection"
                  name="collection"
                  value={formData.collection}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                           placeholder-gray-500"
                  placeholder="Collection public key"
                />
              </div>
              
              <div className="space-y-2">
                <label 
                  htmlFor="tokenMint" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Token Mint
                </label>
                <input
                  id="tokenMint"
                  name="tokenMint"
                  value={formData.tokenMint}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                           placeholder-gray-500"
                  placeholder="Token mint address"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="authority" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Authority
                </label>
                <input
                  id="authority"
                  name="authority"
                  value={formData.authority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                           placeholder-gray-500"
                  placeholder="Authority address"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="escrowName" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Escrow Name
                </label>
                <input
                  id="escrowName"
                  name="escrowName"
                  value={formData.escrowName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent
                           placeholder-gray-500"
                  placeholder="Name for the escrow"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="tokenPerNft" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Tokens per NFT
                </label>
                <input
                  type="number"
                  id="tokenPerNft"
                  name="tokenPerNft"
                  value={formData.tokenPerNft}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="tokenFee" 
                  className="block text-sm font-medium text-gray-200"
                >
                  Token Fee
                </label>
                <input
                  type="number"
                  id="tokenFee"
                  name="tokenFee"
                  value={formData.tokenFee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-black/50 border border-cyan-500/20 rounded-md text-white 
                           focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent"
                />
              </div>
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