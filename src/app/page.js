'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ColorBends from '@/components/ColorBends';
import ShinyText from '@/components/ShinyText';
import { GooeyText } from '@/components/ui/gooey-text-morphing';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const features = [
  {
    icon: '📊',
    title: 'Smart Dashboard',
    desc: 'Real-time overview of your finances with beautiful charts and quick stats.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Insights',
    desc: 'Get personalized financial advice powered by Google Gemini AI.',
  },
  {
    icon: '📈',
    title: 'Deep Analytics',
    desc: 'Understand your spending patterns with category breakdowns and trends.',
  },
  {
    icon: '💳',
    title: 'Secure Payments',
    desc: 'Integrated Razorpay payment gateway for seamless transactions.',
  },
  {
    icon: '🌙',
    title: 'Dark Mode',
    desc: 'Beautiful dark and light themes for comfortable viewing anytime.',
  },
  {
    icon: '📱',
    title: 'Fully Responsive',
    desc: 'Works perfectly on desktop, tablet, and mobile devices.',
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', overflow: 'hidden' }}>
      <Navbar />

      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#24b429ff"]}
        rotation={91}
        speed={0.15}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={0.5}
        parallax={0.5}
        noise={0.1}
        transparent
        autoRotate={0.05}
      />

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 24px 80px',
      }}>
        <div style={{ maxWidth: 800, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 20,
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--color-primary)',
              marginBottom: 90,
            }}>
              💰FinTrack AI
            </span>
          </motion.div>

          {/* ... Hero Content ... */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              marginBottom: 40,
              minHeight: '80px', // Ensure space for morphing
            }}
          >
            <GooeyText
              texts={["Track", "Manage", "Analyze", "Grow"]}
              morphTime={1.2}
              cooldownTime={0.5}
              textClassName="font-sekuya font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            />
            <br />
            <span className="text-white/90">Your Finances Intelligently</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 32px',
            }}
          >
            FinTrack AI helps you understand your spending, get AI-driven insights,
            and take control of your financial future — all in one beautiful dashboard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <Link href="/signup">
              <LiquidButton size="xl" className="text-white font-semibold">
                🚀 Get Started
              </LiquidButton>
            </Link>

            <Link href="/ai-insights">
              <LiquidButton size="xl" className="text-white/80 font-medium">
                🤖 See AI Insights
              </LiquidButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        padding: '80px 24px',
        maxWidth: 1120,
        margin: '0 auto',
        position: 'relative',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 56 }}
        >
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1px', marginBottom: 12 }}>
            Everything you need to{' '}
            <span className="gradient-text">manage money</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            Powerful features designed to give you financial clarity.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="relative group cursor-default"
            >
              <div className="
                relative p-8 rounded-2xl h-full
                bg-white/5 backdrop-blur-xl
                border border-white/10
                overflow-hidden
                transition-all duration-300
                group-hover:border-blue-500/30
                group-hover:bg-white/10
                before:absolute before:inset-0
                before:bg-black/40 before:rounded-2xl
              ">
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl
                                 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                    {feature.icon}
                  </div>

                  <h3 className="text-white font-semibold text-lg md:text-xl group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 leading-relaxed text-sm md:text-base">
                    {feature.desc}
                  </p>
                </div>

                {/* Subtle Glow Effect on Hover */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 blur-3xl opacity-0 
                                group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative group max-w-2xl mx-auto"
        >
          <div className="
            relative p-12 rounded-3xl overflow-hidden
            bg-white/5 backdrop-blur-2xl
            border border-white/10
            shadow-2xl
            before:absolute before:inset-0
            before:bg-black/20 before:rounded-3xl
          ">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight">
                Ready to take control?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                Start tracking your expenses and get AI-powered financial insights today.
              </p>
              <Link href="/login">
                <LiquidButton size="xl" className="text-white font-bold">
                  Open Dashboard →
                </LiquidButton>
              </Link>
            </div>

            {/* Decorative Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] -z-10" />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '32px 24px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-color)',
        fontSize: 13,
        color: 'var(--text-muted)',
      }}>
        © 2026 FinTrack AI. Built with ❤️ 
      </footer>
    </div>
  );
}
