// Logo menggunakan file logo.png yang asli
export default function Logo({ height = 40, showText = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '4px 8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: `${height}px`
      }}>
        <img
          src="/logo.png"
          alt="PamAgents Logo"
          style={{ height: `${height - 8}px`, width: 'auto', objectFit: 'contain' }}
        />
      </div>
      {showText && (
        <span style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: height * 0.5,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          lineHeight: 1,
        }}>
          <span style={{ color: 'white' }}>Pam</span>
          <span style={{ color: '#FFD600' }}>Agents</span>
        </span>
      )}
    </div>
  );
}
