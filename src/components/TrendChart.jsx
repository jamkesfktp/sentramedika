import React from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const formatRupiah = (value) => {
  if (value >= 1e12) return `Rp ${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `Rp ${(value / 1e9).toFixed(1)}M`;
  if (value >= 1e6) return `Rp ${(value / 1e6).toFixed(1)}Jt`;
  return `Rp ${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}>
        <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: 'var(--text-main)' }}>{label}</p>
        {payload.map((entry, index) => {
          const isNegative = entry.value < 0;
          const color = isNegative ? 'var(--accent-red)' : entry.color;
          const formattedVal = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(entry.value);
          return (
            <div key={index} style={{ color: color, margin: '3px 0', fontSize: '14px' }}>
              {entry.name}: <span style={{ fontWeight: '600' }}>{formattedVal}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const TrendChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const dataMax = Math.max(...data.map(i => i.Selisih));
  const dataMin = Math.min(...data.map(i => i.Selisih));
  
  let off = 0;
  if (dataMax <= 0) off = 0;
  else if (dataMin >= 0) off = 1;
  else off = dataMax / (dataMax - dataMin);

  return (
    <div className="glass-card chart-section">
      <div className="section-title">
        {title || 'Tren Bulanan Pendapatan & Selisih'}
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset={off} stopColor="var(--accent-emerald)" stopOpacity={1} />
                <stop offset={off} stopColor="var(--accent-red)" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fontSize: 12}} />
            <YAxis yAxisId="left" stroke="var(--text-muted)" tickFormatter={formatRupiah} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" tickFormatter={formatRupiah} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.03)'}} />
            <Legend verticalAlign="top" height={36} />
            
            <Bar yAxisId="left" dataKey="INACBG" name="Tarif INACBG" fill="var(--accent-light-blue)" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="left" dataKey="iDRG" name="Tarif iDRG" fill="var(--accent-navy)" radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="Selisih" name="Selisih (iDRG - INACBG)" stroke="url(#splitColor)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
