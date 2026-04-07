'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
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
import DashboardMetricsStack from '@/components/DashboardMetricsStack';

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
        marginLeft: 240,
        paddingTop: 64,
        minHeight: '100vh',
      }}>
        <PageTransition>
          <div style={{ padding: '32px 28px', maxWidth: 1100 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>Dashboard</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                Welcome back! Here&apos;s your financial overview.
              </p>
            </div>

            {/* Balance + Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
              marginBottom: 28,
            }}>
              <BalanceCard
                balance={totals.balance}
                income={totals.income}
                expense={totals.expense}
                loading={loading}
              />
              <StatsCard
                icon="📈"
                label="Total Income"
                value={`₹${totals.income.toLocaleString('en-IN')}`}
                variant="emerald"
                color="#b8fce5ff"
                loading={loading}
              />
              <StatsCard
                icon="📉"
                label="Total Expenses"
                value={`₹${totals.expense.toLocaleString('en-IN')}`}
                variant="rose"
                color="#ef4444"
                loading={loading}
              />
              <StatsCard
                icon="📋"
                label="Transactions"
                value={transactions.length.toString()}
                variant="blue"
                color="#6366f1"
                loading={loading}
              />
            </div>

            {/* Quick Actions */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginBottom: 28,
              flexWrap: 'wrap',
            }}>
              <Link href="/add-expense">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="gradient-btn"
                  style={{ fontSize: 14, padding: '10px 20px' }}
                >
                  ➕ Add Transaction
                </motion.button>
              </Link>
              <Link href="/analytics">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  📈 View Analytics
                </motion.button>
              </Link>
              <Link href="/ai-insights">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: 12,
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🤖 AI Insights
                </motion.button>
              </Link>
            </div>

            {/* Recent Transactions */}
            <BorderGlow
              edgeSensitivity={20}
              glowIntensity={1.5}
              borderRadius={28}
              glowRadius={40}
              backgroundColor="rgba(255, 255, 255, 0.03)"
              colors={['#6366f1', '#a855f7', '#3b82f6']}
              className="mt-6"
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
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
    </ProtectedRoute>
  );
}
