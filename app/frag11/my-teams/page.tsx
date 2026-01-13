'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Trophy, Calendar } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { UserTeam } from '@/types/frag11';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

export default function MyTeamsPage() {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserTeams();
  }, []);

  const loadUserTeams = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('frag11_user_teams')
        .select(`
          *,
          match:frag11_matches(
            *,
            team1:frag11_teams!team1_id(*),
            team2:frag11_teams!team2_id(*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) {
        setTeams(data);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
              My Teams
            </h1>
            <p className="text-cyan-100/70">Manage your fantasy cricket teams</p>
          </div>
          
          <Link href="/frag11/matches">
            <CyberButton variant="glow" icon={Plus}>
              Create New Team
            </CyberButton>
          </Link>
        </div>

        {/* Teams Grid */}
        {loading ? (
          <div className="text-center text-cyan-400 py-12">Loading teams...</div>
        ) : teams.length === 0 ? (
          <CyberCard variant="default">
            <CyberCardContent className="text-center py-16">
              <Users className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-cyan-100 mb-2">No teams yet</h3>
              <p className="text-cyan-100/60 mb-6">Start building your fantasy team now!</p>
              <Link href="/frag11/matches">
                <CyberButton variant="primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Team
                </CyberButton>
              </Link>
            </CyberCardContent>
          </CyberCard>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teams.map(team => (
              <CyberCard key={team.id} variant="cyan" hover glow>
                <CyberCardHeader>
                  <CyberCardTitle>{team.team_name}</CyberCardTitle>
                  <div className="flex items-center gap-2 text-sm text-cyan-100/60 mt-2">
                    <Calendar className="w-4 h-4" />
                    {team.match?.match_date && format(new Date(team.match.match_date), 'MMM dd, yyyy')}
                  </div>
                </CyberCardHeader>

                <CyberCardContent className="space-y-4">
                  {/* Match Info */}
                  <div className="text-center py-3 bg-slate-900/50 rounded">
                    <div className="text-sm font-bold text-cyan-100">
                      {team.match?.team1?.short_name} vs {team.match?.team2?.short_name}
                    </div>
                    <div className="text-xs text-cyan-100/60 mt-1">
                      {team.match?.venue}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-cyan-100/60 mb-1">Credits Used</div>
                      <div className="font-bold text-cyan-100">{team.total_credits_used.toFixed(1)}/100</div>
                    </div>
                    <div>
                      <div className="text-cyan-100/60 mb-1">Total Points</div>
                      <div className="font-bold text-cyan-100 flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {team.total_points}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  {team.match?.status === 'live' && (
                    <CyberBadge variant="cyan" className="w-full text-center">
                      LIVE
                    </CyberBadge>
                  )}
                  {team.match?.status === 'completed' && (
                    <CyberBadge variant="default" className="w-full text-center">
                      COMPLETED
                    </CyberBadge>
                  )}
                  {team.match?.status === 'upcoming' && (
                    <CyberBadge variant="purple" className="w-full text-center">
                      UPCOMING
                    </CyberBadge>
                  )}

                  {/* Actions */}
                  <Link href={`/frag11/my-teams/${team.id}`}>
                    <CyberButton variant="primary" size="sm" fullWidth>
                      View Details
                    </CyberButton>
                  </Link>
                </CyberCardContent>
              </CyberCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
