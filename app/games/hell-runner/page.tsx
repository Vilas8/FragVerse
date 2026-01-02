'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

// Dynamically import the game component (client-side only)
const HellRunnerGame = dynamic(
  () => import('@/components/games/HellRunnerGame'),
  { ssr: false }
);

export default function HellRunnerPage() {
  const { user } = useAuth();
  const [gameStarted, setGameStarted] = useState(false);

  if (!user && !gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-950 via-black to-orange-950 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md bg-black/80 border-red-500">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-500 mb-4 pixel-font">
              🔥 HELL RUNNER
            </h1>
            <p className="text-gray-300 mb-6">
              A devilishly difficult platformer where every level tries to kill you.
              Sign in to save your progress and compete on leaderboards!
            </p>
            <div className="space-y-3">
              <Link href="/sign-in">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Sign In to Play
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-500/10"
                onClick={() => setGameStarted(true)}
              >
                Play as Guest
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HellRunnerGame userId={user?.id} />
    </div>
  );
}
