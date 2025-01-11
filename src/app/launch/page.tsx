// app/launch/page.tsx
"use client";

// app/launch/page.tsx
"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LaunchHub from '@/components/launch/LaunchHub';
import DeployToken from '@/components/launch/DeployToken';

function LaunchContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature');

  switch (feature) {
    case 'deploytoken':
      return <DeployToken />;
    // Add other feature cases here as we implement them
    // case 'deploycollection':
    //   return <DeployCollection />;
    // case 'launchpumptoken':
    //   return <LaunchPumpToken />;
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