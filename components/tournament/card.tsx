import { Tournament } from '@/app/types/types';
import Link from 'next/link';
import { Users, Trophy, Lock, Unlock, Zap } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberCardFooter, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  // Determine card variant based on status
  const getCardVariant = () => {
    if (tournament.finished) return 'gold';
    if (tournament.started) return 'cyan';
    return 'purple';
  };

  // Get status badge with proper styling
  const getStatusBadge = () => {
    if (tournament.finished) {
      return (
        <CyberBadge variant="gold">
          <Trophy className="w-3 h-3 mr-1" />
          Finished
        </CyberBadge>
      );
    } else if (tournament.started) {
      return (
        <CyberBadge variant="cyan">
          <Zap className="w-3 h-3 mr-1" />
          Live
        </CyberBadge>
      );
    } else {
      return (
        <CyberBadge variant="purple">
          <Users className="w-3 h-3 mr-1" />
          Recruiting
        </CyberBadge>
      );
    }
  };

  // Calculate if tournament is full
  const isFull = tournament.max_player_count && tournament.player_count >= tournament.max_player_count;
  const fillPercentage = tournament.max_player_count 
    ? (tournament.player_count / tournament.max_player_count) * 100 
    : 0;

  return (
    <CyberCard 
      variant={getCardVariant()} 
      glow={tournament.started && !tournament.finished}
      className="flex flex-col h-full group"
    >
      <CyberCardHeader className="pb-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <CyberCardTitle className="text-xl flex-1 line-clamp-2">
            {tournament.name}
          </CyberCardTitle>
          {getStatusBadge()}
        </div>
        
        {/* Privacy Badge */}
        <div className="flex items-center gap-2">
          {tournament.private ? (
            <span className="flex items-center gap-1 text-xs text-pink-300">
              <Lock className="w-3 h-3" />
              Private
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-cyan-300">
              <Unlock className="w-3 h-3" />
              Public
            </span>
          )}
        </div>
      </CyberCardHeader>

      <CyberCardContent className="flex-grow pb-4">
        <p className="text-sm text-cyan-100/70 line-clamp-3 mb-4">
          {tournament.description || 'No description available'}
        </p>

        {/* Player Count with Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="flex items-center gap-2 text-white font-semibold">
              <Users className="w-4 h-4 text-cyan-400" />
              Players
            </span>
            <span className="text-cyan-300 font-bold">
              {tournament.player_count}
              {tournament.max_player_count && (
                <span className="text-cyan-100/50"> / {tournament.max_player_count}</span>
              )}
            </span>
          </div>
          
          {/* Progress Bar */}
          {tournament.max_player_count && (
            <div className="relative h-2 bg-slate-900/50 rounded-full overflow-hidden border border-cyan-500/30">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                style={{ width: `${fillPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-50 animate-pulse" />
              </div>
            </div>
          )}
          
          {isFull && (
            <span className="text-xs text-red-300 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Tournament Full
            </span>
          )}
        </div>
      </CyberCardContent>

      <CyberCardFooter className="pt-4">
        <Link href={`/tournaments/${tournament.id}`} className="w-full">
          <CyberButton 
            variant={tournament.finished ? 'ghost' : tournament.started ? 'primary' : 'secondary'}
            size="md"
            fullWidth
          >
            {tournament.finished ? 'View Results' : tournament.started ? 'Watch Live' : 'Join Tournament'}
          </CyberButton>
        </Link>
      </CyberCardFooter>
    </CyberCard>
  );
};

export default TournamentCard;
