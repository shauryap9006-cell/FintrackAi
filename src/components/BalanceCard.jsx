"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import "./balanceCard.css";

export default function BalanceCard({ balance = 0, income = 0, expense = 0 }) {
  const fmt = (v) => v.toLocaleString('en-IN');
  const net = income - expense;
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <motion.div
      className="balance-card"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.015 }}
    >
      {/* cursor glow */}
      <motion.div
        className="cursor-glow"
        style={{ left: smoothX, top: smoothY }}
      />

      {/* TOP */}
      <div className="top">
        <div>
          <p className="bc-label">TOTAL BALANCE</p>

          <motion.h1
            className="bc-amount"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ₹{fmt(balance)}
          </motion.h1>

          <p className="bc-trend" style={{ color: net >= 0 ? '#10b981' : '#ef4444' }}>
            {net >= 0 ? '+' : ''}₹{fmt(net)} this month
          </p>
        </div>

        <div className="bc-icon-box">💳</div>
      </div>

      {/* MIDDLE */}
      <div className="middle">
        <div>
          <p className="bc-income">↑ Income</p>
          <h3>₹{fmt(income)}</h3>
        </div>

        <div className="bc-divider" />

        <div>
          <p className="bc-expense">↓ Expenses</p>
          <h3>₹{fmt(expense)}</h3>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="bottom">
        <div className="bc-bar" />
        <p className="bc-empty">{income === 0 && expense === 0 ? 'No transactions yet' : 'Monthly overview'}</p>

        <Link href="/add-expense">
          <motion.button
            className="bc-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Transaction
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
