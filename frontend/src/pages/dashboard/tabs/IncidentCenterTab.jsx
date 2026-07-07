import { useState } from 'react';
import { AlertTriangle, Search, Download, Sparkles, ChevronLeft, ChevronRight, X, Shield, Eye, Clock, MapPin, Camera, Cpu, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import IncidentDetailView from './IncidentDetailView';

// Mock incident data
const MOCK_INCIDENTS = [
  {
    id: 'INC-4092', type: 'Restricted Area Intrusion', description: 'Unauthorized vehicle near silo',
    severity: 'critical', location: 'Sector Alpha, Cam-04', status: 'pending_validation', assignee: null,
    detectedAt: '10:42 AM', confidence: 98.4, policy: 'Perimeter Security v2',
    camera: 'Cam-04_PTZ', locationDetail: 'Sector Alpha, Gate 3',
    aiSummary: 'Unidentified light vehicle breached Sector Alpha outer perimeter. Trajectory indicates approach toward Silo 4. Recommend immediate security dispatch and lockdown of Silo 4 access gates.',
    timeline: [
      { text: 'Incident created via Policy Engine', time: '10:42 AM', primary: true },
      { text: 'AI Agent assigned confidence score 98%', time: '10:42 AM' },
      { text: 'Notification sent to Shift Supervisor', time: '10:43 AM' }
    ]
  },
  {
    id: 'INC-4091', type: 'Thermal Anomaly Detected', description: 'Conveyor belt #3 overheating',
    severity: 'high', location: 'Processing Plant', status: 'detected', assignee: 'J. Doe', assigneeInitials: 'JD',
    detectedAt: '09:58 AM', confidence: 91.2, policy: 'Equipment Monitoring v1',
    camera: 'Cam-11_Fixed', locationDetail: 'Processing Plant, Belt #3',
    aiSummary: 'Thermal signature detected on conveyor belt #3 exceeding normal operating temperature by 40°C. Potential bearing failure or friction issue.',
    timeline: [
      { text: 'Incident created via Policy Engine', time: '09:58 AM', primary: true },
      { text: 'AI Agent assigned confidence score 91%', time: '09:58 AM' },
      { text: 'Assigned to J. Doe for investigation', time: '10:05 AM' }
    ]
  },
  {
    id: 'INC-4088', type: 'PPE Violation', description: 'Missing hardhat near crusher',
    severity: 'low', location: 'Crusher Zone, Cam-12', status: 'responded', assignee: 'A. Smith', assigneeInitials: 'AS',
    detectedAt: '08:22 AM', confidence: 87.6, policy: 'PPE Compliance v3',
    camera: 'Cam-12_PTZ', locationDetail: 'Crusher Zone, Section B',
    aiSummary: 'Worker detected without hardhat in crusher zone. Worker subsequently retrieved PPE from nearby storage.',
    timeline: [
      { text: 'Incident created via Policy Engine', time: '08:22 AM', primary: true },
      { text: 'Assigned to A. Smith', time: '08:25 AM' },
      { text: 'Marked as resolved - PPE retrieved', time: '08:40 AM' }
    ]
  },
  {
    id: 'INC-4087', type: 'Vehicle Speeding', description: 'Haul truck exceeding limit',
    severity: 'medium', location: 'Main Road B', status: 'rejected', assignee: 'System (Auto)', assigneeInitials: 'SY',
    detectedAt: '07:15 AM', confidence: 95.1, policy: 'Speed Monitoring v2',
    camera: 'Cam-08_Fixed', locationDetail: 'Main Road B, KM 2.5',
    aiSummary: 'Haul truck HD785 detected exceeding 30km/h speed limit on main hauling road.',
    timeline: [
      { text: 'Incident created via Policy Engine', time: '07:15 AM', primary: true },
      { text: 'Auto-resolved by system after speed normalized', time: '07:18 AM' }
    ]
  },
  {
    id: 'INC-4085', type: 'Unsafe Act', description: 'Person too close to excavator',
    severity: 'high', location: 'Pit A, Cam-02', status: 'confirmed', assignee: null,
    detectedAt: '06:50 AM', confidence: 93.8, policy: 'Safety Zone v1',
    camera: 'Cam-02_PTZ', locationDetail: 'Pit A, Excavator Zone',
    aiSummary: 'Personnel detected within 10-meter exclusion zone of active excavator swing path.',
    timeline: [
      { text: 'Incident created via Policy Engine', time: '06:50 AM', primary: true },
      { text: 'Critical alert sent to dispatcher', time: '06:50 AM' }
    ]
  }
];

const severityConfig = {
  critical: { label: 'Critical', bg: '#FEE2E2', color: '#991B1B', dot: '#DC2626', border: '#FECACA' },
  high: { label: 'High', bg: '#FEF3C7', color: '#92400E', dot: '#D97706', border: '#FDE68A' },
  medium: { label: 'Medium', bg: '#FEF9C3', color: '#854D0E', dot: '#CA8A04', border: '#FEF08A' },
  low: { label: 'Low', bg: '#F3F4F6', color: '#374151', dot: '#9CA3AF', border: '#E5E7EB' }
};

const statusConfig = {
  detected: { label: 'Detected', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  pending_validation: { label: 'Pending Validation', bg: '#FFF7ED', color: '#C2410C', border: '#FFEDD5' },
  confirmed: { label: 'Confirmed', bg: '#ECFDF5', color: '#047857', border: '#D1FAE5' },
  rejected: { label: 'Rejected', bg: '#FEF2F2', color: '#B91C1C', border: '#FEE2E2' },
  responded: { label: 'Responded', bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' }
};

export default function IncidentCenterTab() {
  const [selectedIncident, setSelectedIncident] = useState(MOCK_INCIDENTS[0]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailViewIncident, setDetailViewIncident] = useState(null);

  const filteredIncidents = MOCK_INCIDENTS.filter(inc => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    if (searchQuery && !inc.type.toLowerCase().includes(searchQuery.toLowerCase()) && !inc.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sev = (s) => severityConfig[s] || severityConfig.low;
  const stat = (s) => statusConfig[s] || statusConfig.open;

  const cardStyle = {
    background: 'white', borderRadius: '16px', border: '1px solid #E3E6EE',
    boxShadow: '0 4px 16px rgba(0,0,0,0.03)', overflow: 'hidden'
  };

  // If detail view is active, render the full detail page
  if (detailViewIncident) {
    return <IncidentDetailView incident={detailViewIncident} onBack={() => setDetailViewIncident(null)} />;
  }

  return (
    <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>Incident Center</h2>
          <p style={{ fontSize: '14px', color: 'var(--outline)', margin: '4px 0 0' }}>Manage, investigate, and resolve operational anomalies.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{
            padding: '10px 18px', border: '1.5px solid #C3C6D4', background: 'white', borderRadius: '10px',
            fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <Download size={15} /> Export Log
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 160px)' }}>
        {/* Left: Table */}
        <div style={{ flex: 1, ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          {/* Filter Bar */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E3E6EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--outline)' }} />
                <input
                  type="text" placeholder="Search incidents..."
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: '32px', paddingRight: '12px', paddingTop: '7px', paddingBottom: '7px',
                    border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '12px', width: '200px',
                    outline: 'none', fontFamily: 'inherit'
                  }}
                />
              </div>
              <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
                style={{ padding: '7px 12px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: 'white' }}>
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                style={{ padding: '7px 12px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', background: 'white' }}>
                <option value="all">Status: All</option>
                <option value="detected">Detected</option>
                <option value="pending_validation">Pending Validation</option>
                <option value="confirmed">Confirmed</option>
                <option value="rejected">Rejected</option>
                <option value="responded">Responded</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E3E6EE', position: 'sticky', top: 0, background: 'white', zIndex: 5 }}>
                  {['ID', 'Type & Description', 'Severity', 'Location', 'Status', 'Assignee'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '10px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(inc => {
                  const isSelected = selectedIncident?.id === inc.id;
                  const sv = sev(inc.severity);
                  const st = stat(inc.status);
                  return (
                    <tr key={inc.id}
                      onClick={() => { setSelectedIncident(inc); setDrawerOpen(true); }}
                      style={{
                        borderBottom: '1px solid #F0EDED', cursor: 'pointer',
                        background: isSelected ? 'rgba(13,71,161,0.05)' : 'white',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#FAFBFD'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                    >
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--brand-primary)' : 'var(--outline)' }}>{inc.id}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--brand-dark)' }}>{inc.type}</div>
                        <div style={{ fontSize: '11px', color: 'var(--outline)', marginTop: '2px' }}>{inc.description}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 10px', borderRadius: '999px', fontSize: '10px', fontWeight: 700,
                          background: sv.bg, color: sv.color, textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sv.dot }} />
                          {sv.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--outline)' }}>{inc.location}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
                          background: st.bg, color: st.color, border: `1px solid ${st.border}`
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '12px', color: 'var(--outline)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {inc.assignee ? (
                            <>
                              <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', fontSize: '9px', fontWeight: 700,
                                background: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>{inc.assigneeInitials}</div>
                              {inc.assignee}
                            </>
                          ) : (
                            <span style={{ color: '#9CA3AF' }}>Unassigned</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #E3E6EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'var(--outline)' }}>Showing 1-{filteredIncidents.length} of {MOCK_INCIDENTS.length} incidents</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--outline)', borderRadius: '4px' }}><ChevronLeft size={18} /></button>
              <button style={{ padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--outline)', borderRadius: '4px' }}><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* Right: Detail Drawer */}
        {drawerOpen && selectedIncident && (
          <div style={{ width: '400px', flexShrink: 0, ...cardStyle, display: 'flex', flexDirection: 'column' }}>
            {/* Drawer Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #E3E6EE', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: 'var(--brand-primary)' }}>{selectedIncident.id}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                      background: sev(selectedIncident.severity).bg, color: sev(selectedIncident.severity).color
                    }}>{sev(selectedIncident.severity).label}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0, lineHeight: 1.3 }}>{selectedIncident.type}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--outline)', margin: '4px 0 0' }}>Detected at {selectedIncident.detectedAt}</p>
                </div>
                <button onClick={() => setDrawerOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--outline)', padding: '4px', borderRadius: '50%' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Drawer Body (scrollable) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* AI Summary */}
              <div style={{
                background: 'rgba(13,71,161,0.04)', borderLeft: '4px solid var(--brand-primary)',
                borderRadius: '0 10px 10px 0', padding: '14px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Cpu size={18} color="var(--brand-primary)" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Summary</h4>
                    <p style={{ fontSize: '12px', color: 'var(--brand-dark)', margin: 0, lineHeight: 1.5 }}>{selectedIncident.aiSummary}</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div>
                <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Incident Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {[
                    { icon: MapPin, label: 'Location', value: selectedIncident.locationDetail },
                    { icon: Camera, label: 'Source Camera', value: selectedIncident.camera, link: true },
                    { icon: Shield, label: 'Policy Violated', value: selectedIncident.policy },
                    { icon: Eye, label: 'Confidence', value: `${selectedIncident.confidence}%` }
                  ].map((item, i) => (
                    <div key={i}>
                      <span style={{ fontSize: '10px', color: '#9CA3AF', display: 'block', marginBottom: '3px' }}>{item.label}</span>
                      <span style={{
                        fontSize: '12px', fontWeight: 600,
                        color: item.link ? 'var(--brand-primary)' : 'var(--brand-dark)',
                        cursor: item.link ? 'pointer' : 'default'
                      }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Evidence */}
              <div>
                <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Visual Evidence</h4>
                <div style={{
                  width: '100%', borderRadius: '10px', border: '1.5px solid #E3E6EE',
                  overflow: 'hidden', position: 'relative', background: '#000'
                }}>
                  <video
                    src="/cctv_example.mp4"
                    autoPlay muted loop playsInline
                    style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                  />
                  <span style={{
                    position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)',
                    color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace'
                  }}>● REC</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Activity Timeline</h4>
                <div style={{ paddingLeft: '14px', borderLeft: '2px solid #E3E6EE', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedIncident.timeline.map((item, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <div style={{
                        position: 'absolute', left: '-20px', top: '3px', width: '10px', height: '10px',
                        borderRadius: '50%', background: item.primary ? 'var(--brand-primary)' : '#D1D5DB',
                        border: '3px solid white', boxShadow: '0 0 0 1px #E3E6EE'
                      }} />
                      <p style={{ fontSize: '12px', fontWeight: item.primary ? 600 : 400, color: 'var(--brand-dark)', margin: 0 }}>{item.text}</p>
                      <p style={{ fontSize: '10px', color: '#9CA3AF', margin: '2px 0 0' }}>{item.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #E3E6EE', flexShrink: 0 }}>
              {/* Detail Incident Button */}
              <button
                onClick={() => setDetailViewIncident(selectedIncident)}
                style={{
                  width: '100%', padding: '11px 16px', border: 'none', background: 'var(--brand-primary)',
                  borderRadius: '10px', fontSize: '12px', fontWeight: 700, color: 'white',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  boxShadow: '0 2px 8px rgba(13,71,161,0.25)', marginBottom: '10px',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <ExternalLink size={14} /> Detail Incident & Take Action
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
