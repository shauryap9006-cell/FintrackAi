'use client';

import { motion } from 'framer-motion';

export default function EmptyState({ icon = '📭', title, message, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="empty"
    >
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="primary-btn"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
