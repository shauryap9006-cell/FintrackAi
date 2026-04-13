'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  AreaChart, Area,
} from 'recharts';
import ThreeDIncomeExpenseChart from './ThreeDIncomeExpenseChart';

/* ── Color palette ── */
const COLORS = [
  '#818cf8', '#34d399', '#f59e0b', '#f87171',
  '#ec4899', '#a78bfa', '#38bdf8', '#fb923c',
];

/* ── Shared tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(10, 10, 20, 0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      padding: '12px 18px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(16px)',
    }}>
      {label && (
        <p style={{
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 6,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          {label}
        </p>
      )}
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: i > 0 ? 4 : 0 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color || '#818cf8' }} />
          <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
            ₹{entry.value?.toLocaleString('en-IN')}
          </p>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════ */
/*  Monthly Spending – Area Chart             */
/* ═══════════════════════════════════════════ */
export function MonthlyChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity={0.30} />
              <stop offset="60%" stopColor="#818cf8" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            fontSize={11}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            axisLine={false}
            dy={8}
          />
          <YAxis
            fontSize={10}
            stroke="rgba(255,255,255,0.2)"
            tickLine={false}
            axisLine={false}
            width={50}
            tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(129,140,248,0.15)', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#818cf8"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#areaGrad)"
            dot={false}
            activeDot={{ fill: '#a5b4fc', stroke: '#818cf8', strokeWidth: 2, r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Category Breakdown – Donut Chart          */
/* ═══════════════════════════════════════════ */
export function CategoryChart({ data = [] }) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="46%"
            outerRadius={100}
            innerRadius={60}
            paddingAngle={3}
            strokeWidth={0}
            cornerRadius={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={40}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 500,
                marginLeft: 2,
              }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*  Income vs Expense – Bar Chart (Recharts)  */
/* ═══════════════════════════════════════════ */
export function IncomeExpenseChart({ income = 0, expense = 0 }) {
  // Use actual database totals passed as props
  const chartData = [
    { name: 'Summary', income, expense }
  ];

  // Dynamically calculate Y-axis max based on actual data
  const maxValue = Math.max(income, expense, 1000);
  const yMax = Math.ceil(maxValue / 5000) * 5000;

  return (
    <div style={{ width: '100%', height: 340, marginTop: 24 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 24 }} barGap={24}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            fontSize={13}
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
            dy={16} // Increased spacing from axis
          />
          <YAxis
            fontSize={12}
            stroke="rgba(255,255,255,0.5)"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v === 0 ? '₹0' : `₹${(v / 1000).toFixed(0)}k`}
            domain={[0, yMax]}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{
              background: 'rgba(10, 10, 20, 0.92)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(16px)',
              color: '#fff',
            }}
            itemStyle={{ fontWeight: 600 }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: 8, fontSize: 12 }}
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
          />
          <Bar dataKey="income" name="Income" fill="#1D9E75" radius={[6, 6, 0, 0]} barSize={50} />
          <Bar dataKey="expense" name="Expense" fill="#E24B4A" radius={[6, 6, 0, 0]} barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
