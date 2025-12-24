import { signInAction } from '@/lib/actions';
import { FormMessage, Message } from '@/components/form-message';
import { SubmitButton } from '@/components/submit-button';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { GoogleSignUpButton } from '@/components/auth/google-signup-button';
import { Separator } from '@/components/ui/separator';
import { CyberInput } from '@/components/ui/cyber-input';
import { CyberCard } from '@/components/ui/cyber-card';
import { Mail, Lock, LogIn, Zap } from 'lucide-react';

export default function Login({ searchParams }: { searchParams: Message }) {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      {/* Main Card */}
      <CyberCard variant="cyan" glow className="relative z-10 w-full max-w-md mx-4 mt-[-10vh]">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl">
                  <LogIn className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SIGN IN
            </h1>
            <p className="text-sm text-cyan-100/60">
              {"Don't have an account? "}
              <Link
                className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                href="/sign-up"
              >
                Sign up now
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <CyberInput
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              label="Email"
              icon={Mail}
              required
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
                  Password
                </Label>
                <Link
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-semibold"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <CyberInput
                id="password"
                type="password"
                name="password"
                placeholder="Your password"
                icon={Lock}
                required
              />
            </div>

            <SubmitButton pendingText="Signing In..." formAction={signInAction}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Sign in
              </div>
            </SubmitButton>
            
            <FormMessage message={searchParams} />
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <Separator className="bg-cyan-500/20" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-cyan-300 text-sm font-semibold">
              OR
            </span>
          </div>

          {/* Google Sign In */}
          <GoogleSignUpButton isLogin={true} />
        </div>

        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none" />
      </CyberCard>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-1/4 left-1/4 animate-float" />
        <div className="absolute w-1 h-1 bg-purple-400 rounded-full top-3/4 left-3/4 animate-float delay-300" />
        <div className="absolute w-1.5 h-1.5 bg-pink-400 rounded-full top-1/2 right-1/4 animate-float delay-500" />
      </div>
    </div>
  );
}
