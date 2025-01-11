'use client'

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins,
  History,
  Globe,
  Search,
  ArrowLeft,
  ChevronRight,
  Send,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Copy
} from 'lucide-react';
import WalletButton from '@/components/landing/WalletButton';
import TransferModal from './TransferModal';
import { Connection, PublicKey } from '@solana/web3.js';
import { useRouter } from 'next/navigation';

type Tab = 'assets' | 'transactions' | 'domains';

interface Asset {
  mint?: string;
  symbol: string;
  name: string;
  balance: number;
  imageUrl?: string;
}

interface Transaction {
  signature: string;
  timestamp: number;
  type: string;
  amount?: number;
  token?: string;
  status: 'success' | 'error';
}

const Portfolio = () => {
  const { publicKey, connected } = useWallet();
  const [activeTab, setActiveTab] = React.useState<Tab>('assets');
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [domains, setDomains] = React.useState<string[]>([]);
  const [balance, setBalance] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [isTransferModalOpen, setIsTransferModalOpen] = React.useState(false);
  const [selectedAsset, setSelectedAsset] = React.useState<Asset | null>(null);
  const router = useRouter();

  const isAsset = (item: any): item is Asset => 'symbol' in item;
  const isTransaction = (item: any): item is Transaction => 'signature' in item;
  const isString = (item: any): item is string => typeof item === 'string';

  // Pagination
  const loadMore = async () => {
    if (!connected || !publicKey || isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      switch (activeTab) {
        case 'assets':
          const assetsResponse = await fetch(
            `/api/portfolio/assets?account=${publicKey.toBase58()}&cursor=${currentPage + 1}`
          );
          const newAssets = await assetsResponse.json();
          if (newAssets.length === 0) {
            setHasMore(false);
          } else {
            setAssets(prev => [...prev, ...newAssets]);
            setCurrentPage(prev => prev + 1);
          }
          break;

        case 'transactions':
          const lastTx = transactions[transactions.length - 1]?.signature;
          const txResponse = await fetch(
            `/api/portfolio/transactions?account=${publicKey.toBase58()}&cursor=${lastTx}`
          );
          const { transactions: newTxs, oldest } = await txResponse.json();
          if (!oldest) {
            setHasMore(false);
          }
          setTransactions(prev => [...prev, ...newTxs]);
          break;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data loading
  const loadData = async () => {
    if (!connected || !publicKey) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Load balance
      const balanceResponse = await fetch(
        `/api/portfolio/balance?account=${publicKey.toBase58()}`
      );
      const { balance } = await balanceResponse.json();
      setBalance(balance);

      // Load initial assets
      const assetsResponse = await fetch(
        `/api/portfolio/assets?account=${publicKey.toBase58()}&cursor=1`
      );
      const initialAssets = await assetsResponse.json();
      setAssets(initialAssets);

      // Load initial transactions
      const txResponse = await fetch(
        `/api/portfolio/transactions?account=${publicKey.toBase58()}`
      );
      const { transactions: initialTxs } = await txResponse.json();
      setTransactions(initialTxs);

      // Load domains
      const domainsResponse = await fetch(
        `/api/portfolio/domains?account=${publicKey.toBase58()}`
      );
      const { domains: initialDomains } = await domainsResponse.json();
      setDomains(initialDomains);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect for initial load
  React.useEffect(() => {
    if (connected && publicKey) {
      loadData();
    }
  }, [connected, publicKey]);

  // Handle transfer
  const handleTransfer = async (to: string, amount: number, mint?: string) => {
    if (!connected || !publicKey) return;

    try {
      const response = await fetch('/api/portfolio/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: publicKey.toBase58(),
          to,
          amount,
          mint
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Reload data after transfer
      await loadData();
      
    } catch (err: any) {
      throw new Error(err.message || 'Transfer failed');
    }
  };

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'assets':
        return assets.filter(asset => 
          asset.name.toLowerCase().includes(query) ||
          asset.symbol.toLowerCase().includes(query)
        );
      case 'transactions':
        return transactions.filter(tx =>
          tx.signature.toLowerCase().includes(query) ||
          tx.type.toLowerCase().includes(query)
        );
      case 'domains':
        return domains.filter(domain =>
          domain.toLowerCase().includes(query)
        );
      default:
        return [];
    }
  }, [activeTab, assets, transactions, domains, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white font-['Orbitron']">
      <div className="container mx-auto px-4 py-16">
      {/* Header with Balance, Wallet, and Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex flex-col items-center gap-4 w-full md:w-auto">
          <motion.button
            onClick={() => router.push('/')}
            className="flex items-center px-4 py-2 rounded-lg bg-black/50 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5 mr-2 text-cyan-400" />
            <span className="font-['Orbitron'] text-gray-300">Go Back</span>
          </motion.button>
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">Portfolio</h1>
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              {balance.toFixed(4)} SOL
            </div>
          </div>
        </div>
        
        <WalletButton />
      </div>

        {/* Search and Tabs */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-black/50 border border-gray-800 focus:border-blue-500 outline-none"
                placeholder={`Search ${activeTab}...`}
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('assets')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'assets'
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                <Coins className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'transactions'
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('domains')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'domains'
                    ? 'bg-blue-500 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-black/20 border border-gray-800 rounded-xl p-6">
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {!connected ? (
            <div className="text-center py-12 text-gray-400">
              Please connect your wallet to view your portfolio
            </div>
          ) : isLoading && (activeTab === 'assets' ? assets.length === 0 : activeTab === 'transactions' ? transactions.length === 0 : domains.length === 0) ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {activeTab === 'assets' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(filteredData as Asset[]).map((asset, index) => (
                    <motion.div
                      key={asset.mint || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-black/30 border border-gray-800 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {asset.imageUrl ? (
                            <img 
                              src={asset.imageUrl} 
                              alt={asset.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                              <Coins className="w-5 h-5 text-blue-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{asset.name}</h3>
                            <p className="text-sm text-gray-400">{asset.symbol}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setIsTransferModalOpen(true);
                          }}
                          className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                        >
                          <Send className="w-4 h-4 text-blue-400" />
                        </button>
                      </div>
                      <div className="text-xl font-bold">
                        {asset.balance.toFixed(4)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  {(filteredData as Transaction[]).map((tx, index) => (
                    <motion.div
                      key={tx.signature}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-black/30 border border-gray-800 hover:border-blue-500/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-400">
                            {new Date(tx.timestamp * 1000).toLocaleDateString()}
                          </p>
                          <p className="font-medium">{tx.type}</p>
                          {tx.amount && (
                            <p className="text-sm">
                              {tx.amount.toFixed(4)} {tx.token || 'SOL'}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tx.status === 'success' 
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {tx.status}
                          </span>
                          <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 text-blue-400" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'domains' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(filteredData as string[]).map((domain, index) => (
                    <motion.div
                      key={domain}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-black/30 border border-gray-800 hover:border-blue-500/50 transition-colors"
                    >
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                           <Globe className="w-5 h-5 text-blue-400" />
                         </div>
                         <span className="font-medium">{domain}</span>
                       </div>
                       <button
                         onClick={() => {
                           navigator.clipboard.writeText(domain);
                           // Could add a toast notification here
                         }}
                         className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                       >
                         <Copy className="w-4 h-4 text-blue-400" />
                       </button>
                     </div>
                   </motion.div>
                 ))}
               </div>
             )}

             {/* Load More Button */}
             {hasMore && activeTab !== 'domains' && (
               <div className="flex justify-center mt-8">
                 <button
                   onClick={loadMore}
                   disabled={isLoading}
                   className="px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                 >
                   {isLoading ? (
                     <RefreshCw className="w-5 h-5 animate-spin" />
                   ) : (
                     'Load More'
                   )}
                 </button>
               </div>
             )}
           </div>
         )}
       </div>
     </div>

     {/* Transfer Modal */}
     <TransferModal
       isOpen={isTransferModalOpen}
       onClose={() => {
         setIsTransferModalOpen(false);
         setSelectedAsset(null);
       }}
       onTransfer={handleTransfer}
       selectedAsset={selectedAsset || undefined}
     />
   </div>
 );
};

export default Portfolio;