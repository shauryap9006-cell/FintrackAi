'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const categories = [
  'Food', 'Transport', 'Shopping', 'Bills',
  'Entertainment', 'Health', 'Salary', 'Freelance',
  'Investment', 'Other',
];

export default function ExpenseForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    amount: '',
    category: 'Food',
    type: 'expense',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
    setForm({
      amount: '',
      category: 'Food',
      type: 'expense',
      note: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card no-card-hover"
      style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {/* Type toggle */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Type
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['expense', 'income'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t })}
              style={{
                flex: 1,
                padding: '10px 20px',
                borderRadius: 10,
                border: '1.5px solid',
                borderColor: form.type === t
                  ? (t === 'income' ? 'var(--color-success)' : 'var(--color-danger)')
                  : 'var(--border-color)',
                background: form.type === t
                  ? (t === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)')
                  : 'transparent',
                color: form.type === t
                  ? (t === 'income' ? 'var(--color-success)' : 'var(--color-danger)')
                  : 'var(--text-secondary)',
                fontWeight: form.type === t ? 600 : 400,
                fontSize: 14,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
              }}
            >
              {t === 'income' ? '↑' : '↓'} {t}
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Amount (₹)
        </label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          className="input-field"
          required
          min="1"
          step="0.01"
        />
      </div>

      {/* Category */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Category
        </label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="input-field"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Date
        </label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      {/* Note */}
      <div>
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>
          Note (optional)
        </label>
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="e.g. Lunch at restaurant"
          className="input-field"
        />
      </div>

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading || !form.amount}
        className="gradient-btn"
        style={{
          width: '100%',
          marginTop: 4,
          fontSize: 15,
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: 18,
              height: 18,
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            Adding...
          </>
        ) : (
          <>➕ Add Transaction</>
        )}
      </motion.button>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <style jsx global>{`
        .no-card-hover:hover {
          transform: translateZ(0) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .no-card-hover:hover::after {
          display: none !important;
        }
      `}</style>
    </motion.form>
  );
}
