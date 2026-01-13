'use client';

import Link from 'next/link';
import { Trophy, Users, DollarSign, Sparkles } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Contest } from '@/types/frag11';
import { Progress } from '@/components/ui/progress';

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const spotsLeft = contest.max_entries - contest.current_entries;
  const fillPercentage = (contest.current_entries / contest.max_entries) * 100;
  const isAlmostFull = fillPercentage > 80;
  const isFree = contest.entry_fee === 0;

  const getContestBadgeVariant = () => {
    if (contest.is_guaranteed) return 'gold';
    if (isFree) return 'green';
    return 'cyan';
  };

  return (
    <CyberCard
      variant={contest.is_featured ? 'cyan' : 'default'}
      glow={contest.is_guaranteed}
      hover
      className="relative overflow-hidden"
    >
      {contest.is_featured && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          FEATURED
        </div>
      )}

      <CyberCardHeader className={contest.is_featured ? 'mt-6' : ''}>
        <CyberCardTitle glow={contest.is_guaranteed}>
          {contest.name}
        </CyberCardTitle>
        <div className="flex gap-2 mt-2">
          {contest.is_guaranteed && (
            <CyberBadge variant="gold">GUARANTEED</CyberBadge>
          )}
          {isFree && (
            <CyberBadge variant="green">FREE</CyberBadge>
          )}
        </div>
      </CyberCardHeader>

      <CyberCardContent className="space-y-4">
        {/* Prize Pool */}
        <div className="text-center py-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg">
          <div className="text-sm text-cyan-100/60 mb-1">Prize Pool</div>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ₹{contest.total_prize_pool.toLocaleString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-cyan-100/60 mb-1">Entry</div>
            <div className="font-bold text-cyan-100 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              {isFree ? 'FREE' : `₹${contest.entry_fee}`}
            </div>
          </div>
          <div>
            <div className="text-cyan-100/60 mb-1">First Prize</div>
            <div className="font-bold text-cyan-100 flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              ₹{contest.first_prize.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Spots Left */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-cyan-100/60 flex items-center gap-1">
              <Users className="w-4 h-4" />
              Spots Left
            </span>
            <span className={`font-bold ${isAlmostFull ? 'text-red-400' : 'text-cyan-100'}`}>
              {spotsLeft.toLocaleString()} / {contest.max_entries.toLocaleString()}
            </span>
          </div>
          <Progress value={fillPercentage} className="h-2" />
        </div>

        {/* Winner Percentage */}
        <div className="text-center text-xs text-cyan-100/60">
          {contest.winner_percentage}% Winners
        </div>

        {/* Action Button */}
        <Link href={`/frag11/contests/${contest.id}`}>
          <CyberButton
            variant={contest.is_guaranteed ? 'glow' : 'primary'}
            size="sm"
            fullWidth
          >
            {spotsLeft > 0 ? 'Join Contest' : 'View Contest'}
          </CyberButton>
        </Link>
      </CyberCardContent>
    </CyberCard>
  );
}
