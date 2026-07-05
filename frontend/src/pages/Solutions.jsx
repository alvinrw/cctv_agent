import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Zap, Shield, CheckCircle2, ArrowRight, Camera, Globe } from 'lucide-react';

// Data tanpa JSX — icon di-render secara langsung di komponen
const SOLUTIONS_DATA = {
  'agent-ai-cctv': {
    id: 'agent-ai-cctv',
    badge: 'Edge Powered',
    badgeIconName: 'zap',
    tabIconName: 'camera',
    title: 'Agent AI CCTV',
    tagline: 'Pemantauan Pintar Berbasis AI Edge',
    desc: 'Sistem pemantauan canggih berbasis Edge AI yang dirancang untuk analisis ancaman keselamatan dan keamanan secara real-time. Memproses feed video secara lokal di unit CCTV area tambang untuk menjamin respon deteksi di bawah satu detik tanpa membebani bandwidth jaringan Anda.',
    features: [
      'Deteksi ancaman keamanan instan kurang dari 1 detik di jaringan edge.',
      'Pengurangan alarm palsu hingga 99% melalui filter analitik AI pintar.',
      'Kecerdasan terdistribusi yang mencegah kegagalan sistem terpusat.',
      'Analisis real-time untuk pengenalan anomali dan pelanggaran APD.',
      'Protokol tanggap insiden otomatis untuk mempercepat tindakan darurat.',
    ],
    stats: [
      { value: '<1d', label: 'Waktu Deteksi' },
      { value: '99%', label: 'Akurasi Deteksi' },
      { value: '24/7', label: 'Aktif Memantau' },
    ],
  },
  'centralized-access': {
    id: 'centralized-access',
    badge: 'Kontrol Terpadu',
    badgeIconName: 'shield',
    tabIconName: 'globe',
    title: 'Centralized Access Portal',
    tagline: 'Dashboard Operasi Keamanan Terpusat',
    desc: 'Pengelolaan operasi keamanan terpadu untuk instalasi multi-site tambang Astra yang kompleks. Kelola akses pengguna berbasis peran (RBAC), tinjau riwayat peringatan yang terkonsolidasi, dan sinkronkan kebijakan keamanan di seluruh site dari satu portal admin terpusat.',
    features: [
      'Sinkronisasi dan pemantauan multi-site secara real-time.',
      'Manajemen akses berbasis peran (RBAC) yang sangat aman.',
      'Laporan analitis terpadu dan audit kepatuhan keselamatan tambang.',
      'Integrasi Single Sign-On (SSO) untuk otentikasi cepat.',
      'Arsitektur API-first untuk kemudahan integrasi dengan sistem internal Astra.',
    ],
    stats: [
      { value: 'Multi-Site', label: 'Dukungan Area' },
      { value: 'RBAC', label: 'Kontrol Akses' },
      { value: '100%', label: 'Cakupan Laporan' },
    ],
  },
};

// Helper: render icon berdasarkan name string
function TabIcon({ name, size = 20 }) {
  if (name === 'camera') return <Camera size={size} />;
  if (name === 'globe')  return <Globe size={size} />;
  if (name === 'zap')    return <Zap size={size} />;
  if (name === 'shield') return <Shield size={size} />;
  return null;
}

