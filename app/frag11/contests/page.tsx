'use client';

import { useState, useEffect } from 'react';
import { Trophy, Filter, Search } from 'lucide-react';
import { CyberCard, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberInput, CyberSelect } from '@/components/ui/cyber-input';
import { Contest, ContestType } from '@/types/frag11';
import { ContestCard } from '@/components/frag11/ContestCard';
import { createClient } from '@/utils/supabase/client';

export default function ContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [typeFilter, setTypeFilter] = useState<ContestType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  useEffect(() => {
    filterContests();
  }, [contests, typeFilter, searchQuery]);

  const loadContests = async () => {
    const supabase = createClient();
    
    try {
      const { data } = await supabase
        .from('frag11_contests')
        .select(`
          *,
          match:frag11_matches(
            *,
            team1:frag11_teams!team1_id(*),
            team2:frag11_teams!team2_id(*)
          )
        `)
        .eq('status', 'upcoming')
        .order('total_prize_pool', { ascending: false });

      if (data) {
        setContests(data);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterContests = () => {
    let filtered = [...contests];

    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(c => c.type === typeFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContests(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-cyan-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Contests
            </h1>
          </div>
          <p className="text-cyan-100/70 text-lg">
            Join contests and compete for massive prizes!
          </p>
        </div>

        {/* Filters */}
        <CyberCard variant="default" className="mb-8">
          <CyberCardContent className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <CyberInput
                placeholder="Search contests..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <CyberSelect
                icon={Filter}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as ContestType | 'ALL')}
              >
                <option value="ALL">All Contests</option>
                <option value="free">Free Contests</option>
                <option value="paid">Paid Contests</option>
                <option value="head_to_head">Head to Head</option>
                <option value="mega">Mega Contests</option>
              </CyberSelect>
            </div>
          </CyberCardContent>
        </CyberCard>

        {/* Contest Categories */}
        {loading ? (
          <div className="text-center text-cyan-400 py-12">Loading contests...</div>
        ) : (
          <div className="space-y-12">
            {/* Featured Contests */}
            {filteredContests.filter(c => c.is_featured).length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-cyan-100 mb-6">Featured Contests</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredContests
                    .filter(c => c.is_featured)
                    .map(contest => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
              </section>
            )}

            {/* Guaranteed Contests */}
            {filteredContests.filter(c => c.is_guaranteed && !c.is_featured).length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-cyan-100 mb-6">Guaranteed Prizes</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredContests
                    .filter(c => c.is_guaranteed && !c.is_featured)
                    .map(contest => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
              </section>
            )}

            {/* All Other Contests */}
            {filteredContests.filter(c => !c.is_featured && !c.is_guaranteed).length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-cyan-100 mb-6">All Contests</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredContests
                    .filter(c => !c.is_featured && !c.is_guaranteed)
                    .map(contest => (
                      <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
              </section>
            )}

            {filteredContests.length === 0 && (
              <div className="text-center text-cyan-100/60 py-12">
                <Trophy className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
                <p>No contests found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
