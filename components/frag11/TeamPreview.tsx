'use client';

import { X, Star, Shield } from 'lucide-react';
import { IPLPlayer } from '@/types/frag11';
import { CyberBadge } from '@/components/ui/cyber-card';
import { cn } from '@/lib/utils';

interface TeamPreviewProps {
  players: IPLPlayer[];
  captainId: string | null;
  viceCaptainId: string | null;
  onRemovePlayer?: (player: IPLPlayer) => void;
}

export function TeamPreview({ players, captainId, viceCaptainId, onRemovePlayer }: TeamPreviewProps) {
  const groupedPlayers = {
    WK: players.filter(p => p.role === 'WK'),
    BAT: players.filter(p => p.role === 'BAT'),
    AR: players.filter(p => p.role === 'AR'),
    BOWL: players.filter(p => p.role === 'BOWL'),
  };

  const roleLabels = {
    WK: 'Wicket Keepers',
    BAT: 'Batters',
    AR: 'All-Rounders',
    BOWL: 'Bowlers',
  };

  const roleColors = {
    WK: 'cyan',
    BAT: 'purple',
    AR: 'pink',
    BOWL: 'green',
  } as const;

  const totalCredits = players.reduce((sum, p) => sum + p.credits, 0);

  if (players.length === 0) {
    return (
      <div className="text-center py-8 text-cyan-100/40">
        <p className="text-sm">No players selected yet</p>
        <p className="text-xs mt-1">Start building your team!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Credits Summary */}
      <div className="bg-slate-900/50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-cyan-100/60">Players Selected</span>
          <span className="font-bold text-cyan-100">{players.length}/11</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-cyan-100/60">Credits Used</span>
          <span className={cn(
            'font-bold',
            totalCredits > 100 ? 'text-red-400' : 'text-cyan-100'
          )}>
            {totalCredits.toFixed(1)}/100
          </span>
        </div>
      </div>

      {/* Players by Role */}
      <div className="space-y-3">
        {Object.entries(groupedPlayers).map(([role, rolePlayers]) => (
          rolePlayers.length > 0 && (
            <div key={role}>
              <div className="flex items-center gap-2 mb-2">
                <CyberBadge variant={roleColors[role as keyof typeof roleColors]} className="text-xs">
                  {role}
                </CyberBadge>
                <span className="text-xs text-cyan-100/60">
                  {roleLabels[role as keyof typeof roleLabels]} ({rolePlayers.length})
                </span>
              </div>
              
              <div className="space-y-2">
                {rolePlayers.map(player => (
                  <div
                    key={player.id}
                    className="bg-slate-900/50 rounded p-2 flex items-center justify-between group hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      {captainId === player.id && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                      {viceCaptainId === player.id && (
                        <Shield className="w-4 h-4 text-orange-400" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-cyan-100 leading-tight">
                          {player.name}
                        </div>
                        <div className="text-xs text-cyan-100/60">
                          {player.team?.short_name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-cyan-400">
                        {player.credits}
                      </span>
                      {onRemovePlayer && (
                        <button
                          onClick={() => onRemovePlayer(player)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      {/* Warnings */}
      {players.length === 11 && !captainId && (
        <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
          ⚠️ Please select a captain (2x points)
        </div>
      )}
      {players.length === 11 && !viceCaptainId && (
        <div className="text-xs text-yellow-400 bg-yellow-500/10 p-2 rounded">
          ⚠️ Please select a vice-captain (1.5x points)
        </div>
      )}
    </div>
  );
}