export default function Solutions() {
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState(
    slug && SOLUTIONS_DATA[slug] ? slug : 'agent-ai-cctv'
  );

  // ✅ FIX: Sync activeTab setiap kali slug di URL berubah
  useEffect(() => {
    if (slug && SOLUTIONS_DATA[slug]) {
      setActiveTab(slug);
    }
  }, [slug]);

  const sol = SOLUTIONS_DATA[activeTab];

  return (
    <main style={{ paddingTop: '72px' }}>

      {/* ===== PAGE HEADER ===== */}
      <section style={{
        background: 'var(--surface-low)',
        padding: '60px 0 48px',
        textAlign: 'center',
        borderBottom: '1px solid var(--outline-variant)',
      }}>
        <div className="container">
          <h1 style={{ color: 'var(--brand-dark)', marginBottom: '16px' }}>
            Solusi Keamanan Tambang PamAgents
          </h1>
          <div className="divider" />
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: '680px', margin: '20px auto 0', lineHeight: 1.75 }}>
            Pilih modul keamanan berbasis kecerdasan buatan (AI) yang sesuai untuk memproteksi operasional site tambang Anda. PamAgents menghadirkan sistem keamanan andal yang dirancang khusus untuk Astra.
          </p>
        </div>
      </section>


      {/* ===== SOLUTION DETAIL ===== */}
      <section className="section" style={{ background: '#FAFBFD' }}>
        <div className="container">
          <div
            key={activeTab}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '60px', alignItems: 'center' }}
            className="sol-detail-grid animate-fade-in"
          >
            {/* Left Column: Info & Stats */}
            <div>
              <span className="badge badge-blue" style={{ marginBottom: '20px', display: 'inline-flex', gap: '8px', padding: '6px 16px', background: 'rgba(13,71,161,0.08)', borderColor: 'rgba(13,71,161,0.15)' }}>
                <TabIcon name={sol.badgeIconName} size={14} />
                {sol.badge}
              </span>

              <h2 style={{ color: 'var(--brand-dark)', marginBottom: '10px', fontSize: '32px', fontWeight: 700 }}>{sol.title}</h2>
              <p style={{ color: 'var(--brand-primary)', fontWeight: 600, fontSize: '16px', marginBottom: '20px', letterSpacing: '0.01em' }}>
                {sol.tagline}
              </p>
              
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.8, marginBottom: '32px', fontSize: '15px' }}>
                {sol.desc}
              </p>

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {sol.stats.map(st => (
                  <div
                    key={st.label}
                    style={{
                      background: 'white',
                      border: '1.5px solid rgba(13,71,161,0.1)',
                      borderRadius: '12px',
                      padding: '16px 12px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(13,71,161,0.03)',
                      transition: 'transform 0.3s ease, border-color 0.3s ease',
                    }}
                    className="details-stat-card"
                  >
                    <div style={{ color: 'var(--brand-primary)', fontSize: '24px', fontWeight: 700, lineHeight: 1.1 }}>{st.value}</div>
                    <div style={{ color: 'var(--outline)', fontSize: '11px', marginTop: '6px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>{st.label}</div>
                  </div>
                ))}
              </div>

              {/* Feature Cards */}
              <div style={{ display: 'grid', gap: '12px', marginBottom: '40px' }}>
                {sol.features.map(f => (
                  <div
                    key={f}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: 'white',
                      border: '1px solid rgba(13, 71, 161, 0.06)',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--on-surface-variant)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                  >
                    <CheckCircle2 size={18} color="var(--brand-primary)" style={{ flexShrink: 0 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div>
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  Lebih Lanjut <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Interactive Mock Visuals */}
            <div>
              {activeTab === 'agent-ai-cctv' ? (
                /* ===== CCTV MOCK VISUAL ===== */
                <div style={{
                  background: '#071224',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(13, 71, 161, 0.25)',
                  boxShadow: '0 20px 50px rgba(11,29,58,0.25), 0 0 30px rgba(13,71,161,0.1)',
                  position: 'relative'
                }}>
                  {/* Top Bar / Header */}
                  <div style={{
                    background: 'rgba(11, 29, 58, 0.95)',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="pulse-red-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d4d' }} />
                      <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>CAM_01 // EDGE_AI_FEED</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#FFC107', fontFamily: 'monospace', fontWeight: 600 }}>RESOLVING // 99.8% ACC</span>
                  </div>

                  {/* Main CCTV Feed Area */}
                  <div style={{
                    position: 'relative',
                    height: '280px',
                    background: '#030811',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* CCTV Gridlines Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(rgba(18, 55, 117, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 55, 117, 0.08) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      pointerEvents: 'none'
                    }} />

                    {/* Scanline Effect */}
                    <div className="cctv-scanline" />

                    {/* Simulated Camera Viewfinder corners */}
                    <div style={{ position: 'absolute', top: '15px', left: '15px', width: '12px', height: '12px', borderTop: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)' }} />
                    <div style={{ position: 'absolute', top: '15px', right: '15px', width: '12px', height: '12px', borderTop: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)' }} />
                    <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '12px', height: '12px', borderBottom: '2px solid rgba(255,255,255,0.3)', borderLeft: '2px solid rgba(255,255,255,0.3)' }} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '12px', height: '12px', borderBottom: '2px solid rgba(255,255,255,0.3)', borderRight: '2px solid rgba(255,255,255,0.3)' }} />

                    {/* Bounding Box 1 */}
                    <div className="bounding-glow-yellow" style={{
                      position: 'absolute',
                      top: '50px',
                      left: '60px',
                      width: '100px',
                      height: '140px',
                      border: '2px dashed #FFC107',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      padding: '4px'
                    }}>
                      <span style={{
                        background: '#FFC107',
                        color: '#0B1D3A',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        alignSelf: 'flex-start'
                      }}>PERSON [99.2%]</span>
                    </div>

                    {/* Bounding Box 2 (Threat Alert) */}
                    <div style={{
                      position: 'absolute',
                      top: '90px',
                      right: '60px',
                      width: '130px',
                      height: '110px',
                      border: '2px solid #ff4d4d',
                      boxShadow: '0 0 12px rgba(255, 77, 77, 0.4)',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      padding: '4px'
                    }}>
                      <span className="flash-alert-red" style={{
                        background: '#ff4d4d',
                        color: '#fff',
                        fontSize: '9px',
                        fontWeight: 'bold',
                        padding: '2px 4px',
                        borderRadius: '2px',
                        alignSelf: 'flex-start',
                      }}>RESTRICTED ZONE // WARNING</span>
                    </div>

                    {/* Corner Telemetry */}
                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      left: '20px',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      lineHeight: '1.4'
                    }}>
                      FPS: 30.0<br />
                      LATENCY: 8ms<br />
                      INFERENCE: EDGE_GPU
                    </div>

                    <div style={{
                      position: 'absolute',
                      bottom: '15px',
                      right: '20px',
                      color: '#FFC107',
                      fontSize: '9px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      letterSpacing: '0.05em'
                    }}>
                      AI SCANNING...
                    </div>
                  </div>

                  {/* Events Log Console */}
                  <div style={{
                    background: '#040d1a',
                    padding: '18px 20px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>EDGE REALTIME EVENT LOGS:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#FFC107' }}>[12:04:12]</span>
                        <span style={{ color: 'rgba(255,255,255,0.8)' }}>Object detection initialized.</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#FFC107' }}>[12:04:13]</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>Anomaly filtered (False Positive: Domestic Animal).</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ color: '#ff4d4d' }}>[12:04:15]</span>
                        <span style={{ color: '#ff9999', fontWeight: 'bold' }}>WARNING: Intrusion detected in Zone 4B. Dispatching.</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ===== CENTRALIZED ACCESS VISUAL ===== */
                <div style={{
                  background: '#071224',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1.5px solid rgba(13, 71, 161, 0.25)',
                  boxShadow: '0 20px 50px rgba(11,29,58,0.25), 0 0 30px rgba(13,71,161,0.1)',
                  position: 'relative'
                }}>
                  {/* Top Bar / Header */}
                  <div style={{
                    background: 'rgba(11, 29, 58, 0.95)',
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="pulse-green-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, letterSpacing: '0.05em' }}>JARINGAN INTEGRASI MULTI-SITE ASTRA</span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#10b981', fontFamily: 'monospace', fontWeight: 600 }}>SSO: AKTIF</span>
                  </div>

                  {/* Topology / Map Visualization */}
                  <div style={{
                    position: 'relative',
                    height: '280px',
                    background: '#030811',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* World Grid Map Gridlines */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'radial-gradient(rgba(13, 71, 161, 0.15) 1px, transparent 0)',
                      backgroundSize: '16px 16px',
                      pointerEvents: 'none'
                    }} />

                    {/* Topology Network Nodes & SVG Connections */}
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                      {/* Connection Lines */}
                      <line x1="20%" y1="50%" x2="50%" y2="30%" stroke="rgba(13, 71, 161, 0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="50%" y1="30%" x2="80%" y2="40%" stroke="rgba(13, 71, 161, 0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="20%" y1="50%" x2="45%" y2="75%" stroke="rgba(13, 71, 161, 0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
                      <line x1="45%" y1="75%" x2="80%" y2="40%" stroke="rgba(13, 71, 161, 0.6)" strokeWidth="1.5" strokeDasharray="4 4" />
                      
                      {/* Glowing active path */}
                      <line x1="20%" y1="50%" x2="50%" y2="30%" stroke="#FFC107" strokeWidth="2" strokeDasharray="8 8" className="svg-dash" />
                    </svg>

                    {/* Node 1: Jakarta */}
                    <div style={{ position: 'absolute', left: '20%', top: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="pulse-yellow-glow" style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFD600' }} />
                      <span style={{ fontSize: '9px', color: '#fff', marginTop: '4px', background: 'rgba(11,29,58,0.85)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.08)' }}>JAKARTA HQ</span>
                    </div>

                    {/* Node 2: Kaltim */}
                    <div style={{ position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="pulse-green-glow" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '9px', color: '#fff', marginTop: '4px', background: 'rgba(11,29,58,0.85)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.08)' }}>SITE KALTIM</span>
                    </div>

                    {/* Node 3: Kendari */}
                    <div style={{ position: 'absolute', left: '80%', top: '40%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="pulse-green-glow" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '9px', color: '#fff', marginTop: '4px', background: 'rgba(11,29,58,0.85)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.08)' }}>SITE KENDARI</span>
                    </div>

                    {/* Node 4: Kalsel */}
                    <div style={{ position: 'absolute', left: '45%', top: '75%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div className="pulse-green-glow" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                      <span style={{ fontSize: '9px', color: '#fff', marginTop: '4px', background: 'rgba(11,29,58,0.85)', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.08)' }}>SITE KALSEL</span>
                    </div>

                    {/* Stats overlay card */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'rgba(11, 29, 58, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      backdropFilter: 'blur(6px)'
                    }}>
                      <span style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>SYSTEM STATUS:</span>
                      <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>● SITES ACTIVE</span>
                      <span style={{ fontSize: '9px', color: '#fff' }}>COVERAGE: 100%</span>
                    </div>
                  </div>

                  {/* Audit Logs Console */}
                  <div style={{
                    background: '#040d1a',
                    padding: '18px 20px',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    borderTop: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>AUDIT AKSES PORTAL PUSAT:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                        <span>[12:05:01] ADMIN: alvin_nugraha</span>
                        <span>AKSES DIBERIKAN // RUANG SERVER</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                        <span>[12:05:03] SISTEM: KLIEN_SSO</span>
                        <span>ROTASI SESI // AMAN</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FFD600' }}>
                        <span>[12:05:08] SISTEM: KEBIJAKAN_PUSAT</span>
                        <span>KEBIJAKAN KELAYAKAN AKTIF DI 4 SITE</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ENTERPRISE RELIABILITY ===== */}
      <section style={{
        background: 'var(--surface-low)',
        padding: '80px 0',
        textAlign: 'center',
        borderTop: '1px solid var(--outline-variant)',
      }}>
        <div className="container">
          <Shield size={48} color="var(--brand-primary)" style={{ opacity: 0.8, marginBottom: '20px' }} />
          <h2 style={{ color: 'var(--brand-dark)', marginBottom: '16px' }}>Enterprise-Grade Reliability</h2>
          <div className="divider" />
          <p style={{ color: 'var(--on-surface-variant)', maxWidth: '580px', margin: '20px auto 48px', lineHeight: 1.75 }}>
            Our solutions are built on a fluid grid architecture ensuring stability
            across CCTV monitoring walls and mobile field apps alike.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
            {[
              'SOC 2 Type II Certified',
              'ISO 27001 Compliant',
              '99.9% SLA Guarantee',
              'End-to-end Encryption',
              '24/7 Expert Support',
              'Automated Failover',
            ].map(pill => (
              <div
                key={pill}
                style={{
                  background: 'white',
                  border: '1.5px solid var(--outline-variant)',
                  borderRadius: '999px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--brand-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <CheckCircle2 size={15} color="var(--brand-primary)" />
                {pill}
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .details-stat-card:hover {
          transform: translateY(-2px);
          border-color: var(--brand-secondary) !important;
          box-shadow: 0 6px 16px rgba(13,71,161,0.08) !important;
        }

        /* CCTV scanline */
        @keyframes scanline {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .cctv-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 193, 7, 0.25);
          box-shadow: 0 0 10px #FFC107, 0 0 4px #FFC107;
          animation: scanline 5s linear infinite;
          pointer-events: none;
          z-index: 10;
        }

        /* Pulsing dots */
        @keyframes pulseRed {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(255, 77, 77, 0.7); }
          50% { opacity: 1; box-shadow: 0 0 0 6px rgba(255, 77, 77, 0); }
        }
        .pulse-red-dot {
          animation: pulseRed 1.8s infinite;
        }

        @keyframes pulseGreen {
          0%, 100% { opacity: 0.6; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          50% { opacity: 1; box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
        }
        .pulse-green-dot {
          animation: pulseGreen 1.8s infinite;
        }

        /* Topology glows */
        @keyframes pulseGlowYellow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.8); }
          50% { transform: scale(1.1); box-shadow: 0 0 10px 4px rgba(255, 193, 7, 0.4); }
        }
        .pulse-yellow-glow {
          animation: pulseGlowYellow 2.2s infinite;
        }

        @keyframes pulseGlowGreen {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.8); }
          50% { transform: scale(1.1); box-shadow: 0 0 10px 4px rgba(16, 185, 129, 0.4); }
        }
        .pulse-green-glow {
          animation: pulseGlowGreen 2.2s infinite;
        }

        /* Bounding Box glow */
        @keyframes boundingGlow {
          0% { border-color: rgba(255, 193, 7, 0.5); box-shadow: 0 0 6px rgba(255, 193, 7, 0.15); }
          100% { border-color: rgba(255, 193, 7, 1); box-shadow: 0 0 14px rgba(255, 193, 7, 0.4); }
        }
        .bounding-glow-yellow {
          animation: boundingGlow 2s infinite alternate ease-in-out;
        }

        /* Red Alarm warning flash */
        @keyframes alertRed {
          0%, 100% { background: #ff4d4d; }
          50% { background: #cc0000; }
        }
        .flash-alert-red {
          animation: alertRed 1s infinite;
        }

        /* SVG Active Connection Dash */
        @keyframes svgDashAnim {
          to { stroke-dashoffset: -40; }
        }
        .svg-dash {
          animation: svgDashAnim 4s linear infinite;
        }

        @media (max-width: 900px) {
          .sol-detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </main>
  );
}
