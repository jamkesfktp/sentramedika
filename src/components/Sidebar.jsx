import React from 'react';
import { Activity, LayoutDashboard, Building2, X } from 'lucide-react';

const Sidebar = ({ hospitals, selectedHospital, onSelect, isOpen, onClose }) => {
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
        <div className="nav-item" onClick={() => onSelect('All')} className={`nav-item ${selectedHospital === 'All' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Overview Semua Cabang
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
      </div>
    </div>
  );
};

export default Sidebar;
