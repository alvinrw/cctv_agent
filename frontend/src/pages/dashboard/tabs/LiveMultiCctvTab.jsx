import { useState } from 'react';
import {
  Camera, WifiOff, Maximize2, X, Rewind, Play, Pause, FastForward, Download
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
  const [page, setPage] = useState(0);
  const [fullscreenCctv, setFullscreenCctv] = useState(null);
  const [focusedMonitorIdx, setFocusedMonitorIdx] = useState(null);
  const [playbackNotification, setPlaybackNotification] = useState({});

  const handlePlaybackAction = (type) => {
    if (focusedMonitorIdx === null) return;
    const globalIdx = currentPage * gridSize + focusedMonitorIdx;
    const camId = selectedCctvIds[globalIdx];
    if (!camId) return;

    let text = '';
    switch (type) {
      case 'rev5': text = 'REWIND -5s'; break;
      case 'rev10': text = 'REWIND -10s'; break;
      case 'rev30': text = 'REWIND -30s'; break;
      case 'pause': text = 'PAUSED'; break;
      case 'play': text = 'PLAYING'; break;
      case 'ff': text = 'SPEED: 2x'; break;
      case 'snap': text = 'SNAPSHOT SAVED'; break;
      case 'download': text = 'DOWNLOADING VIDEO...'; break;
      default: break;
    }

    setPlaybackNotification(prev => ({
      ...prev,
      [focusedMonitorIdx]: text
    }));

    if (type !== 'pause' && type !== 'play' && type !== 'ff') {
      setTimeout(() => {
        setPlaybackNotification(prev => {
          const next = { ...prev };
          delete next[focusedMonitorIdx];
          return next;
        });
      }, 2000);
    }
  };

  const totalSelected = selectedCctvIds.length;
  const totalPages = Math.max(1, Math.ceil(totalSelected / gridSize));
  const currentPage = Math.min(page, totalPages - 1);

  return (
    <>
      <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
      <div className="animate-tab-fade">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top: Layout Monitor Selector & Top Actions */}
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
                  { size: 4, label: '4 Layar' },
                  { size: 6, label: '6 Layar' },
                  { size: 9, label: '9 Layar' }
                ].map(opt => (
                  <button
                    key={opt.size}
                    onClick={() => {
                      setGridSize(opt.size);
                      setPage(0); // Reset page to 0 when layout size changes to prevent out of bounds
                      setFocusedMonitorIdx(null);
                      setPlaybackNotification({});
                    }}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {totalSelected > gridSize && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--outline)', marginRight: '4px' }}>
                    {currentPage + 1} dari {totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setPage(prev => Math.max(0, prev - 1));
                      setFocusedMonitorIdx(null);
                      setPlaybackNotification({});
                    }}
                    disabled={currentPage === 0}
                    style={{
                      background: currentPage === 0 ? '#ECEEF1' : 'var(--brand-primary)',
                      color: currentPage === 0 ? 'var(--outline)' : 'white',
                      border: 'none', borderRadius: '6px',
                      padding: '6px 12px', fontWeight: 600, fontSize: '12px',
                      cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => {
                      setPage(prev => Math.min(totalPages - 1, prev + 1));
                      setFocusedMonitorIdx(null);
                      setPlaybackNotification({});
                    }}
                    disabled={currentPage >= totalPages - 1}
                    style={{
                      background: currentPage >= totalPages - 1 ? '#ECEEF1' : 'var(--brand-primary)',
                      color: currentPage >= totalPages - 1 ? 'var(--outline)' : 'white',
                      border: 'none', borderRadius: '6px',
                      padding: '6px 12px', fontWeight: 600, fontSize: '12px',
                      cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Middle: Dynamic Monitors Grid (Full Width & Larger Screens) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: (gridSize === 6 || gridSize === 9) ? '1fr 1fr 1fr' : '1fr 1fr',
            gridTemplateRows: (gridSize === 9) ? '1fr 1fr 1fr' : '1fr 1fr',
            height: '560px',
            gap: '16px'
          }}>
            {Array.from({ length: gridSize }).map((_, idx) => {
              const activeCctvId = selectedCctvIds[currentPage * gridSize + idx];

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
                <div key={idx} className="monitor-card"
                  onClick={() => {
                    if (cam) setFocusedMonitorIdx(idx);
                  }}
                  style={{
                    background: '#040d1a',
                    borderRadius: '12px',
                    border: cam?.status === 'OFFLINE' ? '2.5px solid #ff4d4d' : (focusedMonitorIdx === idx ? '2.5px solid var(--brand-primary)' : '1.5px solid #E3E6EE'),
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: focusedMonitorIdx === idx ? '0 0 0 3px rgba(30,73,226,0.3)' : '0 4px 16px rgba(0,0,0,0.08)',
                    height: '100%',
                    transition: 'all 0.2s ease',
                    cursor: cam ? 'pointer' : 'default'
                  }}>
                  {!cam ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.25)', gap: '8px', padding: '16px', textAlign: 'center' }}>
                      <Camera size={32} style={{ opacity: 0.4 }} />
                      <span style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'monospace' }}>
                        MONITOR {idx + 1}<br />
                        <span style={{ color: 'var(--outline)', fontWeight: 400 }}>Pilih kamera dari daftar di bawah</span>
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
                      {/* Playback status overlay notification */}
                      {playbackNotification[idx] && (
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(7,21,44,0.65)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFD600',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          zIndex: 8,
                          letterSpacing: '1px',
                          pointerEvents: 'none'
                        }}>
                          <span style={{ background: 'rgba(0,0,0,0.75)', padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {playbackNotification[idx]}
                          </span>
                        </div>
                      )}
                      {/* Fullscreen Hover Button */}
                      <button
                        className="monitor-fullscreen-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenCctv({ cam, idx, sectorName });
                        }}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          background: 'rgba(30, 73, 226, 0.95)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          cursor: 'pointer',
                          zIndex: 15,
                          boxShadow: '0 4px 12px rgba(30,73,226,0.3)',
                          outline: 'none'
                        }}
                      >
                        <Maximize2 size={18} />
                      </button>
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

          {/* Playback Control Panel */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: '-8px',
            marginBottom: '-4px'
          }}>
            {[
              { type: 'rev5', label: 'Mundur 5d', icon: <Rewind size={13} />, desc: 'Mundur 5 Detik' },
              { type: 'rev10', label: 'Mundur 10d', icon: <Rewind size={13} />, desc: 'Mundur 10 Detik' },
              { type: 'rev30', label: 'Mundur 30d', icon: <Rewind size={13} />, desc: 'Mundur 30 Detik' },
              { type: 'pause', label: 'Jeda', icon: <Pause size={13} />, desc: 'Jeda Rekaman' },
              { type: 'play', label: 'Putar', icon: <Play size={13} />, desc: 'Putar Rekaman' },
              { type: 'ff', label: 'Percepat 2x', icon: <FastForward size={13} />, desc: 'Percepat Putaran' },
              { type: 'snap', label: 'Snapshot', icon: <Camera size={13} />, desc: 'Ambil Foto Cuplikan' },
              { type: 'download', label: 'Unduh Klip', icon: <Download size={13} />, desc: 'Unduh Klip Video' }
            ].map(action => {
              const isControlActive = focusedMonitorIdx !== null && selectedCctvIds[currentPage * gridSize + focusedMonitorIdx];
              return (
                <button
                  key={action.type}
                  disabled={!isControlActive}
                  onClick={() => handlePlaybackAction(action.type)}
                  title={action.desc}
                  style={{
                    background: isControlActive ? '#F1F5F9' : '#F8FAFC',
                    color: isControlActive ? 'var(--brand-dark)' : 'var(--outline)',
                    border: isControlActive ? '1px solid #CBD5E1' : '1px solid #E2E8F0',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: isControlActive ? 'pointer' : 'not-allowed',
                    opacity: isControlActive ? 1 : 0.5,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    outline: 'none'
                  }}
                  onMouseOver={(e) => {
                    if (isControlActive) {
                      e.currentTarget.style.background = 'var(--brand-primary)';
                      e.currentTarget.style.color = 'white';
                      e.currentTarget.style.borderColor = 'var(--brand-primary)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (isControlActive) {
                      e.currentTarget.style.background = '#F1F5F9';
                      e.currentTarget.style.color = 'var(--brand-dark)';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }
                  }}
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom: List of CCTV Cameras to Display */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #E3E6EE',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ color: 'var(--brand-dark)', margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>Sektor Pemantauan</h4>
            <p style={{ color: 'var(--outline)', fontSize: '11px', margin: '0 0 20px' }}>Pilih salah satu sektor di bawah untuk menampilkan seluruh kamera CCTV pada monitor.</p>

            <div
              className="sleek-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '20px',
                overflowX: 'auto',
                paddingBottom: '12px'
              }}
            >
              {(() => {
                const allCctvIds = sites.flatMap(s => s.details.filter(d => d.type === 'cctv')).map(c => c.id);
                const isAllSelected = allCctvIds.length > 0 && allCctvIds.every(id => selectedCctvIds.includes(id)) && selectedCctvIds.length === allCctvIds.length;

                return (
                  <div
                    onClick={() => {
                      setSelectedCctvIds(allCctvIds);
                      setPage(0);
                    }}
                    style={{
                      background: isAllSelected ? 'rgba(30, 73, 226, 0.04)' : '#F8FAFC',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isAllSelected ? '2px solid var(--brand-primary)' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isAllSelected ? '0 2px 8px rgba(30,73,226,0.1)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: '0 0 240px'
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: isAllSelected ? 'var(--brand-primary)' : 'var(--outline)',
                        textTransform: 'uppercase',
                        marginBottom: '10px',
                        paddingBottom: '4px',
                        borderBottom: '1px solid #E2E8F0'
                      }}>
                        Semua Sektor
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-dark)', marginBottom: '4px' }}>
                        Tampilkan Semua Kamera
                      </div>
                      <p style={{ color: 'var(--outline)', fontSize: '11px', margin: 0, lineHeight: '1.4' }}>
                        Menampilkan seluruh kamera CCTV aktif dari semua wilayah operasional.
                      </p>
                    </div>
                    <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--brand-primary)', background: 'rgba(30, 73, 226, 0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                        {allCctvIds.length} Kamera
                      </span>
                    </div>
                  </div>
                );
              })()}

              {sites.map(s => {
                const cctvs = s.details.filter(d => d.type === 'cctv');
                if (cctvs.length === 0) return null;

                // A sector is active/selected if its cameras are the currently selected cameras
                const isSelected = cctvs.length > 0 && cctvs.every(cam => selectedCctvIds.includes(cam.id)) && selectedCctvIds.length === cctvs.length;

                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setSelectedCctvIds(cctvs.map(cam => cam.id));
                      setPage(0);
                    }}
                    style={{
                      background: isSelected ? 'rgba(30, 73, 226, 0.04)' : '#F8FAFC',
                      padding: '16px',
                      borderRadius: '8px',
                      border: isSelected ? '2px solid var(--brand-primary)' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isSelected ? '0 2px 8px rgba(30,73,226,0.1)' : 'none',
                      flex: '0 0 240px'
                    }}
                  >
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      color: isSelected ? 'var(--brand-primary)' : 'var(--outline)',
                      textTransform: 'uppercase',
                      marginBottom: '10px',
                      paddingBottom: '4px',
                      borderBottom: '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>{s.name}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {cctvs.map(cam => {
                        return (
                          <div key={cam.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--on-surface-variant)', padding: '2px 0' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: cam.status === 'ONLINE' ? '#10B981' : '#EF4444', flexShrink: 0 }} />
                            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{cam.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>

    {/* Fullscreen CCTV Overlay */}
    {fullscreenCctv && (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#040d1a',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Close button */}
        <button
          onClick={() => setFullscreenCctv(null)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10000,
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
            outline: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <X size={24} />
        </button>

        {/* Fullscreen Video/Image container */}
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(() => {
            const imgs = [cctvImg1, cctvImg2, cctvImg3, cctvImg4];
            return (
              <img
                src={imgs[fullscreenCctv.idx % imgs.length]}
                alt={fullscreenCctv.cam.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  maxHeight: '100vh'
                }}
              />
            );
          })()}

          {/* Info Overlay top */}
          <div style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '12px', alignItems: 'center', zIndex: 10000 }}>
            <span style={{ background: 'rgba(7,21,44,0.85)', color: 'white', fontSize: '14px', fontWeight: 'bold', padding: '6px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.15)' }}>
              MONITOR {fullscreenCctv.idx + 1} // {fullscreenCctv.cam.name}
            </span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', animation: 'ping-dot 1s infinite' }} />
              <span style={{ color: '#EF4444', fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}>LIVE / REC</span>
            </div>
          </div>

          {/* Info Overlay bottom */}
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10000 }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
              FPS: 30 // RESOLUTION: 1080P HD // BITRATE: 4.2 Mbps
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: 'bold', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
              SEKTOR: {fullscreenCctv.sectorName}
            </span>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
