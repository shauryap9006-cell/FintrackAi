'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import { MonthlyChart, CategoryChart, IncomeExpenseChart } from '@/components/ChartSection';
import { SkeletonCard } from '@/components/SkeletonLoader';
import EmptyState from '@/components/EmptyState';
import { getAnalytics } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const hasData = analytics && (
    analytics.monthlySpending?.length > 0 ||
    analytics.categoryBreakdown?.length > 0
  );

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
            <div style={{ marginBottom: 28 }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>Analytics</h1>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                Dive deep into your spending patterns and trends.
              </p>
            </div>

            {loading ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
              }}>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : !hasData ? (
              <EmptyState
                icon="📈"
                title="No analytics data yet"
                message="Start adding transactions to see spending insights and charts."
                actionLabel="Add Transaction"
                onAction={() => window.location.href = '/add-expense'}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Top row: Income vs Expense + Category */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: 20,
                }}>
                  <IncomeExpenseChart
                    income={analytics.totals?.income || 0}
                    expense={analytics.totals?.expense || 0}
                  />
                  <CategoryChart data={analytics.categoryBreakdown || []} />
                </div>

                {/* Monthly chart */}
                <MonthlyChart data={analytics.monthlySpending || []} />

                {/* Summary Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 16,
                }}>
                  {(analytics.categoryBreakdown || []).map((item, i) => (
                    <div
                      key={i}
                      className="glass-card"
                      style={{
                        padding: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
                          {item.category}
                        </p>
                        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                          ₹{item.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <span style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-secondary)',
                        padding: '4px 10px',
                        borderRadius: 8,
                      }}>
                        {item.count} txns
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
