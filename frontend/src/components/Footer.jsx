import { Link } from 'react-router-dom';
import { Mail, Share2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <img src="/logo.png" alt="PamAgents" style={{ height: '26px', width: 'auto', objectFit: 'contain' }} />
              </div>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
                <span style={{ color: '#D9E2FF' }}>Pam</span>
                <span style={{ color: '#FFD600' }}>Agents</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: 1.6 }}>
              © 2024 PamAgents. All rights reserved.<br />Agentic AI System for Astra.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
            {[
              { label: 'Privacy Policy', to: '#' },
              { label: 'Terms of Service', to: '#' },
              { label: 'Solutions', to: '/solutions/agent-ai-cctv' },
              { label: 'Careers', to: '#' },
            ].map(link => (
              <Link key={link.label} to={link.to} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px', transition: 'color 150ms ease' }}
                onMouseEnter={e => e.target.style.color = '#D9E2FF'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}
              >{link.label}</Link>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {[Share2, Mail].map((Icon, i) => (
              <a key={i} href="#" style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#9ca3af', textDecoration: 'none', transition: 'all 300ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand-primary)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
