import React from 'react';

const StatCard = ({ title, value, icon: Icon, isCurrency = false, isDiff = false }) => {
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
    : new Intl.NumberFormat('id-ID').format(value);

  let valueClass = '';
  if (isDiff) {
    valueClass = value >= 0 ? 'positive' : 'negative';
  }

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>{title}</h3>
        {Icon && <Icon size={20} color="var(--accent-cyan)" />}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: '700' }} className={valueClass}>
        {isDiff && value > 0 ? '+' : ''}{formattedValue}
      </div>
    </div>
  );
};

export default StatCard;
