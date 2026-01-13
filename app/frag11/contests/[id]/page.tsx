'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, Award, TrendingUp, ArrowLeft, CheckCircle } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Contest, UserTeam } from '@/types/frag11';
import { createClient } from '@/utils/supabase/client';
import { formatCurrency } from '@/lib/utils';

export default function ContestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contest, setContest] = useState<Contest | null>(null);
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadContestDetails();
    }
  }, [params.id]);

  const loadContestDetails = async () => {
    const supabase = createClient();
    
    try {
      // Load contest
      const { data: contestData } = await supabase
        .from('frag11_contests')
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

      if (contestData) {
        setContest(contestData);

        // Load user's teams for this match
        const { data: { user } } = await supabase.auth.getUser();
        if (user && contestData.match) {
          const { data: teamsData } = await supabase
            .from('frag11_user_teams')
            .select('*')
            .eq('user_id', user.id)
            .eq('match_id', contestData.match.id);

          if (teamsData) {
            setUserTeams(teamsData);
          }
        }
      }
    } catch (error) {
      console.error('Error loading contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinContest = async () => {
    if (!selectedTeamId || !contest) return;

    const supabase = createClient();
    setJoining(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }

      // Check if already joined
      const { data: existing } = await supabase
        .from('frag11_contest_entries')
        .select('id')
        .eq('contest_id', contest.id)
        .eq('user_team_id', selectedTeamId)
        .single();

      if (existing) {
        alert('You have already joined this contest with this team!');
        return;
      }

      // Join contest
      const { error } = await supabase
        .from('frag11_contest_entries')
        .insert({
          contest_id: contest.id,
          user_id: user.id,
          user_team_id: selectedTeamId,
        });

      if (error) throw error;

      // Update contest entry count
      await supabase
        .from('frag11_contests')
        .update({ current_entries: contest.current_entries + 1 })
        .eq('id', contest.id);

      alert('Successfully joined contest!');
      router.push('/frag11/my-contests');
    } catch (error) {
      console.error('Error joining contest:', error);
      alert('Failed to join contest. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading contest...</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-cyan-100 mb-4">Contest not found</h2>
          <Link href="/frag11/contests">
            <CyberButton variant="primary">Back to Contests</CyberButton>
          </Link>
        </div>
      </div>
    );
  }

  const filledPercentage = (contest.current_entries / contest.max_entries) * 100;
  const spotsLeft = contest.max_entries - contest.current_entries;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/frag11/contests">
          <CyberButton variant="ghost" icon={ArrowLeft} className="mb-6">
            Back to Contests
          </CyberButton>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contest Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info */}
            <CyberCard variant="cyan" glow>
              <CyberCardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CyberCardTitle>{contest.name}</CyberCardTitle>
                    <p className="text-cyan-100/60 mt-2">{contest.description}</p>
                  </div>
                  {contest.is_guaranteed && (
                    <CyberBadge variant="green">GUARANTEED</CyberBadge>
                  )}
                </div>

                {/* Match Info */}
                <div className="bg-slate-900/30 rounded-lg p-4">
                  <div className="text-sm text-cyan-100/60 mb-2">Match</div>
                  <div className="text-lg font-bold text-cyan-100">
                    {contest.match?.team1?.short_name} vs {contest.match?.team2?.short_name}
                  </div>
                  <div className="text-sm text-cyan-100/60 mt-1">
                    {contest.match?.venue}
                  </div>
                </div>
              </CyberCardHeader>

              <CyberCardContent className="space-y-6">
                {/* Prize Pool */}
                <div className="text-center py-6 bg-slate-900/30 rounded-lg border border-cyan-500/20">
                  <div className="text-sm text-cyan-100/60 mb-2">Total Prize Pool</div>
                  <div className="text-4xl font-bold text-cyan-100 flex items-center justify-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    {formatCurrency(contest.total_prize_pool)}
                  </div>
                  {contest.first_prize && (
                    <div className="text-cyan-100/70 mt-3">
                      Winner gets: <span className="font-bold text-cyan-100">{formatCurrency(contest.first_prize)}</span>
                    </div>
                  )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                    <div className="text-cyan-100/60 text-sm mb-1">Entry Fee</div>
                    <div className="font-bold text-cyan-100 text-lg">
                      {contest.entry_fee === 0 ? 'FREE' : `₹${contest.entry_fee}`}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                    <div className="text-cyan-100/60 text-sm mb-1">Spots Left</div>
                    <div className="font-bold text-cyan-100 text-lg">
                      {spotsLeft.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                    <div className="text-cyan-100/60 text-sm mb-1">Max Entries</div>
                    <div className="font-bold text-cyan-100 text-lg">
                      {contest.max_entries.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                    <div className="text-cyan-100/60 text-sm mb-1">Winners</div>
                    <div className="font-bold text-cyan-100 text-lg">
                      {contest.winner_percentage}%
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm text-cyan-100/60 mb-2">
                    <span>{contest.current_entries.toLocaleString()} joined</span>
                    <span>{filledPercentage.toFixed(1)}% filled</span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                      style={{ width: `${filledPercentage}%` }}
                    />
                  </div>
                </div>
              </CyberCardContent>
            </CyberCard>

            {/* Prize Breakdown */}
            {contest.prize_distribution && Array.isArray(contest.prize_distribution) && (
              <CyberCard variant="default">
                <CyberCardHeader>
                  <CyberCardTitle>Prize Breakdown</CyberCardTitle>
                </CyberCardHeader>
                <CyberCardContent>
                  <div className="space-y-2">
                    {contest.prize_distribution.map((prize: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-400" />
                          <span className="text-cyan-100">
                            Rank {prize.rank_from}{prize.rank_to !== prize.rank_from && ` - ${prize.rank_to}`}
                          </span>
                        </div>
                        <span className="font-bold text-cyan-100">
                          {formatCurrency(prize.prize)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CyberCardContent>
              </CyberCard>
            )}
          </div>

          {/* Join Panel */}
          <div>
            <CyberCard variant="purple" glow className="sticky top-4">
              <CyberCardHeader>
                <CyberCardTitle>Join Contest</CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent className="space-y-4">
                {userTeams.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-cyan-100/60 mb-4">
                      Create a team first to join this contest
                    </p>
                    <Link href={`/frag11/create-team?match=${contest.match_id}`}>
                      <CyberButton variant="primary" fullWidth>
                        Create Team
                      </CyberButton>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm text-cyan-100/70 mb-2 block">
                        Select Your Team
                      </label>
                      <select
                        value={selectedTeamId || ''}
                        onChange={(e) => setSelectedTeamId(e.target.value)}
                        className="w-full bg-slate-900/50 border border-cyan-500/30 rounded-lg px-4 py-3 text-cyan-100 focus:outline-none focus:border-cyan-500"
                      >
                        <option value="">Choose a team...</option>
                        {userTeams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.team_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <CyberButton
                      variant="glow"
                      fullWidth
                      disabled={!selectedTeamId || joining}
                      onClick={handleJoinContest}
                      icon={CheckCircle}
                    >
                      {joining ? 'Joining...' : `Join Contest ${contest.entry_fee > 0 ? `(₹${contest.entry_fee})` : '(FREE)'}`}
                    </CyberButton>
                  </>
                )}
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
}
