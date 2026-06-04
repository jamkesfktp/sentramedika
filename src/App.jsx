import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ComparisonChart from './components/ComparisonChart';
import TrendChart from './components/TrendChart';
import DataTable from './components/DataTable';
import dataJson from './assets/data.json';
import { Users, Coins, Calculator, TrendingUp, Menu } from 'lucide-react';

const App = () => {
  const [selected, setSelected] = useState('All');
  const [ptdFilter, setPtdFilter] = useState('All'); // 'All', '1' (Ranap), '2' (Rajal)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const currentDataJson = dataJson[ptdFilter] || dataJson;
  const hospitals = currentDataJson.hospitals ? Object.keys(currentDataJson.hospitals) : [];
  
  const currentData = selected === 'All' 
    ? currentDataJson.summary 
    : currentDataJson.hospitals[selected].summary;

  const topUntung = selected === 'All' ? [] : currentDataJson.hospitals[selected].top25_untung;
  const topRugi = selected === 'All' ? [] : currentDataJson.hospitals[selected].top25_rugi;
  const topDiagUtama = selected === 'All' ? [] : currentDataJson.hospitals[selected].top10_diag_utama;
  const topDiagSekunder = selected === 'All' ? [] : currentDataJson.hospitals[selected].top10_diag_sekunder;
  const topTindakan = selected === 'All' ? [] : currentDataJson.hospitals[selected].top10_tindakan;
  
  const trendBulanan = selected === 'All' 
    ? (currentDataJson.trend_bulanan || []) 
    : (currentDataJson.hospitals[selected].trend_bulanan || []);

  const caseColumns = [
    { label: 'Kode INACBG', key: 'INACBG' },
    { label: 'Deskripsi INACBG', key: 'DESKRIPSI_INACBG' },
    { label: 'Kode iDRG', key: 'IDRG_DRG_CODE' },
    { label: 'Deskripsi iDRG', key: 'IDRG_DRG_DESCRIPTION' },
    { label: 'Jumlah Kasus', key: 'Jumlah_Kasus', type: 'number' },
    { label: 'Tarif INACBG', key: 'Total_Tarif_INACBG', type: 'currency' },
    { label: 'Tarif iDRG', key: 'Total_Tarif_iDRG', type: 'currency' },
    { label: 'Selisih', key: 'Total_Selisih', type: 'currency' }
  ];

  const top10Columns = [
    { label: 'Kode', key: 'Kode' },
    { label: 'Deskripsi', key: 'Deskripsi' },
    { label: 'Jumlah', key: 'Jumlah', type: 'number' },
    { label: 'Tarif INACBG', key: 'Total_Tarif_INACBG', type: 'currency' },
    { label: 'Tarif iDRG', key: 'Total_Tarif_iDRG', type: 'currency' }
  ];

  return (
    <div className="app-container">
      <Sidebar 
        hospitals={hospitals} 
        selectedHospital={selected} 
        onSelect={(h) => { setSelected(h); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="main-content">
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1>Dashboard Analisis iDRG vs INACBG</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {selected === 'All' ? 'Ringkasan Seluruh Cabang Sentra Medika' : `Detail Analisis Cabang ${selected}`}
              </p>
            </div>
          </div>
          <div className="header-filters" style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['All', '1', '2'].map((f) => (
              <button
                key={f}
                onClick={() => setPtdFilter(f)}
                style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  backgroundColor: ptdFilter === f ? 'var(--accent-red)' : 'transparent',
                  color: ptdFilter === f ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'All' ? 'Semua' : f === '1' ? 'Rawat Inap' : 'Rawat Jalan'}
              </button>
            ))}
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Kasus" value={currentData.total_cases} icon={Users} />
          <StatCard title="Total Tarif INACBG" value={currentData.tarif_inacbg} icon={Coins} isCurrency={true} />
          <StatCard title="Total Tarif iDRG" value={currentData.tarif_idrg} icon={Calculator} isCurrency={true} />
          <StatCard title="Selisih iDRG - INACBG" value={currentData.selisih} icon={TrendingUp} isCurrency={true} isDiff={true} />
        </div>

        {trendBulanan && trendBulanan.length > 0 && (
          <TrendChart data={trendBulanan} title={`Tren Pendapatan Bulanan (${selected === 'All' ? 'Semua Cabang' : selected})`} />
        )}

        {selected !== 'All' && (
          <>
            <ComparisonChart data={topUntung} title="Top 10 Kasus Menguntungkan (iDRG vs INACBG)" />
            <ComparisonChart data={topRugi} title="Top 10 Kasus Merugikan (iDRG vs INACBG)" />
            
            <DataTable 
              title="Top 25 Kasus Paling Menguntungkan" 
              data={topUntung} 
              columns={caseColumns} 
            />
            
            <DataTable 
              title="Top 25 Kasus Paling Merugikan" 
              data={topRugi} 
              columns={caseColumns} 
            />

            <DataTable 
              title="Top 10 Diagnosa Utama" 
              data={topDiagUtama} 
              columns={top10Columns} 
            />

            <DataTable 
              title="Top 10 Diagnosa Sekunder" 
              data={topDiagSekunder} 
              columns={top10Columns} 
            />

            <DataTable 
              title="Top 10 Tindakan" 
              data={topTindakan} 
              columns={top10Columns} 
            />
          </>
        )}
        
        {selected === 'All' && (
          <div className="glass-card table-section">
            <div className="section-title">
              <TrendingUp size={20} color="var(--accent-indigo)" />
              Perbandingan Pendapatan INACBG vs iDRG per Cabang
            </div>
            <div className="chart-wrapper">
              <ComparisonChart 
                data={hospitals.map(h => ({
                  name: h,
                  Total_Tarif_INACBG: currentDataJson.hospitals[h].summary.tarif_inacbg,
                  Total_Tarif_iDRG: currentDataJson.hospitals[h].summary.tarif_idrg,
                  fullDesc: `Cabang ${h}`
                }))} 
                title="" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
