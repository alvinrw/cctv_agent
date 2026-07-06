import {
  Activity, AlertTriangle, Camera, CheckCircle, Play, ShieldAlert, ShieldCheck, WifiOff
} from 'lucide-react';

export default function OverviewTab({
  sites,
  overviewFilterMode,
  setOverviewFilterMode,
  overviewSelectedSiteId,
  setOverviewSelectedSiteId,
  totalCCTV,
  totalCCTVOnline,
  totalCCTVOffline,
  triggerKPIFilter,
  allIncidents,
  setSelectedSite,
  setActiveSubTab,
  setActiveCctv,
  handlePlayClip
}) {
  return (
  <section style={{ marginTop: '32px' }}>
    <div className="container animate-tab-fade">



      {/* KPI METRICS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Total CCTV */}
        <div
          onClick={() => triggerKPIFilter('ALL')}
          style={{
            background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #E3E6EE', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          className="hover-pop"
        >
          <div style={{ background: 'rgba(13,71,161,0.08)', color: 'var(--brand-primary)', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Camera size={24} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Semua CCTV</p>
            <h3 style={{ fontSize: '26px', color: 'var(--brand-dark)', fontWeight: 700, margin: '4px 0 0', lineHeight: 1 }}>{totalCCTV} <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 500 }}>({totalCCTVOnline} Online)</span></h3>
          </div>
        </div>

        {/* Offline CCTV */}
        <div
          onClick={() => triggerKPIFilter('CCTV_OFFLINE')}
          style={{
            background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: totalCCTVOffline > 0 ? '1px solid #ff4d4d' : '1px solid #E3E6EE', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
          className="hover-pop"
        >
          <div style={{ background: totalCCTVOffline > 0 ? 'rgba(255,77,77,0.08)' : 'rgba(0,0,0,0.04)', color: totalCCTVOffline > 0 ? '#ff4d4d' : 'var(--outline)', padding: '8px', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <WifiOff size={24} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CCTV Offline</p>
            <h3 style={{ fontSize: '26px', color: totalCCTVOffline > 0 ? '#ff4d4d' : 'var(--brand-dark)', fontWeight: 700, margin: '4px 0 0', lineHeight: 1 }}>{totalCCTVOffline}</h3>
          </div>
        </div>

        {/* Status AI Agent */}
        <div
          style={{
            background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            border: '1px solid #E3E6EE', display: 'flex', alignItems: 'center', gap: '16px',
            transition: 'transform 0.2s'
          }}
          className="hover-pop"
        >
          <div style={{ background: 'rgba(16,185,129,0.08)', color: '#10b981', width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status AI Agent</p>
            <h3 style={{ fontSize: '24px', color: '#10b981', fontWeight: 700, margin: '4px 0 0', lineHeight: 1 }}>AKTIF</h3>
          </div>
        </div>
      </div>


      {/* NOTIFIKASI & BROADCAST TELEGRAM */}
      <div style={{
        background: 'white', border: '1px solid #E3E6EE', borderRadius: '16px',
        padding: '24px', marginBottom: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #F0EDED', paddingBottom: '10px' }}>
          <h3 style={{ fontSize: '15px', color: 'var(--brand-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <AlertTriangle size={18} color="#f59e0b" />
            Notifikasi Kejadian & Broadcast
          </h3>
          <span style={{ fontSize: '11px', color: 'var(--outline)', background: '#F4F6FA', padding: '4px 10px', borderRadius: '4px', fontWeight: 600 }}>
            Terhubung ke Bot @PamAgents_AlertBot
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Notification Item 1 */}
          <div style={{ display: 'flex', gap: '14px', padding: '14px', background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={16} color="#d97706" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#92400e' }}>Pelanggaran APD Terdeteksi</span>
                <span style={{ fontSize: '10px', color: '#b45309', background: 'rgba(217,119,6,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>13:14:02</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#78350f', lineHeight: 1.4 }}>
                CCTV Haul Road Incline A mendeteksi pekerja tanpa helm safety di zona loading. Notifikasi dikirim ke Grup Telegram <strong>K3 Pit A</strong>.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#0088cc', padding: '2px 8px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Terkirim via Telegram</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#b45309', background: 'rgba(217,119,6,0.08)', padding: '2px 8px', borderRadius: '3px' }}>Sektor: Pit A</span>
              </div>
            </div>
          </div>

          {/* Notification Item 2 */}
          <div style={{ display: 'flex', gap: '14px', padding: '14px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldAlert size={16} color="#dc2626" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#991b1b' }}>Truk Overspeed di Haul Road</span>
                <span style={{ fontSize: '10px', color: '#dc2626', background: 'rgba(220,38,38,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>12:50:33</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#7f1d1d', lineHeight: 1.4 }}>
                Truk HD785 terdeteksi melaju di atas batas 30 km/jam pada jalur incline. Alert <strong>CRITICAL</strong> dikirim ke Grup Telegram <strong>Dispatcher & Safety Officer</strong>.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#0088cc', padding: '2px 8px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Terkirim via Telegram</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#dc2626', background: 'rgba(220,38,38,0.06)', padding: '2px 8px', borderRadius: '3px' }}>Prioritas: CRITICAL</span>
              </div>
            </div>
          </div>

          {/* Notification Item 3 */}
          <div style={{ display: 'flex', gap: '14px', padding: '14px', background: '#F0F9FF', border: '1px solid #E0F2FE', borderRadius: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={16} color="#2563eb" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#1e40af' }}>Dust Suppression Auto-Trigger</span>
                <span style={{ fontSize: '10px', color: '#2563eb', background: 'rgba(37,99,235,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>13:01:10</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#1e3a5f', lineHeight: 1.4 }}>
                Sistem penyiram debu otomatis aktif di Stockpile Utara. Kepekatan debu melampaui ambang batas 80%. Notifikasi dikirim ke <strong>Tim Lingkungan</strong>.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#0088cc', padding: '2px 8px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Terkirim via Telegram</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#2563eb', background: 'rgba(37,99,235,0.06)', padding: '2px 8px', borderRadius: '3px' }}>Sektor: Stockpile Utara</span>
              </div>
            </div>
          </div>

          {/* Notification Item 4 */}
          <div style={{ display: 'flex', gap: '14px', padding: '14px', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle size={16} color="#16a34a" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, fontSize: '13px', color: '#14532d' }}>Kamera Crusher Hopper Kembali Online</span>
                <span style={{ fontSize: '10px', color: '#16a34a', background: 'rgba(22,163,106,0.1)', padding: '2px 8px', borderRadius: '3px', fontWeight: 600 }}>10:22:15</span>
              </div>
              <p style={{ margin: 0, fontSize: '11.5px', color: '#15803d', lineHeight: 1.4 }}>
                CCTV Crusher Hopper berhasil terkoneksi kembali setelah gangguan jaringan 12 menit. Notifikasi recovery dikirim ke <strong>Admin IT</strong>.
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '9px', fontWeight: 700, color: 'white', background: '#0088cc', padding: '2px 8px', borderRadius: '3px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>Terkirim via Telegram</span>
                <span style={{ fontSize: '9px', fontWeight: 600, color: '#16a34a', background: 'rgba(22,163,106,0.06)', padding: '2px 8px', borderRadius: '3px' }}>Status: Recovery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 Columns: System Status & Activity Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="db-layout-grid">

        {/* Left Column: ALL SECTOR STATUS WITH CCTV */}
        <div style={{ background: 'white', border: '1px solid #E3E6EE', borderRadius: '16px', padding: '28px', boxShadow: '0 4px 16px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>

          {/* Header Row with Title and Selector Tabs */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F0EDED', paddingBottom: '12px', flexWrap: 'wrap', gap: '12px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Activity size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '15px', color: 'var(--brand-dark)', fontWeight: 700, margin: 0 }}>
                Status Sektor (CCTV)
              </h3>
            </div>

            {/* Selector Mode (Gabungan vs Per Sektor) */}
            <div style={{ display: 'flex', background: '#F4F6FA', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setOverviewFilterMode('all')}
                style={{
                  padding: '6px 12px', border: 'none', borderRadius: '4px',
                  background: overviewFilterMode === 'all' ? 'white' : 'transparent',
                  color: overviewFilterMode === 'all' ? 'var(--brand-dark)' : 'var(--outline)',
                  fontWeight: 600, fontSize: '11px', cursor: 'pointer',
                  boxShadow: overviewFilterMode === 'all' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Gabungan Semua
              </button>
              <button
                onClick={() => setOverviewFilterMode('single')}
                style={{
                  padding: '6px 12px', border: 'none', borderRadius: '4px',
                  background: overviewFilterMode === 'single' ? 'white' : 'transparent',
                  color: overviewFilterMode === 'single' ? 'var(--brand-dark)' : 'var(--outline)',
                  fontWeight: 600, fontSize: '11px', cursor: 'pointer',
                  boxShadow: overviewFilterMode === 'single' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Per Sektor
              </button>
            </div>
          </div>

          {/* Dropdown Selector if Per Sektor mode is active */}
          {overviewFilterMode === 'single' && (
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--brand-dark)' }}>Pilih Sektor Tambang:</span>
              <select
                value={overviewSelectedSiteId}
                onChange={e => setOverviewSelectedSiteId(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #C3C6D4', borderRadius: '6px', fontSize: '12px', background: 'white' }}
              >
                {sites.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Scrollable nodes list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '440px', overflowY: 'auto', paddingRight: '4px' }}>
            {sites
              .filter(site => overviewFilterMode === 'all' || site.id === overviewSelectedSiteId)
              .map(site => {
                const siteCctvs = site.details.filter(d => d.type === 'cctv');

                return (
                  <div key={site.id} style={{
                    background: '#FAFBFD', border: '1px solid #E3E6EE', borderRadius: '12px', padding: '16px'
                  }}>
                    {/* Sector Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #E3E6EE', paddingBottom: '8px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--brand-dark)', fontSize: '13.5px' }}>{site.name}</span>
                    </div>

                    {/* List of CCTVs inside this site */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {/* CCTVs */}
                      {siteCctvs.map(cam => {
                        const isCamOffline = cam.status === 'OFFLINE';
                        const displayCamName = cam.name.replace(/\s*\((online|offline)\)\s*$/i, '');
                        const latestClip = cam.clippings && cam.clippings[0];
                        const reportText = isCamOffline
                          ? 'Kamera terputus. Menunggu pemeriksaan tim teknisi.'
                          : latestClip
                            ? `[REPLAY] ${latestClip.title}: ${latestClip.description}`
                            : `Normal: ${cam.feedDescription}`;

                        return (
                          <div key={cam.id} style={{
                            background: 'white', border: '1.5px solid #F0EDED', borderRadius: '8px', padding: '10px 12px',
                            display: 'flex', alignItems: 'flex-start', gap: '12px'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Camera size={14} color={isCamOffline ? '#ff4d4d' : 'var(--brand-primary)'} />
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
                                  <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--brand-dark)' }}>{displayCamName}</span>
                                  <span
                                    aria-label={isCamOffline ? 'CCTV offline' : 'CCTV online'}
                                    title={isCamOffline ? 'Offline' : 'Online'}
                                    style={{
                                      width: '7px',
                                      height: '7px',
                                      borderRadius: '50%',
                                      background: isCamOffline ? '#ff4d4d' : '#10b981',
                                      boxShadow: `0 0 0 3px ${isCamOffline ? 'rgba(255,77,77,0.12)' : 'rgba(16,185,129,0.12)'}`,
                                      flexShrink: 0
                                    }}
                                  />
                                </div>
                                <span style={{ fontSize: '11px', color: latestClip ? '#F57F17' : 'var(--outline)' }}>{reportText}</span>

                                {/* Workload Badges */}
                                {/* {!isCamOffline && (
                                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '8.5px', fontWeight: 700, background: '#E0F2FE', color: '#0369a1', padding: '1px 5px', borderRadius: '3px' }}>
                                      APD
                                    </span>
                                    <span style={{ fontSize: '8.5px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '1px 5px', borderRadius: '3px' }}>
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
                                            <span style={{ fontSize: '8.5px', fontWeight: 700, background: '#FEE2E2', color: '#B91C1C', padding: '1px 5px', borderRadius: '3px' }}>
                                              Zona Bahaya
                                            </span>
                                          )}
                                          {hasTruck && (
                                            <span style={{ fontSize: '8.5px', fontWeight: 700, background: '#FEF9C3', color: '#854D0E', padding: '1px 5px', borderRadius: '3px' }}>
                                              No-Stay Truk
                                            </span>
                                          )}
                                          {otherSkills.map(sk => (
                                            <span key={sk.id} style={{ fontSize: '8.5px', fontWeight: 700, background: '#EEF2F6', color: '#4F46E5', padding: '1px 5px', borderRadius: '3px', border: '1px solid rgba(79,70,229,0.15)' }}>
                                              {sk.code}
                                            </span>
                                          ))}
                                        </>
                                      );
                                    })()}
                                  </div>
                                )} */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Column: CENTRAL INCIDENTS LOGS WITH REDIRECT & AUTOPLAY PLAYBACK */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Global Clippings History Card */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '24px',
            border: '1px solid #E3E6EE', boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #F0EDED', paddingBottom: '12px' }}>
              <Activity size={18} color="var(--brand-primary)" />
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--brand-dark)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Riwayat Insiden & Kejadian Global (CCTV)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '2px' }}>
              {allIncidents.length > 0 ? (
                allIncidents.slice(0, 10).map((incident, idx) => (
                  <div
                    key={incident.id || idx}
                    style={{
                      background: '#FAFBFD', border: '1.5px solid #F0EDED',
                      borderRadius: '8px', padding: '12px 14px',
                      display: 'flex', justify: 'space-between', alignItems: 'center', gap: '16px',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#C3C6D4'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = '#F0EDED'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span style={{
                          background: incident.type === 'danger' ? 'rgba(255,77,77,0.1)' : 'rgba(255,193,7,0.1)',
                          color: incident.type === 'danger' ? '#ff4d4d' : '#F57F17',
                          fontSize: '9px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px'
                        }}>
                          {incident.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--outline)', fontFamily: 'monospace' }}>[{incident.time}]</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', margin: 0 }}>
                        {incident.description}
                      </p>
                      <span style={{ fontSize: '9.5px', color: 'var(--outline)', display: 'block', marginTop: '2px' }}>
                        Sektor: {incident.sectorName} ({incident.cameraObj?.name || incident.camera})
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSite(sites.find(s => s.id === incident.sectorId));
                        setActiveCctv(incident.cameraObj);
                        setActiveSubTab('map');
                        handlePlayClip(incident);
                      }}
                      style={{
                        background: 'var(--brand-primary)',
                        color: 'white',
                        border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s ease',
                        boxShadow: '0 2px 6px rgba(13,71,161,0.2)'
                      }}
                      title="Putar Rekaman Video di Peta"
                    >
                      <Play size={14} style={{ marginLeft: '2px' }} />
                    </button>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', border: '1px dashed #C3C6D4', borderRadius: '8px', color: 'var(--outline)', fontSize: '11px' }}>
                  Tidak ada rekaman klip insiden yang terdeteksi hari ini.
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
