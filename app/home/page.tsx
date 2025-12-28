import {
  BrowseTournamentsButton,
  MatchesSection,
  TournamentsSection,
} from '@/components/ui/landing-pages';
import {
  getMostPopularTournaments,
  getUserCurrentMatches,
  getAuthUser,
} from '@/lib/actions';
import { Swords, Trophy, Zap, Users, Shield, Target } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const { matches } = await getUserCurrentMatches();
  const { popularTournaments } = await getMostPopularTournaments();
  const user = await getAuthUser();

  return (
    <main className="w-full relative overflow-hidden">
      {/* Animated Background - Dark theme */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative w-full py-32 text-center">
        {/* Glowing orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Title with glow effect */}
          <div className="mb-6 inline-block">
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              FRAGVERSE
            </h1>
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </div>
          
          <p className="text-2xl md:text-3xl mb-4 font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
            THE ULTIMATE TOURNAMENT ARENA
          </p>
          
          <p className="text-lg md:text-xl mb-12 text-cyan-100/80 max-w-2xl mx-auto">
            Compete in electrifying tournaments. Clash with elite players. Claim your glory.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <a 
              href="#tournaments"
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                <Swords className="w-5 h-5" />
                JOIN BATTLE
              </span>
            </a>
            
            <a 
              href="#popular"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm border-2 border-purple-500/50 rounded-lg font-bold text-lg text-white hover:bg-purple-500/20 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <span className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                EXPLORE TOURNAMENTS
              </span>
            </a>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group relative p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-500/20 rounded-lg mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">1000+</h3>
                <p className="text-cyan-200/70">Active Tournaments</p>
              </div>
            </div>

            <div className="group relative p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-xl border border-purple-500/20 hover:border-purple-400/50 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mb-4 mx-auto">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">50K+</h3>
                <p className="text-purple-200/70">Elite Players</p>
              </div>
            </div>

            <div className="group relative p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10 backdrop-blur-sm rounded-xl border border-pink-500/20 hover:border-pink-400/50 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/10 group-hover:to-rose-500/10 rounded-xl transition-all" />
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-lg mb-4 mx-auto">
                  <Trophy className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">$2M+</h3>
                <p className="text-pink-200/70">Prize Pool</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-20 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              DOMINATE THE ARENA
            </h2>
            <p className="text-xl text-cyan-100/70">Everything you need to become a champion</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Swords,
                title: 'Epic Tournaments',
                description: 'Join single or double elimination brackets with customizable rules',
                color: 'cyan'
              },
              {
                icon: Shield,
                title: 'Team Battles',
                description: 'Form squads and compete in coordinated team tournaments',
                color: 'purple'
              },
              {
                icon: Target,
                title: 'Skill Matchmaking',
                description: 'Face opponents of your level with advanced Swiss-system pairing',
                color: 'pink'
              },
              {
                icon: Trophy,
                title: 'Real Prizes',
                description: 'Compete for cash prizes, exclusive rewards, and glory',
                color: 'blue'
              },
              {
                icon: Zap,
                title: 'Live Streaming',
                description: 'Broadcast your matches and build your fanbase',
                color: 'purple'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Connect with players, chat, and build your reputation',
                color: 'cyan'
              },
            ].map((feature, i) => (
              <div 
                key={i}
                className="group relative p-8 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-xl mb-6 group-hover:bg-cyan-500/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-cyan-100/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section id="tournaments" className="relative py-20">
        <MatchesSection title="Next Matches" matches={matches} direction="t" />
      </section>

      {/* Popular Tournaments Section */}
      <section id="popular" className="relative py-20 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent">
        <TournamentsSection
          title="Popular Tournaments"
          tournaments={popularTournaments}
          button={<BrowseTournamentsButton />}
        />
      </section>

      {/* CTA Section - Only show if user is NOT logged in */}
      {!user && (
        <section className="relative w-full py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-3xl" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              READY TO COMPETE?
            </h2>
            <p className="text-xl md:text-2xl text-cyan-100/80 mb-12 max-w-2xl mx-auto">
              Join thousands of players in the ultimate tournament experience
            </p>
            <Link
              href="/sign-up"
              className="inline-block group relative px-12 py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-xl font-bold text-xl text-white overflow-hidden transition-all hover:scale-110 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">START YOUR JOURNEY</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
