'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Trophy, Users } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Match } from '@/types/frag11';
import { format } from 'date-fns';

interface MatchCardProps {
  match: Match;
  showLiveBadge?: boolean;
}

export function MatchCard({ match, showLiveBadge }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';
  const isUpcoming = match.status === 'upcoming';

  const formatMatchDate = () => {
    try {
      return format(new Date(match.match_date), 'EEE, MMM dd');
    } catch {
      return match.match_date;
    }
  };

  return (
    <CyberCard
      variant={isLive ? 'cyan' : isCompleted ? 'default' : 'purple'}
      glow={isLive}
      hover
      className="relative overflow-hidden"
    >
      {isLive && showLiveBadge && (
        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold flex items-center gap-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </div>
      )}

      <CyberCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-cyan-100/60">
            <Calendar className="w-4 h-4" />
            {formatMatchDate()}
          </div>
          <CyberBadge variant="cyan" className="text-xs">
            Match {match.match_number}
          </CyberBadge>
        </div>
      </CyberCardHeader>

      <CyberCardContent className="space-y-6">
        {/* Teams */}
        <div className="space-y-4">
          {/* Team 1 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {match.team1?.logo_url && (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                  <Image
                    src={match.team1.logo_url}
                    alt={match.team1.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <div className="font-bold text-cyan-100">{match.team1?.short_name || 'TBD'}</div>
                <div className="text-xs text-cyan-100/60">{match.team1?.name}</div>
              </div>
            </div>
            {isLive && match.team1_score && (
              <div className="text-right">
                <div className="font-bold text-cyan-100 text-lg">{match.team1_score}</div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center text-cyan-100/40">
            <div className="text-sm font-bold">VS</div>
          </div>

          {/* Team 2 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {match.team2?.logo_url && (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                  <Image
                    src={match.team2.logo_url}
                    alt={match.team2.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <div className="font-bold text-cyan-100">{match.team2?.short_name || 'TBD'}</div>
                <div className="text-xs text-cyan-100/60">{match.team2?.name}</div>
              </div>
            </div>
            {isLive && match.team2_score && (
              <div className="text-right">
                <div className="font-bold text-cyan-100 text-lg">{match.team2_score}</div>
              </div>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-2 text-sm text-cyan-100/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {match.match_time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {match.venue}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-cyan-100/60">
            <Trophy className="w-4 h-4" />
            {match.contests_count} Contests
          </div>
          <div className="flex items-center gap-2 text-cyan-100/60">
            <Users className="w-4 h-4" />
            ₹{(match.total_prize_pool / 100000).toFixed(1)}L Pool
          </div>
        </div>

        {/* Action Button */}
        {isUpcoming && (
          <Link href={`/frag11/create-team?match=${match.id}`}>
            <CyberButton variant="primary" size="sm" fullWidth>
              Create Team
            </CyberButton>
          </Link>
        )}
        {isLive && (
          <Link href={`/frag11/matches/${match.id}`}>
            <CyberButton variant="glow" size="sm" fullWidth>
              View Live Score
            </CyberButton>
          </Link>
        )}
        {isCompleted && match.result && (
          <div className="text-center text-sm text-cyan-100/60 py-2">
            {match.result}
          </div>
        )}
      </CyberCardContent>
    </CyberCard>
  );
}
