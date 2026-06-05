import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
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

  const { sesuai_kasus, sesuai_tarif, tidak_sesuai_kasus, tidak_sesuai_tarif, top_tidak_sesuai, layanan_stats } = data.kompetensi;
  
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {showDisclaimer && (
        <div className="glass-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} />
                DISCLAIMER PENGGUNAAN APLIKASI
              </h3>
              <ul style={{ fontSize: '0.875rem', color: 'var(--text-main)', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <li>Data yang Anda masukkan adalah benar.</li>
                <li>Anda bertanggung jawab penuh atas penggunaan akun Anda.</li>
                <li>Data berikut bersifat rahasia dan hanya ditujukan untuk penggunaan individu atau entitas yang dituju/disetujui/berhak.</li>
                <li>Aplikasi Ini Diproses di Browser lokal dan tidak dikirimkan atau di simpan di Server manapun atau Pihak ke 3</li>
                <li>Apabila data yang Anda terima terdapat kesalahan isi/konten, harap segera memberitahukan kepada Manajemen.</li>
                <li>Anda tidak diperkenankan menyebarkan, mendistribusikan atau menyalin data ini.</li>
                <li>Segala tindakan penyalahgunaan terhadap data ini bukan menjadi tanggung jawab kami.</li>
              </ul>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--accent-teal)' }}>
          <div style={{ pading: '1rem', backgroundColor: 'rgba(20, 184, 166, 0.1)', borderRadius: '50%', padding: '1rem' }}>
            <CheckCircle size={28} color="var(--accent-teal)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Sesuai Kompetensi</p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{sesuai_kasus} Kasus <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({persen_sesuai}%)</span></h2>
            <p style={{ color: 'var(--accent-teal)', fontWeight: '600', fontSize: '1.1rem' }}>{formatCurrency(sesuai_tarif)}</p>
          </div>
        </div>
        
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #ef4444' }}>
          <div style={{ pading: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', padding: '1rem' }}>
            <AlertTriangle size={28} color="#ef4444" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Di Luar Kompetensi</p>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{tidak_sesuai_kasus} Kasus <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>({persen_tidak}%)</span></h2>
            <p style={{ color: '#ef4444', fontWeight: '600', fontSize: '1.1rem' }}>{formatCurrency(tidak_sesuai_tarif)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <Info size={20} color="var(--accent-blue)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
          <strong>Info:</strong> Analisis ini membandingkan <strong>Kode ICD Primer</strong> dari setiap klaim dengan kamus kompetensi layanan. Kasus ditandai sebagai "Di Luar Kompetensi" jika tingkat kompetensi yang dimiliki {selectedHospital === 'All' ? 'Rumah Sakit' : `Cabang ${selectedHospital}`} lebih rendah dari tingkat yang dibutuhkan oleh standar kompetensi.
        </p>
      </div>

      {layanan_stats && layanan_stats.length > 0 && (
        <DataTable 
          title="Rekapitulasi Layanan Di Luar Kompetensi" 
          data={layanan_stats.sort((a,b) => b.Total_Tarif - a.Total_Tarif)} 
          columns={layananColumns} 
        />
      )}

      {top_tidak_sesuai && top_tidak_sesuai.length > 0 && (
        <DataTable 
          title="Top 50 Rincian Kasus Di Luar Kompetensi" 
          data={top_tidak_sesuai} 
          columns={detailColumns} 
        />
      )}

    </div>
  );
};

export default CompetencyAnalysis;
