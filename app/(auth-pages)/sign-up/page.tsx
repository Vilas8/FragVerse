import { signUpAction } from '@/lib/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { GoogleSignUpButton } from '@/components/auth/google-signup-button';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberCard } from '@/components/ui/cyber-card';
import { Mail, Lock, UserPlus, User, Sparkles } from 'lucide-react';

export default function Signup({ searchParams }: { searchParams: Message }) {
  if ('message' in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_50%)]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main Card */}
      <CyberCard variant="purple" glow className="relative z-10 w-full max-w-md mx-4 mt-[-10vh]">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-2xl">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SIGN UP
            </h1>
            <p className="text-sm text-purple-100/60">
              Already have an account?{' '}
              <Link
                className="font-bold text-purple-400 hover:text-purple-300 transition-colors"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            <CyberInput
              id="username"
              name="username"
              type="text"
              placeholder="Choose your warrior name"
              label="Username"
              icon={User}
              minLength={3}
              maxLength={20}
              required
            />

            <CyberInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email"
              icon={Mail}
              required
            />

            <CyberInput
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              label="Password"
              icon={Lock}
              minLength={6}
              required
            />

            <SubmitButton formAction={signUpAction} pendingText="Creating account...">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Account
              </div>
            </SubmitButton>
            
            <FormMessage message={searchParams} />
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator className="bg-purple-500/20" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-purple-300 text-sm font-semibold">
              OR
            </span>
          </div>

          {/* Google Sign Up */}
          <GoogleSignUpButton />
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all pointer-events-none" />
      </CyberCard>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-purple-400 rounded-full top-1/4 right-1/4 animate-float" />
        <div className="absolute w-1 h-1 bg-pink-400 rounded-full top-3/4 left-3/4 animate-float delay-300" />
        <div className="absolute w-1.5 h-1.5 bg-cyan-400 rounded-full top-1/2 left-1/4 animate-float delay-500" />
      </div>
    </div>
  );
}
