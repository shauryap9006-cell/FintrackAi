'use client';

import { motion } from 'framer-motion';

export default function AIInsightsPanel({ data, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="glass-card" style={{ padding: 28 }}>
        <div className="skeleton" style={{ width: 160, height: 20, marginBottom: 20, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '100%', height: 60, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '100%', height: 40, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: '100%', height: 120, marginBottom: 16, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 140, height: 20, borderRadius: 8 }} />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-card"
        style={{ padding: 28, textAlign: 'center' }}
      >
        <span style={{ fontSize: 40 }}>⚠️</span>
        <p style={{ color: 'var(--color-danger)', fontSize: 14, marginTop: 12 }}>{error}</p>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {/* Summary */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'rgba(99,102,241,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>📋</span>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Summary</h3>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{data.summary}</p>
      </div>

      {/* Alerts */}
      {data.alerts && data.alerts !== 'No alerts' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{
            padding: 24,
            borderLeft: '4px solid var(--color-warning)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(245,158,11,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>⚠️</span>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-warning)' }}>Alerts</h3>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{data.alerts}</p>
        </motion.div>
      )}

      {/* Tips */}
      {data.tips?.length > 0 && (
        <div className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(16,185,129,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}>💡</span>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Smart Tips</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--bg-secondary)',
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  gap: 10,
                }}
              >
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>#{i + 1}</span>
                {tip}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Top Category */}
      {data.topCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card"
          style={{
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.05))',
          }}
        >
          <span style={{ fontSize: 28 }}>🏆</span>
          <div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Top Spending Category</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{data.topCategory}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
