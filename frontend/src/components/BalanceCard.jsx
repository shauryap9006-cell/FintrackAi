import BorderGlow from './BorderGlow';

export default function BalanceCard({ balance = 0, income = 0, expense = 0, loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b0f1a] rounded-[28px] animate-pulse p-8 border border-white/5">
        <div className="skeleton h-4 w-24 mb-3 rounded" />
        <div className="skeleton h-9 w-44 mb-5 rounded" />
        <div className="flex gap-6">
          <div className="skeleton h-5 w-24 rounded" />
          <div className="skeleton h-5 w-24 rounded" />
        </div>
      </div>
    );
  }

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor="260 80 80"
      backgroundColor="rgba(99, 82, 210, 0.45)"
      borderRadius={28}
      glowRadius={80}
      glowIntensity={3}
      coneSpread={45}
      animated
      colors={['#c084fc', '#f472b6', '#38bdf8']}
      className="h-full"
    >
      <div className="p-8">
        <p className="text-[13px] font-semibold text-white/70 mb-1 tracking-wider uppercase">
          Total Balance
        </p>
        <h2 className="text-4xl font-black text-white mb-8 tracking-tight">
          ₹{balance.toLocaleString('en-IN')}
        </h2>

        <div className="flex gap-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold border border-emerald-500/20">
                ↑
              </div>
              <span className="text-xs text-white/70 font-medium tracking-wide">INCOME</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">₹{income.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold border border-rose-500/20">
                ↓
              </div>
              <span className="text-xs text-white/70 font-medium tracking-wide">EXPENSES</span>
            </div>
            <p className="text-lg font-bold text-white tracking-tight">₹{expense.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>
    </BorderGlow>
  );
}
