'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, BarChart3, Sparkles, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import BalanceCard from '@/components/BalanceCard';
import StatsCard from '@/components/StatsCard';
import TransactionList from '@/components/TransactionList';
import EmptyState from '@/components/EmptyState';
import { SkeletonTable } from '@/components/SkeletonLoader';
import { getTransactions, getAnalytics, deleteTransaction } from '@/lib/api';
import BorderGlow from '@/components/BorderGlow';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [txRes, analyticsRes] = await Promise.all([
        getTransactions(),
        getAnalytics(),
      ]);
      setTransactions(txRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.error(err);
      // Silently handle — show empty state
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete transaction');
    }
  };

  const totals = analytics?.totals || { income: 0, expense: 0, balance: 0 };
  const recentTransactions = transactions.slice(0, 8);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
      <Sidebar />

      <main className="dashboard-main" style={{
        marginLeft: 110,
        paddingTop: 64,
        minHeight: '100vh',
      }}>
        <PageTransition>
          <div style={{ padding: '32px 28px 40px', maxWidth: 1200 }}>
            {/* Reimagined Header */}
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative mb-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-6 md:p-8"
            >
              <div className="pointer-events-none absolute -top-28 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -top-8 right-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />

              <div className="relative z-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                      Dashboard
                    </h1>
                    <p className="mt-2 text-sm md:text-base text-slate-300">
                      Welcome back! Here&apos;s your financial overview.
                    </p>
                  </div>
                  <div className="inline-flex w-fit rounded-full border border-slate-700 bg-slate-950/80 px-4 py-1 text-xs text-slate-300">
                    {loading ? 'Syncing data...' : `${transactions.length} total transactions`}
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Balance</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      ₹{totals.balance.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Income</p>
                    <p className="mt-1 text-lg font-semibold text-emerald-300">
                      ₹{totals.income.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-400">Expenses</p>
                    <p className="mt-1 text-lg font-semibold text-rose-300">
                      ₹{totals.expense.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="actions mt-5">
                  <Link href="/add-expense">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.5 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-md px-4 py-2 transition-colors duration-200 shadow-[0_0_12px_rgba(6,182,212,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.7)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                      Add Transaction
                    </motion.button>
                  </Link>
                  <Link href="/analytics">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.5 }}
                      whileTap={{ scale: 0.97 }}
                      className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-md px-4 py-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <BarChart3 size={16} />
                      View Analytics
                    </motion.button>
                  </Link>
                  <Link href="/ai-insights">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.5 }}
                      whileTap={{ scale: 0.97 }}
                      className="border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-md px-4 py-2 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Sparkles size={16} />
                      AI Insights
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.section>

            {/* Balance + Stats */}
            <div className="dashboard-main-grid" style={{
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gap: 16,
              marginBottom: 22,
            }}>
              <BalanceCard
                balance={totals.balance}
                income={totals.income}
                expense={totals.expense}
                loading={loading}
              />

              <div className="bg-slate-900 border border-slate-800 rounded-[28px] p-6" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 16,
              }}>
                <StatsCard
                  icon={<TrendingUp size={22} />}
                  label="Total Income"
                  value={`₹${totals.income.toLocaleString('en-IN')}`}
                  variant="emerald"
                  color="#b8fce5ff"
                  loading={loading}
                />
                <StatsCard
                  icon={<TrendingDown size={22} />}
                  label="Total Expenses"
                  value={`₹${totals.expense.toLocaleString('en-IN')}`}
                  variant="rose"
                  color="#ef4444"
                  loading={loading}
                />
                <div style={{ gridColumn: 'span 2' }}>
                  <StatsCard
                    icon={<Receipt size={22} />}
                    label="Transactions"
                    value={transactions.length.toString()}
                    variant="blue"
                    color="#6366f1"
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <BorderGlow
              edgeSensitivity={20}
              glowIntensity={1.5}
              borderRadius={28}
              glowRadius={40}
              backgroundColor="rgba(255, 255, 255, 0.03)"
              colors={['#6366f1', '#a855f7', '#3b82f6']}
              className="mt-6 card"
            >
              <div style={{ padding: 24 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 16,
              }}>
                <h2 className="text-white" style={{ fontSize: 17, fontWeight: 600 }}>Recent Transactions</h2>
                {transactions.length > 8 && (
                  <span style={{ fontSize: 13, color: '#22d3ee', fontWeight: 500 }}>
                    Showing last 8
                  </span>
                )}
              </div>

              {loading ? (
                <SkeletonTable rows={5} />
              ) : recentTransactions.length > 0 ? (
                <TransactionList
                  transactions={recentTransactions}
                  onDelete={handleDelete}
                />
              ) : (
                <EmptyState
                  icon="📭"
                  title="No transactions yet"
                  message="Add your first transaction to start tracking your finances."
                  actionLabel="Add Transaction"
                  onAction={() => window.location.href = '/add-expense'}
                />
              )}
              </div>
            </BorderGlow>
          </div>
        </PageTransition>
      </main>

      <style jsx global>{`
        @media (max-width: 1180px) {
          .dashboard-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
    </ProtectedRoute>
  );
}
