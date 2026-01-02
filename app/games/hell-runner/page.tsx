'use client';

import dynamic from 'next/dynamic';

// Dynamically import the game component (client-side only)
const HellRunnerGame = dynamic(
  () => import('@/components/games/HellRunnerGame'),
  { ssr: false }
);

export default function HellRunnerPage() {
  return (
    <div className="min-h-screen bg-black">
      <HellRunnerGame userId={undefined} />
    </div>
  );
}
