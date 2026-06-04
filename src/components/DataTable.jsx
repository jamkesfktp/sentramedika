import React from 'react';
import { Table, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const DataTable = ({ title, data, columns }) => {
  if (!data || data.length === 0) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('id-ID').format(val);

  const handleDownload = () => {
    // Format data for Excel
    const excelData = data.map(row => {
      let newRow = {};
      columns.forEach(col => {
        newRow[col.label] = row[col.key];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${title.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
  };

  return (
    <div className="glass-card table-section">
      <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Table size={20} color="var(--accent-navy)" />
          {title}
        </div>
        <button 
          onClick={handleDownload}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', 
            backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', 
            borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500',
            color: 'var(--text-main)', transition: 'background-color 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-main)'}
        >
          <Download size={16} /> Download Excel
        </button>
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
