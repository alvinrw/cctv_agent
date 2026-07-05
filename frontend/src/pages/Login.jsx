import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isAuthenticated', 'true');
        setLoading(false);
        navigate('/dashboard');
      } else {
        setError('Username atau password salah.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0B1D3A 0%, #0D47A1 100%)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Back to Home Button */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          color: 'rgba(255, 255, 255, 0.7)',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 600,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px 16px',
          borderRadius: '8px',
          transition: 'all 0.2s ease',
          zIndex: 10
        }}
        className="back-home-btn"
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>
      {/* Decorative Blur Blobs */}
      <div style={{
        position: 'absolute', width: '300px', height: '300px',
        borderRadius: '50%', background: 'rgba(255, 193, 7, 0.15)',
        filter: 'blur(80px)', top: '-50px', right: '-50px',
      }} />
      <div style={{
        position: 'absolute', width: '400px', height: '400px',
        borderRadius: '50%', background: 'rgba(13, 71, 161, 0.3)',
        filter: 'blur(100px)', bottom: '-100px', left: '-100px',
      }} />

      {/* Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
        zIndex: 5,
        textAlign: 'center',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '6px 16px',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            marginBottom: '16px'
          }}>
            <img src="/logo.png" alt="PamAgents" style={{ height: '32px', width: 'auto' }} />
          </div>
          <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, letterSpacing: '-0.01em', marginBottom: '8px' }}>
            Portal Pemantauan
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
            Masuk dengan akun admin Anda untuk melihat dashboard.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textAlign: 'left',
          }}>
            <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
            <span style={{ color: '#fca5a5', fontSize: '13px', fontWeight: 500 }}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Username input */}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: 600 }}>
              USERNAME
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                className="login-input"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label" style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px', fontWeight: 600 }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 42px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1.5px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: 'white',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                className="login-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,255,255,0.4)',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '10px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              fontSize: '15px',
            }}
          >
            {loading ? 'Menghubungkan...' : 'Masuk'}
          </button>
        </form>
      </div>

      <style>{`
        .login-input:focus {
          border-color: #FFC107 !important;
          box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.2) !important;
        }
        .back-home-btn:hover {
          color: #FFC107 !important;
          background: rgba(255,255,255,0.12) !important;
          border-color: rgba(255, 193, 7, 0.3) !important;
          transform: translateX(-2px);
        }
      `}</style>
    </main>
  );
}
