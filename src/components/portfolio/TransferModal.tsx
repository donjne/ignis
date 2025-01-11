'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X,
  Send,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (to: string, amount: number, mint?: string) => Promise<void>;
  selectedAsset?: {
    mint?: string;
    symbol: string;
    balance: number;
  };
}

const TransferModal = ({ 
  isOpen, 
  onClose, 
  onTransfer,
  selectedAsset 
}: TransferModalProps) => {
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const validateInput = () => {
    try {
      if (!recipient || !amount) {
        setError('Please fill in all fields');
        return false;
      }

      new PublicKey(recipient);

      const numAmount = Number(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return false;
      }

      if (selectedAsset && numAmount > selectedAsset.balance) {
        setError('Insufficient balance');
        return false;
      }

      return true;
    } catch {
      setError('Invalid recipient address');
      return false;
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateInput()) return;

    setIsLoading(true);
    try {
      await onTransfer(recipient, Number(amount), selectedAsset?.mint);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md bg-black border border-gray-800 rounded-xl p-6"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-6">
              Transfer {selectedAsset?.symbol || 'SOL'}
            </h2>

            <form onSubmit={handleTransfer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-3 rounded-lg bg-black/50 border border-gray-800 focus:border-blue-500 outline-none"
                  placeholder="Enter recipient's address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 rounded-lg bg-black/50 border border-gray-800 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                    step="any"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {selectedAsset?.symbol || 'SOL'}
                  </span>
                </div>
                {selectedAsset && (
                  <p className="text-xs text-gray-400 mt-1">
                    Balance: {selectedAsset.balance} {selectedAsset.symbol}
                  </p>
                )}
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
                disabled={isLoading}
                className="w-full p-4 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                   Send {selectedAsset?.symbol || 'SOL'}
                 </>
               )}
             </motion.button>
           </form>
         </motion.div>
       </div>
     )}
   </AnimatePresence>
 );
};

export default TransferModal;