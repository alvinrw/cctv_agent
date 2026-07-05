import { Link } from 'react-router-dom';
import { Rocket, Target, Users } from 'lucide-react';

const VALUES = [
  { icon: <Target size={24} />, title: 'Presisi Utama', desc: 'Setiap keputusan didukung oleh data akurat — kami membangun sistem pemantauan keselamatan kerja yang andal dan dapat dipercaya.' },
  { icon: <Rocket size={24} />, title: 'Inovasi Tiada Henti', desc: 'Kami terus memperluas batas teknologi kecerdasan buatan (AI) setiap hari untuk mendahului potensi ancaman keamanan tambang.' },
  { icon: <Users size={24} />, title: 'Fokus Pada Pengguna', desc: 'Kesuksesan kami diukur dari tingkat keselamatan operasional dan efisiensi pengawasan yang kami berikan kepada mitra site tambang.' },
];

const TEAM = [
  { name: 'Alvin Nugraha', role: 'Founder & Super Admin', desc: 'Memimpin visi PamAgents untuk mengintegrasikan AI Edge CCTV sebagai sistem keselamatan dan pencegahan bahaya utama di site tambang Astra.', gradient: 'linear-gradient(135deg, #1E49E2, #1A42CC)', initials: 'AN', featured: true },
  { name: 'Marcus Thorne', role: 'Chief Technology Officer', desc: 'Arsitek utama engine Edge AI PamAgents, Marcus ahli dalam komputasi edge dan analisis video real-time dengan latensi rendah.', gradient: 'linear-gradient(135deg, #1A42CC, #3B82F6)', initials: 'MT', featured: true },
  { name: 'Dr. Sarah Lin', role: 'Head of AI Research', desc: 'Memimpin riset machine learning untuk deteksi kepatuhan APD (Alat Pelindung Diri) dan identifikasi otomatis zona bahaya tambang.', gradient: 'linear-gradient(135deg, #07152C, #1E49E2)', initials: 'SL', featured: false },
  { name: 'David Chen', role: 'Head of Operations', desc: 'Mengatur implementasi fisik infrastruktur sensor dan kamera pengawas di lapangan untuk integrasi multi-site yang mulus.', gradient: 'linear-gradient(135deg, #FFD600, #FFC400)', initials: 'DC', initialsColor: '#07152C', featured: false },
  { name: 'Maya Patel', role: 'Lead UI/UX Engineer', desc: 'Merancang dashboard pusat visualisasi peta radar dan pemantauan site terpadu agar mudah dioperasikan oleh pengawas.', gradient: 'linear-gradient(135deg, #1A42CC, #07152C)', initials: 'MP', featured: false },
];

function Avatar({ member, size = 96 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: member.gradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.3, fontWeight: 700, color: member.initialsColor || 'white', letterSpacing: '0.05em',
      boxShadow: '0 8px 24px rgba(30,73,226,0.25)',
      border: '3px solid rgba(255,255,255,0.2)', flexShrink: 0,
    }}>
      {member.initials}
    </div>
  );
}

export default function AboutUs() {
  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Mission */}
      <section className="mission-section">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/g%3E%3C/svg%3E\")", opacity: 0.6, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <h1 style={{ color: 'white', marginBottom: '20px' }}>Misi Kami</h1>
            <div style={{ width:'60px', height:'3px', background:'linear-gradient(90deg,#FFD600,rgba(255,214,0,0.3))', borderRadius:'999px', margin:'0 auto 28px' }} />
            <p style={{ color: 'rgba(219,234,254,0.9)', fontSize: '18px', lineHeight: 1.8 }}>
              Mempelopori masa depan Agentic AI Systems untuk industri pertambangan, menghadirkan tingkat keamanan tak tertandingi,
              presisi tinggi, serta kecerdasan operasional pada site tambang Astra secara 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--surface-low)' }}>
        <div className="container">
          <div className="section-header">
            <h2>Nilai Utama Kami</h2>
            <div className="divider" />
          </div>
          <div className="grid-3" style={{ marginTop: '48px' }}>
            {VALUES.map(v => (
              <div key={v.title} style={{ background:'white', borderRadius:'16px', padding:'36px 28px', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.05)', transition:'all 300ms ease', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 12px 36px rgba(30,73,226,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ width:'52px', height:'52px', background:'var(--primary-fixed)', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', color:'var(--brand-primary)' }}>
                  {v.icon}
                </div>
                <h3 style={{ color:'var(--brand-dark)', marginBottom:'12px' }}>{v.title}</h3>
                <p className="text-sm" style={{ color:'var(--on-surface-variant)', lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Kepemimpinan Kami</h2>
            <div className="divider" />
            <p style={{ marginTop: '16px' }}>Pikiran di balik generasi berikutnya dari pemantauan keamanan AI.</p>
          </div>

          {/* Featured (top 2) */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            {TEAM.filter(m => m.featured).map(member => (
              <div key={member.name} style={{ background:'white', borderRadius:'16px', padding:'36px', display:'flex', gap:'24px', alignItems:'flex-start', boxShadow:'0 4px 16px rgba(0,0,0,0.06)', border:'1px solid rgba(0,0,0,0.05)', transition:'all 300ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 12px 36px rgba(30,73,226,0.12)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <Avatar member={member} size={100} />
                <div style={{ flex:1 }}>
                  <span className="badge badge-blue" style={{ marginBottom:'10px', display:'inline-flex' }}>{member.role}</span>
                  <h3 style={{ color:'var(--brand-dark)', marginBottom:'10px', fontSize:'20px' }}>{member.name}</h3>
                  <p className="text-sm" style={{ color:'var(--on-surface-variant)', lineHeight:1.7 }}>{member.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Rest (bottom 3) */}
          <div className="grid-3">
            {TEAM.filter(m => !m.featured).map(member => (
              <div key={member.name} className="team-card"
                onMouseEnter={e => { e.currentTarget.style.boxShadow='0 12px 36px rgba(30,73,226,0.12)'; e.currentTarget.style.transform='translateY(-5px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow=''; e.currentTarget.style.transform='translateY(0)'; }}
              >
                <div style={{ display:'flex', justifyContent:'center', marginBottom:'16px' }}>
                  <Avatar member={member} size={88} />
                </div>
                <span className="badge badge-blue" style={{ marginBottom:'10px', display:'inline-flex' }}>{member.role}</span>
                <h3 style={{ color:'var(--brand-dark)', marginBottom:'10px', fontSize:'18px' }}>{member.name}</h3>
                <p className="text-sm" style={{ color:'var(--on-surface-variant)', lineHeight:1.6 }}>{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section style={{ background:'linear-gradient(135deg, #1E49E2 0%, #07152C 100%)', padding:'80px 0', textAlign:'center' }}>
        <div className="container">
          <h2 style={{ color:'white', marginBottom:'16px' }}>Hubungi Tim PamAgents</h2>
          <p style={{ color:'rgba(219,234,254,0.85)', marginBottom:'36px', maxWidth:'500px', margin:'0 auto 36px' }}>
            Tertarik untuk mengintegrasikan sistem kecerdasan buatan pada jaringan kamera pengawas site tambang Anda? Hubungi kami hari ini.
          </p>
          <Link to="/contact" className="btn btn-primary" style={{ padding:'14px 40px' }}>Hubungi Kami</Link>
        </div>
      </section>
    </main>
  );
}
