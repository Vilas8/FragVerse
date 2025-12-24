'use client';

import { useState } from 'react';
import { CyberInput, CyberSelect } from '@/components/ui/cyber-input';
import { CyberButton } from '@/components/ui/cyber-button';
import { Search, Trophy, Filter, TrendingUp } from 'lucide-react';
import { TournamentWithStatus } from '@/app/tournaments/page';
import TournamentCard from '../tournament/card';

export default function TournmamentsBrowser({
  tournaments,
}: {
  tournaments: TournamentWithStatus[];
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [currentPage, setCurrentPage] = useState(1);
  const tournamentsPerPage = 9;

  const filteredTournaments = tournaments
    .filter(
      (tournament) =>
        (statusFilter === 'all' || tournament.status === statusFilter) &&
        (tournament.name.toLowerCase().includes(search.toLowerCase()) ||
          tournament.description.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
        );
      } else if (sortBy === 'popularity') {
        const viewCountA = a.analytics?.[0]?.view_count || 0;
        const viewCountB = b.analytics?.[0]?.view_count || 0;
        return viewCountB - viewCountA;
      }
      return 0;
    });

  const indexOfLastTournament = currentPage * tournamentsPerPage;
  const indexOfFirstTournament = indexOfLastTournament - tournamentsPerPage;
  const currentTournaments = filteredTournaments.slice(
    indexOfFirstTournament,
    indexOfLastTournament
  );

  const totalPages = Math.ceil(filteredTournaments.length / tournamentsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 animate-pulse" />
            <Trophy className="h-12 w-12 text-cyan-400 relative" />
          </div>
        </div>
        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
          BROWSE TOURNAMENTS
        </h1>
        <p className="text-cyan-100/60 text-lg">Discover and join competitive gaming tournaments</p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="lg:col-span-1">
            <CyberInput
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={Search}
            />
          </div>

          {/* Status Filter */}
          <div>
            <CyberSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              icon={Filter}
              label=""
            >
              <option value="all">All Tournaments</option>
              <option value="waiting_for_players">Recruiting</option>
              <option value="ongoing">Live Now</option>
              <option value="ended">Finished</option>
            </CyberSelect>
          </div>

          {/* Sort */}
          <div>
            <CyberSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              icon={TrendingUp}
              label=""
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest First</option>
            </CyberSelect>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm text-cyan-300">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="font-semibold">
            {filteredTournaments.length} {filteredTournaments.length === 1 ? 'tournament' : 'tournaments'} found
          </span>
        </div>
      </div>

      {/* Tournament Grid */}
      {currentTournaments.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {currentTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </CyberButton>
              
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <CyberButton
                      key={i}
                      variant={currentPage === pageNum ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => paginate(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </CyberButton>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={i} className="text-cyan-400 px-2">...</span>
                  );
                }
                return null;
              })}
              
              <CyberButton
                variant="ghost"
                size="sm"
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </CyberButton>
            </div>
          )}
        </>
      ) : (
        // Empty State
        <div className="text-center py-20">
          <div className="mb-6">
            <Trophy className="h-20 w-20 text-cyan-500/30 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No tournaments found</h3>
          <p className="text-cyan-100/60">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
