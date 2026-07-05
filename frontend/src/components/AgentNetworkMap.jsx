import { useEffect, useState } from 'react';

const SITES = [
  { id: 'CAM-MALANG-01', x: 25, y: 30, label: 'CCTV Excavator Shovel 01', status: 'OK', color: '#10B981', details: 'Pit A (Quarry Barat)' },
  { id: 'CAM-MALANG-02', x: 70, y: 25, label: 'Haul Road Incline A', status: 'OK', color: '#10B981', details: 'Pit A (Quarry Barat)' },
  { id: 'CAM-MALANG-03', x: 48, y: 65, label: 'Kamera Pengawas CCTV', status: 'OK', color: '#10B981', details: 'Pit A (Quarry Barat)' },
];


export default function AgentNetworkMap() {
  const [activeSite, setActiveSite] = useState(null);
  const [logMessages, setLogMessages] = useState([
    'Satellite stream connected.',
    'Astra site mapping online.',
  ]);

  // Periodic log updates
  useEffect(() => {
    const logInterval = setInterval(() => {
      const randomSite = SITES[Math.floor(Math.random() * SITES.length)];
      const events = [
        `Pemindaian ${randomSite.id} (${randomSite.label}): ${randomSite.status}`,
        `Ping latency untuk ${randomSite.id}: ${Math.floor(Math.random() * 30 + 8)}ms`,
        `Koneksi kamera ${randomSite.id} stabil`,
      ];
      setLogMessages((prev) => [events[Math.floor(Math.random() * events.length)], ...prev.slice(0, 2)]);
    }, 4500);
    return () => clearInterval(logInterval);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>
      {/* Satellite Map Container */}
      <div style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        background: '#0B1528',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
        minHeight: '230px',
        flex: '1'
      }}>
        {/* Satellite Background */}
        <img
          src="/mine_site_satellite.png"
          alt="Mine Site Satellite Map"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: 'brightness(0.7) contrast(1.15) saturate(1.1)',
            minHeight: '230px'
          }}
        />

        {/* Cyber Scanning Overlay grid & scanline */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(30, 73, 226, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 73, 226, 0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }} />

        {/* Sweeping Scanner bar */}
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(30, 73, 226, 0.8), transparent)',
          boxShadow: '0 0 12px rgba(30, 73, 226, 0.8)',
          animation: 'radar-sweep-y 5s linear infinite',
          pointerEvents: 'none'
        }} />

        <style>{`
          @keyframes radar-sweep-y {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
          @keyframes radar-pulse {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(3.5); opacity: 0; }
          }
        `}</style>

        {/* Interactive Site Nodes */}
        {SITES.map((site) => {
          const isSelected = activeSite?.id === site.id;
          return (
            <div
              key={site.id}
              style={{
                position: 'absolute',
                left: `${site.x}%`,
                top: `${site.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10
              }}
              onMouseEnter={() => setActiveSite(site)}
              onMouseLeave={() => setActiveSite(null)}
            >
              {/* Outer pulsating ring */}
              <div style={{
                position: 'absolute',
                left: '-12px', top: '-12px',
                width: '28px', height: '28px',
                borderRadius: '50%',
                border: `2px solid ${site.color}`,
                animation: 'radar-pulse 2s infinite ease-out',
                pointerEvents: 'none'
              }} />

              {/* Inner glowing dot */}
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: site.color,
                boxShadow: `0 0 10px ${site.color}, 0 0 4px ${site.color}`,
                border: '1.5px solid white',
                transition: 'transform 0.2s ease-in-out',
                transform: isSelected ? 'scale(1.3)' : 'scale(1)'
              }} />

              {/* Mini tag label */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(7, 21, 44, 0.92)',
                border: `1px solid ${site.color}`,
                borderRadius: '4px',
                padding: '2px 6px',
                whiteSpace: 'nowrap',
                color: 'white',
                fontSize: '8px',
                fontWeight: 'bold',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                opacity: isSelected ? 1 : 0.8,
                transition: 'opacity 0.2s'
              }}>
                {site.id}
              </div>

              {/* Popup Tooltip detailing site status */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#0B1528',
                  border: `1.5px solid ${site.color}`,
                  borderRadius: '6px',
                  padding: '8px 12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  zIndex: 20,
                  pointerEvents: 'none'
                }}>
                  <p style={{ margin: 0, color: 'white', fontSize: '10px', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                    {site.label}
                  </p>
                  <p style={{ margin: '2px 0 0 0', color: site.color, fontSize: '9px', fontFamily: 'monospace' }}>
                    Status: {site.status} ({site.details})
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
