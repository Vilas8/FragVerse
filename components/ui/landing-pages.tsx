import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, LogIn, Frown, Swords, Trophy } from 'lucide-react';
import { Match, Tournament } from '@/app/types/types';
import TournamentCard from '@/components/tournament/card';
import { Card, CardContent } from '@/components/ui/card';
import MatchCard from '@/components/match-card';

const BrowseTournamentsButton = () => (
  <Link href="/tournaments">
    <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50 rounded-xl font-bold text-lg text-white hover:bg-purple-500/30 hover:border-purple-400 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
      <span className="flex items-center gap-2">
        <Search className="w-5 h-5" />
        Browse All Tournaments
      </span>
    </button>
  </Link>
);

const SignUpButton = () => (
  <Link href="/sign-up">
    <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg text-white overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="relative flex items-center gap-2">
        <LogIn className="w-5 h-5" />
        Join Now
      </span>
    </button>
  </Link>
);

const HowItWorksSection = () => (
  <section className="relative py-20">
    <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-transparent to-cyan-950/20" />
    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          HOW IT WORKS
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group relative p-8 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:scale-105 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              1
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Sign Up</h3>
            <p className="text-cyan-100/70">
              Create your account and set up your player profile.
            </p>
          </div>
        </div>
        
        <div className="group relative p-8 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-purple-500/20 hover:border-purple-400/50 transition-all hover:scale-105 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
          <div className="relative">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)]">
              2
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Create or Join</h3>
            <p className="text-purple-100/70">
              Start your own tournament or browse and join existing ones.
            </p>
          </div>
        </div>
        
        <div className="group relative p-8 bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm rounded-2xl border border-pink-500/20 hover:border-pink-400/50 transition-all hover:scale-105 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
          <div className="relative">
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 font-bold text-2xl shadow-[0_0_20px_rgba(236,72,153,0.5)]">
              3
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Compete</h3>
            <p className="text-pink-100/70">
              Play matches, track results, and climb the rankings.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

interface TournamentsSectionProps {
  title: string;
  tournaments?: Tournament[] | null;
  direction?: string;
  button?: React.ReactNode;
}

const TournamentsSection: React.FC<TournamentsSectionProps> = ({
  title,
  tournaments,
  direction = 'b',
  button,
}) => (
  <section className="relative py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {title}
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tournaments && tournaments.length > 0 ? (
          tournaments.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center gap-8">
            <div className="group relative p-12 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl border border-purple-500/30 hover:border-purple-400/50 transition-all max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
              <div className="relative flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-500/20 rounded-full mb-6">
                  <Trophy className="w-12 h-12 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  No Tournaments Available
                </h3>
                <p className="text-lg text-purple-100/70 text-center max-w-md mb-6">
                  Unfortunately, there are no tournaments available at this time. Be the first to create one!
                </p>
                <Link href="/tournaments/create">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg font-bold text-white hover:scale-105 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    Create Tournament
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-12">{button}</div>
    </div>
  </section>
);

interface MatchesSectionProps {
  title: string;
  matches?: Match[] | null;
  direction?: string;
  button?: React.ReactNode;
}

const MatchesSection: React.FC<MatchesSectionProps> = ({
  title,
  matches,
  direction = 'b',
  button,
}) => (
  <section className="relative py-20">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
          {title}
        </h2>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {matches && matches.length > 0 ? (
          matches.map((match) => <MatchCard key={match.id} match={match} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center gap-8">
            <div className="group relative p-12 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all" />
              <div className="relative flex flex-col items-center justify-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-cyan-500/20 rounded-full mb-6">
                  <Swords className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  No Matches Found
                </h3>
                <p className="text-lg text-cyan-100/70 text-center max-w-md mb-6">
                  Unfortunately, you have no upcoming matches. Please check back later or create your own tournament!
                </p>
                <Link href="/tournaments">
                  <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-bold text-white hover:scale-105 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    Browse Tournaments
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-center mt-12">{button}</div>
    </div>
  </section>
);

export {
  BrowseTournamentsButton,
  HowItWorksSection,
  TournamentsSection,
  MatchesSection,
  SignUpButton,
};
