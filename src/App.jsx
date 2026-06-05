import React, { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import ComparisonChart from './components/ComparisonChart';
import TrendChart from './components/TrendChart';
import DataTable from './components/DataTable';
import Login from './components/Login';
import CompetencyAnalysis from './components/CompetencyAnalysis';
import dataJson from './assets/data.json';
import { Users, Coins, Calculator, TrendingUp, Menu, Calendar } from 'lucide-react';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selected, setSelected] = useState('All');
  const [ptdFilter, setPtdFilter] = useState('All'); // 'All', '1' (Ranap), '2' (Rajal)
  const [selectedMonths, setSelectedMonths] = useState(['All']);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleMonthToggle = (month) => {
    if (month === 'All') {
      setSelectedMonths(['All']);
    } else {
      let newMonths = selectedMonths.filter(m => m !== 'All');
      if (newMonths.includes(month)) {
        newMonths = newMonths.filter(m => m !== month);
      } else {
        newMonths.push(month);
      }
      if (newMonths.length === 0) newMonths = ['All'];
      setSelectedMonths(newMonths);
    }
  };

  const hospitals = dataJson.hospitals.filter(h => h !== 'All');
  const availableMonths = dataJson.months || [];

  // Computed Data Merging Logic for Multiple Months
  const computedData = useMemo(() => {
    const monthsToProcess = selectedMonths.includes('All') ? ['All'] : selectedMonths;
    
    // Get nodes based on selected months
    const nodes = monthsToProcess.map(m => {
      const monthData = dataJson.data[m];
      if (!monthData) return null;
      const ptdData = monthData[ptdFilter];
      if (!ptdData) return null;
      return selected === 'All' ? ptdData : ptdData.hospitals[selected];
    }).filter(n => n !== null);

    const summary = { total_cases: 0, tarif_inacbg: 0, tarif_idrg: 0, tarif_rs: 0, selisih: 0 };
    
    nodes.forEach(n => {
      summary.total_cases += n.summary.total_cases || 0;
      summary.tarif_inacbg += n.summary.tarif_inacbg || 0;
      summary.tarif_idrg += n.summary.tarif_idrg || 0;
      summary.tarif_rs += n.summary.tarif_rs || 0;
      summary.selisih += n.summary.selisih || 0;
    });

    const mergeLists = (listName, idKeys, sumKeys) => {
      const map = {};
      nodes.forEach(node => {
        (node[listName] || []).forEach(item => {
          const id = idKeys.map(k => item[k]).join('|');
          if (!map[id]) map[id] = { ...item };
          else {
            sumKeys.forEach(k => { map[id][k] = (map[id][k] || 0) + (item[k] || 0); });
          }
        });
      });
      return Object.values(map);
    };

    const topUntung = mergeLists('top50_untung', ['INACBG', 'IDRG_DRG_CODE'], ['Jumlah_Kasus', 'Total_Tarif_INACBG', 'Total_Tarif_iDRG', 'Total_Tarif_RS', 'Total_Selisih'])
      .sort((a,b) => b.Total_Selisih - a.Total_Selisih).slice(0, 25);
      
    const topRugi = mergeLists('top50_rugi', ['INACBG', 'IDRG_DRG_CODE'], ['Jumlah_Kasus', 'Total_Tarif_INACBG', 'Total_Tarif_iDRG', 'Total_Tarif_RS', 'Total_Selisih'])
      .sort((a,b) => a.Total_Selisih - b.Total_Selisih).slice(0, 25);
      
    const topDiagUtama = mergeLists('top50_diag_utama', ['Kode'], ['Jumlah', 'Total_Tarif_INACBG', 'Total_Tarif_iDRG', 'Total_Tarif_RS'])
      .sort((a,b) => b.Jumlah - a.Jumlah).slice(0, 10);
      
    const topDiagSekunder = mergeLists('top50_diag_sekunder', ['Kode'], ['Jumlah', 'Total_Tarif_INACBG', 'Total_Tarif_iDRG', 'Total_Tarif_RS'])
      .sort((a,b) => b.Jumlah - a.Jumlah).slice(0, 10);
      
    const topTindakan = mergeLists('top50_tindakan', ['Kode'], ['Jumlah', 'Total_Tarif_INACBG', 'Total_Tarif_iDRG', 'Total_Tarif_RS'])
      .sort((a,b) => b.Jumlah - a.Jumlah).slice(0, 10);

    // Trend chart should just use the trend data from "All" month selection so it shows the whole history
    // If user explicitly filters by a specific month, we can either filter the trend or keep it full.
    // The requirement was: "tampilkan sesuai bulan". So if they filter by month, trend only shows those months.
    let trendBulanan = [];
    if (selectedMonths.includes('All')) {
      const allNode = selected === 'All' ? dataJson.data['All'][ptdFilter] : dataJson.data['All'][ptdFilter].hospitals[selected];
      trendBulanan = allNode ? (allNode.trend_bulanan || []) : [];
    } else {
      const allNode = selected === 'All' ? dataJson.data['All'][ptdFilter] : dataJson.data['All'][ptdFilter].hospitals[selected];
      const allTrend = allNode ? (allNode.trend_bulanan || []) : [];
      trendBulanan = allTrend.filter(t => selectedMonths.includes(t.name));
    }

    // Prepare global Comparison data across hospitals
    const comparisonHospitals = hospitals.map(h => {
      let hInacbg = 0;
      let hIdrg = 0;
      monthsToProcess.forEach(m => {
        const hNode = dataJson.data[m]?.[ptdFilter]?.hospitals[h];
        if (hNode) {
          hInacbg += hNode.summary.tarif_inacbg || 0;
          hIdrg += hNode.summary.tarif_idrg || 0;
        }
      });
      return {
        name: h,
        Total_Tarif_INACBG: hInacbg,
        Total_Tarif_iDRG: hIdrg,
        fullDesc: `Cabang ${h}`
      };
    });

    return {
      summary, topUntung, topRugi, topDiagUtama, topDiagSekunder, topTindakan, trendBulanan, comparisonHospitals
    };
  }, [selected, ptdFilter, selectedMonths]);

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

  return !isAuthenticated ? (
    <Login onLogin={() => setIsAuthenticated(true)} />
  ) : (
    <div className="app-container">
      <Sidebar 
        hospitals={hospitals} 
        selectedHospital={selected} 
        onSelect={(h) => { setSelected(h); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onLogout={() => setIsAuthenticated(false)}
      />
      
      <div className="main-content">
        <div className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <h1>Dashboard {activeMenu === 'kompetensi' ? 'Analisis Kompetensi' : 'Analisis iDRG vs INACBG'}</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {selected === 'All' ? 'Ringkasan Seluruh Cabang Sentra Medika' : `Detail Analisis Cabang ${selected}`}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {/* PTD Filter */}
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
                  {f === 'All' ? 'Semua PTD' : f === '1' ? 'Rawat Inap' : 'Rawat Jalan'}
                </button>
              ))}
            </div>

            {/* Month Filter */}
            <div className="header-filters" style={{ display: 'flex', gap: '1rem', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}>
                <Calendar size={16} style={{ marginRight: '6px' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Filter Bulan:</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {['All', ...availableMonths].map((m) => (
                  <label
                    key={m}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      color: 'var(--text-main)',
                      fontWeight: selectedMonths.includes(m) ? '600' : '400'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMonths.includes(m)}
                      onChange={() => handleMonthToggle(m)}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent-indigo)', width: '16px', height: '16px' }}
                    />
                    {m === 'All' ? 'Semua Bulan' : m}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activeMenu === 'kompetensi' ? (
          <div style={{ marginTop: '1.5rem' }}>
            <CompetencyAnalysis 
              data={selectedMonths.includes('All') ? 
                (selected === 'All' ? dataJson.data['All'][ptdFilter] : dataJson.data['All'][ptdFilter].hospitals[selected]) 
                : null /* If multiple months selected, you may need a merged competence object, or just pass the first month for now. We assume 'All' month works. */}
              selectedHospital={selected}
            />
          </div>
        ) : (
          <>
            <div className="stats-grid">
              <StatCard title="Total Kasus" value={computedData.summary.total_cases} icon={Users} />
              <StatCard title="Total Tarif INACBG" value={computedData.summary.tarif_inacbg} icon={Coins} isCurrency={true} />
              <StatCard title="Total Tarif iDRG" value={computedData.summary.tarif_idrg} icon={Calculator} isCurrency={true} />
              <StatCard title="Selisih iDRG - INACBG" value={computedData.summary.selisih} icon={TrendingUp} isCurrency={true} isDiff={true} />
            </div>

            {computedData.trendBulanan && computedData.trendBulanan.length > 0 && (
              <TrendChart data={computedData.trendBulanan} title={`Tren Pendapatan Bulanan (${selected === 'All' ? 'Semua Cabang' : selected})`} />
            )}

            {selected !== 'All' && (
              <>
                <ComparisonChart data={computedData.topUntung} title="Top 10 Kasus Menguntungkan (iDRG vs INACBG)" />
                <ComparisonChart data={computedData.topRugi} title="Top 10 Kasus Merugikan (iDRG vs INACBG)" />
                
                <DataTable 
                  title="Top 25 Kasus Paling Menguntungkan" 
                  data={computedData.topUntung} 
                  columns={caseColumns} 
                />
                
                <DataTable 
                  title="Top 25 Kasus Paling Merugikan" 
                  data={computedData.topRugi} 
                  columns={caseColumns} 
                />

                <DataTable 
                  title="Top 10 Diagnosa Utama" 
                  data={computedData.topDiagUtama} 
                  columns={top10Columns} 
                />

                <DataTable 
                  title="Top 10 Diagnosa Sekunder" 
                  data={computedData.topDiagSekunder} 
                  columns={top10Columns} 
                />

                <DataTable 
                  title="Top 10 Tindakan" 
                  data={computedData.topTindakan} 
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
                    data={computedData.comparisonHospitals} 
                    title="" 
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
