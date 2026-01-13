'use client';

import Link from 'next/link';
import { Trophy, Users, Clock, TrendingUp, Award } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { Contest } from '@/types/frag11';
import { formatCurrency } from '@/lib/utils';

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const filledPercentage = (contest.current_entries / contest.max_entries) * 100;
  const spotsLeft = contest.max_entries - contest.current_entries;
  const isFilling = filledPercentage > 75;
  const isAlmostFull = filledPercentage > 90;

  return (
    <Link href={`/frag11/contests/${contest.id}`}>
      <CyberCard 
        variant={contest.is_featured ? 'cyan' : contest.type === 'free' ? 'purple' : 'default'}
        hover 
        glow={contest.is_featured}
      >
        <CyberCardHeader>
          <div className="flex items-start justify-between mb-2">
            <CyberCardTitle className="text-lg">{contest.name}</CyberCardTitle>
            {contest.is_guaranteed && (
              <CyberBadge variant="green" className="text-xs">
                GUARANTEED
              </CyberBadge>
            )}
          </div>
          <p className="text-sm text-cyan-100/60 line-clamp-1">{contest.description}</p>
        </CyberCardHeader>

        <CyberCardContent className="space-y-4">
          {/* Prize Pool */}
          <div className="text-center py-4 bg-slate-900/30 rounded-lg border border-cyan-500/20">
            <div className="text-xs text-cyan-100/60 mb-1">Prize Pool</div>
            <div className="text-2xl font-bold text-cyan-100 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {formatCurrency(contest.total_prize_pool)}
            </div>
            {contest.first_prize && (
              <div className="text-xs text-cyan-100/50 mt-1">
                Winner: {formatCurrency(contest.first_prize)}
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-cyan-100/60 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Spots
              </div>
              <div className="font-bold text-cyan-100">
                {spotsLeft.toLocaleString()} left
              </div>
            </div>
            <div>
              <div className="text-cyan-100/60 mb-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Entry
              </div>
              <div className="font-bold text-cyan-100">
                {contest.entry_fee === 0 ? 'FREE' : `₹${contest.entry_fee}`}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-cyan-100/60">
              <span>{contest.current_entries.toLocaleString()} joined</span>
              <span>{contest.max_entries.toLocaleString()} max</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  isAlmostFull ? 'bg-red-500' : 
                  isFilling ? 'bg-yellow-500' : 
                  'bg-cyan-500'
                }`}
                style={{ width: `${filledPercentage}%` }}
              />
            </div>
          </div>

          {/* Contest Type Badge */}
          <div className="flex items-center justify-between pt-2">
            {contest.type === 'free' ? (
              <CyberBadge variant="green">FREE ENTRY</CyberBadge>
            ) : contest.type === 'head_to_head' ? (
              <CyberBadge variant="pink">HEAD TO HEAD</CyberBadge>
            ) : contest.type === 'mega' ? (
              <CyberBadge variant="gold">MEGA CONTEST</CyberBadge>
            ) : (
              <CyberBadge variant="purple">PAID ENTRY</CyberBadge>
            )}
            
            <div className="text-xs text-cyan-100/60 flex items-center gap-1">
              <Award className="w-3 h-3" />
              {contest.winner_percentage}% win
            </div>
          </div>
        </CyberCardContent>
      </CyberCard>
    </Link>
  );
}
