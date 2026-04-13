'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Wallet, PlusCircle,
  BarChart3, PieChart as PieIcon, Activity,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import { MonthlyChart, CategoryChart, IncomeExpenseChart } from '@/components/ChartSection';
import { getAnalytics, getTransactions } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import './analytics.css';

/* ── tiny helpers ── */
const fmt = (v) => `₹${(v || 0).toLocaleString('en-IN')}`;
const pct = (part, total) => (total > 0 ? ((part / total) * 100).toFixed(1) : '0');

/* ── animated number ── */
function AnimatedValue({ value, prefix = '', suffix = '' }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {prefix}{value}{suffix}
    </motion.span>
  );
}

/* ── stagger children orchestrator ── */
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [analyticsRes, txRes] = await Promise.all([
        getAnalytics(),
        getTransactions(),
      ]);
      setAnalytics(analyticsRes.data);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const totals = analytics?.totals || { income: 0, expense: 0, balance: 0 };
  const hasData = analytics && (
    analytics.monthlySpending?.length > 0 ||
    analytics.categoryBreakdown?.length > 0
  );

  /* ── top category ── */
  const topCategory = analytics?.categoryBreakdown?.[0];

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
            <div className="analytics-page">

              {/* ═══ HERO ═══ */}
              <motion.div
                className="analytics-hero"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, position: 'relative', zIndex: 1 }}>
                  <div>
                    <h1>Analytics</h1>
                    <p>Deep dive into your spending patterns, trends, and insights.</p>
                  </div>
                  {!loading && (
                    <div style={{
                      display: 'flex', gap: 8, alignItems: 'center',
                      padding: '6px 16px', borderRadius: 20,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: 12, color: 'rgba(255,255,255,0.5)',
                    }}>
                      <Activity size={13} />
                      {transactions.length} transactions tracked
                    </div>
                  )}
                </div>
              </motion.div>

              {/* ═══ LOADING STATE ═══ */}
              {loading && (
                <>
                  <div className="analytics-skeleton">
                    <div className="skel-pill" />
                    <div className="skel-pill" />
                    <div className="skel-pill" />
                  </div>
                  <div className="chart-grid">
                    <div className="skel-chart" />
                    <div className="skel-chart" />
                  </div>
                </>
              )}

              {/* ═══ EMPTY STATE ═══ */}
              {!loading && !hasData && (
                <motion.div
                  className="analytics-empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="ae-icon">📊</div>
                  <h3>No analytics data yet</h3>
                  <p>Start adding transactions to unlock beautiful charts, spending breakdowns, and financial insights.</p>
                  <Link href="/add-expense">
                    <motion.button
                      className="ae-btn"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <PlusCircle size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Add Your First Transaction
                    </motion.button>
                  </Link>
                </motion.div>
              )}

              {/* ═══ DATA VIEW ═══ */}
              {!loading && hasData && (
                <motion.div variants={stagger} initial="hidden" animate="show">

                  {/* ── Summary Pills ── */}
                  <motion.div className="analytics-summary" variants={fadeUp}>
                    {/* Balance */}
                    <div className="summary-pill balance">
                      <div className="sp-glow" />
                      <div className="sp-icon"><Wallet size={16} color="#818cf8" /></div>
                      <p className="sp-label">Net Balance</p>
                      <p className="sp-value"><AnimatedValue value={fmt(totals.balance)} /></p>
                    </div>

                    {/* Income */}
                    <div className="summary-pill income">
                      <div className="sp-glow" />
                      <div className="sp-icon"><TrendingUp size={16} color="#34d399" /></div>
                      <p className="sp-label">Total Income</p>
                      <p className="sp-value"><AnimatedValue value={fmt(totals.income)} /></p>
                    </div>

                    {/* Expense */}
                    <div className="summary-pill expense">
                      <div className="sp-glow" />
                      <div className="sp-icon"><TrendingDown size={16} color="#f87171" /></div>
                      <p className="sp-label">Total Spent</p>
                      <p className="sp-value"><AnimatedValue value={fmt(totals.expense)} /></p>
                    </div>
                  </motion.div>

                  {/* ── Quick Insight Bar ── */}
                  {topCategory && (
                    <motion.div
                      variants={fadeUp}
                      style={{
                        marginBottom: 24,
                        padding: '14px 20px',
                        borderRadius: 14,
                        background: 'rgba(124, 58, 237, 0.06)',
                        border: '1px solid rgba(124, 58, 237, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.6)',
                      }}
                    >
                      <span style={{
                        background: 'rgba(124,58,237,0.15)',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 700,
                        color: '#a78bfa',
                        letterSpacing: '0.05em',
                      }}>
                        INSIGHT
                      </span>
                      <span>
                        Your biggest spending category is <strong style={{ color: '#fff' }}>{topCategory.category}</strong> at{' '}
                        <strong style={{ color: '#fff' }}>{fmt(topCategory.total)}</strong>{' '}
                        ({pct(topCategory.total, totals.expense)}% of expenses)
                      </span>
                    </motion.div>
                  )}

                  {/* ── Charts Row 1: Income vs Expense + Category Donut ── */}
                  <motion.div className="chart-grid" variants={fadeUp}>
                    <div className="chart-card">
                      <div className="chart-card-title">
                        <div className="cc-dot" style={{ background: '#6366f1' }} />
                        <h3>Income vs Expenses</h3>
                      </div>
                      <IncomeExpenseChart
                        income={totals.income}
                        expense={totals.expense}
                      />
                    </div>

                    <div className="chart-card">
                      <div className="chart-card-title">
                        <div className="cc-dot" style={{ background: '#a855f7' }} />
                        <h3>Spending by Category</h3>
                      </div>
                      <CategoryChart data={analytics.categoryBreakdown || []} />
                    </div>
                  </motion.div>

                  {/* ── Chart Row 2: Monthly Trend (full width) ── */}
                  <motion.div className="chart-grid" variants={fadeUp}>
                    <div className="chart-card chart-full">
                      <div className="chart-card-title">
                        <div className="cc-dot" style={{ background: '#3b82f6' }} />
                        <h3>Monthly Spending Trend</h3>
                      </div>
                      <MonthlyChart data={analytics.monthlySpending || []} />
                    </div>
                  </motion.div>

                  {/* ── Category Breakdown Cards ── */}
                  {analytics.categoryBreakdown?.length > 0 && (
                    <motion.div variants={fadeUp}>
                      <div className="section-title">
                        <BarChart3 size={16} style={{ opacity: 0.5 }} />
                        Category Breakdown
                        <div className="st-line" />
                      </div>
                      <div className="category-grid">
                        {analytics.categoryBreakdown.map((item, i) => (
                          <motion.div
                            key={i}
                            className="category-item"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.35 }}
                          >
                            <div className="ci-left">
                              <span className="ci-name">{item.category}</span>
                              <span className="ci-amount">{fmt(item.total)}</span>
                            </div>
                            <span className="ci-badge">{item.count} txn{item.count !== 1 ? 's' : ''}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </motion.div>
              )}
            </div>
          </PageTransition>
        </main>
      </div>
    </ProtectedRoute>
  );
}
