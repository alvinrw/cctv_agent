import { useState } from 'react';
import { 
  BarChart3, TrendingDown, Calendar, Brain, AlertTriangle, 
  ShieldAlert, Lock, Gauge, Users, Maximize2, Sparkles, MapPin
} from 'lucide-react';

export default function AnalysisTab({ lang = 'id' }) {
  const [hoveredBar, setHoveredBar] = useState(null);
  const [activeBarValue, setActiveBarValue] = useState(null);

  // Mock bar chart data (30 days of violations)
  const chartData = [
    { day: 1, val: 24 }, { day: 2, val: 28 }, { day: 3, val: 22 }, 
    { day: 4, val: 35 }, { day: 5, val: 42 }, { day: 6, val: 30 }, 
    { day: 7, val: 26 }, { day: 8, val: 38 }, { day: 9, val: 45 }, 
    { day: 10, val: 50 }, { day: 11, val: 40 }, { day: 12, val: 33 }, 
    { day: 13, val: 29 }, { day: 14, val: 52 }, { day: 15, val: 65 }, 
    { day: 16, val: 74 }, { day: 17, val: 58 }, { day: 18, val: 44 }, 
    { day: 19, val: 38 }, { day: 20, val: 49 }, { day: 21, val: 56 }, 
    { day: 22, val: 62 }, { day: 23, val: 80, isAnomaly: true }, { day: 24, val: 55 }, 
    { day: 25, val: 42 }, { day: 26, val: 38 }, { day: 27, val: 46 }, 
    { day: 28, val: 50 }, { day: 29, val: 42 }, { day: 30, val: 36 }
  ];

  const maxVal = Math.max(...chartData.map(d => d.val));

  // Pulse keyframe animations helper
  const pulseStyles = `
    @keyframes pulseRed {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
    @keyframes pulseOrange {
      0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(249, 115, 22, 0); }
      100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
    }
  `;

  return (
    <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
      <style>{pulseStyles}</style>
      
      <div className="animate-tab-fade">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>Analisis</h2>
            <p style={{ fontSize: '14px', color: 'var(--outline)', margin: '4px 0 0' }}>{lang === 'id' ? 'Tren Risiko & Analisis Eksekutif' : 'Executive Analytics & Risk Trends'}</p>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Weekly Violations */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'id' ? 'Pelanggaran Mingguan' : 'Weekly Violations'}
              </span>
              <TrendingDown size={18} color="var(--outline)" />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>142</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', marginBottom: '3px' }}>{lang === 'id' ? '-12% vs minggu lalu' : '-12% vs last week'}</span>
            </div>
          </div>

          {/* Monthly Average */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'id' ? 'Rata-rata Bulanan' : 'Monthly Average'}
              </span>
              <Calendar size={18} color="var(--outline)" />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>680</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)', marginBottom: '3px' }}>{lang === 'id' ? 'Stabil' : 'Stable'}</span>
            </div>
          </div>

          {/* Agent Insight */}
          <div style={{
            background: 'rgba(13, 71, 161, 0.05)',
            borderLeft: '4px solid var(--brand-secondary)',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.08, pointerEvents: 'none' }}>
              <Brain size={80} color="var(--brand-primary)" />
            </div>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--brand-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={12} /> {lang === 'id' ? 'Wawasan AI (Agent Insight)' : 'Agent Insight'}
              </span>
              <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.5, color: 'var(--brand-dark)', fontWeight: 600 }}>
                {lang === 'id' ? 'Zona C menunjukkan lonjakan berulang 15% pada pelanggaran APD selama pergantian shift.' : 'Zone C shows a 15% recurring spike in PPE violations during shift changes.'}
              </p>
            </div>
          </div>

          {/* High Risk Events */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'id' ? 'Kejadian Risiko Tinggi' : 'High Risk Events'}
              </span>
              <AlertTriangle size={18} color="#ec407a" />
            </div>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--brand-dark)', lineHeight: 1 }}>8</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#ec407a', marginBottom: '3px' }}>{lang === 'id' ? '+2 vs minggu lalu' : '+2 vs last week'}</span>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '20px'
        }} className="db-layout-grid">
          
          {/* Violation Trend Line Chart (Spans 8 columns) */}
          <div style={{
            gridColumn: 'span 8',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '380px'
          }} className="bento-col-8">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'id' ? 'Tren Pelanggaran (30 Hari)' : 'Violation Trend (30 Days)'}
              </h3>
              {hoveredBar !== null && (
                <div style={{
                  background: 'var(--brand-dark)',
                  color: 'white',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: 700
                }}>
                  Hari {hoveredBar}: <strong>{activeBarValue} Pelanggaran</strong>
                </div>
              )}
            </div>

            <div style={{
              flex: 1,
              background: '#FAFBFD',
              borderRadius: '12px',
              border: '1px dashed #E3E6EE',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              padding: '24px 16px 12px',
              position: 'relative'
            }}>
              {chartData.map((d, idx) => {
                const heightPct = (d.val / maxVal) * 80; // Scale to max 80% height
                const isHovered = hoveredBar === d.day;
                
                return (
                  <div
                    key={d.day}
                    onMouseEnter={() => {
                      setHoveredBar(d.day);
                      setActiveBarValue(d.val);
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                      setActiveBarValue(null);
                    }}
                    style={{
                      width: 'calc(100% / 30 - 4px)',
                      height: `${heightPct}%`,
                      background: d.isAnomaly
                        ? (isHovered ? '#ff5252' : 'rgba(239, 68, 68, 0.45)')
                        : (isHovered ? 'var(--brand-primary)' : 'rgba(13, 71, 161, 0.2)'),
                      borderTop: d.isAnomaly 
                        ? '2px solid #ef4444' 
                        : `2px solid ${isHovered ? 'var(--brand-primary)' : 'rgba(13, 71, 161, 0.4)'}`,
                      borderRadius: '4px 4px 0 0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  />
                );
              })}
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              color: 'var(--outline)',
              fontSize: '11px',
              fontWeight: 600,
              padding: '0 4px'
            }}>
              <span>Hari 1</span>
              <span>Hari 15</span>
              <span>Hari 30</span>
            </div>
          </div>

          {/* Top Triggered Policies (Spans 4 columns) */}
          <div style={{
            gridColumn: 'span 4',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '380px'
          }} className="bento-col-4">
            <h3 style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'id' ? 'Policy Sering Terpemicu' : 'Top Triggered Policies'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {[
                { label: lang === 'id' ? 'Tanpa Helm Proyek' : 'Missing Hardhat', pct: '42%', icon: ShieldAlert, bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444' },
                { label: lang === 'id' ? 'Akses Area Terlarang' : 'Restricted Area Access', pct: '28%', icon: Lock, bg: 'rgba(13, 71, 161, 0.08)', color: 'var(--brand-primary)' },
                { label: lang === 'id' ? 'Kendaraan Ngebut' : 'Vehicle Speeding', pct: '15%', icon: Gauge, bg: 'rgba(249, 115, 22, 0.08)', color: '#f97316' },
                { label: lang === 'id' ? 'Kerumunan Tanpa Izin' : 'Unauthorized Group', pct: '10%', icon: Users, bg: 'rgba(16, 185, 129, 0.08)', color: '#10b981' }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: '#FAFBFD',
                    borderRadius: '10px',
                    border: '1px solid #E3E6EE'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color
                      }}>
                        <Icon size={16} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--brand-dark)' }}>{item.label}</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: 'var(--outline)' }}>{item.pct}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Most Violated Zones (Spans 6 columns) */}
          <div style={{
            gridColumn: 'span 6',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '24px',
            minHeight: '320px'
          }} className="bento-col-6">
            <h3 style={{ margin: '0 0 20px', fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {lang === 'id' ? 'Zona Paling Sering Melanggar' : 'Most Violated Zones'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { zone: 'Loading Dock B', count: 124, width: '85%' },
                { zone: 'Main Access Road', count: 98, width: '65%' },
                { zone: 'Processing Plant Area 1', count: 65, width: '45%' },
                { zone: 'Excavation Site Alpha', count: 32, width: '25%' }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-dark)' }}>{item.zone}</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--outline)' }}>{item.count}</span>
                  </div>
                  <div style={{ width: '100%', background: '#E2E8F0', borderRadius: '999px', height: '8px' }}>
                    <div style={{
                      background: 'var(--brand-primary)',
                      height: '8px',
                      borderRadius: '999px',
                      width: item.width,
                      transition: 'width 1s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident Heatmap (Spans 6 columns) */}
          <div style={{
            gridColumn: 'span 6',
            background: 'white',
            borderRadius: '16px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '320px'
          }} className="bento-col-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {lang === 'id' ? 'Heatmap Lokasi' : 'Site Heatmap'}
              </h3>
              <Maximize2 size={16} color="var(--outline)" style={{ cursor: 'pointer' }} />
            </div>

            <div style={{
              flex: 1,
              background: '#FAFBFD',
              borderRadius: '12px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid #E3E6EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEmbjA8JbKyr8wIwQE-l6HcKecaPBh99_2FIYo6-SG4KWetrCJKX0J2NS5z730uyQTq1cRfYQ_eeMnya0Orqx7nLLPlsiUidM-Q7KqPOw5q7Y_82ztj4YzTTh14_eG7vPz337V2L4UXsN4KBbjE7R38Qa3LFGqULEUG9eZTzP-2ZAg31_jk2kIyTcMEaQEKAg38W88_LexVWguIq5FrN-uD6nPU3AFflRU0evHhIdkh9wKyJFzzs6FeWfDCMyacl0omdS7kAC26ITB"
                alt="Schematic Map"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: 0.85
                }}
              />

              {/* Pulsating Hotspot 1 (Red) */}
              <div style={{
                position: 'absolute',
                top: '42%',
                left: '28%',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ef4444',
                cursor: 'pointer',
                animation: 'pulseRed 2s infinite ease-in-out'
              }} title="High Violations (Loading Dock B)" />

              {/* Pulsating Hotspot 2 (Orange) */}
              <div style={{
                position: 'absolute',
                top: '55%',
                left: '60%',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#f97316',
                cursor: 'pointer',
                animation: 'pulseOrange 2.5s infinite ease-in-out'
              }} title="Medium Violations (Main Access Road)" />

              {/* Pulsating Hotspot 3 (Orange) */}
              <div style={{
                position: 'absolute',
                top: '25%',
                left: '75%',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#f97316',
                cursor: 'pointer',
                animation: 'pulseOrange 2.2s infinite ease-in-out'
              }} title="Medium Violations (Processing Plant)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
