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
    colors: ['#266905ff', '#60a5fa', '#2563eb'],
    bg: 'rgba(128, 128, 128, 0.08)'
  },
  indigo: {
    glow: '260 80 80',
    colors: ['#6366f1', '#818cf8', '#4f46e5'],
    bg: 'rgba(169, 26, 26, 0.8)'
  }
};

export default function StatsCard({ icon, label, value, trend, trendUp, variant = 'indigo', color = '#6366f1', loading = false }) {
  if (loading) {
    return (
      <div className="bg-[#0b0f1a] rounded-[28px] animate-pulse p-6 border border-white/5 h-full">
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
      className="h-full"
    >
      <div className="p-6 cursor-default">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 border border-white/5 shadow-inner"
          style={{ background: `${color}15` }}
        >
          {icon}
        </div>

        <p className="text-[12px] text-white/50 font-black mb-1 tracking-wider uppercase">
          {label}
        </p>

        <div className="flex items-baseline gap-2.5">
          <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
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
