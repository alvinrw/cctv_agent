import { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Zap, Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolOpen, setMobileSolOpen] = useState(false);

  // ===== DROPDOWN STATE (React-controlled, bukan CSS hover) =====
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const closeTimer = useRef(null);

  const openDropdown = () => {
    // Cancel any pending close
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const closeDropdown = () => {
    // Delay close sedikit agar mouse bisa pindah ke menu tanpa hilang
    closeTimer.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 120);
  };

  const handleDropdownItemClick = (path) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;
  const isSolutionActive = location.pathname.startsWith('/solutions');

  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            height: '42px'
          }}>
            <img src="/logo.png" alt="PamAgents" style={{ height: '30px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>
            <span style={{ color: 'white' }}>Pam</span>
            <span style={{ color: '#FFD600' }}>Agents</span>
          </span>
        </Link>

        {/* ===== DESKTOP NAV ===== */}
        <div id="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>

          {/* Solutions Dropdown — React state controlled */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            {/* Trigger button */}
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '15px',
                fontWeight: isSolutionActive ? 700 : 500,
                color: isSolutionActive ? '#FFD600' : 'rgba(255,255,255,0.85)',
                padding: '8px 0',
                position: 'relative',
                transition: 'color 150ms ease',
              }}
            >
              Solutions
              <ChevronDown
                size={15}
                style={{
                  transition: 'transform 250ms ease',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
              {isSolutionActive && (
                <span style={{
                  position: 'absolute', bottom: '2px', left: 0, right: 0,
                  height: '2px', background: '#FFD600', borderRadius: '999px',
                }} />
              )}
            </button>

            {/* Invisible bridge — mengisi gap antara button dan menu agar hover tidak putus */}
            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '-20px', right: '-20px',
                height: '14px',
                background: 'transparent',
              }} />
            )}

            {/* Dropdown menu */}
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 12px)',
                left: '50%',
                minWidth: '260px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '8px 0',
                zIndex: 200,
                // Animasi
                opacity: dropdownOpen ? 1 : 0,
                visibility: dropdownOpen ? 'visible' : 'hidden',
                transform: dropdownOpen
                  ? 'translateX(-50%) translateY(0)'
                  : 'translateX(-50%) translateY(-8px)',
                transition: 'opacity 200ms ease, visibility 200ms ease, transform 200ms ease',
                pointerEvents: dropdownOpen ? 'auto' : 'none',
              }}
              onMouseEnter={openDropdown}
              onMouseLeave={closeDropdown}
            >
              {/* Item 1 */}
              <div
                onClick={() => handleDropdownItemClick('/solutions/agent-ai-cctv')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', cursor: 'pointer',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F6F3F2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#D9E2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Zap size={17} color="#0D47A1" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#0B1D3A', margin: 0 }}>Agent AI CCTV</p>
                  <p style={{ fontSize: '12px', color: '#434652', margin: 0 }}>Intelligent video analysis</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: '#F0EDED', margin: '0 16px' }} />

              {/* Item 2 */}
              <div
                onClick={() => handleDropdownItemClick('/solutions/centralized-access')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 16px', cursor: 'pointer',
                  transition: 'background 150ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F6F3F2'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: '#D9E2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Shield size={17} color="#0D47A1" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: '#0B1D3A', margin: 0 }}>Centralized Access</p>
                  <p style={{ fontSize: '12px', color: '#434652', margin: 0 }}>Unified control panel</p>
                </div>
              </div>
            </div>
          </div>

          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
          <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact Us</Link>
        </div>

        {/* Desktop CTA */}
        <div id="desktop-cta">
          <Link to="/solutions/agent-ai-cctv" className="btn btn-primary" style={{ padding: '10px 22px', fontSize: '14px' }}>
            Get Demo
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          id="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => setMobileOpen(false)}
          style={{ fontSize: '16px', padding: '8px 0' }}
        >
          Home
        </Link>

        <button
          onClick={() => setMobileSolOpen(v => !v)}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
            fontFamily: "'Poppins', sans-serif", fontSize: '16px', fontWeight: 500,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 0',
          }}
        >
          Solutions
          <ChevronDown
            size={16}
            style={{ transform: mobileSolOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: '300ms' }}
          />
        </button>

        {mobileSolOpen && (
          <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link
              to="/solutions/agent-ai-cctv"
              className="nav-link"
              onClick={() => { setMobileOpen(false); setMobileSolOpen(false); }}
              style={{ fontSize: '15px' }}
            >
              → Agent AI CCTV
            </Link>
            <Link
              to="/solutions/centralized-access"
              className="nav-link"
              onClick={() => { setMobileOpen(false); setMobileSolOpen(false); }}
              style={{ fontSize: '15px' }}
            >
              → Centralized Access
            </Link>
          </div>
        )}

        <Link
          to="/about"
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          onClick={() => setMobileOpen(false)}
          style={{ fontSize: '16px', padding: '8px 0' }}
        >
          About Us
        </Link>
        <Link
          to="/contact"
          className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
          onClick={() => setMobileOpen(false)}
          style={{ fontSize: '16px', padding: '8px 0' }}
        >
          Contact Us
        </Link>
        <Link
          to="/contact"
          className="btn btn-primary"
          onClick={() => setMobileOpen(false)}
          style={{ marginTop: '8px', width: '100%' }}
        >
          Get Demo
        </Link>
      </div>

      <style>{`
        @media (min-width: 769px) {
          #mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
        @media (max-width: 768px) {
          #desktop-nav { display: none !important; }
          #desktop-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}
