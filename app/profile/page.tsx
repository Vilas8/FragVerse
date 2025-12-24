import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle, CyberBadge } from '@/components/ui/cyber-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Progress from '@/components/ui/progress';
import { Trophy, Swords, Target, Award, Zap, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Avatar2 from '@/app/profile/UploadImage';
import {
  getAuthUser,
  getCurrentUserMatchResults,
  getProfileComments,
  getPublicUserData,
  getUserStatistics,
} from '@/lib/actions';
import { redirect } from 'next/navigation';
import EditableUsername from './Editname';
import { getAllUserCurrentTournaments } from '@/lib/actions';
import ProfileComments from '@/components/profile/comment-box';
import { CyberButton } from '@/components/ui/cyber-button';
import Link from 'next/link';
import { BioBox } from '@/components/profile/bio-box';

export default async function Profile() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/sign-in');
  }
  const userid = user?.id as string;
  const { data: publicUser } = await getPublicUserData(user.id);
  const { tournaments } = await getAllUserCurrentTournaments();
  const { comments } = await getProfileComments(user.id);
  const { matchesWithUsernames: matches } = await getCurrentUserMatchResults();
  const { data: statistics } = await getUserStatistics(user.id);

  const winRatio = statistics
    ? Math.round(
        (statistics.matchesWon /
          (statistics.matchesWon + statistics.matchesLost || 1)) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto p-4 space-y-8">
      {/* Hero Profile Section */}
      <CyberCard variant="cyan" glow className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with glow */}
            <div className="relative group">
              <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <Avatar2
                initialUrl={publicUser.avatar_url}
                size={150}
                username={publicUser.username}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 space-y-3">
              <EditableUsername username={publicUser.username} userid={userid} />
              <p className="text-cyan-100/60 text-sm">
                {user ? user.email : 'guest@example.com'}
              </p>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-3 mt-4">
                <CyberBadge variant="cyan">
                  <Trophy className="w-3 h-3 mr-1" />
                  {statistics?.tournamentCount || 0} Tournaments
                </CyberBadge>
                <CyberBadge variant="green">
                  <Swords className="w-3 h-3 mr-1" />
                  {statistics?.matchesWon || 0} Wins
                </CyberBadge>
                <CyberBadge variant="gold">
                  <Award className="w-3 h-3 mr-1" />
                  {statistics?.wonCount || 0} Championships
                </CyberBadge>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full md:w-auto md:max-w-md">
              <BioBox user={publicUser} />
            </div>
          </div>
        </div>
      </CyberCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="current">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 backdrop-blur-sm border border-cyan-500/20">
              <TabsTrigger 
                value="current"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Current Tournaments
              </TabsTrigger>
              <TabsTrigger 
                value="results"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600"
              >
                <Swords className="w-4 h-4 mr-2" />
                Match Results
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[600px] mt-4">
              <TabsContent value="current" className="space-y-4">
                {tournaments && tournaments.length > 0 ? (
                  tournaments.map((tournament) => (
                    <CyberCard key={tournament.id} variant="cyan" hover>
                      <CyberCardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CyberCardTitle className="text-lg mb-2">
                              {tournament.name}
                            </CyberCardTitle>
                            <p className="text-cyan-100/60 text-sm line-clamp-2 mb-3">
                              {tournament.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-cyan-300">
                                <strong>{tournament.player_count}</strong> Players
                              </span>
                              {tournament.finished ? (
                                <CyberBadge variant="gold">Finished</CyberBadge>
                              ) : tournament.started ? (
                                <CyberBadge variant="cyan">Live</CyberBadge>
                              ) : (
                                <CyberBadge variant="purple">Recruiting</CyberBadge>
                              )}
                            </div>
                          </div>
                          <Link href={`/tournaments/${tournament.id}`}>
                            <CyberButton variant="secondary" size="sm">
                              View
                            </CyberButton>
                          </Link>
                        </div>
                      </CyberCardHeader>
                    </CyberCard>
                  ))
                ) : (
                  <CyberCard variant="default">
                    <CyberCardContent className="text-center py-12">
                      <Trophy className="w-12 h-12 text-cyan-500/30 mx-auto mb-3" />
                      <p className="text-cyan-100/60">No active tournaments</p>
                    </CyberCardContent>
                  </CyberCard>
                )}
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                {matches && matches.length > 0 ? (
                  matches.map((match) => (
                    <CyberCard key={match.id} variant="purple" hover>
                      <CyberCardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CyberCardTitle className="text-lg mb-2">
                              {match.tournaments.name} - Round {match.round}
                            </CyberCardTitle>
                            <div className="flex items-center gap-2 mb-2 text-cyan-100/80">
                              <span>{match.homePlayerUsername}</span>
                              <Swords className="w-4 h-4 text-purple-400" />
                              <span>{match.awayPlayerUsername}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-cyan-300">Winner:</span>
                              <CyberBadge variant="gold">
                                <Trophy className="w-3 h-3 mr-1" />
                                {match.winnerId === match.homePlayerId
                                  ? match.homePlayerUsername
                                  : match.awayPlayerUsername}
                              </CyberBadge>
                            </div>
                          </div>
                          <Link href={`/tournaments/${match.tournament_id}`}>
                            <CyberButton variant="secondary" size="sm">
                              View
                            </CyberButton>
                          </Link>
                        </div>
                      </CyberCardHeader>
                    </CyberCard>
                  ))
                ) : (
                  <CyberCard variant="default">
                    <CyberCardContent className="text-center py-12">
                      <Swords className="w-12 h-12 text-purple-500/30 mx-auto mb-3" />
                      <p className="text-cyan-100/60">No match results yet</p>
                    </CyberCardContent>
                  </CyberCard>
                )}
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statistics Card */}
          <CyberCard variant="purple" glow>
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Battle Statistics
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent>
              {statistics && (
                <div className="space-y-6">
                  {/* Win Ratio */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Match Win Ratio
                      </span>
                      <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        {winRatio}%
                      </span>
                    </div>
                    <Progress value={winRatio} className="h-3" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300">Tournaments</span>
                      </div>
                      <p className="text-2xl font-black text-white">
                        {statistics.tournamentCount}
                      </p>
                    </div>

                    <div className="p-3 bg-gold-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Won</span>
                      </div>
                      <p className="text-2xl font-black text-white">
                        {statistics.wonCount}
                      </p>
                    </div>

                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-300">Matches Won</span>
                      </div>
                      <p className="text-2xl font-black text-white">
                        {statistics.matchesWon}
                      </p>
                    </div>

                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Swords className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-red-300">Matches Lost</span>
                      </div>
                      <p className="text-2xl font-black text-white">
                        {statistics.matchesLost}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CyberCardContent>
          </CyberCard>

          {/* Comments */}
          <ProfileComments
            user={user}
            profile_user_id={user.id}
            comments={comments}
          />
        </div>
      </div>
    </div>
  );
}
