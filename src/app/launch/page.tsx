// app/launch/page.tsx
"use client";

// app/launch/page.tsx
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LaunchHub from '@/components/launch/LaunchHub';
import DeployToken from '@/components/launch/DeployToken';
import DeployCollection from '@/components/launch/DeployCollection';
import LaunchPumpToken from '@/components/launch/LaunchPumpToken';
import MintNFT from '@/components/launch/Mint';
import Trade from '@/components/launch/Trade';
import TensorTrade from '@/components/launch/TensorTrade';



function LaunchContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature');

  switch (feature) {
    case 'deploytoken':
      return <DeployToken />;
    // Add other feature cases here as we implement them
    case 'deploycollection':
      return <DeployCollection />;
    case 'launchpumptoken':
      return <LaunchPumpToken />;
    case 'mint':
      return <MintNFT />;
    case 'trade':
      return <Trade />;
    case 'tensortrade':
      return <TensorTrade />;
    default:
      return <LaunchHub />;
  }
}

export default function LaunchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400"></div>
      </div>
    }>
      <LaunchContent />
    </Suspense>
  );
}    