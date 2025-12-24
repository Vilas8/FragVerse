import { getPublicUserData, signOutAction } from '@/lib/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { createClient } from '@/utils/supabase/server';
import { LogIn, LogOut, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NotificationComponent from './notifications-server';
import RecentChatsList from './recentChats';
import { CyberButton } from '@/components/ui/cyber-button';

export default async function AuthButton() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: publicUser } = await getPublicUserData(user?.id);

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={'default'}
              className="font-normal pointer-events-none bg-red-500/20 text-red-300 border-red-500/50"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Link href="/sign-in">
              <CyberButton
                variant="ghost"
                size="sm"
                icon={LogIn}
                disabled
              >
                Sign in
              </CyberButton>
            </Link>
            <Link href="/sign-up">
              <CyberButton
                variant="primary"
                size="sm"
                icon={UserPlus}
                disabled
              >
                Sign up
              </CyberButton>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <RecentChatsList user={user} />
      <NotificationComponent user={user} />
      
      {/* Avatar with glow effect */}
      <Link href="/profile" className="group relative">
        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity" />
        <div className="relative ring-2 ring-cyan-500/30 group-hover:ring-cyan-400/50 rounded-full transition-all">
          <Avatar className="w-10 h-10">
            {publicUser?.avatar_url ? (
              <AvatarImage src={publicUser.avatar_url} alt={publicUser.username || ''} />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                {publicUser?.username?.charAt(0).toUpperCase() || "F"}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
      </Link>

      <form action={signOutAction}>
        <CyberButton
          type="submit"
          variant="secondary"
          size="sm"
          icon={LogOut}
        >
          Sign out
        </CyberButton>
      </form>
    </div>
  ) : (
    <div className="flex gap-3">
      <Link href="/sign-in">
        <CyberButton
          variant="ghost"
          size="sm"
          icon={LogIn}
        >
          Sign in
        </CyberButton>
      </Link>
      <Link href="/sign-up">
        <CyberButton
          variant="primary"
          size="sm"
          icon={UserPlus}
        >
          Sign up
        </CyberButton>
      </Link>
    </div>
  );
}
