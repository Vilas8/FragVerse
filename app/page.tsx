import { getAuthUser } from '@/lib/actions';
import HeroSection from '@/components/landing/hero-section';
import NextMatches from '@/components/landing/next-matches';
import FeaturesSection from '@/components/landing/features-section';
import PopularTournaments from '@/components/landing/popular-tournaments';
import { redirect } from 'next/navigation';

export default async function Index() {
  const user = await getAuthUser();
  
  if (user) {
    redirect('/home');
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <HeroSection />
      <FeaturesSection />
      <PopularTournaments />
      <NextMatches />
    </div>
  );
}
