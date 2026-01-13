'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Trophy, Users, ArrowLeft } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Match, Contest } from '@/types/frag11';
import { ContestCard } from '@/components/frag11/ContestCard';
import { createClient } from '@/utils/supabase/client';
import { format } from 'date-fns';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadMatchDetails();
    }
  }, [params.id]);

  const loadMatchDetails = async () => {
    const supabase = createClient();
    
    try {
      // Load match
      const { data: matchData } = await supabase
        .from('frag11_matches')
        .select(`
          *,
          team1:frag11_teams!team1_id(*),
          team2:frag11_teams!team2_id(*)
        `)
        .eq('id', params.id)
        .single();

      if (matchData) {
        setMatch(matchData);
      }

      // Load contests
      const { data: contestsData } = await supabase
        .from('frag11_contests')
        .select('*')
        .eq('match_id', params.id)
        .eq('status', 'upcoming')
        .order('total_prize_pool', { ascending: false });

      if (contestsData) {
        setContests(contestsData);
      }
    } catch (error) {
      console.error('Error loading match:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-lg">Loading match details...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-cyan-100 mb-4">Match not found</h2>
          <Link href="/frag11/matches">
            <CyberButton variant="primary">Back to Matches</CyberButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/frag11/matches">
          <CyberButton variant="ghost" icon={ArrowLeft} className="mb-6">
            Back to Matches
          </CyberButton>
        </Link>

        {/* Match Info Card */}
        <CyberCard variant="cyan" glow className="mb-8">
          <CyberCardHeader>
            <div className="flex items-center justify-between">
              <CyberCardTitle>Match {match.match_number}</CyberCardTitle>
              <CyberBadge variant={match.status === 'live' ? 'red' : 'cyan'}>
                {match.status.toUpperCase()}
              </CyberBadge>
            </div>
          </CyberCardHeader>

          <CyberCardContent>
            {/* Teams */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-cyan-100 mb-2">
                  {match.team1?.name}
                </h3>
                <div className="text-cyan-400 font-bold text-lg">
                  {match.team1?.short_name}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-4xl font-bold text-cyan-100">VS</div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-cyan-100 mb-2">
                  {match.team2?.name}
                </h3>
                <div className="text-cyan-400 font-bold text-lg">
                  {match.team2?.short_name}
                </div>
              </div>
            </div>

            {/* Match Details */}
            <div className="grid md:grid-cols-3 gap-4 py-4 border-y border-cyan-500/20">
              <div className="flex items-center gap-2 text-cyan-100/70">
                <Calendar className="w-5 h-5" />
                <span>{format(new Date(match.match_date), 'EEEE, MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-100/70">
                <Clock className="w-5 h-5" />
                <span>{match.match_time}</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-100/70">
                <MapPin className="w-5 h-5" />
                <span>{match.venue}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-cyan-100/60 text-sm mb-1">Total Prize Pool</div>
                <div className="text-2xl font-bold text-cyan-100 flex items-center justify-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  ₹{(match.total_prize_pool / 100000).toFixed(1)}L
                </div>
              </div>
              <div className="text-center p-4 bg-slate-900/30 rounded-lg">
                <div className="text-cyan-100/60 text-sm mb-1">Total Contests</div>
                <div className="text-2xl font-bold text-cyan-100 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  {match.contests_count}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <Link href={`/frag11/create-team?match=${match.id}`}>
                <CyberButton variant="glow" size="lg" fullWidth>
                  Create Team for This Match
                </CyberButton>
              </Link>
            </div>
          </CyberCardContent>
        </CyberCard>

        {/* Contests Section */}
        <div>
          <h2 className="text-3xl font-bold text-cyan-100 mb-6">Available Contests</h2>
          
          {contests.length === 0 ? (
            <CyberCard variant="default">
              <CyberCardContent className="text-center py-12">
                <Trophy className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
                <p className="text-cyan-100/60">No contests available for this match yet</p>
              </CyberCardContent>
            </CyberCard>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {contests.map(contest => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
