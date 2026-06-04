import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ComparisonChart from './components/ComparisonChart';
import DataTable from './components/DataTable';
import dataJson from './assets/data.json';
import { Users, Coins, Calculator, TrendingUp } from 'lucide-react';

const App = () => {
  const [selected, setSelected] = useState('All');
  
  const hospitals = Object.keys(dataJson.hospitals);
  
  const currentData = selected === 'All' 
    ? dataJson.summary 
    : dataJson.hospitals[selected].summary;

  const topUntung = selected === 'All' ? [] : dataJson.hospitals[selected].top25_untung;
  const topRugi = selected === 'All' ? [] : dataJson.hospitals[selected].top25_rugi;
  const topDiagUtama = selected === 'All' ? [] : dataJson.hospitals[selected].top10_diag_utama;
  const topTindakan = selected === 'All' ? [] : dataJson.hospitals[selected].top10_tindakan;

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
        onSelect={setSelected} 
      />
      
      <div className="main-content">
        <div className="header">
          <div>
            <h1>Dashboard Analisis iDRG vs INACBG</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {selected === 'All' ? 'Ringkasan Seluruh Cabang Sentra Medika' : `Detail Analisis Cabang ${selected}`}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="Total Kasus" value={currentData.total_cases} icon={Users} />
          <StatCard title="Total Tarif INACBG" value={currentData.tarif_inacbg} icon={Coins} isCurrency={true} />
          <StatCard title="Total Tarif iDRG" value={currentData.tarif_idrg} icon={Calculator} isCurrency={true} />
          <StatCard title="Selisih iDRG - INACBG" value={currentData.selisih} icon={TrendingUp} isCurrency={true} isDiff={true} />
        </div>

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
                  INACBG: dataJson.hospitals[h].summary.tarif_inacbg,
                  iDRG: dataJson.hospitals[h].summary.tarif_idrg,
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
