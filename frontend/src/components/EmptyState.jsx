'use client';

import { motion } from 'framer-motion';

export default function EmptyState({ icon = '📭', title, message, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{
        padding: 48,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <span style={{ fontSize: 48 }}>{icon}</span>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 320 }}>{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="gradient-btn"
          style={{ marginTop: 8, fontSize: 14 }}
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
