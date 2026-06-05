import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert, Building2 } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import DataTable from './DataTable';

const CompetencyAnalysis = ({ data, selectedHospital }) => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  if (!data || !data.kompetensi) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Data Analisis Kompetensi belum tersedia untuk filter yang dipilih.
      </div>
    );
  }

  const { sesuai_kasus, sesuai_tarif, tidak_sesuai_kasus, tidak_sesuai_tarif, top_tidak_sesuai, top_sesuai, layanan_stats } = data.kompetensi;
  
  const total_kasus = sesuai_kasus + tidak_sesuai_kasus;
  const persen_sesuai = total_kasus > 0 ? ((sesuai_kasus / total_kasus) * 100).toFixed(1) : 0;
  const persen_tidak = total_kasus > 0 ? ((tidak_sesuai_kasus / total_kasus) * 100).toFixed(1) : 0;

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const layananColumns = [
    { label: 'Kelompok Layanan', key: 'Layanan' },
    { label: 'Jumlah Kasus Luar Kompetensi', key: 'Jumlah_Kasus', type: 'number' },
    { label: 'Total Potensi Risiko (Tarif iDRG)', key: 'Total_Tarif', type: 'currency' }
  ];

  const detailColumns = [
    { label: 'Kode ICD', key: 'KOMP_ICD_CODE' },
    { label: 'Nama Penyakit', key: 'KOMP_ICD_NAMA' },
    { label: 'Kelompok Layanan', key: 'KOMP_LAYANAN' },
    { label: 'Level Dibutuhkan', key: 'KOMP_REQ' },
    { label: 'Kompetensi RS', key: 'KOMP_RS_LVL' },
    { label: 'Jumlah Kasus', key: 'Jumlah_Kasus', type: 'number' },
    { label: 'Total Risiko Tarif', key: 'Total_Tarif_iDRG', type: 'currency' }
  ];

  // Data for Pie Chart
  const pieData = [
    { name: 'Sesuai Kompetensi', value: sesuai_kasus },
    { name: 'Di Luar Kompetensi', value: tidak_sesuai_kasus }
  ];
  const COLORS = ['#14b8a6', '#ef4444'];

  // Custom Tooltip for Scatter
  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--card-shadow)', fontSize: '0.875rem' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>{data.KOMP_ICD_CODE} - {data.KOMP_ICD_NAMA}</p>
          <p style={{ color: 'var(--text-main)' }}>Layanan: {data.KOMP_LAYANAN}</p>
          <p style={{ color: 'var(--text-main)' }}>Jumlah Kasus: <strong>{data.Jumlah_Kasus}</strong></p>
          <p style={{ color: '#ef4444' }}>Potensi Risiko: <strong>{formatCurrency(data.Total_Tarif_iDRG)}</strong></p>
        </div>
      );
    }
    return null;
  };

  const CustomScatterTooltipSesuai = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--card-shadow)', fontSize: '0.875rem' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>{data.KOMP_ICD_CODE} - {data.KOMP_ICD_NAMA}</p>
          <p style={{ color: 'var(--text-main)' }}>Layanan: {data.KOMP_LAYANAN}</p>
          <p style={{ color: 'var(--text-main)' }}>Jumlah Kasus: <strong>{data.Jumlah_Kasus}</strong></p>
          <p style={{ color: 'var(--accent-teal)' }}>Pendapatan Tarif: <strong>{formatCurrency(data.Total_Tarif_iDRG)}</strong></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} />
                DISCLAIMER MAPPING KOMPETENSI
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                Mapping kompetensi layanan pada aplikasi ini didasarkan pada file yang beredar di grup telegram organisasi casemix atau forum diskusi casemix, dan <strong>bukan</strong> merupakan pedoman kompetensi resmi yang dikeluarkan oleh Kementerian Kesehatan Republik Indonesia. Mapping kompetensi ICD yang valid adalah yang dikeluarkan resmi oleh Kementerian Kesehatan.
              </p>
            </div>
            <button 
              onClick={() => setShowDisclaimer(false)}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem 0.75rem', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* RS Indicator Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--accent-navy)', color: 'white', borderRadius: '12px', boxShadow: 'var(--card-shadow)' }}>
        <Building2 size={24} />
        <div>
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Data Analisis Kompetensi: {selectedHospital === 'All' ? 'Seluruh Cabang Sentra Medika' : `Cabang ${selectedHospital}`}</h2>
          <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: 0, marginTop: '2px' }}>Total {total_kasus} kasus klaim dianalisis terhadap standar kompetensi</p>
        </div>
      </div>

      {/* Management Insight Card */}
      <div className="glass-card" style={{ padding: '1.5rem', background: 'linear-gradient(to right, rgba(21, 30, 61, 0.05), transparent)' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-navy)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>
          <Info size={20} /> Insight Profesional Manajemen
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', margin: 0 }}>
          Berdasarkan data saat ini, <strong>{persen_tidak}% ({tidak_sesuai_kasus} kasus)</strong> ditangani di luar dari kompetensi optimal rumah sakit, 
          yang membuka potensi selisih tarif atau risiko audit sebesar <strong>{formatCurrency(tidak_sesuai_tarif)}</strong>. 
          Manajemen disarankan untuk mengevaluasi kelompok layanan tertinggi pada tabel rekapitulasi di bawah, 
          baik melalui peningkatan kapasitas fasilitas dan kredensial DPJP, maupun melakukan perbaikan rujukan kasus kompleks.
        </p>
      </div>

      {/* Main Stats and Pie Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-teal)' }}>
            <div style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: '50%', padding: '1rem' }}>
              <CheckCircle size={28} color="var(--accent-teal)" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Sesuai Kompetensi</p>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{sesuai_kasus} Kasus <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({persen_sesuai}%)</span></h2>
              <p style={{ color: 'var(--accent-teal)', fontWeight: '600', fontSize: '1.1rem' }}>{formatCurrency(sesuai_tarif)}</p>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', padding: '1rem' }}>
              <AlertTriangle size={28} color="#ef4444" />
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Di Luar Kompetensi</p>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{tidak_sesuai_kasus} Kasus <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({persen_tidak}%)</span></h2>
              <p style={{ color: '#ef4444', fontWeight: '600', fontSize: '1.1rem' }}>{formatCurrency(tidak_sesuai_tarif)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1rem' }}>Komposisi Kasus</h3>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Kasus`, 'Jumlah']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Scatter Plots Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Scatter Plot Sesuai Kompetensi */}
        {top_sesuai && top_sesuai.length > 0 && (
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <CheckCircle size={20} color="var(--accent-teal)" />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Peta Kasus: Sesuai Kompetensi</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Visualisasi penyakit dengan kompetensi yang sesuai. Kuadran kanan atas adalah tulang punggung (<em>backbone</em>) layanan Anda.
            </p>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" dataKey="Jumlah_Kasus" name="Volume" 
                    label={{ value: 'Jumlah Kasus', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)' }} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" dataKey="Total_Tarif_iDRG" name="Tarif" 
                    label={{ value: 'Pendapatan Tarif (iDRG)', angle: -90, position: 'insideLeft', offset: 0, fill: 'var(--text-muted)' }} 
                    tickFormatter={(val) => `Rp ${(val/1000000).toFixed(0)}M`}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomScatterTooltipSesuai />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Diagnosa" data={top_sesuai} fill="var(--accent-teal)" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Scatter Plot Tidak Sesuai */}
      {top_tidak_sesuai && top_tidak_sesuai.length > 0 && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>Peta Risiko: Kasus Di Luar Kompetensi (Kuadran Risiko)</h3>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Grafik ini memetakan penyakit berdasarkan <strong>Volume Kasus (Sumbu X)</strong> dan <strong>Risiko Finansial (Sumbu Y)</strong>. Titik di sudut kanan atas menunjukkan penyakit dengan risiko dan jumlah kasus paling tinggi.
          </p>
            <div style={{ width: '100%', height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="Jumlah_Kasus" 
                    name="Volume Kasus" 
                    label={{ value: 'Jumlah Kasus', position: 'insideBottom', offset: -10, fill: 'var(--text-muted)' }} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="Total_Tarif_iDRG" 
                    name="Risiko Tarif (Rp)" 
                    label={{ value: 'Potensi Risiko Tarif (iDRG)', angle: -90, position: 'insideLeft', offset: 0, fill: 'var(--text-muted)' }} 
                    tickFormatter={(val) => `Rp ${(val/1000000).toFixed(0)}M`}
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Diagnosa" data={top_tidak_sesuai} fill="#ef4444" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Tables */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {layanan_stats && layanan_stats.length > 0 && (
          <DataTable 
            title="Rekapitulasi Risiko Berdasarkan Kelompok Layanan" 
            data={layanan_stats.sort((a,b) => b.Total_Tarif - a.Total_Tarif)} 
            columns={layananColumns} 
          />
        )}

        {top_tidak_sesuai && top_tidak_sesuai.length > 0 && (
          <DataTable 
            title="Top 50 Rincian Kasus Penyakit (ICD) Di Luar Kompetensi" 
            data={top_tidak_sesuai} 
            columns={detailColumns} 
          />
        )}
      </div>

    </div>
  );
};

export default CompetencyAnalysis;
