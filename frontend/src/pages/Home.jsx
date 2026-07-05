import { Link } from 'react-router-dom';
import { Shield, Camera, CheckCircle2, Rocket, ChevronRight } from 'lucide-react';
import AgentNetworkMap from '../components/AgentNetworkMap';

const SOLUTIONS = [
  { icon: <Camera size={26} />, title: 'Agent AI CCTV', desc: 'Pemantauan pintar berbasis AI Edge yang menganalisis rekaman video secara langsung di area tambang. Mendeteksi pelanggaran APD, orang di zona berbahaya, dan insiden keselamatan secara lokal dengan respons instan.' },
  { icon: <Shield size={26} />, title: 'Centralized Access Portal', desc: 'Sistem kontrol keamanan terpusat untuk seluruh site tambang Astra. Kelola hak akses admin, pantau laporan gabungan seluruh cctv, dan koordinasikan peringatan keamanan secara terintegrasi.' },
];

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <header className="hero-section">
        <div className="hero-pattern" />
        <div className="hero-content">
          {/* Left */}
          <div style={{ flex: '1 1 55%' }}>
            <span className="badge badge-yellow" style={{ marginBottom: '20px' }}>Keamanan Site Tambang</span>
            <h1 style={{ color: 'white', marginBottom: '20px', marginTop: '12px' }}>
              Platform Pemantauan<br />
              <span style={{ color: '#FFD600' }}>CCTV Berbasis AI</span>
            </h1>
            <p style={{ color: 'rgba(219,234,254,0.9)', marginBottom: '32px', maxWidth: '540px', fontSize: '16px', lineHeight: 1.75 }}>
              Deteksi ancaman keamanan area tambang secara real-time menggunakan teknologi AI terintegrasi pada jaringan CCTV Anda.
              Ubah pengawasan pasif menjadi pencegahan aktif dan respon insiden otomatis demi keselamatan kerja maksimal.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
              <Link to="/solutions/agent-ai-cctv" className="btn btn-primary">Jadwalkan Demo</Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              {['Pemantauan 24/7', '99.9% Uptime Sistem', 'Standar Keamanan Astra'].map(c => (
                <div key={c} className="check-item">
                  <CheckCircle2 size={18} color="#FFD600" /><span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Agent Network Map */}
          <div style={{ flex: '1 1 40%', maxWidth: '460px', width: '100%' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: '-4px', borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(255,214,0,0.4), rgba(66,165,245,0.3))',
                filter: 'blur(12px)', opacity: 0.6,
              }} />
              <div className="glass-card" style={{ padding: '24px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '16px', marginBottom: '20px' }}>
                  <h3 style={{ color: 'white', fontSize: '17px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD600"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" /></svg>
                    Live Security Radar Scan
                  </h3>
                  <span style={{ position: 'relative', display: 'inline-flex', width: '12px', height: '12px' }}>
                    <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#4ade80', opacity: 0.75, animation: 'ping-dot 1.5s ease infinite' }} />
                    <span style={{ position: 'relative', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }} />
                  </span>
                </div>
                <div style={{ minHeight: '310px', marginBottom: '20px' }}>
                  <AgentNetworkMap />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="stats-card">
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Agen Aktif</p>
                    <p style={{ color: 'white', fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      24<span style={{ color: '#FFD600', fontSize: '12px', fontWeight: 400 }}>online</span>
                    </p>
                  </div>
                  <div className="stats-card">
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '6px' }}>Area Pemantauan</p>
                    <p style={{ color: 'white', fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                      15<span style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 400 }}>km²</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SOLUTIONS */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Solusi Pemantauan Keamanan</h2>
            <div className="divider" />
            <p style={{ marginTop: '16px' }}>
              Sistem deteksi ancaman keamanan area tambang secara real-time yang terintegrasi penuh untuk menjaga keselamatan operasional.
            </p>
          </div>
          <div className="grid-2">
            {SOLUTIONS.map(sol => (
              <div key={sol.title} className="solution-card">
                <div className="solution-card-icon">{sol.icon}</div>
                <div>
                  <h3 style={{ color: 'var(--brand-dark)', marginBottom: '8px', fontSize: '17px' }}>{sol.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>{sol.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/solutions/agent-ai-cctv" className="btn btn-dark-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              Lihat Detail Solusi <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #1A42CC 0%, #1E49E2 100%)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '40px', textAlign: 'center' }}>
            {[{ num: '99.9%', label: 'Uptime Sistem' }, { num: '50+', label: 'CCTV Terkoneksi' }, { num: '24/7', label: 'Pemantauan Aktif' }].map(s => (
              <div key={s.label}>
                <p style={{ fontSize: '42px', fontWeight: 700, color: '#FFD600', lineHeight: 1.1, marginBottom: '8px' }}>{s.num}</p>
                <p style={{ color: 'rgba(219,234,254,0.85)', fontSize: '15px', fontWeight: 500 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div style={{ position: 'absolute', top: 0, left: 0, width: '280px', height: '280px', borderRadius: '50%', background: '#1A42CC', filter: 'blur(80px)', opacity: 0.5 }} className="animate-blob" />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '280px', height: '280px', borderRadius: '50%', background: '#FFD600', filter: 'blur(80px)', opacity: 0.15 }} className="animate-blob animation-delay-2000" />
        <div style={{ position: 'absolute', bottom: '-80px', left: '10%', width: '280px', height: '280px', borderRadius: '50%', background: '#07152C', filter: 'blur(80px)', opacity: 0.5 }} className="animate-blob animation-delay-4000" />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <Rocket size={48} color="#FFD600" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 12px rgba(255,214,0,0.5))' }} />
            <h2 style={{ color: 'white', marginBottom: '16px' }}>Siap Mengamankan Operasional Tambang Anda?</h2>
            <p style={{ color: 'rgba(219,234,254,0.9)', marginBottom: '40px', fontSize: '16px' }}>
              Bergabunglah dengan pengawas site terkemuka yang memercayakan keselamatan area tambang mereka pada sistem pemantauan AI PamAgents.
            </p>
            <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '17px' }}>
              Jadwalkan Demo Sekarang
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
