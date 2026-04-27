'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import MockupEditor from '@/components/MockupEditor';
import { motion } from 'motion/react';
import { Loader2, LayoutDashboard, Settings, History, HelpCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      // Small delay to let AuthProvider initialize from localStorage
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedUser = localStorage.getItem('mockup_studio_user');
      if (!savedUser) {
        router.push('/login');
      } else {
        setIsReady(true);
      }
    };
    
    checkAuth();
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="animate-spin text-black/20" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] bg-[#F9F9F9]">
      {/* Dashboard Header */}
      <div className="w-full bg-white border-b border-black/5 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-black">Mockup Editor</h1>
            <p className="mt-1 text-sm text-black/40">Create and preview your designs on high-quality products.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-black/10">
              <History size={16} />
              Recent
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-black/10">
              <Settings size={16} />
              Settings
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-black/10">
              <HelpCircle size={16} />
              Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        <MockupEditor />
      </motion.div>
      
      {/* Dashboard Footer / Status */}
      <div className="w-full bg-white border-t border-black/5 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              System Online
            </span>
            <span>•</span>
            <span>v1.0.4 Stable</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Storage: 42% Used</span>
            <span>•</span>
            <span>API Latency: 12ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
