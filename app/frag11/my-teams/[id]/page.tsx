'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, Star, Shield, ArrowLeft, Calendar } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { UserTeam, IPLPlayer } from '@/types/frag11';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

interface TeamPlayer {
  player: IPLPlayer;
  is_captain: boolean;
  is_vice_captain: boolean;
}

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [team, setTeam] = useState<UserTeam | null>(null);
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadTeamDetails();
    }
  }, [params.id]);

  const loadTeamDetails = async () => {
    const supabase = createClient();
    
    try {
      // Load team
      const { data: teamData } = await supabase
        .from('frag11_user_teams')
        .select(`
          *,
          match:frag11_matches(
            *,
            team1:frag11_teams!team1_id(*),
            team2:frag11_teams!team2_id(*)
          )
        `)
        .eq('id', params.id)
        .single();

      if (teamData) {
        setTeam(teamData);

        // Parse player IDs and load player details
        if (teamData.player_ids && Array.isArray(teamData.player_ids)) {
          const { data: playersData } = await supabase
            .from('frag11_players')
            .select('*, team:frag11_teams(*)')
            .in('id', teamData.player_ids);

          if (playersData) {
            const teamPlayers: TeamPlayer[] = playersData.map(player => ({
              player,
              is_captain: player.id === teamData.captain_id,
              is_vice_captain: player.id === teamData.vice_captain_id,
            }));
            setPlayers(teamPlayers);
          }
        }
      }
    } catch (error) {
      console.error('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading team...</div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-cyan-100 mb-4">Team not found</h2>
          <Link href="/frag11/my-teams">
            <CyberButton variant="primary">Back to My Teams</CyberButton>
          </Link>
        </div>
      </div>
    );
  }

  const groupedPlayers = {
    WK: players.filter(p => p.player.role === 'WK'),
    BAT: players.filter(p => p.player.role === 'BAT'),
    AR: players.filter(p => p.player.role === 'AR'),
    BOWL: players.filter(p => p.player.role === 'BOWL'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/frag11/my-teams">
          <CyberButton variant="ghost" icon={ArrowLeft} className="mb-6">
            Back to My Teams
          </CyberButton>
        </Link>

        {/* Team Header */}
        <CyberCard variant="cyan" glow className="mb-8">
          <CyberCardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CyberCardTitle>{team.team_name}</CyberCardTitle>
                <div className="flex items-center gap-2 text-cyan-100/60 mt-2">
                  <Calendar className="w-4 h-4" />
                  {team.match?.match_date && format(new Date(team.match.match_date), 'EEEE, MMMM dd, yyyy')}
                </div>
              </div>
              <CyberBadge variant={team.match?.status === 'live' ? 'red' : 'cyan'}>
                {team.match?.status?.toUpperCase()}
              </CyberBadge>
            </div>
          </CyberCardHeader>

          <CyberCardContent className="space-y-4">
            {/* Match Info */}
            <div className="text-center py-4 bg-slate-900/30 rounded-lg">
              <div className="text-xl font-bold text-cyan-100">
                {team.match?.team1?.short_name} vs {team.match?.team2?.short_name}
              </div>
              <div className="text-sm text-cyan-100/60 mt-1">
                {team.match?.venue}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-cyan-100/60 text-sm mb-1">Players</div>
                <div className="font-bold text-cyan-100 text-xl">{players.length}</div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-cyan-100/60 text-sm mb-1">Total Points</div>
                <div className="font-bold text-cyan-100 text-xl flex items-center justify-center gap-1">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  {team.total_points}
                </div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-cyan-100/60 text-sm mb-1">Rank</div>
                <div className="font-bold text-cyan-100 text-xl">
                  {team.rank || '-'}
                </div>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>

        {/* Players by Role */}
        <div className="space-y-6">
          {Object.entries(groupedPlayers).map(([role, rolePlayers]) => (
            rolePlayers.length > 0 && (
              <div key={role}>
                <h3 className="text-xl font-bold text-cyan-100 mb-4">
                  {role === 'WK' ? 'Wicket Keepers' : 
                   role === 'BAT' ? 'Batters' : 
                   role === 'AR' ? 'All-Rounders' : 'Bowlers'} ({rolePlayers.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {rolePlayers.map(({ player, is_captain, is_vice_captain }) => (
                    <CyberCard key={player.id} variant="default" hover>
                      <CyberCardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-cyan-100">{player.name}</h4>
                              {is_captain && (
                                <div className="bg-yellow-500 text-black px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-current" />
                                  C
                                </div>
                              )}
                              {is_vice_captain && (
                                <div className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  VC
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-cyan-100/60">
                              {player.team?.short_name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-cyan-100/60">Credits</div>
                            <div className="font-bold text-cyan-100">{player.credits}</div>
                          </div>
                        </div>
                      </CyberCardContent>
                    </CyberCard>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
