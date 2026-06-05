import React from 'react';
import { Activity, LayoutDashboard, Building2, X, ClipboardCheck } from 'lucide-react';

const Sidebar = ({ hospitals, selectedHospital, onSelect, isOpen, onClose, activeMenu, setActiveMenu, onLogout, userRole }) => {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-title" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="logo-icon"><Activity size={18} strokeWidth={3} /></span>
          Sentra Medika
        </div>
        <button className="mobile-close-btn" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>
      
      <div className="sidebar-nav-scroll">
            <div className="nav-section">Lokasi Data</div>
        {userRole === 'admin' && (
          <div 
            onClick={() => onSelect('All')}
            className={`nav-item ${selectedHospital === 'All' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            Overview Semua Cabang
          </div>
        )}
        
        <div 
          onClick={() => setActiveMenu('kompetensi')} 
          className={`nav-item ${activeMenu === 'kompetensi' ? 'active' : ''}`}
        >
          <ClipboardCheck size={20} />
          Analisis Kompetensi
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
          Cabang RS
        </div>
        
        {hospitals.map(hosp => (
          <div 
            key={hosp} 
            onClick={() => onSelect(hosp)}
            className={`nav-item ${selectedHospital === hosp ? 'active' : ''}`}
          >
            <Building2 size={20} />
            {hosp}
          </div>
        ))}
        
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div 
            onClick={onLogout} 
            className="nav-item"
            style={{ color: '#ef4444' }}
          >
            <X size={20} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
