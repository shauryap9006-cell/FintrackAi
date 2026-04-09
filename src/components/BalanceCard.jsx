import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import BorderGlow from './BorderGlow';

export default function BalanceCard({ balance = 0, income = 0, expense = 0, loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900 rounded-[28px] animate-pulse p-8 border border-slate-800">
        <div className="skeleton h-4 w-24 mb-3 rounded" />
        <div className="skeleton h-9 w-44 mb-5 rounded" />
        <div className="flex gap-6">
          <div className="skeleton h-5 w-24 rounded" />
          <div className="skeleton h-5 w-24 rounded" />
        </div>
      </div>
    );
  }

  const totalFlow = income + expense;
  const formattedBalance = balance.toLocaleString('en-IN');
  const expenseRatio = totalFlow > 0 ? Math.min((expense / totalFlow) * 100, 100) : 0;
  const expenseBarWidth = `${Math.max(expenseRatio, totalFlow > 0 ? 8 : 0)}%`;

  let hint = 'Balanced cash flow';
  if (income === 0 && expense === 0) hint = 'No transactions yet';
  else if (expense > income) hint = 'Spending exceeds income';
  else if (income > expense) hint = 'You are saving this period';

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="260 80 80"
      backgroundColor="rgba(15, 23, 42, 0.9)"
      borderRadius={28}
      glowRadius={80}
      glowIntensity={3}
      coneSpread={45}
      animated
      colors={['#22d3ee', '#06b6d4', '#38bdf8']}
      className="h-full card"
    >
      <div
        className="balance-card p-8 h-full flex flex-col justify-between"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85))'
        }}
      >
        <div className="top">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-slate-300 mb-1 tracking-wider uppercase">
                Total Balance
              </p>
              <h2
                className="value font-black text-white tracking-tight leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ fontSize: 'clamp(20px, 2.5vw, 34px)' }}
                title={`₹${formattedBalance}`}
              >
                ₹<span className="amount inline-block">{formattedBalance}</span>
              </h2>
            </div>
            <div className="flex items-center justify-center w-[42px] h-[42px] rounded-xl border border-slate-700 bg-slate-800 backdrop-blur-md shrink-0">
              <Wallet size={22} className="text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="middle mt-6 flex items-center justify-between gap-6">
          <div className="stat income min-w-0 flex-1">
            <span className="text-xs text-emerald-300 font-medium tracking-wide">↑ Income</span>
            <p className="text-lg font-bold text-white tracking-tight mt-1">₹{income.toLocaleString('en-IN')}</p>
          </div>
          <div className="divider w-px h-10 bg-slate-700 shrink-0" />
          <div className="stat expense min-w-0 flex-1 text-right">
            <span className="text-xs text-rose-300 font-medium tracking-wide">↓ Expenses</span>
            <p className="text-lg font-bold text-white tracking-tight mt-1">₹{expense.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bottom mt-6">
          <div className="bar h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="expense-bar h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #ef4444, #f97316)' }}
              initial={{ width: 0 }}
              animate={{ width: expenseBarWidth }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="hint text-xs text-slate-300 mt-2">{hint}</p>
        </div>
      </div>
    </BorderGlow>
  );
}
