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
  getAllUserCurrentTournaments,
} from '@/lib/actions';
import { redirect } from 'next/navigation';
import EditableUsername from './Editname';
import ProfileComments from '@/components/profile/comment-box';
import { CyberButton } from '@/components/ui/cyber-button';
import Link from 'next/link';
import { BioBox } from '@/components/profile/bio-box';
import { PublicUser } from '@/app/types/types';

export default async function Profile() {
  try {
    const user = await getAuthUser();

    if (!user) {
      redirect('/sign-in');
    }

    const userid = user?.id as string;

    // Fetch all data with error handling
    const [publicUserResult, tournamentsResult, commentsResult, matchesResult, statisticsResult] =
      await Promise.allSettled([
        getPublicUserData(user.id),
        getAllUserCurrentTournaments(),
        getProfileComments(user.id),
        getCurrentUserMatchResults(),
        getUserStatistics(user.id),
      ]);

    // Extract data with fallbacks
    const publicUserData =
      publicUserResult.status === 'fulfilled' ? publicUserResult.value.data : null;
    const tournaments =
      tournamentsResult.status === 'fulfilled' ? tournamentsResult.value.tournaments : [];
    const comments =
      commentsResult.status === 'fulfilled' ? commentsResult.value.comments : [];
    const matches =
      matchesResult.status === 'fulfilled'
        ? matchesResult.value.matchesWithUsernames
        : [];
    const statistics =
      statisticsResult.status === 'fulfilled' ? statisticsResult.value.data : null;

    // Create default publicUser object if data is missing - with all required PublicUser fields
    const publicUser: PublicUser =
      publicUserData && Object.keys(publicUserData).length > 0
        ? publicUserData
        : {
            id: user.id,
            username: user.email?.split('@')[0] || 'User',
            avatar_url: '',
            bio: '',
            tournaments_won_amount: 0,
            tournaments_participated_amount: 0,
            matches_won_amount: 0,
            matches_lost_amount: 0,
          };

    const winRatio = statistics
      ? Math.round(
          (statistics.matchesWon /
            (statistics.matchesWon + statistics.matchesLost || 1)) *
            100,
        )
      : 0;

    return (
      <div className="container mx-auto p-4 space-y-8">
        {/* Hero Profile Section */}
        <CyberCard
          variant="cyan"
          glow
          className="relative overflow-hidden bg-gradient-to-r from-sky-50 via-cyan-50 to-purple-50"
        >
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar with glow */}
              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <Avatar2
                  initialUrl={publicUser.avatar_url || ''}
                  size={150}
                  username={publicUser.username || 'User'}
                />
              </div>

              {/* User Info */}
              <div className="flex-1 space-y-3">
                <EditableUsername
                  username={publicUser.username || 'User'}
                  userid={userid}
                />
                <p className="text-slate-600 text-sm">
                  {user ? user.email : 'guest@example.com'}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <CyberBadge variant="cyan" className="text-slate-800">
                    <Trophy className="w-3 h-3 mr-1 text-sky-600" />
                    {statistics?.tournamentCount || 0} Tournaments
                  </CyberBadge>
                  <CyberBadge variant="green" className="text-slate-800">
                    <Swords className="w-3 h-3 mr-1 text-emerald-600" />
                    {statistics?.matchesWon || 0} Wins
                  </CyberBadge>
                  <CyberBadge variant="gold" className="text-slate-800">
                    <Award className="w-3 h-3 mr-1 text-amber-600" />
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
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 border border-slate-200">
                <TabsTrigger
                  value="current"
                  className="text-slate-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Current Tournaments
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="text-slate-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600"
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
                              <p className="text-slate-700 text-sm line-clamp-2 mb-3">
                                {tournament.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-600">
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
                        <Trophy className="w-12 h-12 text-cyan-500/60 mx-auto mb-3" />
                        <p className="text-slate-600">No active tournaments</p>
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
                                {match.tournaments?.name || 'Tournament'} - Round{' '}
                                {match.round}
                              </CyberCardTitle>
                              <div className="flex items-center gap-2 mb-2 text-slate-700">
                                <span>{match.homePlayerUsername || 'Player 1'}</span>
                                <Swords className="w-4 h-4 text-purple-500" />
                                <span>{match.awayPlayerUsername || 'Player 2'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600">Winner:</span>
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
                        <Swords className="w-12 h-12 text-purple-500/60 mx-auto mb-3" />
                        <p className="text-slate-600">No match results yet</p>
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
            <CyberCard
              variant="purple"
              glow
              className="bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200"
            >
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2 text-slate-900">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Battle Statistics
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent>
                {statistics ? (
                  <div className="space-y-6">
                    {/* Win Ratio */}
                    <div>
                      <div className="flex justify-between mb-3">
                        <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Target className="w-4 h-4 text-sky-600" />
                          Match Win Ratio
                        </span>
                        <span className="text-2xl font-black text-slate-900">
                          {winRatio}%
                        </span>
                      </div>
                      <Progress value={winRatio} className="h-3" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-cyan-500" />
                          <span className="text-xs text-slate-700">Tournaments</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          {statistics.tournamentCount || 0}
                        </p>
                      </div>

                      <div className="p-3 bg-amber-500/10 border border-amber-500/40 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-slate-700">Won</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          {statistics.wonCount || 0}
                        </p>
                      </div>

                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-slate-700">Matches Won</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          {statistics.matchesWon || 0}
                        </p>
                      </div>

                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Swords className="w-4 h-4 text-red-500" />
                          <span className="text-xs text-slate-700">Matches Lost</span>
                        </div>
                        <p className="text-2xl font-black text-slate-900">
                          {statistics.matchesLost || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-purple-300 mx-auto mb-3" />
                    <p className="text-slate-500">No statistics available yet</p>
                  </div>
                )}
              </CyberCardContent>
            </CyberCard>

            {/* Comments */}
            <ProfileComments
              user={user}
              profile_user_id={user.id}
              comments={comments || []}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Profile page error:', error);
    return (
      <div className="container mx-auto p-4">
        <CyberCard variant="default">
          <CyberCardContent className="text-center py-12">
            <p className="text-red-400 text-lg mb-2">Something went wrong</p>
            <p className="text-slate-600">
              Unable to load profile. Please try again later.
            </p>
            <p className="text-xs text-slate-500 mt-4">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </CyberCardContent>
        </CyberCard>
      </div>
    );
  }
}
