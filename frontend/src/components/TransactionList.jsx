'use client';

import { motion } from 'framer-motion';

const categoryIcons = {
  food: '🍔',
  transport: '🚗',
  shopping: '🛍️',
  bills: '📄',
  entertainment: '🎬',
  health: '💊',
  salary: '💼',
  freelance: '💻',
  investment: '📈',
  other: '📦',
};

function getCategoryTag(category) {
  const cat = category?.toLowerCase() || 'other';
  const tagClass = `tag tag-${['food', 'transport', 'shopping', 'bills', 'entertainment', 'health', 'salary'].includes(cat) ? cat : 'other'}`;
  return tagClass;
}

export default function TransactionList({ transactions = [], onDelete }) {
  if (!transactions.length) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {transactions.map((tx, index) => (
        <motion.div
          key={tx._id || index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 0',
            borderBottom: index < transactions.length - 1 ? '1px solid var(--border-color)' : 'none',
          }}
        >
          {/* Category icon */}
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: tx.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}>
            {categoryIcons[tx.category?.toLowerCase()] || '📦'}
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <p style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {tx.note || tx.category}
              </p>
              <span className={getCategoryTag(tx.category)} style={{ flexShrink: 0 }}>
                {tx.category}
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {new Date(tx.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Amount */}
          <p style={{
            fontSize: 15,
            fontWeight: 600,
            color: tx.type === 'income' ? 'var(--color-success)' : 'var(--color-danger)',
            flexShrink: 0,
          }}>
            {tx.type === 'income' ? '+' : '-'}₹{tx.amount?.toLocaleString('en-IN')}
          </p>

          {/* Delete button */}
          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onDelete(tx._id)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: 'rgba(239,68,68,0.1)',
                color: 'var(--color-danger)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              ✕
            </motion.button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
