import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Headphones, CheckCircle2, Send, ExternalLink } from 'lucide-react';

export default function ContactUs() {
  const [form, setForm] = useState({ name:'', email:'', company:'', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <main style={{ paddingTop: '72px' }}>
      {/* Header */}
      <section style={{ background: 'var(--surface-low)', padding: '72px 0 56px', borderBottom: '1px solid var(--outline-variant)' }}>
        <div className="container">
          <h1 style={{ color: 'var(--brand-dark)', marginBottom: '0px' }}>
            Hubungi <span style={{ color: 'var(--brand-primary)' }}>Tim Kami.</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '48px', alignItems: 'flex-start' }} className="contact-grid">

            {/* Form */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '44px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}>
              {submitted ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'340px', textAlign:'center', gap:'20px' }}>
                  <div style={{ width:'80px', height:'80px', borderRadius:'50%', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <CheckCircle2 size={40} color="#10b981" />
                  </div>
                  <h3 style={{ color:'var(--brand-dark)', fontSize:'22px' }}>Pesan Terkirim!</h3>
                  <p style={{ color:'var(--on-surface-variant)', maxWidth:'320px' }}>
                    Terima kasih telah menghubungi kami. Tim kami akan segera merespons Anda dalam waktu 24 jam.
                  </p>
                  <button className="btn btn-dark-outline" onClick={() => { setSubmitted(false); setForm({ name:'', email:'', company:'', message:'' }); }}>
                    Kirim Pesan Lainnya
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ color: 'var(--brand-dark)', fontSize: '22px', marginBottom: '32px', fontWeight: 600 }}>Kirim Pesan Kepada Kami</h2>
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                      <div className="form-group">
                        <label className="form-label">Nama Lengkap</label>
                        <input className="form-input" type="text" name="name" placeholder="Alvin Nugraha" value={form.name} onChange={handleChange} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Kerja</label>
                        <input className="form-input" type="email" name="email" placeholder="alvin@company.com" value={form.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label className="form-label">Perusahaan / Organisasi</label>
                      <input className="form-input" type="text" name="company" placeholder="Astra Mining" value={form.company} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom: '28px' }}>
                      <label className="form-label">Bagaimana kami bisa membantu?</label>
                      <textarea className="form-input" name="message" placeholder="Deskripsikan kebutuhan pemantauan keamanan atau kebutuhan kecerdasan buatan Anda..." value={form.message} onChange={handleChange} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <button type="submit" className="btn btn-primary" style={{ width:'100%', fontSize:'16px', padding:'14px' }} disabled={loading}>
                        {loading ? (
                          <span style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                            <span style={{ width:'18px', height:'18px', border:'2px solid rgba(11,29,58,0.3)', borderTopColor:'var(--brand-dark)', borderRadius:'50%', animation:'spin-loader 0.7s linear infinite', display:'inline-block' }} />
                            Mengirim...
                          </span>
                        ) : (
                          <span style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <Send size={18} /> Kirim Pesan
                          </span>
                        )}
                      </button>
                      <p style={{ fontSize:'12px', color:'var(--outline)', textAlign:'center' }}>
                        Dengan mengirimkan formulir ini, Anda menyetujui{' '}
                        <a href="#" style={{ color:'var(--brand-primary)', textDecoration:'none', fontWeight:600 }}>Kebijakan Privasi</a> kami.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* HQ */}
              <div className="contact-info-card">
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                  <div style={{ width:'36px', height:'36px', background:'var(--primary-fixed)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <MapPin size={18} color="var(--brand-primary)" />
                  </div>
                  <h3 style={{ fontSize:'16px', color:'var(--brand-dark)', fontWeight:700 }}>Kantor Pusat</h3>
                </div>
                <div style={{ background:'var(--surface-low)', borderRadius:'10px', padding:'14px 16px', fontSize:'14px', color:'var(--on-surface-variant)', lineHeight:1.8 }}>
                  <strong style={{ color:'var(--brand-dark)', display:'block', marginBottom:'4px' }}>Astra Mining Indonesia</strong>
                  Jl. Raya Bogor No. 100<br />
                  Jakarta Timur, DKI Jakarta 13930<br />
                  Indonesia
                </div>
              </div>

              {/* Direct Contact */}
              <div className="contact-info-card">
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                  <div style={{ width:'36px', height:'36px', background:'var(--primary-fixed)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Headphones size={18} color="var(--brand-primary)" />
                  </div>
                  <h3 style={{ fontSize:'16px', color:'var(--brand-dark)', fontWeight:700 }}>Kontak Langsung</h3>
                </div>
                {[
                  { label:'DUKUNGAN TEKNIS', email:'support@pamagents.com' },
                  { label:'KEMITRAAN & PENJUALAN', email:'sales@pamagents.com' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'14px', padding:'12px 0', borderBottom:'1px solid var(--outline-variant)' }}>
                    <div style={{ width:'32px', height:'32px', background:'var(--surface-low)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--brand-primary)', flexShrink:0 }}>
                      <Mail size={16} />
                    </div>
                    <div>
                      <p style={{ fontSize:'10px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--outline)', marginBottom:'2px' }}>{item.label}</p>
                      <a href={`mailto:${item.email}`} style={{ fontSize:'14px', color:'var(--brand-primary)', textDecoration:'none', fontWeight:600 }}>{item.email}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin-loader { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 600px) { .contact-grid form > div:first-child { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  );
}
