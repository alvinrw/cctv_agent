import { useState } from 'react';
import {
  Camera, Cpu, AlertTriangle, ShieldAlert, Sparkles, TrendingUp,
  MapPin, CheckCircle, ArrowUp, Activity, HelpCircle
} from 'lucide-react';

export default function OverviewTab({
  sites,
  filteredSites,
  selectedSite,
  totalCCTV,
  totalCCTVOnline,
  totalCCTVOffline,
  allIncidents,
  setActiveSubTab,
  setSelectedSite
}) {
  const [selectedMapMarker, setSelectedMapMarker] = useState(null);

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid #E3E6EE',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  };

  const badgeStyle = (bg, color) => ({
    background: bg,
    color: color,
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px'
  });

  return (
    <section style={{ marginTop: '32px' }}>
      <div className="container animate-tab-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>Operational Overview</h2>
              <p style={{ fontSize: '13px', color: 'var(--outline)', margin: '4px 0 0' }}>Real-time telemetry and incident tracking across active zones.</p>
            </div>
          </div>

          {/* KPI Bento Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {/* Active Cameras */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--outline)' }}>Active Cameras</span>
                <span style={{ background: 'rgba(30, 73, 226, 0.08)', color: 'var(--brand-primary)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <Camera size={16} />
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>30/32</span>
              </div>
            </div>

            {/* Active Policies */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--outline)' }}>Active Policies</span>
                <span style={{ background: 'rgba(30, 73, 226, 0.08)', color: 'var(--brand-primary)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <Cpu size={16} />
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>15</span>
                <span style={{ fontSize: '12px', color: 'var(--outline)' }}>System</span>
              </div>
            </div>

            {/* Active Alerts */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--outline)' }}>Active Alerts</span>
                <span style={{ background: 'rgba(255, 196, 0, 0.1)', color: '#D97706', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <AlertTriangle size={16} />
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>5</span>
                <span style={badgeStyle('rgba(255, 196, 0, 0.15)', '#D97706')}>Action Req</span>
              </div>
            </div>

            {/* Open Incidents */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--outline)' }}>Open Incidents</span>
                <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                  <ShieldAlert size={16} />
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>3</span>
                <span style={badgeStyle('rgba(239, 68, 68, 0.1)', '#EF4444')}>Critical</span>
              </div>
            </div>
          </div>

          {/* Middle Layout: Map & Alerts */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', minHeight: '400px' }} className="db-layout-grid">
            
            {/* Operational Map */}
            <div style={{ ...cardStyle, boxShadow: 'none' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operational Map: Mine Site Alpha
              </h3>

              {/* Map Canvas Visualizer */}
              <div style={{
                width: '100%',
                height: '520px',
                position: 'relative',
                backgroundImage: 'url("/mine_site_satellite.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Grid overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                  backgroundSize: '30px 30px', pointerEvents: 'none'
                }} />

                {/* Connecting lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  {(filteredSites || sites || []).map(s => {
                    if (s.id === 'workshop-main') return null;
                    return (
                      <line
                        key={s.id}
                        x1="45%" y1="55%"
                        x2={s.x} y2={s.y}
                        stroke={s.status === 'ALERT' ? 'rgba(255,77,77,0.5)' : 'rgba(255,193,7,0.5)'}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    );
                  })}
                </svg>

                {/* Pins */}
                {(filteredSites || sites || []).map(s => {
                  const isSelected = selectedSite && selectedSite.id === s.id;
                  const isAlert = s.status === 'ALERT';
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedSite(s);
                        setActiveSubTab('map');
                      }}
                      style={{
                        position: 'absolute', left: s.x, top: s.y,
                        transform: 'translate(-50%, -50%)', background: 'none',
                        border: 'none', cursor: 'pointer', padding: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        zIndex: isSelected ? 10 : 2
                      }}
                    >
                      <div style={{
                        position: 'relative', width: '22px', height: '22px',
                        display: 'flex', alignItems: 'center', justify: 'center'
                      }}>
                        <div style={{
                          position: 'absolute', width: '100%', height: '100%',
                          borderRadius: '50%', background: isAlert ? '#ff4d4d' : '#FFC107',
                          animation: 'mapPulse 1.8s infinite', opacity: 0.45
                        }} />
                        <div style={{
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: isAlert ? '#ff4d4d' : '#FFC107',
                          border: isSelected ? '2px solid white' : '1px solid rgba(0,0,0,0.5)',
                          boxShadow: '0 0 6px rgba(0,0,0,0.6)'
                        }} />
                      </div>
                      <span style={{
                        marginTop: '2px', background: isSelected ? 'var(--brand-primary)' : 'rgba(11,29,58,0.9)',
                        color: 'white', fontSize: '8px', fontWeight: 700, padding: '2px 6px',
                        borderRadius: '4px', whiteSpace: 'nowrap', border: isSelected ? '1px solid #FFC107' : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        backdropFilter: isSelected ? 'none' : 'blur(2px)'
                      }}>
                        {s.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Alerts Feed */}
            <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Recent Alerts
                </h3>
                <button
                  onClick={() => setActiveSubTab('incident-center')}
                  style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  View All
                </button>
              </div>
              
              {/* Alerts Scroll list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, maxHeight: '460px' }}>
                
                {/* Alert Item 1 */}
                <div style={{
                  padding: '12px', borderRadius: '8px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer'
                }} onClick={() => setActiveSubTab('incident-center')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>Unauthorized Vehicle</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--outline)' }}>10:42 AM</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--outline)' }}>Camera 12 - Crusher Zone</span>
                  <div style={{ marginTop: '4px' }}>
                    <span style={badgeStyle('rgba(255,196,0,0.1)', '#D97706')}>
                      <Activity size={10} /> Agent Analyzing
                    </span>
                  </div>
                </div>

                {/* Alert Item 2 */}
                <div style={{
                  padding: '12px', borderRadius: '8px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer'
                }} onClick={() => setActiveSubTab('incident-center')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>PPE Violation</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--outline)' }}>10:15 AM</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--outline)' }}>Camera 05 - Loading Area A</span>
                </div>

                {/* Alert Item 3 */}
                <div style={{
                  padding: '12px', borderRadius: '8px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer'
                }} onClick={() => setActiveSubTab('incident-center')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>Camera Offline</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--outline)' }}>09:30 AM</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--outline)' }}>Camera 22 - Workshop Ext</span>
                </div>

                {/* Alert Item 4 */}
                <div style={{
                  padding: '12px', borderRadius: '8px', background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer'
                }} onClick={() => setActiveSubTab('incident-center')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>Speeding Detected</span>
                    <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--outline)' }}>08:55 AM</span>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--outline)' }}>Camera 08 - Main Haul Road</span>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom Section: Table & Analytics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }} className="db-layout-grid">
            
            {/* Incident Summary Table */}
            <div style={{ ...cardStyle, overflowX: 'auto' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Incident Summary
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(195,198,212,0.3)', paddingBottom: '8px' }}>
                    <th style={{ padding: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>ID</th>
                    <th style={{ padding: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Location</th>
                    <th style={{ padding: '8px', fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'INC-1042', type: 'Unauthorized Access', location: 'Crusher Zone', status: 'Open', statusColor: '#DC2626', statusBg: '#FEE2E2' },
                    { id: 'INC-1041', type: 'PPE Missing (Hardhat)', location: 'Loading Area A', status: 'Investigating', statusColor: 'var(--outline)', statusBg: '#ECEEF1' },
                    { id: 'INC-1040', type: 'Vehicle Speeding', location: 'Main Haul Road', status: 'Open', statusColor: '#DC2626', statusBg: '#FEE2E2' },
                    { id: 'INC-1039', type: 'Equipment Malfunction', location: 'Workshop Ext', status: 'Resolved', statusColor: '#10B981', statusBg: '#E8F5E9' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(195,198,212,0.15)', cursor: 'pointer' }}
                      onClick={() => setActiveSubTab('incident-center')}
                    >
                      <td style={{ padding: '12px 8px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--brand-dark)' }}>{row.id}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--brand-dark)' }}>{row.type}</td>
                      <td style={{ padding: '12px 8px', fontSize: '13px', color: 'var(--outline)' }}>{row.location}</td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: 700, color: row.statusColor, background: row.statusBg,
                          padding: '3px 8px', borderRadius: '4px'
                        }}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Analytics Charts */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Analytics Overview
              </h3>
              <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                
                {/* Chart 1 */}
                <div style={{
                  flex: 1, background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0',
                  padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', position: 'absolute', top: '10px', left: '10px' }}>Violation Trends</span>
                  <div style={{ display: 'flex', alignItems: 'end', gap: '6px', height: '100px', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
                    <div style={{ width: '12px', height: '90px', background: 'var(--brand-primary)', opacity: 0.6, borderRadius: '3px 3px 0 0' }} />
                    <div style={{ width: '12px', height: '45px', background: 'var(--brand-secondary)', borderRadius: '3px 3px 0 0' }} />
                    <div style={{ width: '12px', height: '70px', background: 'var(--brand-primary)', borderRadius: '3px 3px 0 0' }} />
                    <div style={{ width: '12px', height: '30px', background: '#C3C6D4', borderRadius: '3px 3px 0 0' }} />
                    <div style={{ width: '12px', height: '100px', background: 'var(--brand-dark)', borderRadius: '3px 3px 0 0' }} />
                  </div>
                </div>

                {/* Chart 2 */}
                <div style={{
                  flex: 1, background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0',
                  padding: '16px', display: 'flex', flexDirection: 'column', position: 'relative', alignItems: 'center', justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', position: 'absolute', top: '10px', left: '10px' }}>Incident Dist.</span>
                  <div style={{
                    width: '76px', height: '76px', borderRadius: '50%',
                    border: '10px solid var(--brand-primary)', borderRightColor: 'var(--brand-secondary)', borderBottomColor: 'var(--brand-dark)',
                    marginTop: '20px'
                  }} />
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
