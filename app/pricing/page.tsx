'use client';

import { useAuth } from '@/components/AuthContext';
import { motion } from 'motion/react';
import { Check, Zap, Shield, Star, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const { user, updateSubscription } = useAuth();
  const router = useRouter();

  const handleUpgrade = (plan: 'free' | 'pro') => {
    if (!user) {
      router.push('/login');
      return;
    }
    updateSubscription(plan);
    router.push('/dashboard');
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for trying out MockupStudio',
      features: [
        'Unlimited previews',
        'T-shirt & Hoodie products',
        'Basic color options',
        'Low-res preview',
        'Watermarked downloads'
      ],
      buttonText: user?.subscription === 'free' ? 'Current Plan' : 'Get Started',
      highlight: false,
      plan: 'free'
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For professional designers and brands',
      features: [
        'Everything in Free',
        'High-resolution exports (4K)',
        'No watermarks',
        'Priority support',
        'Commercial usage rights',
        'Custom background colors'
      ],
      buttonText: user?.subscription === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      highlight: true,
      plan: 'pro'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-sm font-bold uppercase tracking-widest text-black/40">Pricing Plans</h2>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-black sm:text-6xl">
            Simple, <span className="text-black/40 italic">transparent</span> pricing.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-black/60">
            Choose the plan that&apos;s right for you. Upgrade or downgrade at any time.
          </p>
        </motion.div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative flex flex-col rounded-[40px] p-8 shadow-xl border ${
              plan.highlight ? 'bg-black text-white border-black' : 'bg-white text-black border-black/5'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-black'}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                {plan.period && <span className={`text-lg font-medium ${plan.highlight ? 'text-white/60' : 'text-black/40'}`}>{plan.period}</span>}
              </div>
              <p className={`mt-4 text-sm ${plan.highlight ? 'text-white/60' : 'text-black/60'}`}>
                {plan.description}
              </p>
            </div>

            <ul className="mb-10 flex-1 space-y-4">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-sm font-medium">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.highlight ? 'bg-white/10 text-emerald-400' : 'bg-black/5 text-emerald-600'}`}>
                    <Check size={14} />
                  </div>
                  <span className={plan.highlight ? 'text-white/80' : 'text-black/80'}>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan.plan as 'free' | 'pro')}
              disabled={user?.subscription === plan.plan}
              className={`group flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${
                plan.highlight 
                  ? 'bg-white text-black hover:bg-white/90' 
                  : 'bg-black text-white hover:bg-black/90'
              }`}
            >
              {plan.buttonText}
              {user?.subscription !== plan.plan && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 grid grid-cols-1 gap-12 md:grid-cols-3">
        {[
          {
            icon: <Zap className="text-yellow-500" />,
            title: "Instant Access",
            desc: "Get immediate access to all features once you upgrade your account."
          },
          {
            icon: <Shield className="text-blue-500" />,
            title: "Secure Payments",
            desc: "We use industry-standard encryption to keep your payment information safe."
          },
          {
            icon: <Star className="text-emerald-500" />,
            title: "Cancel Anytime",
            desc: "No long-term contracts. You can cancel your subscription at any time."
          }
        ].map((item, i) => (
          <div key={i} className="text-center">
            <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/5">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-black">{item.title}</h3>
            <p className="mt-2 text-sm text-black/60 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
