import {
  AlertTriangle, Camera, WifiOff
} from 'lucide-react';
import cctvImg1 from '../../../assets/1.webp';
import cctvImg2 from '../../../assets/2.jpg';
import cctvImg3 from '../../../assets/3.png';
import cctvImg4 from '../../../assets/4.png';

export default function LiveMultiCctvTab({
  sites,
  selectedCctvIds,
  setSelectedCctvIds,
  gridSize,
  setGridSize
}) {
  return (
  <section style={{ marginTop: '32px' }}>
    <div className="container animate-tab-fade">
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }} className="db-layout-grid">

        {/* Left Column: List of CCTV Cameras to Display */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #E3E6EE',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          alignSelf: 'start',
          maxHeight: '620px',
          overflowY: 'auto'
        }}>
          <h4 style={{ color: 'var(--brand-dark)', margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>Daftar Kamera CCTV</h4>
          <p style={{ color: 'var(--outline)', fontSize: '11px', margin: '0 0 16px' }}>Centang kamera yang ingin ditampilkan pada monitor.</p>

          {sites.map(s => {
            const cctvs = s.details.filter(d => d.type === 'cctv');
            if (cctvs.length === 0) return null;
            return (
              <div key={s.id} style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', marginBottom: '8px', paddingBottom: '2px', borderBottom: '1px solid #F0EDED' }}>
                  {s.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {cctvs.map(cam => {
                    const isChecked = selectedCctvIds.includes(cam.id);
                    return (
                      <label key={cam.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', color: 'var(--on-surface-variant)', padding: '4px 0' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCctvIds(prev => prev.filter(id => id !== cam.id));
                            } else {
                              setSelectedCctvIds(prev => [...prev, cam.id]);
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cam.status === 'ONLINE' ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{cam.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Custom Grid & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Grid Layout Selector & Top Actions */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px 24px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)' }}>Layout Monitor:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { size: 1, label: '1 Layar' },
                  { size: 2, label: '2 Layar' },
                  { size: 4, label: '4 Layar' },
                  { size: 6, label: '6 Layar' }
                ].map(opt => (
                  <button
                    key={opt.size}
                    onClick={() => setGridSize(opt.size)}
                    style={{
                      background: gridSize === opt.size ? 'var(--brand-primary)' : 'var(--surface-low)',
                      color: gridSize === opt.size ? 'white' : 'var(--on-surface-variant)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => alert('Simulasi Sirene Diaktifkan di Seluruh Sektor!')}
                style={{
                  background: '#EF4444', color: 'white', border: 'none', borderRadius: '6px',
                  padding: '8px 14px', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: '0 2px 8px rgba(239,68,68,0.2)'
                }}
              >
                <AlertTriangle size={14} /> Sirene Bahaya
              </button>
              {/* <button
                onClick={() => alert('Mengambil snapshot dari semua monitor aktif...')}
                style={{
                  background: 'white', color: 'var(--brand-primary)', border: '1.5px solid var(--brand-primary)',
                  borderRadius: '6px', padding: '7px 14px', fontWeight: 600, fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}
              >
                <Camera size={14} /> Tangkap Layar
              </button> */}
            </div>
          </div>

          {/* Dynamic Monitors Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: gridSize === 1 ? '1fr' : gridSize === 2 ? '1fr 1fr' : gridSize === 6 ? '1fr 1fr 1fr' : '1fr 1fr',
            gap: '16px'
          }}>
            {Array.from({ length: gridSize }).map((_, idx) => {
              const activeCctvId = selectedCctvIds[idx];

              // Find actual CCTV object from sites
              let cam = null;
              let sectorName = '';
              if (activeCctvId) {
                for (const s of sites) {
                  const found = s.details.find(d => d.id === activeCctvId);
                  if (found) {
                    cam = found;
                    sectorName = s.name;
                    break;
                  }
                }
              }

              return (
                <div key={idx} style={{
                  background: '#040d1a',
                  borderRadius: '12px',
                  border: cam?.status === 'OFFLINE' ? '2px solid #ff4d4d' : '1.5px solid #E3E6EE',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  height: gridSize === 1 ? '400px' : gridSize === 6 ? '180px' : '230px',
                  transition: 'all 0.3s ease'
                }}>
                  {!cam ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.25)', gap: '8px', padding: '16px', textAlign: 'center' }}>
                      <Camera size={32} style={{ opacity: 0.4 }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'monospace' }}>
                        MONITOR {idx + 1}<br />
                        <span style={{ color: 'var(--outline)', fontWeight: 400 }}>Pilih kamera dari daftar di kiri</span>
                      </span>
                    </div>
                  ) : cam.status === 'OFFLINE' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#ff4d4d', gap: '8px' }}>
                      <WifiOff size={36} />
                      <span style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center' }}>
                        {cam.name}<br />
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>NO SIGNAL // OFFLINE</span>
                      </span>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', height: '100%' }}>
                      {/* Real CCTV preview image */}
                      {(() => {
                        const imgs = [cctvImg1, cctvImg2, cctvImg3, cctvImg4];
                        return (
                          <img
                            src={imgs[idx % imgs.length]}
                            alt={`CCTV Feed ${idx + 1}`}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block'
                            }}
                          />
                        );
                      })()}

                      {/* Top bar info */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                        <span style={{ background: 'rgba(7,21,44,0.85)', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '3px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '140px' }}>
                          M-{idx + 1} // {cam.name}
                        </span>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#EF4444', animation: 'ping-dot 1s infinite' }} />
                          <span style={{ color: '#EF4444', fontSize: '7px', fontWeight: 'bold', fontFamily: 'monospace' }}>REC</span>
                        </div>
                      </div>

                      {/* Bottom bar info */}
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 }}>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontFamily: 'monospace' }}>
                          FPS: 30 // HD
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '8px', fontFamily: 'monospace', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
                          {sectorName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Active AI Alert log feed */}
          <div style={{ background: '#07152C', borderRadius: '12px', padding: '16px 20px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            <h4 style={{ color: '#FFD600', margin: '0 0 10px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deteksi AI Pada Monitor Aktif</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '100px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '10px' }}>
              <div style={{ color: '#4ADE80' }}>&gt; [12:08:01] Monitor 1: objek excavator terdeteksi (98.5% akurasi)</div>
              <div style={{ color: '#4ADE80' }}>&gt; [12:08:04] Monitor 2: objek truk batubara terdeteksi (99.1% akurasi)</div>
              <div style={{ color: '#FFD600' }}>&gt; [12:08:12] Monitor 3: keselamatan - objek manusia melewati batas area merah (WARNING)</div>
              {/* <div style={{ color: '#EF4444' }}>&gt; [12:08:18] Monitor 4: ANCAMAN - kamera crusher terputus dari signal (ALERT)</div> */}
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
  );
}
