import Link from 'next/link';
import { Match } from '@/app/types/types';
import { getAuthUser, getUsername } from '@/lib/actions';
import { Swords, Trophy, Users, Target } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberCardFooter } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';

interface MatchCardProps {
  match: Match;
}

const MatchCard: React.FC<MatchCardProps> = async ({ match }) => {
  const user = await getAuthUser();
  if (!user) return null;

  const opponentId =
    user.id === match.home_player_id
      ? match.away_player_id
      : match.home_player_id;
  const opponentName = await getUsername(opponentId);

  return (
    <CyberCard 
      variant="cyan" 
      glow
      className="flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* VS Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 animate-pulse" />
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-black text-xs px-3 py-1.5 rounded-lg border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            VS
          </div>
        </div>
      </div>

      <CyberCardHeader className="pb-4">
        {opponentId ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
              <Target className="w-4 h-4" />
              <span>YOUR OPPONENT</span>
            </div>
            <CyberCardTitle className="text-2xl">
              <Link
                href={`/profile/${opponentId}`}
                className="hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group/link"
              >
                <Swords className="w-5 h-5 text-cyan-400 group-hover/link:animate-pulse" />
                {opponentName.username}
              </Link>
            </CyberCardTitle>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold">
              <Users className="w-4 h-4 animate-pulse" />
              <span>AWAITING OPPONENT</span>
            </div>
            <CyberCardTitle className="text-xl text-purple-300">
              Opponent To Be Determined
            </CyberCardTitle>
          </div>
        )}
      </CyberCardHeader>

      <CyberCardContent className="flex-grow pb-4">
        <div className="space-y-3">
          {/* Tournament Name */}
          <div className="flex items-start gap-2">
            <Trophy className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-xs text-cyan-300/70 font-semibold mb-1">TOURNAMENT</p>
              <p className="text-sm text-white font-medium line-clamp-2">
                {match.tournaments.name}
              </p>
            </div>
          </div>

          {/* Round Info */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex-1">
              <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-cyan-500/30">
                <p className="text-xs text-cyan-300/70 font-semibold mb-0.5">ROUND</p>
                <p className="text-xl font-black text-white">{match.round}</p>
              </div>
            </div>
          </div>
        </div>
      </CyberCardContent>

      <CyberCardFooter className="pt-4">
        <Link href={`/tournaments/${match.tournament_id}`} className="w-full">
          <CyberButton 
            variant="primary"
            size="md"
            fullWidth
            icon={Swords}
          >
            Enter Arena
          </CyberButton>
        </Link>
      </CyberCardFooter>
    </CyberCard>
  );
};

export default MatchCard;
