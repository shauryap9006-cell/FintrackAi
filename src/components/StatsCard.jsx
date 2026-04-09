import BorderGlow from './BorderGlow';

const COLOR_VARIANTS = {
  emerald: {
    glow: '150 80 80',
    colors: ['#10b981', '#34d399', '#059669'],
    bg: 'rgba(5, 118, 99, 0.08)'
  },
  rose: {
    glow: '350 80 80',
    colors: ['#f43f5e', '#fb7185', '#e11d48'],
    bg: 'rgba(15, 36, 191, 0.08)'
  },
  blue: {
    glow: '210 80 80',
    colors: ['#22d3ee', '#67e8f9', '#06b6d4'],
    bg: 'rgba(128, 128, 128, 0.08)'
  },
  indigo: {
    glow: '260 80 80',
    colors: ['#22d3ee', '#38bdf8', '#0ea5e9'],
    bg: 'rgba(15, 23, 42, 0.85)'
  }
};

export default function StatsCard({ icon, label, value, trend, trendUp, variant = 'indigo', color = '#6366f1', loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900 rounded-[28px] animate-pulse p-6 border border-slate-800 h-full">
        <div className="w-11 h-11 rounded-xl bg-white/5 mb-4" />
        <div className="w-20 h-3 mb-2 rounded bg-white/5" />
        <div className="w-24 h-7 rounded bg-white/5" />
      </div>
    );
  }

  const v = COLOR_VARIANTS[variant] || COLOR_VARIANTS.indigo;

  return (
    <BorderGlow
      edgeSensitivity={30}
      glowColor={v.glow}
      backgroundColor={v.bg}
      borderRadius={28}
      glowRadius={60}
      glowIntensity={2}
      coneSpread={35}
      animated
      colors={v.colors}
      className="h-full card"
    >
      <div className="p-6 cursor-default bg-slate-900/90 border border-slate-800 rounded-[28px]">
        <div 
          className="flex items-center justify-center w-[42px] h-[42px] rounded-xl mb-4 border border-slate-700 shadow-inner backdrop-blur-md"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>

        <p className="text-[12px] text-slate-300 font-black mb-1 tracking-wider uppercase">
          {label}
        </p>

        <div className="flex items-baseline gap-2.5 min-w-0">
          <h3
            className="value font-black text-white tracking-tight leading-tight min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{ fontSize: 'clamp(18px, 2.2vw + 8px, 34px)' }}
            title={value}
          >
            {value}
          </h3>
          {trend && (
            <span className={`text-[13px] font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
        </div>
      </div>
    </BorderGlow>
  );
}
