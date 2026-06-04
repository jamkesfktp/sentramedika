import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

const ComparisonChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;
  
  const chartData = data.map(item => {
    // Determine the label name dynamically
    const desc = item.name || item.Deskripsi || item.IDRG_DRG_DESCRIPTION || item.DESKRIPSI_INACBG || 'Unknown';
    return {
      name: desc.length > 15 ? desc.substring(0, 15) + '...' : desc,
      // Support either direct INACBG/iDRG properties or the Total_Tarif_* properties
      INACBG: item.INACBG !== undefined ? item.INACBG : (item.Total_Tarif_INACBG || item.Total_INACBG || 0),
      iDRG: item.iDRG !== undefined ? item.iDRG : (item.Total_Tarif_iDRG || item.Total_iDRG || 0),
      fullDesc: item.fullDesc || desc
    };
  }).slice(0, 10);

  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { notation: 'compact', compactDisplay: 'short' }).format(val);

  return (
    <div className="glass-card chart-section">
      <div className="section-title">
        <BarChart3 size={20} color="var(--accent-indigo)" />
        {title}
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fontSize: 12}} angle={-45} textAnchor="end" interval={0} height={60} />
            <YAxis stroke="var(--text-muted)" tickFormatter={formatRupiah} />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)}
              contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
              cursor={{fill: 'rgba(0,0,0,0.03)'}}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="INACBG" fill="var(--accent-light-blue)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="iDRG" fill="var(--accent-navy)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
