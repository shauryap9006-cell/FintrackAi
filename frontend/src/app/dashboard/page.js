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
      <div style={{ minHeight: '100vh' }}>
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
            <div className="glass-card card welcome-card" style={{ padding: 24, marginBottom: 22 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.1 }}>
                    Dashboard
                  </h1>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 8 }}>
                    Welcome back! Here&apos;s your financial overview.
                  </p>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: 999, padding: '8px 14px' }}>
                  {loading ? 'Syncing data...' : `${transactions.length} total transactions`}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="actions" style={{ marginTop: 18 }}>
                <Link href="/add-expense">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.5 }}
                    whileTap={{ scale: 0.97 }}
                    className="nav-btn primary"
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
                    className="nav-btn"
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
                    className="nav-btn"
                  >
                    <Sparkles size={16} />
                    AI Insights
                  </motion.button>
                </Link>
              </div>
            </div>

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

              <div style={{
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
                <h2 style={{ fontSize: 17, fontWeight: 600 }}>Recent Transactions</h2>
                {transactions.length > 8 && (
                  <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>
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
