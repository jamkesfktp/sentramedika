import React from 'react';
import { Table } from 'lucide-react';

const DataTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('id-ID').format(val);

  return (
    <div className="glass-card table-section">
      <div className="section-title">
        <Table size={20} color="var(--accent-cyan)" />
        {title}
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((col, colIdx) => {
                  let val = row[col.key];
                  let displayVal = val;
                  let className = '';

                  if (col.type === 'currency') displayVal = formatCurrency(val);
                  else if (col.type === 'number') displayVal = formatNumber(val);

                  if (col.key === 'Total_Selisih' || col.key === 'selisih') {
                    className = val >= 0 ? 'positive' : 'negative';
                    if (val > 0) displayVal = '+' + displayVal;
                  }

                  return <td key={colIdx} className={className}>{displayVal}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
