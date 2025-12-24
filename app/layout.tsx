import HeaderAuth from '@/components/header/header-auth';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { robotoBlack } from '@/components/ui/fonts';
import { ThemeProvider } from 'next-themes';
import Link from 'next/link';
import './globals.css';
import TournamentFormModal from '@/components/tournament-form-modal';
import { Toaster } from '@/components/ui/toaster';
import TournamentDropdownList from '@/components/header/tournament-dropdown-list';
import { Trophy, Zap } from 'lucide-react';
import { getAuthUser } from '@/lib/actions';
import { ChatProvider } from '../utils/context/ChatContext';
import { PrivateChat } from '@/components/private-chat';
import { Separator } from '@/components/ui/separator';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'FragVerse - E-Sports Tournament Platform',
  description: 'Create and manage competitive gaming tournaments with FragVerse - Your ultimate e-sports tournament platform',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  return (
    <html lang="en" className={robotoBlack.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ChatProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                {/* Header with theme-aware styling */}
                <header className="w-full sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 dark:border-cyan-500/20">
                  {/* Glow effect at top (dark theme only) */}
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent dark:block hidden" />
                  
                  <div className="mx-auto px-4">
                    <nav className="flex flex-col py-3 gap-3 md:flex-row md:items-center md:py-4">
                      <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                          href="/"
                          className="group flex items-center space-x-3 text-xl font-black transition-all hover:scale-105"
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity dark:block hidden" />
                            <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg shadow-lg">
                              <Trophy className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <span className="hidden md:inline bg-gradient-to-r from-cyan-500 to-purple-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-purple-400 dark:group-hover:from-cyan-300 dark:group-hover:to-purple-300 transition-all font-black">
                            FRAGVERSE
                          </span>
                        </Link>
                        <div className="md:hidden">
                          <HeaderAuth />
                        </div>
                      </div>
                      
                      <Separator className="sm:hidden bg-border dark:bg-cyan-500/20" />
                      
                      {/* Navigation Items */}
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:justify-start">
                        <TournamentDropdownList />
                        <TournamentFormModal user={user} />
                      </div>
                      
                      {/* Auth & Theme Section */}
                      <div className="hidden md:flex items-center gap-3 ml-auto">
                        <ThemeSwitcher />
                        <HeaderAuth />
                      </div>
                    </nav>
                  </div>
                  
                  {/* Glow effect at bottom (dark theme only) */}
                  <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent dark:block hidden" />
                </header>
                
                {/* Main Content */}
                <div className="w-full flex flex-col gap-20">{children}</div>
                
                {user && <PrivateChat user={user} />}

                {/* Footer */}
                <footer className="w-full flex items-center justify-center border-t border-border dark:border-cyan-500/20 mx-auto text-center text-xs gap-8 py-5 mt-auto bg-gradient-to-t from-background to-transparent">
                  <div className="flex items-center gap-3 text-muted-foreground dark:text-cyan-100/50">
                    <Zap className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                    <span className="font-semibold">Powered by FragVerse</span>
                  </div>
                  <div className="md:hidden">
                    <ThemeSwitcher />
                  </div>
                </footer>
              </div>
            </main>
            <Toaster />
          </ChatProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
