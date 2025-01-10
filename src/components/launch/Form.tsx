// "use client";

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Coins, 
//   Image as ImageIcon, 
//   ChevronRight, 
//   Upload, 
//   Check, 
//   RefreshCw,
//   Rocket,
//   ArrowLeft
// } from 'lucide-react';

// interface FormData {
//   type: string;
//   name: string;
//   symbol: string;
//   uri: string;
//   collectionName?: string;
//   collectionSymbol?: string;
//   royalties?: number;
//   numberOfNfts?: number;
// }

// const LaunchPage: React.FC = () => {
//   const [step, setStep] = useState<number>(1);
//   const [assetType, setAssetType] = useState<'token' | 'nft' | 'collection' | ''>('');
//   const [formData, setFormData] = useState<FormData>({
//     type: '',
//     name: '',
//     symbol: '',
//     uri: '',
//     royalties: 5,
//     numberOfNfts: 1
//   });
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');

//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       // Here we'll integrate with the blockchain
//       // This is where your provided scripts will be integrated
//       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
//       console.log('Form submitted:', formData);
//       setStep(3);
//     } catch (err) {
//       setError('An error occurred during creation. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const AssetTypeSelector = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => {
//           setAssetType('token');
//           setStep(2);
//           setFormData({ ...formData, type: 'token' });
//         }}
//         className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
//       >
//         <Coins className="w-12 h-12 mb-4 text-cyan-400" />
//         <h3 className="text-xl font-bold mb-2">Create Token</h3>
//         <p className="text-gray-400 text-sm">Launch your own token with custom parameters</p>
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => {
//           setAssetType('collection');
//           setStep(2);
//           setFormData({ ...formData, type: 'collection' });
//         }}
//         className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
//       >
//         <ImageIcon className="w-12 h-12 mb-4 text-cyan-400" />
//         <h3 className="text-xl font-bold mb-2">Create Collection</h3>
//         <p className="text-gray-400 text-sm">Create an NFT collection to mint multiple NFTs</p>
//       </motion.button>

//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => {
//           setAssetType('nft');
//           setStep(2);
//           setFormData({ ...formData, type: 'nft' });
//         }}
//         className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
//       >
//         <ImageIcon className="w-12 h-12 mb-4 text-cyan-400" />
//         <h3 className="text-xl font-bold mb-2">Create NFTs</h3>
//         <p className="text-gray-400 text-sm">Mint NFTs to an existing collection</p>
//       </motion.button>
//     </div>
//   );

//   const CreationForm = () => (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="w-full max-w-2xl"
//     >
//       <button 
//         onClick={() => setStep(1)}
//         className="flex items-center text-cyan-400 mb-6 hover:text-cyan-300 transition-colors"
//       >
//         <ArrowLeft className="w-4 h-4 mr-2" />
//         Back to Selection
//       </button>

//       <div className="space-y-6">
//         {assetType === 'token' && (
//           <>
//             <h2 className="text-2xl font-bold mb-6">Create Token</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Token Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., My Token"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Token Symbol</label>
//                 <input
//                   type="text"
//                   value={formData.symbol}
//                   onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., MTK"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Metadata URI</label>
//                 <input
//                   type="text"
//                   value={formData.uri}
//                   onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., https://..."
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {assetType === 'collection' && (
//           <>
//             <h2 className="text-2xl font-bold mb-6">Create NFT Collection</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Collection Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., My Collection"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Collection Symbol</label>
//                 <input
//                   type="text"
//                   value={formData.symbol}
//                   onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., MYCOL"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Metadata URI</label>
//                 <input
//                   type="text"
//                   value={formData.uri}
//                   onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., https://..."
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Royalties (%)</label>
//                 <input
//                   type="number"
//                   value={formData.royalties}
//                   onChange={(e) => setFormData({ ...formData, royalties: Number(e.target.value) })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   min="0"
//                   max="100"
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {assetType === 'nft' && (
//           <>
//             <h2 className="text-2xl font-bold mb-6">Create NFTs</h2>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Collection Address</label>
//                 <input
//                   type="text"
//                   value={formData.uri}
//                   onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="Collection Address"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Number of NFTs</label>
//                 <input
//                   type="number"
//                   value={formData.numberOfNfts}
//                   onChange={(e) => setFormData({ ...formData, numberOfNfts: Number(e.target.value) })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   min="1"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-2">Metadata URI</label>
//                 <input
//                   type="text"
//                   value={formData.uri}
//                   onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
//                   className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none"
//                   placeholder="e.g., https://..."
//                 />
//               </div>
//             </div>
//           </>
//         )}

//         {error && (
//           <div className="text-red-400 text-sm mt-4">
//             {error}
//           </div>
//         )}

//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleSubmit}
//           disabled={isLoading}
//           className="w-full p-4 mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
//         >
//           {isLoading ? (
//             <RefreshCw className="w-5 h-5 animate-spin" />
//           ) : (
//             <>
//               <Rocket className="w-5 h-5 mr-2" />
//               Launch {assetType === 'token' ? 'Token' : assetType === 'collection' ? 'Collection' : 'NFTs'}
//             </>
//           )}
//         </motion.button>
//       </div>
//     </motion.div>
//   );

//   const SuccessScreen = () => (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       className="text-center"
//     >
//       <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
//         <Check className="w-8 h-8 text-white" />
//       </div>
//       <h2 className="text-2xl font-bold mb-4">Creation Successful!</h2>
//       <p className="text-gray-400 mb-8">
//         Your {assetType === 'token' ? 'token' : assetType === 'collection' ? 'collection' : 'NFTs'} have been created successfully.
//       </p>
//       <motion.button
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//         onClick={() => {
//           setStep(1);
//           setAssetType('');
//           setFormData({
//             type: '',
//             name: '',
//             symbol: '',
//             uri: '',
//             royalties: 5,
//             numberOfNfts: 1
//           });
//         }}
//         className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
//       >
//         Create Another
//       </motion.button>
//     </motion.div>
//   );

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="container mx-auto px-4 py-16">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-16"
//         >
//           <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-400">
//             Launch Your Digital Assets
//           </h1>
//           <p className="text-gray-400 text-lg">
//             Create tokens and NFTs with just a few clicks
//           </p>
//         </motion.div>

//         <div className="flex justify-center items-center">
//           <AnimatePresence mode="wait">
//             {step === 1 && <AssetTypeSelector />}
//             {step === 2 && <CreationForm />}
//             {step === 3 && <SuccessScreen />}
//           </AnimatePresence>
//         </div>
//       </div>
//     </div>
//     );
// };

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
  ArrowLeft,
  Wallet
} from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { createCollection, create, fetchCollection, mplCore } from '@metaplex-foundation/mpl-core';
import { createMetadataAccountV3, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { generateSigner, Signer, publicKey as toPublicKey, UmiPlugin, signerIdentity } from '@metaplex-foundation/umi';
import WalletButton from '@/components/landing/WalletButton';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { WalletContextState } from '@solana/wallet-adapter-react';

// Types
interface FormData {
  type: string;
  name: string;
  symbol: string;
  uri: string;
  collectionAddress?: string;
  royalties?: number;
  numberOfNfts?: number;
}

interface CreationResult {
  address?: string;
  signature?: string;
  assets?: Array<{ address: string; signature: string }>;
}

const LaunchPage: React.FC = () => {
  const { publicKey, connected, wallet } = useWallet() as WalletContextState;
  const { setVisible } = useWalletModal();
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
  const [creationResult, setCreationResult] = useState<CreationResult | null>(null);
  
  const initializeUmi = async (): Promise<any> => {
    try {
      const umi = createUmi('https://api.devnet.solana.com')
        .use(mplTokenMetadata())
        .use(mplCore());
  
      if (!publicKey || !wallet) {
        throw new Error('Wallet not connected');
      }
  
      // Create signer from wallet adapter
      const signer = createSignerFromWalletAdapter(wallet as unknown as WalletAdapter);
      
      // Use the signerIdentity plugin with the signer
      umi.use(signerIdentity(signer, true));
  
      return umi;
    } catch (error) {
      console.error('Error initializing Umi:', error);
      throw error;
    }
  };

  const createToken = async () => {
    const umi = await initializeUmi();
    const mint = generateSigner(umi);

    const tx = await createMetadataAccountV3(umi, {
      mint: mint.publicKey,
      mintAuthority: umi.identity,
      updateAuthority: toPublicKey(publicKey!.toBase58()),
      data: {
        name: formData.name,
        symbol: formData.symbol,
        uri: formData.uri,
        sellerFeeBasisPoints: 0,
        creators: null,
        collection: null,
        uses: null,
      },
      isMutable: true,
      collectionDetails: null,
    }).sendAndConfirm(umi);

    return {
      address: mint.publicKey.toString(),
      signature: tx.signature.toString()
    };
  };

  const createNftCollection = async () => {
    const umi = await initializeUmi();
    const collectionSigner = generateSigner(umi);

    const { signature } = await createCollection(umi, {
      collection: collectionSigner,
      name: formData.name,
      uri: formData.uri,
      plugins: [
        {
          type: 'Royalties',
          basisPoints: (formData.royalties || 0) * 100,
          creators: [
            {
              address: toPublicKey(publicKey!.toBase58()),
              percentage: 100,
            },
          ],
          ruleSet: { type: 'None' },
        }
      ],
    }).sendAndConfirm(umi);

    return {
      address: collectionSigner.publicKey.toString(),
      signature: signature.toString()
    };
  };

  const createNfts = async () => {
    const umi = await initializeUmi();
    if (!formData.collectionAddress) throw new Error('Collection address required');
    
    const collection = await fetchCollection(umi, toPublicKey(formData.collectionAddress));
    const assets = [];

    for (let i = 0; i < (formData.numberOfNfts || 1); i++) {
      const assetSigner = generateSigner(umi);

      const { signature } = await create(umi, {
        asset: assetSigner,
        name: `${formData.name} #${i + 1}`,
        uri: formData.uri,
        collection: collection,
        plugins: [
          {
            type: 'Royalties',
            basisPoints: (formData.royalties || 0) * 100,
            creators: [
              {
                address: toPublicKey(publicKey!.toBase58()),
                percentage: 100,
              },
            ],
            ruleSet: { type: 'None' },
          }
        ],
      }).sendAndConfirm(umi);

      assets.push({
        address: assetSigner.publicKey.toString(),
        signature: signature.toString()
      });
    }

    return { assets };
  };

  const handleSubmit = async () => {
    if (!connected) {
      setError('Please connect your wallet first');
      setVisible(true);
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    
    try {
      let result;

      switch (assetType) {
        case 'token':
          result = await createToken();
          break;
        case 'collection':
          result = await createNftCollection();
          break;
        case 'nft':
          result = await createNfts();
          break;
        default:
          throw new Error('Invalid asset type');
      }

      setCreationResult(result);
      setStep(3);
    } catch (err: any) {
      console.error('Creation error:', err);
      setError(err.message || 'An error occurred during creation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.symbol || !formData.uri) {
      setError('Please fill in all required fields');
      return false;
    }
    if (assetType === 'nft' && !formData.collectionAddress) {
      setError('Collection address is required');
      return false;
    }
    return true;
  };

  // UI Components
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
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., My Token"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Token Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., MTK"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
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
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., My Collection"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Collection Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., MYCOL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Royalties (%)</label>
                <input
                  type="number"
                  value={formData.royalties}
                  onChange={(e) => setFormData({ ...formData, royalties: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
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
                  value={formData.collectionAddress}
                  onChange={(e) => setFormData({ ...formData, collectionAddress: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="Enter collection address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Number of NFTs</label>
                <input
                  type="number"
                  value={formData.numberOfNfts}
                  onChange={(e) => setFormData({ ...formData, numberOfNfts: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">NFT Name Format</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., My NFT"
                />
                <p className="text-xs text-gray-400 mt-1">Will be appended with # for each NFT</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Symbol</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., NFT"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  value={formData.uri}
                  onChange={(e) => setFormData({ ...formData, uri: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  placeholder="e.g., https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Royalties (%)</label>
                <input
                  type="number"
                  value={formData.royalties}
                  onChange={(e) => setFormData({ ...formData, royalties: Number(e.target.value) })}
                  className="w-full p-3 rounded-lg bg-black/50 border border-cyan-500/20 focus:border-cyan-500/50 outline-none text-white"
                  min="0"
                  max="100"
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
          disabled={isLoading || !connected}
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
      
      {creationResult && (
        <div className="bg-black/30 rounded-lg p-6 mb-8 text-left">
          {creationResult.address && (
            <p className="text-sm text-gray-300 mb-2">
              <span className="text-cyan-400">Address: </span>
              {creationResult.address}
            </p>
          )}
          {creationResult.signature && (
            <p className="text-sm text-gray-300 mb-2">
              <span className="text-cyan-400">Signature: </span>
              {creationResult.signature}
            </p>
          )}
          {creationResult.assets && (
            <div className="mt-4">
              <p className="text-sm text-cyan-400 mb-2">Created NFTs:</p>
              {creationResult.assets.map((asset, index) => (
                <div key={index} className="mb-4 border-t border-cyan-500/20 pt-4">
                  <p className="text-sm text-white font-medium">NFT #{index + 1}</p>
                  <p className="text-xs text-gray-300 break-all">Address: {asset.address}</p>
                  <p className="text-xs text-gray-300 break-all">Signature: {asset.signature}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
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
          setCreationResult(null);
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
        <div className="flex justify-end mb-8">
          <WalletButton />
        </div>

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

export default LaunchPage;

// First Call of the Year - what to expect
// welcome everybody, give everyone a chance to speak
// Talk about the 30 days bootcamp and get progress feedback
// Dive into explaining our core focus this year.