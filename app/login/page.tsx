'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { motion } from 'motion/react';
import { Shirt, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    login(email);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] overflow-hidden">
            <img src="/assets/logo.png" alt="Mockyou Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight text-black">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-black/60">
            Sign in to your account to continue designing
          </p>
        </div>

        <div className="rounded-[32px] bg-gradient-to-br from-[#c92c5e]/10 via-white to-[#d13f6d]/5 p-8 shadow-xl border border-[#d13f6d]/20 sm:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-black/80">
                  Email address
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-black/40">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-2xl border border-black/10 bg-black/[0.02] py-3 pl-11 pr-4 text-black placeholder-black/30 transition-all focus:border-black focus:bg-white focus:ring-0 sm:text-sm"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-black/80">
                  Password
                </label>
                <div className="relative mt-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-black/40">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-2xl border border-black/10 bg-black/[0.02] py-3 pl-11 pr-4 text-black placeholder-black/30 transition-all focus:border-black focus:bg-white focus:ring-0 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-black/10 text-black focus:ring-black"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-black/60">
                  Remember me
                </label>
              </div>

              <div className="text-xs">
                <a href="#" className="font-semibold text-black hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-black/60">
              Don&apos;t have an account?{' '}
              <Link href="/login" className="font-bold text-black hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-black/40">
          <Link href="/" className="hover:text-black">Home</Link>
          <span>•</span>
          <Link href="/pricing" className="hover:text-black">Pricing</Link>
          <span>•</span>
          <Link href="#" className="hover:text-black">Privacy Policy</Link>
        </div>
      </motion.div>
    </div>
  );
}
