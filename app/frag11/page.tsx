'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Users, TrendingUp, Zap, Calendar, Clock, ChevronRight } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent, CyberBadge } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { IPLMatch, Contest } from '@/types/frag11';
import { MatchCard } from '@/components/frag11/MatchCard';
import { ContestCard } from '@/components/frag11/ContestCard';
import { createClient } from '@/utils/supabase/client';

export default function Frag11Dashboard() {
  const [upcomingMatches, setUpcomingMatches] = useState<IPLMatch[]>([]);
  const [liveMatches, setLiveMatches] = useState<IPLMatch[]>([]);
  const [featuredContests, setFeaturedContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const supabase = createClient();
    
    try {
      // Load matches
      const { data: matches } = await supabase
        .from('frag11_matches')
        .select(`
          *,
          team1:frag11_teams!team1_id(*),
          team2:frag11_teams!team2_id(*)
        `)
        .in('status', ['upcoming', 'live'])
        .order('match_date', { ascending: true })
        .limit(6);

      if (matches) {
        setLiveMatches(matches.filter(m => m.status === 'live'));
        setUpcomingMatches(matches.filter(m => m.status === 'upcoming'));
      }

      // Load featured contests
      const { data: contests } = await supabase
        .from('frag11_contests')
        .select(`
          *,
          match:frag11_matches(*)
        `)
        .eq('is_featured', true)
        .eq('status', 'upcoming')
        .order('total_prize_pool', { ascending: false })
        .limit(4);

      if (contests) {
        setFeaturedContests(contests);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                <Trophy className="w-12 h-12 text-cyan-500" />
                <h1 className="text-6xl font-bold">FRAG11</h1>
              </div>
              <div className="text-cyan-400 text-sm tracking-[0.3em] mt-2">FANTASY IPL 2026</div>
            </div>
            
            <p className="text-cyan-100/70 text-xl max-w-2xl mx-auto">
              Build your ultimate cricket fantasy team. Compete for glory and massive prizes!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-8">
              <CyberCard variant="cyan" glass>
                <CyberCardContent className="text-center py-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-100">₹10Cr+</div>
                  <div className="text-xs text-cyan-100/60">Total Prizes</div>
                </CyberCardContent>
              </CyberCard>

              <CyberCard variant="purple" glass>
                <CyberCardContent className="text-center py-4">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-100">50K+</div>
                  <div className="text-xs text-cyan-100/60">Active Players</div>
                </CyberCardContent>
              </CyberCard>

              <CyberCard variant="pink" glass>
                <CyberCardContent className="text-center py-4">
                  <Trophy className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-100">1000+</div>
                  <div className="text-xs text-cyan-100/60">Contests</div>
                </CyberCardContent>
              </CyberCard>

              <CyberCard variant="gold" glass>
                <CyberCardContent className="text-center py-4">
                  <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-cyan-100">{liveMatches.length}</div>
                  <div className="text-xs text-cyan-100/60">Live Now</div>
                </CyberCardContent>
              </CyberCard>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Live Matches
                </h2>
              </div>
              <Link href="/frag11/matches?status=live">
                <CyberButton variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </CyberButton>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} showLiveBadge />
              ))}
            </div>
          </section>
        )}

        {/* Upcoming Matches */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Upcoming Matches
            </h2>
            <Link href="/frag11/matches">
              <CyberButton variant="ghost" size="sm">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </CyberButton>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMatches.slice(0, 6).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        {/* Featured Contests */}
        {featuredContests.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Featured Contests
              </h2>
              <Link href="/frag11/contests">
                <CyberButton variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </CyberButton>
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {featuredContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </section>
        )}

        {/* How to Play */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
            How to Play
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <CyberCard variant="cyan" glow hover>
              <CyberCardContent className="text-center p-8">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-cyan-400">1</span>
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">Select Match</h3>
                <p className="text-cyan-100/60">
                  Choose an upcoming IPL match and pick 11 players within 100 credits
                </p>
              </CyberCardContent>
            </CyberCard>

            <CyberCard variant="purple" glow hover>
              <CyberCardContent className="text-center p-8">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">Create Team</h3>
                <p className="text-cyan-100/60">
                  Build your fantasy team and select captain (2x) & vice-captain (1.5x)
                </p>
              </CyberCardContent>
            </CyberCard>

            <CyberCard variant="pink" glow hover>
              <CyberCardContent className="text-center p-8">
                <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-pink-400">3</span>
                </div>
                <h3 className="text-xl font-bold text-cyan-100 mb-2">Join Contests</h3>
                <p className="text-cyan-100/60">
                  Enter contests, track live scores, and win amazing prizes!
                </p>
              </CyberCardContent>
            </CyberCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16">
          <CyberCard variant="default" glass className="max-w-3xl mx-auto">
            <CyberCardContent className="p-12">
              <Trophy className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-cyan-100 mb-4">
                Ready to Dominate?
              </h2>
              <p className="text-cyan-100/70 mb-6">
                Join thousands of cricket fans and start winning today!
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/frag11/matches">
                  <CyberButton variant="glow" size="lg">
                    <Zap className="w-5 h-5 mr-2" />
                    Create Your Team
                  </CyberButton>
                </Link>
                <Link href="/frag11/contests">
                  <CyberButton variant="secondary" size="lg">
                    Browse Contests
                  </CyberButton>
                </Link>
              </div>
            </CyberCardContent>
          </CyberCard>
        </section>
      </div>
    </div>
  );
}
