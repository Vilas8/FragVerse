'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Users, Trophy, TrendingUp, Save, ArrowLeft, Filter, Search } from 'lucide-react';
import { CyberCard, CyberCardHeader, CyberCardTitle, CyberCardContent } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { CyberInput, CyberSelect } from '@/components/ui/cyber-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IPLPlayer, IPLMatch, UserTeam, PlayerRole, SortOption } from '@/types/frag11';
import { PlayerCard } from '@/components/frag11/PlayerCard';
import { TeamPreview } from '@/components/frag11/TeamPreview';
import { validateTeam } from '@/lib/frag11/teamValidation';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

function CreateTeamContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const matchId = searchParams.get('match');

  const [match, setMatch] = useState<IPLMatch | null>(null);
  const [allPlayers, setAllPlayers] = useState<IPLPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<IPLPlayer[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<IPLPlayer[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [viceCaptainId, setViceCaptainId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  
  const [roleFilter, setRoleFilter] = useState<PlayerRole | 'ALL'>('ALL');
  const [teamFilter, setTeamFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('points');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (matchId) {
      loadMatchAndPlayers();
    }
  }, [matchId]);

  useEffect(() => {
    filterPlayers();
  }, [allPlayers, roleFilter, teamFilter, searchQuery, sortBy]);

  const loadMatchAndPlayers = async () => {
    const supabase = createClient();
    
    try {
      // Load match details
      const { data: matchData } = await supabase
        .from('frag11_matches')
        .select(`
          *,
          team1:frag11_teams!team1_id(*),
          team2:frag11_teams!team2_id(*)
        `)
        .eq('id', matchId)
        .single();

      if (matchData) {
        setMatch(matchData);
        
        // Load players from both teams
        const { data: playersData } = await supabase
          .from('frag11_players')
          .select(`
            *,
            team:frag11_teams(*)
          `)
          .in('team_id', [matchData.team1_id, matchData.team2_id])
          .order('credits', { ascending: false });

        if (playersData) {
          setAllPlayers(playersData);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load match data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = () => {
    let filtered = [...allPlayers];

    // Role filter
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(p => p.role === roleFilter);
    }

    // Team filter
    if (teamFilter !== 'ALL') {
      filtered = filtered.filter(p => p.team_id === teamFilter);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'credits':
          return b.credits - a.credits;
        case 'points':
          return b.average_points - a.average_points;
        case 'selected_by':
          return b.selected_by - a.selected_by;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredPlayers(filtered);
  };

  const handlePlayerToggle = (player: IPLPlayer) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    
    if (isSelected) {
      setSelectedPlayers(selectedPlayers.filter(p => p.id !== player.id));
      if (captainId === player.id) setCaptainId(null);
      if (viceCaptainId === player.id) setViceCaptainId(null);
    } else {
      if (selectedPlayers.length >= 11) {
        toast({
          title: 'Team Full',
          description: 'You can only select 11 players',
          variant: 'destructive',
        });
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSaveTeam = async () => {
    if (!matchId) return;

    const validation = validateTeam(selectedPlayers, captainId, viceCaptainId);
    if (!validation.isValid) {
      toast({
        title: 'Invalid Team',
        description: validation.errors[0],
        variant: 'destructive',
      });
      return;
    }

    if (!teamName.trim()) {
      toast({
        title: 'Team Name Required',
        description: 'Please enter a team name',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Group players by role
      const wicketKeepers = selectedPlayers.filter(p => p.role === 'WK').map(p => p.id);
      const batters = selectedPlayers.filter(p => p.role === 'BAT').map(p => p.id);
      const allRounders = selectedPlayers.filter(p => p.role === 'AR').map(p => p.id);
      const bowlers = selectedPlayers.filter(p => p.role === 'BOWL').map(p => p.id);

      const totalCredits = selectedPlayers.reduce((sum, p) => sum + p.credits, 0);

      const { data, error } = await supabase
        .from('frag11_user_teams')
        .insert({
          user_id: user.id,
          match_id: matchId,
          team_name: teamName,
          wicket_keepers: wicketKeepers,
          batters: batters,
          all_rounders: allRounders,
          bowlers: bowlers,
          captain_id: captainId!,
          vice_captain_id: viceCaptainId!,
          total_credits_used: totalCredits,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Your team has been created',
      });

      router.push(`/frag11/my-teams/${data.id}`);
    } catch (error) {
      console.error('Error saving team:', error);
      toast({
        title: 'Error',
        description: 'Failed to save team',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const totalCreditsUsed = selectedPlayers.reduce((sum, p) => sum + p.credits, 0);
  const creditsRemaining = 100 - totalCreditsUsed;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400 text-xl">Match not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <CyberButton
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </CyberButton>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Create Your Team
              </h1>
              <p className="text-cyan-100/60">
                {match.team1?.short_name} vs {match.team2?.short_name}
              </p>
            </div>
            
            <CyberCard variant="cyan" glass>
              <CyberCardContent className="p-4 text-center">
                <div className="text-sm text-cyan-100/60">Credits Remaining</div>
                <div className={`text-3xl font-bold ${
                  creditsRemaining < 0 ? 'text-red-400' : 'text-cyan-100'
                }`}>
                  {creditsRemaining.toFixed(1)}
                </div>
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Player Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <CyberCard variant="default">
              <CyberCardContent className="p-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <CyberInput
                    placeholder="Search players..."
                    icon={Search}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <CyberSelect
                    icon={Filter}
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as PlayerRole | 'ALL')}
                  >
                    <option value="ALL">All Roles</option>
                    <option value="WK">Wicket Keeper</option>
                    <option value="BAT">Batter</option>
                    <option value="AR">All-Rounder</option>
                    <option value="BOWL">Bowler</option>
                  </CyberSelect>

                  <CyberSelect
                    value={teamFilter}
                    onChange={(e) => setTeamFilter(e.target.value)}
                  >
                    <option value="ALL">All Teams</option>
                    <option value={match.team1_id}>{match.team1?.short_name}</option>
                    <option value={match.team2_id}>{match.team2?.short_name}</option>
                  </CyberSelect>

                  <CyberSelect
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                  >
                    <option value="points">Sort by Points</option>
                    <option value="credits">Sort by Credits</option>
                    <option value="selected_by">Sort by Selection %</option>
                    <option value="name">Sort by Name</option>
                  </CyberSelect>
                </div>
              </CyberCardContent>
            </CyberCard>

            {/* Players by Role */}
            <Tabs defaultValue="WK" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-900/50">
                <TabsTrigger value="WK">WK</TabsTrigger>
                <TabsTrigger value="BAT">BAT</TabsTrigger>
                <TabsTrigger value="AR">AR</TabsTrigger>
                <TabsTrigger value="BOWL">BOWL</TabsTrigger>
              </TabsList>
              
              {(['WK', 'BAT', 'AR', 'BOWL'] as PlayerRole[]).map(role => (
                <TabsContent key={role} value={role} className="space-y-3">
                  {filteredPlayers
                    .filter(p => p.role === role)
                    .map(player => (
                      <PlayerCard
                        key={player.id}
                        player={player}
                        isSelected={selectedPlayers.some(p => p.id === player.id)}
                        isCaptain={captainId === player.id}
                        isViceCaptain={viceCaptainId === player.id}
                        onToggle={handlePlayerToggle}
                        onSetCaptain={setCaptainId}
                        onSetViceCaptain={setViceCaptainId}
                        disabled={selectedPlayers.length >= 11 && !selectedPlayers.some(p => p.id === player.id)}
                      />
                    ))
                  }
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Team Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <CyberCard variant="purple" glow>
                <CyberCardHeader>
                  <CyberCardTitle>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Your Team ({selectedPlayers.length}/11)
                    </div>
                  </CyberCardTitle>
                </CyberCardHeader>
                <CyberCardContent className="space-y-4">
                  <CyberInput
                    placeholder="Team Name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                  
                  <TeamPreview
                    players={selectedPlayers}
                    captainId={captainId}
                    viceCaptainId={viceCaptainId}
                    onRemovePlayer={handlePlayerToggle}
                  />

                  <CyberButton
                    variant="glow"
                    fullWidth
                    onClick={handleSaveTeam}
                    disabled={saving || selectedPlayers.length !== 11 || !captainId || !viceCaptainId}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Team'}
                  </CyberButton>
                </CyberCardContent>
              </CyberCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateTeamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="text-cyan-400 text-xl">Loading...</div></div>}>
      <CreateTeamContent />
    </Suspense>
  );
}
