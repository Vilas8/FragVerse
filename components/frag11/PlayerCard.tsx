'use client';

import Image from 'next/image';
import { Star, TrendingUp, Users, Shield } from 'lucide-react';
import { CyberCard, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { IPLPlayer } from '@/types/frag11';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: IPLPlayer;
  isSelected?: boolean;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  onToggle?: (player: IPLPlayer) => void;
  onSetCaptain?: (playerId: string) => void;
  onSetViceCaptain?: (playerId: string) => void;
  disabled?: boolean;
  showDetailedStats?: boolean;
}

export function PlayerCard({
  player,
  isSelected,
  isCaptain,
  isViceCaptain,
  onToggle,
  onSetCaptain,
  onSetViceCaptain,
  disabled,
  showDetailedStats,
}: PlayerCardProps) {
  const roleColors = {
    WK: 'cyan',
    BAT: 'purple',
    AR: 'pink',
    BOWL: 'green',
  } as const;

  const roleColor = roleColors[player.role];

  return (
    <CyberCard
      variant={isSelected ? roleColor : 'default'}
      glow={isCaptain || isViceCaptain}
      hover={!disabled}
      className={cn(
        'relative transition-all',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isCaptain && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
          <Star className="w-3 h-3 fill-current" />
          CAPTAIN
        </div>
      )}
      {isViceCaptain && (
        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 text-xs font-bold rounded flex items-center gap-1">
          <Shield className="w-3 h-3" />
          VC
        </div>
      )}

      <CyberCardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Player Image */}
          <div className="relative">
            <div className={cn(
              'w-16 h-16 rounded-full overflow-hidden',
              isSelected && 'ring-2 ring-cyan-400'
            )}>
              {player.image_url ? (
                <Image
                  src={player.image_url}
                  alt={player.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold">
                  {player.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-slate-900 rounded-full px-2 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/50">
              {player.credits}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-cyan-100">{player.name}</h3>
              <CyberBadge variant={roleColor} className="text-xs">
                {player.role}
              </CyberBadge>
            </div>
            
            <div className="text-sm text-cyan-100/60 mb-2">
              {player.team?.short_name}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-cyan-100/60">
                <TrendingUp className="w-3 h-3" />
                {player.average_points.toFixed(1)} pts
              </div>
              <div className="flex items-center gap-1 text-cyan-100/60">
                <Users className="w-3 h-3" />
                {player.selected_by.toFixed(1)}%
              </div>
            </div>

            {showDetailedStats && (
              <div className="mt-2 pt-2 border-t border-cyan-500/20 text-xs text-cyan-100/60 space-y-1">
                {player.role === 'BAT' || player.role === 'AR' || player.role === 'WK' ? (
                  <div className="flex gap-4">
                    <div>Runs: {player.runs}</div>
                    <div>Avg: {player.average?.toFixed(1)}</div>
                    <div>SR: {player.strike_rate?.toFixed(1)}</div>
                  </div>
                ) : null}
                {player.role === 'BOWL' || player.role === 'AR' ? (
                  <div className="flex gap-4">
                    <div>Wickets: {player.wickets}</div>
                    <div>Econ: {player.economy?.toFixed(2)}</div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {onToggle && (
              <CyberButton
                variant={isSelected ? 'danger' : 'primary'}
                size="sm"
                onClick={() => onToggle(player)}
                disabled={disabled}
              >
                {isSelected ? 'Remove' : 'Add'}
              </CyberButton>
            )}
            
            {isSelected && onSetCaptain && !isCaptain && (
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => onSetCaptain(player.id)}
              >
                Make C
              </CyberButton>
            )}
            
            {isSelected && onSetViceCaptain && !isViceCaptain && (
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => onSetViceCaptain(player.id)}
              >
                Make VC
              </CyberButton>
            )}
          </div>
        </div>
      </CyberCardContent>
    </CyberCard>
  );
}
