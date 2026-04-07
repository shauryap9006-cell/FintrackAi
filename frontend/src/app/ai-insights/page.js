'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import PageTransition from '@/components/PageTransition';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import EmptyState from '@/components/EmptyState';
import { getTransactions, getAIAdvice } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AIInsightsPage() {
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

  const fetchAdvice = async () => {
    if (transactions.length === 0) {
      toast.error('Add some transactions first to get AI insights');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const monthlyTotal = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const res = await getAIAdvice(transactions, monthlyTotal);
      setAdvice(res.data);
      setHasFetched(true);
      toast.success('AI insights generated!');
    } catch (err) {
      setError(err.message || 'Failed to get AI advice');
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{ padding: '32px 28px', maxWidth: 740 }}>
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <span style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}>
                  🤖
                </span>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>AI Insights</h1>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    Powered by Google Gemini
                  </p>
                </div>
              </div>
            </div>

            {/* Generate button */}
            <div className="glass-card" style={{
              padding: 24,
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {transactions.length} transactions found
                </p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Click to analyze your spending with AI
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={fetchAdvice}
                disabled={loading || transactions.length === 0}
                className="gradient-btn"
                style={{
                  fontSize: 14,
                  padding: '10px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Analyzing...
                  </>
                ) : (
                  <>✨ Generate Insights</>
                )}
              </motion.button>
            </div>

            {/* Results */}
            {!hasFetched && !loading ? (
              <EmptyState
                icon="🤖"
                title="No insights generated yet"
                message="Click the button above to get AI-powered analysis of your financial data."
              />
            ) : (
              <AIInsightsPanel data={advice} loading={loading} error={error} />
            )}
          </div>
        </PageTransition>
      </main>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .dashboard-main { margin-left: 0 !important; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      </div>
    </ProtectedRoute>
  );
}
