'use client';

export default function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      className="glass-card"
      style={{ padding: 24 }}
    >
      <SkeletonLoader width={80} height={14} style={{ marginBottom: 12 }} />
      <SkeletonLoader width={140} height={28} style={{ marginBottom: 8 }} />
      <SkeletonLoader width={100} height={14} />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 0',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <SkeletonLoader width={40} height={40} borderRadius={10} />
          <div style={{ flex: 1 }}>
            <SkeletonLoader width="60%" height={14} style={{ marginBottom: 6 }} />
            <SkeletonLoader width="30%" height={12} />
          </div>
          <SkeletonLoader width={80} height={20} />
        </div>
      ))}
    </div>
  );
}
