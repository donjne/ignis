import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const WalletButton = () => {
  const { connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (connected) {
      disconnect();
    } else {
      setVisible(true);
    }
  };

  return (
    <motion.button
      className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <Wallet className="inline-block mr-2 h-4 w-4" />
      {connected ? 'DISCONNECT' : 'CONNECT WALLET'}
    </motion.button>
  );
};

export default WalletButton;