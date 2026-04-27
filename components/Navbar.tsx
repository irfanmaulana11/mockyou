'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { Shirt, LogOut, User, CreditCard, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden">
            <img src="/assets/logo.png" alt="Mockyou Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-tight text-black">Mockyou</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/pricing" className="text-sm font-medium text-black/60 hover:text-black">
            Pricing
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-black/60 hover:text-black">
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-full border border-black/5 bg-black/5 px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-[10px] text-white">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-xs font-medium text-black/80">{user.email}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${user.subscription === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-black/10 text-black/60'}`}>
                  {user.subscription}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/5 text-black/60 transition-colors hover:bg-black/5 hover:text-black"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-black/60 transition-colors hover:text-black"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
