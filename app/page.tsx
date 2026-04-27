'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Shirt, Zap, Download, Palette, ArrowRight, CheckCircle2, Sparkles, Type, Mountain } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-black/60 mb-6">
                <Sparkles size={14} className="text-emerald-500" />
                AI-Powered Virtual Studio
              </div>
              <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-black sm:text-7xl">
                Mockyou Your <span className="text-black/40 italic">Imagination</span> Instantly.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-black/60 sm:text-xl">
                The most flexible virtual mockup studio. Create, customize, and preview your designs in realistic environments with AI-powered tools.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="group flex items-center gap-2 rounded-2xl bg-black px-8 py-4 text-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Start Designing
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-2xl border border-black/10 px-8 py-4 text-lg font-semibold text-black transition-colors hover:bg-black/5"
                >
                  View Pricing
                </Link>
              </div>
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-black/5 overflow-hidden">
                       <Image 
                        src={`https://picsum.photos/seed/user${i}/100/100`} 
                        alt="User" 
                        width={40} 
                        height={40} 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm font-medium text-black/60">
                  Joined by <span className="text-black font-bold">2,000+</span> designers
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-[40px] bg-black/5 p-8">
                <Image
                  src="/assets/bg_1.jpeg"
                  alt="Graffiti Art Background"
                  fill
                  className="object-cover opacity-80 mix-blend-multiply"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative h-4/5 w-4/5 rounded-3xl bg-white shadow-2xl overflow-hidden">
                     <Image 
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80" 
                      alt="T-Shirt Mockup" 
                      fill 
                      className="object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 border-2 border-dashed border-black/20 rounded-lg flex items-center justify-center">
                      <p className="text-[10px] text-black/20 font-bold uppercase tracking-widest">Your Design Here</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating UI elements */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-6 top-1/4 rounded-2xl bg-white p-4 shadow-xl border border-black/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                    <Download size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Export Ready</p>
                    <p className="text-[10px] text-black/40">4K High Resolution</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -left-6 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl border border-black/5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                    <Palette size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Live Colors</p>
                    <p className="text-[10px] text-black/40">12+ Fabric Options</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-[#F9F9F9] px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-black sm:text-5xl">
              Everything you need to <span className="text-black/40 italic">showcase</span> your brand.
            </h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: <Sparkles className="text-emerald-500" />,
                title: "AI Design Assistant",
                desc: "Generate unique design patterns and graphics using Gemini AI directly in the studio."
              },
              {
                icon: <Type className="text-blue-500" />,
                title: "Text Studio",
                desc: "Add and customize typography directly on your product mockups with full control."
              },
              {
                icon: <Mountain className="text-orange-500" />,
                title: "Virtual Scenes",
                desc: "Preview your products in realistic environments like streets, studios, or dark rooms."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-3xl bg-white p-8 shadow-sm border border-black/5 transition-all hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-black">{feature.title}</h3>
                <p className="mt-4 text-black/60 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[40px] bg-black p-12 text-center text-white sm:p-20">
          <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Ready to see your design?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-white/60">
            Join thousands of designers who use MockupStudio to bring their visions to life. No credit card required to start.
          </p>
          <div className="mt-10">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-black transition-all hover:scale-[1.05] active:scale-[0.95]"
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              Free trial available
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              No watermark
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-black/5 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden">
              <img src="/assets/logo.png" alt="Mockyou Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black">Mockyou</span>
          </div>
          <p className="text-sm text-black/40">
            © 2026 Mockyou. All rights reserved. Built for designers.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-black/40 hover:text-black">Terms</Link>
            <Link href="#" className="text-sm text-black/40 hover:text-black">Privacy</Link>
            <Link href="#" className="text-sm text-black/40 hover:text-black">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
