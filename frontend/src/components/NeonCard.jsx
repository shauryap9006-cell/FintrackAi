export default function NeonCard({ children, className, glowColor = 'from-indigo-500 via-purple-500 to-blue-500', bottomGlow = 'from-purple-600/40 via-indigo-500/20' }) {
  return (
    <div className={`relative group h-full ${className}`}>
      
      {/* OUTER GLOW (stronger + colored) */}
      <div className={`absolute -inset-[1px] rounded-2xl bg-gradient-to-br ${glowColor} opacity-30 blur-2xl group-hover:opacity-50 transition duration-500`}></div>

      {/* CARD */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-[#0b0f1a] border border-white/10 p-6 transition-all duration-300 group-hover:-translate-y-1 flex flex-col justify-between">
        
        {/* TOP LIGHT (important) */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent opacity-40 pointer-events-none"></div>

        {/* BOTTOM NEON GLOW (this is what ensures depth) */}
        <div className={`absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t ${bottomGlow} to-transparent blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500`}></div>

        {/* INNER COLOR BLEED */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none"></div>

        {/* HOVER SHINE */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -left-full top-0 h-full w-1/2 bg-white/10 blur-xl rotate-12 group-hover:left-full transition-all duration-700 pointer-events-none"></div>
        </div>

        {/* CONTENT */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
