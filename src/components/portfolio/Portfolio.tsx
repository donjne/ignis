"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet,
  Coins,
  Image as ImageIcon,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  fetchAssetsByOwner, 
  fetchAsset,
  mplCore 
} from '@metaplex-foundation/mpl-core';
import { 
  PublicKey,
  Connection, 
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import WalletButton from '@/components/landing/WalletButton';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { signerIdentity } from '@metaplex-foundation/umi';

interface TokenMetadataResult {
    mint: string;
    metadata: {
      name: string;
      symbol: string;
      uri?: string;
      decimals: number;
    }
  }
  

interface BaseAssetData {
    name: string;
    image?: string;
    address: string;
    amount: number;
  }
  
  interface NftData extends BaseAssetData {
    collection?: string;
    collectionName?: string;
  }
  
  interface TokenData extends BaseAssetData {
    symbol: string;
    decimals?: number;
  }
const PortfolioPage: React.FC = () => {
  const { publicKey, connected, wallet } = useWallet() as WalletContextState;
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [nfts, setNfts] = useState<NftData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const initializeUmi = async () => {
    try {
      const umi = createUmi('https://api.devnet.solana.com')
        .use(mplCore());
  
      if (!publicKey || !wallet) {
        throw new Error('Wallet not connected');
      }
  
      const signer = createSignerFromWalletAdapter(wallet as unknown as WalletAdapter);
      umi.use(signerIdentity(signer, true));
  
      return umi;
    } catch (error) {
      console.error('Error initializing Umi:', error);
      throw error;
    }
  };

  const fetchTokenMetadata = async (mints: string[]) => {
    try {
      const response = await fetch('/api/tokens/metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mints }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token metadata');
      }

      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return [];
    }
  };

  const processTokens = async (accounts: Array<any>, metadataResults: TokenMetadataResult[]) => {
    const processedTokens = await Promise.all(
      accounts.map(async account => {
        const mint = account.account.data.parsed.info.mint;
        const metadata = metadataResults.find(m => m.mint === mint)?.metadata;
        const imageUri = metadata?.uri ? await fetchMetadataUri(metadata.uri) : undefined;
  
        return {
          name: metadata?.name || 'Unknown Token',
          symbol: metadata?.symbol || '???',
          amount: Number(account.account.data.parsed.info.tokenAmount.amount),
          decimals: metadata?.decimals || account.account.data.parsed.info.tokenAmount.decimals,
          address: mint,
          image: imageUri
        };
      })
    );
  
    return processedTokens;
  };

  const fetchAssets = async () => {
    if (!publicKey || !connected) return;

    setIsLoading(true);
    setError('');

    try {
      const connection = new Connection('https://api.devnet.solana.com');
      const umi = await initializeUmi();

      // Fetch SOL balance
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);

      // Fetch NFTs using mplCore - remove symbol from NFTs
      const nftAssets = await fetchAssetsByOwner(umi, publicKey.toString());
      const processedNfts = await Promise.all(
        nftAssets.map(async (asset) => {
          const fullAsset = await fetchAsset(umi, asset.publicKey);
          let collectionInfo;

          if (fullAsset.publicKey) {
            try {
              const collectionAsset = await fetchAsset(umi, fullAsset.publicKey);
              collectionInfo = {
                address: fullAsset.publicKey.toString(),
                name: collectionAsset.name
              };
            } catch (e) {
              console.error('Error fetching collection:', e);
            }
          }

          return {
            name: fullAsset.name,
            image: fullAsset.uri ? await fetchMetadataUri(fullAsset.uri) : undefined,
            amount: 1,
            address: asset.publicKey.toString(),
            collection: collectionInfo?.address,
            collectionName: collectionInfo?.name
          };
        })
      );

      // Process tokens - keep symbol for tokens
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
      });

      const filteredTokenAccounts = tokenAccounts.value
        .filter(account => Number(account.account.data.parsed.info.tokenAmount.amount) > 0);

      const tokenMints = filteredTokenAccounts.map(account => account.account.data.parsed.info.mint);
      const tokenMetadataResults = await fetchTokenMetadata(tokenMints);

      const processedTokens = await processTokens(filteredTokenAccounts, tokenMetadataResults);

      setNfts(processedNfts);
      setTokens(processedTokens);

    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMetadataUri = async (uri: string): Promise<string | undefined> => {
    try {
      const response = await fetch(uri);
      const data = await response.json();
      return data.image;
    } catch (e) {
      console.error('Error fetching metadata URI:', e);
      return undefined;
    }
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchAssets();
    }
  }, [connected, publicKey]);

  const AssetCard: React.FC<{ 
    asset: TokenData | NftData; 
    type: 'token' | 'nft' 
  }> = ({ asset, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold mb-1">{asset.name}</h3>
          {type === 'token' && (
            <>
              <p className="text-sm text-gray-400">{(asset as TokenData).symbol}</p>
              <p className="text-cyan-400 mt-2">Amount: {asset.amount.toLocaleString()}</p>
            </>
          )}
          {type === 'nft' && 'collectionName' in asset && asset.collectionName && (
            <p className="text-sm text-gray-400 mt-2">Collection: {asset.collectionName}</p>
          )}
        </div>
        {asset.image ? (
          <img 
            src={asset.image} 
            alt={asset.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
            {type === 'token' ? (
              <Coins className="w-8 h-8 text-cyan-400" />
            ) : (
              <ImageIcon className="w-8 h-8 text-cyan-400" />
            )}
          </div>
        )}
      </div>
      <a
        href={`https://explorer.solana.com/address/${asset.address}?cluster=devnet`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors mt-4 flex items-center"
      >
        View on Explorer
        <ExternalLink className="w-4 h-4 ml-1" />
      </a>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-end mb-8">
          <WalletButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Your Digital Portfolio
          </h1>
          <p className="text-gray-400 text-lg">
            View all your Solana assets in one place
          </p>
        </motion.div>

        {!connected ? (
          <div className="text-center text-gray-400">
            Please connect your wallet to view your portfolio
          </div>
        ) : (
          <div className="space-y-8">
            {/* SOL Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">SOL Balance</h2>
                  <p className="text-3xl text-cyan-400">{solBalance.toFixed(4)} SOL</p>
                </div>
                <Wallet className="w-12 h-12 text-cyan-400" />
              </div>
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-red-400 text-center py-4">
                {error}
              </div>
            )}

            {/* Tokens */}
            {tokens.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Tokens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tokens.map((token) => (
                    <AssetCard key={token.address} asset={token} type="token" />
                  ))}
                </div>
              </div>
            )}

            {/* NFTs */}
            {nfts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">NFTs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nfts.map((nft) => (
                    <AssetCard key={nft.address} asset={nft} type="nft" />
                  ))}
                </div>
              </div>
            )}

            {/* No Assets State */}
            {!isLoading && tokens.length === 0 && nfts.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                No assets found in your wallet
              </div>
            )}
          </div>
        )}
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

export default PortfolioPage;