// app/launch/page.tsx
"use client";

import { useSearchParams } from 'next/navigation';
import LaunchHub from '@/components/launch/LaunchHub';  // Renamed from Form
import DeployToken from '@/components/launch/DeployToken';

export default function LaunchPage() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature');

  // Render the appropriate component based on the feature parameter
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