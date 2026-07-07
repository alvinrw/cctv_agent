import {
  Activity, Camera, Play, RotateCcw, WifiOff
} from 'lucide-react';
import VideoPlayer from '../../../components/VideoPlayer';

export default function MapMonitoringTab({
  filteredSites,
  selectedSite,
  setSelectedSite,
  filterKPI,
  setFilterKPI,
  sectorCctvs,
  activeCctv,
  setActiveCctv,
  isPlayingClip,
  setIsPlayingClip,
  selectedClip,
  setSelectedClip,
  clipProgress,
  setClipProgress,
  getCctvSectorGroup,
  cctvAttributeBadgeStyle,
  handlePlayClip,
  lang = 'id'
}) {
  return (
  <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
    <div className="animate-tab-fade">

      {/* Filter tags status */}
      {filterKPI !== 'ALL' && (
        <div style={{ background: '#ff5f5615', border: '1px solid #ff4d4d35', borderRadius: '8px', padding: '12px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#ff4d4d', fontSize: '13px', fontWeight: 600 }}>
            Menampilkan filter lokasi yang memiliki perangkat CCTV offline saja.
          </span>
          <button
            onClick={() => setFilterKPI('ALL')}
            style={{ background: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
          >
            Reset Filter
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.3fr', gap: '32px' }} className="db-layout-grid">

        {/* LEFT: SATELLITE MAP */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E3E6EE', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontWeight: 700 }}>Peta Satelit Sektor Pertambangan</h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--outline)' }}>Pilih pin sektor tambang pada peta atau tombol di bawah untuk detail pemantauan CCTV.</p>
          </div>

          {/* Clickable Sectors List (Chips) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {filteredSites.map(s => {
              const isSelected = selectedSite.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSite(s)}
                  style={{
                    background: isSelected ? 'var(--brand-primary)' : '#FAFBFD',
                    color: isSelected ? 'white' : 'var(--brand-dark)',
                    border: `1.5px solid ${isSelected ? 'var(--brand-primary)' : '#E3E6EE'}`,
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 2px 6px rgba(13,71,161,0.15)' : 'none',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: s.status === 'ALERT' ? '#ff4d4d' : '#10b981',
                    display: 'inline-block'
                  }} />
                  {s.name}
                </button>
              );
            })}
          </div>

          {/* Satellite Map Viewbox */}
          <div style={{
            position: 'relative',
            backgroundImage: 'url("/mine_site_satellite.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '12px',
            height: '520px',
            overflow: 'hidden',
            border: '2px solid rgba(13,71,161,0.2)',
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7)'
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px', pointerEvents: 'none'
            }} />

            {/* Active SVG lines connecting to office HQ */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              {filteredSites.map(s => {
                if (s.id === 'workshop-main') return null;
                return (
                  <line
                    key={s.id}
                    x1="45%" y1="55%"
                    x2={s.x} y2={s.y}
                    stroke={s.status === 'ALERT' ? 'rgba(255,77,77,0.5)' : 'rgba(255,193,7,0.5)'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </svg>

            {/* Pins */}
            {filteredSites.map(s => {
              const isSelected = selectedSite.id === s.id;
              const isAlert = s.status === 'ALERT';
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSite(s)}
                  style={{
                    position: 'absolute', left: s.x, top: s.y,
                    transform: 'translate(-50%, -50%)', background: 'none',
                    border: 'none', cursor: 'pointer', padding: 0,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    zIndex: isSelected ? 10 : 2
                  }}
                >
                  <div style={{
                    position: 'relative', width: '28px', height: '28px',
                    display: 'flex', alignItems: 'center', justify: 'center'
                  }}>
                    <div style={{
                      position: 'absolute', width: '100%', height: '100%',
                      borderRadius: '50%', background: isAlert ? '#ff4d4d' : '#FFC107',
                      animation: 'mapPulse 1.8s infinite', opacity: 0.45
                    }} />
                    <div style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: isAlert ? '#ff4d4d' : '#FFC107',
                      border: isSelected ? '2.5px solid white' : '1px solid rgba(0,0,0,0.5)',
                      boxShadow: '0 0 10px rgba(0,0,0,0.6)'
                    }} />
                  </div>
                  <span style={{
                    marginTop: '4px', background: isSelected ? 'var(--brand-primary)' : 'rgba(11,29,58,0.9)',
                    color: 'white', fontSize: '9px', fontWeight: 700, padding: '3px 8px',
                    borderRadius: '4px', whiteSpace: 'nowrap', border: isSelected ? '1px solid #FFC107' : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    backdropFilter: isSelected ? 'none' : 'blur(4px)'
                  }}>
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: SURVEILLANCE LIVE STREAM & HISTORY CLIPPINGS */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E3E6EE', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>

          {/* Site Header */}
          <div style={{ borderBottom: '1px solid #E3E6EE', paddingBottom: '14px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontSize: '18px', fontWeight: 700 }}>{selectedSite.name}</h3>
            </div>
          </div>

          {/* CCTV Live Video Stream Player (Simulasi) */}
          <div style={{ background: '#071224', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(13,71,161,0.2)', marginBottom: '20px' }}>

            {/* Player header */}
            <div style={{ background: 'rgba(11,29,58,0.95)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <span style={{ color: 'white', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}>
                {isPlayingClip ? (lang === 'id' ? 'MODE PUTAR ULANG REKAMAN' : 'REC PLAYBACK MODE') : (lang === 'id' ? 'SIARAN LIVE CCTV' : 'LIVE CCTV FEED')}
              </span>
              <span style={{ color: isPlayingClip ? '#ff4d4d' : '#FFC107', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                {activeCctv ? activeCctv.name : (lang === 'id' ? 'TIDAK ADA KAMERA DIPILIH' : 'NO CAMERA SELECTED')}
              </span>
            </div>

            {/* Player Screen */}
            <div style={{ height: '200px', background: '#02060f', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
              {/* Error / Offline State */}
              {activeCctv && activeCctv.status === 'OFFLINE' ? (
                <div style={{ textAlign: 'center', zIndex: 5, color: '#ff4d4d', padding: '20px' }}>
                  <WifiOff size={40} style={{ marginBottom: '10px', opacity: 0.8 }} />
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>{lang === 'id' ? 'CCTV TERPUTUS' : 'CCTV DISCONNECTED'}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{lang === 'id' ? 'Sinyal terputus atau perangkat offline.' : 'Signal timeout or hardware offline.'}</p>
                </div>
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
                  {/* Video Player with Overlays */}
                  <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
                    <VideoPlayer
                      isPlaying={isPlayingClip}
                      onProgress={setClipProgress}
                      clip={selectedClip}
                      isLive={!isPlayingClip}
                    />

                    {/* Status Overlay Badge */}
                    {/* <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: isPlayingClip ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
                      border: isPlayingClip ? '1.5px solid #ef4444' : '1.5px solid #10b981'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'white',
                        animation: 'mapPulse 1s infinite',
                        display: 'inline-block'
                      }} />
                      {isPlayingClip ? 'REPLAY (REKAMAN KEJADIAN)' : 'LIVE STREAM'}
                    </div> */}

                    {/* Technical Parameters */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '8px',
                      fontFamily: 'monospace',
                      lineHeight: 1.4,
                      textAlign: 'right',
                      background: 'rgba(0, 0, 0, 0.4)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      CAM_ID: {activeCctv ? activeCctv.id.toUpperCase() : 'UNKNOWN'}<br />
                      FPS: 30.0 | RES: 1080P<br />
                      CODEC: H.265
                    </div>

                    <div style={{ position: 'absolute', bottom: '10px', left: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '9px', fontWeight: 500 }}>
                      {activeCctv ? activeCctv.feedDescription : ''}
                    </div>

                    {isPlayingClip && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                        <div style={{ width: `${clipProgress}%`, height: '100%', background: '#FFC107', transition: 'width 0.5s linear' }} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DEVICE LIST WITH CLICKABLE CCTV CHANNELS */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', paddingRight: '2px' }}>
              {sectorCctvs.map(cam => {
                const isActive = activeCctv && activeCctv.id === cam.id;
                const isOffline = cam.status === 'OFFLINE';
                const displayCamName = cam.name.replace(/\s*\((online|offline)\)\s*$/i, '');
                return (
                  <div
                    key={cam.id}
                    onClick={() => { setActiveCctv(cam); setIsPlayingClip(false); setSelectedClip(null); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: isActive ? 'rgba(13,71,161,0.06)' : 'white',
                      border: `1.5px solid ${isActive ? 'var(--brand-primary)' : '#FAFBFD'}`,
                      borderRadius: '8px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'all 0.2s ease',
                    }}
                    className="clickable-cctv-item"
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#C3C6D4'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#FAFBFD'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Camera size={15} color={isActive ? 'var(--brand-primary)' : 'var(--outline)'} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                          <span style={{ color: isActive ? 'var(--brand-dark)' : 'var(--on-surface-variant)', fontWeight: isActive ? 700 : 500 }}>
                            {displayCamName}
                          </span>
                          <span
                            aria-label={isOffline ? 'CCTV offline' : 'CCTV online'}
                            title={isOffline ? 'Offline' : 'Online'}
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: isOffline ? '#ff4d4d' : '#10b981',
                              boxShadow: `0 0 0 3px ${isOffline ? 'rgba(255,77,77,0.12)' : 'rgba(16,185,129,0.12)'}`,
                              flexShrink: 0
                            }}
                          />
                        </div>

                        {/* Workload Badges */}
                        {!isOffline && (
                          <div style={{ display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                            <span style={cctvAttributeBadgeStyle}>
                              APD
                            </span>
                            <span style={cctvAttributeBadgeStyle}>
                              Keselamatan
                            </span>
                            {(() => {
                              const group = getCctvSectorGroup(cam.id);
                              if (!group) return null;

                              const activeSkills = group.skills;
                              const hasHuman = activeSkills.some(sk => sk.code === 'no_human_zone');
                              const hasTruck = activeSkills.some(sk => sk.code === 'no_truck_stop');
                              const otherSkills = activeSkills.filter(sk => sk.code !== 'no_human_zone' && sk.code !== 'no_truck_stop');

                              return (
                                <>
                                  {hasHuman && (
                                    <span style={cctvAttributeBadgeStyle}>
                                      Zona Bahaya
                                    </span>
                                  )}
                                  {hasTruck && (
                                    <span style={cctvAttributeBadgeStyle}>
                                      No-Stay Truk
                                    </span>
                                  )}
                                  {otherSkills.map(sk => (
                                    <span key={sk.id} style={cctvAttributeBadgeStyle}>
                                      {sk.code}
                                    </span>
                                  ))}
                                </>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE CCTV HISTORY CLIPPINGS LIST PANEL */}
          <div style={{ borderTop: '1px solid #F0EDED', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '12.5px', color: 'var(--brand-dark)', fontWeight: 700, margin: '0 0 12px', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} color="var(--brand-primary)" />
              Riwayat Kliping: {activeCctv ? activeCctv.name.replace('CCTV ', '') : 'Tidak Ada'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '180px', overflowY: 'auto', paddingRight: '2px' }}>
              {activeCctv && activeCctv.clippings && activeCctv.clippings.length > 0 ? (
                activeCctv.clippings.map(clip => {
                  const isCurrentClip = selectedClip && selectedClip.id === clip.id;
                  const isOffline = activeCctv.status === 'OFFLINE';
                  return (
                    <div
                      key={clip.id}
                      style={{
                        border: `1px solid ${isCurrentClip ? '#FFC107' : '#E3E6EE'}`,
                        borderRadius: '8px', padding: '12px 14px', background: isCurrentClip ? 'rgba(255,193,7,0.05)' : '#FAFBFD',
                        display: 'flex', justify: 'space-between', alignItems: 'center', gap: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{
                            background: clip.type === 'danger' ? 'rgba(255,77,77,0.1)' : 'rgba(255,193,7,0.1)',
                            color: clip.type === 'danger' ? '#ff4d4d' : '#F57F17',
                            fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px'
                          }}>
                            {clip.title}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--outline)', fontFamily: 'monospace' }}>[{clip.time}]</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: 0 }}>
                          {clip.description}
                        </p>
                        <span style={{ fontSize: '10px', color: 'var(--outline)', display: 'block', marginTop: '4px' }}>
                          Durasi: {clip.duration}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlayClip(clip)}
                        disabled={isOffline || isPlayingClip}
                        style={{
                          background: isCurrentClip ? '#FFC107' : 'var(--brand-primary)',
                          color: isCurrentClip ? 'var(--brand-dark)' : 'white',
                          border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: (isOffline || isPlayingClip) ? 'not-allowed' : 'pointer',
                          flexShrink: 0, transition: 'all 0.2s ease',
                          opacity: (isOffline || isPlayingClip) ? 0.4 : 1
                        }}
                        title="Putar klip rekaman"
                      >
                        {isCurrentClip ? <RotateCcw size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #C3C6D4', borderRadius: '8px', color: 'var(--outline)', fontSize: '11px' }}>
                  Tidak ada rekaman klip insiden untuk kamera ini hari ini.
                </div>
              )}
            </div>
          </div>



        </div>

      </div>
    </div>
  </section>
  );
}
