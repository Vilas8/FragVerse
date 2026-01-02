'use client';

import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from '@/lib/games/hell-runner/scenes/MainScene';
import { PreloadScene } from '@/lib/games/hell-runner/scenes/PreloadScene';
import { MenuScene } from '@/lib/games/hell-runner/scenes/MenuScene';
import { GameOverScene } from '@/lib/games/hell-runner/scenes/GameOverScene';

interface Props {
  userId?: string;
}

export default function HellRunnerGame({ userId }: Props) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: 800,
      height: 600,
      backgroundColor: '#000000',
      pixelArt: true,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 1000, x: 0 },
          debug: false,
        },
      },
      scene: [PreloadScene, MenuScene, MainScene, GameOverScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    gameRef.current = new Phaser.Game(config);

    // Store userId in game registry for access in scenes
    if (gameRef.current && userId) {
      gameRef.current.registry.set('userId', userId);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [userId]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-red-950 via-black to-orange-950">
      <div
        ref={containerRef}
        className="border-4 border-red-500 rounded-lg shadow-2xl shadow-red-500/50"
        style={{ maxWidth: '800px', maxHeight: '600px' }}
      />
    </div>
  );
}
