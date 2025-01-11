// components/launch/LaunchHub.tsx
'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Coins, 
  Image as ImageIcon,
  Rocket,
  ArrowLeft,
  Wallet,
  BarChart3,
  PiggyBank,
  Share2,
  Handshake,
  Layers
} from 'lucide-react';
import WalletButton from '@/components/landing/WalletButton';

const LaunchHub = () => {
  const router = useRouter();

  const features = [
    {
      title: "Deploy Token",
      description: "Create and deploy your own token using Token Metadata",
      icon: Coins,
      route: "/launch?feature=deploytoken",  // Updated route
      gradient: "from-blue-500/10 to-indigo-500/10",
      border: "border-blue-500/20 hover:border-blue-500/40"
    },
    {
      title: "Deploy Collection",
      description: "Create an NFT collection using Core",
      icon: Layers,
      route: "/launch?feature=deploycollection",  // Updated route
      gradient: "from-purple-500/10 to-pink-500/10",
      border: "border-purple-500/20 hover:border-purple-500/40"
    },
    {
      title: "Launch Pump Token",
      description: "Launch your token on Pump.fun",
      icon: Rocket,
      route: "/launch?feature=launchpumptoken",  // Updated route
      gradient: "from-red-500/10 to-orange-500/10",
      border: "border-red-500/20 hover:border-red-500/40"
    },
    {
      title: "Mint NFTs",
      description: "Mint NFTs to your existing collection",
      icon: ImageIcon,
      route: "/launch?feature=mint",  // Updated route
      gradient: "from-green-500/10 to-emerald-500/10",
      border: "border-green-500/20 hover:border-green-500/40"
    },
    {
      title: "Trade Tokens",
      description: "Trade tokens on decentralized exchanges",
      icon: Share2,
      route: "/launch?feature=trade",  // Updated route
      gradient: "from-yellow-500/10 to-amber-500/10",
      border: "border-yellow-500/20 hover:border-yellow-500/40"
    },
    {
      title: "Trade on Tensor",
      description: "Trade NFTs on Tensor marketplace",
      icon: Handshake,
      route: "/launch?feature=tensortrade",  // Updated route
      gradient: "from-cyan-500/10 to-teal-500/10",
      border: "border-cyan-500/20 hover:border-cyan-500/40"
    },
    {
      title: "Lend Tokens",
      description: "Lend tokens for yield using Lulo",
      icon: PiggyBank,
      route: "/launch?feature=lend",  // Updated route
      gradient: "from-violet-500/10 to-purple-500/10",
      border: "border-violet-500/20 hover:border-violet-500/40"
    },
    {
      title: "Stake",
      description: "Stake with Jupiter or Solayer",
      icon: BarChart3,
      route: "/launch?feature=stake",  // Updated route
      gradient: "from-pink-500/10 to-rose-500/10",
      border: "border-pink-500/20 hover:border-pink-500/40"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => router.push('/')}  // Updated to go to home
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <WalletButton />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
            Digital Assets Hub
          </h1>
          <p className="text-gray-400 text-lg">
            Create, trade, and manage your digital assets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(feature.route)}
                className={`p-6 rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.border} transition-all text-left`}
              >
                <Icon className="w-12 h-12 mb-4 text-cyan-400" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </motion.button>
            )}
          )}
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

export default LaunchHub;