"use client"
import React, { useState, useEffect } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';
import { useSwapConfig } from '@/contexts/swapConfigContext';
import { SwapService } from '@/lib/SwapService';

interface AddressEntry {
  label: string;
  address: string;
}

const SwapAddresses = ({ escrowAddress }: { escrowAddress: string }) => {
  const { config } = useSwapConfig();
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  
  useEffect(() => {
    if (!config || !escrowAddress) return;

    const swapService = new SwapService(config);
    const escrowTokenAccount = findAssociatedTokenPda(swapService.umi, {
      mint: publicKey(config.tokenMint),
      owner: publicKey(escrowAddress)
    }).toString();

    const feeTokenAccount = findAssociatedTokenPda(swapService.umi, {
      mint: publicKey(config.tokenMint),
      owner: publicKey(config.authority)
    }).toString();

    setAddresses([
      { label: 'Collection', address: config.collection },
      { label: 'Token Mint', address: config.tokenMint },
      { label: 'Authority', address: config.authority },
      { label: 'Escrow Account', address: escrowAddress },
      { label: 'Escrow Token Account', address: escrowTokenAccount },
      { label: 'Fee Token Account', address: feeTokenAccount },
    ]);
  }, [config, escrowAddress]);

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard!');
  };

  const formatAddress = (address: string) => 
    `${address.slice(0, 8)}...${address.slice(-8)}`;

  return (
    <div className="mt-8 p-4 bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-500/20">
      <h3 className="text-lg font-medium text-gray-300 mb-4">Swap Addresses</h3>
      
      <div className="space-y-2">
        {addresses.map(({ label, address }) => (
          <div 
            key={label} 
            className="flex items-center justify-between p-2 rounded bg-black/30 hover:bg-black/40 transition-colors"
          >
            <div>
              <span className="text-sm text-gray-400">{label}</span>
              <p className="text-white font-mono">{formatAddress(address)}</p>
            </div>
            <button
              onClick={() => copyToClipboard(address)}
              className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>You can use these addresses to interact with the swap from your wallet app.</p>
        <p>Click the copy icon to copy the full address.</p>
      </div>
    </div>
  );
};

export default SwapAddresses;