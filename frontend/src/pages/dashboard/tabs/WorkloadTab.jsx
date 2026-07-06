import {
  Activity, Camera, Cpu, Settings, ShieldCheck
} from 'lucide-react';

export default function WorkloadTab({
  sites,
  workloadGroups,
  workloadSelectedSiteId,
  setWorkloadSelectedSiteId,
  sectorGroupAssignments,
  handleAssignSectorGroup,
  getCctvSectorGroup,
  setShowPolicyModal
}) {
  return (
  <section style={{ marginTop: '32px' }}>
    <div className="container animate-tab-fade">

      {/* Header info */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #E3E6EE',
        marginBottom: '28px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '18px', color: 'var(--brand-dark)', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="var(--brand-primary)" /> Konfigurasi Workload Agen AI CCTV & Sektor
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--outline)' }}>
            Pilih policy group untuk menentukan daftar aturan AI aktif pada setiap kamera, atau buat policy group baru.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowPolicyModal(true)}
            style={{
              background: 'var(--brand-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(13,71,161,0.2)',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <Settings size={15} /> Kelola Policy Group
          </button>
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #DCFCE7',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', animation: 'mapPulse 1.5s infinite' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803D' }}>AI Agent Status: AKTIF</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }} className="db-layout-grid">

        {/* Left Column: List of Sectors */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #E3E6EE',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          alignSelf: 'start'
        }}>
          <h4 style={{ fontSize: '14px', color: 'var(--brand-dark)', fontWeight: 700, margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Sektor Pertambangan
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sites.map(s => {
              const isSelected = workloadSelectedSiteId === s.id;
              const cctvs = s.details.filter(d => d.type === 'cctv');

              // Count how many custom workloads are active in this sector
              let activeCustomRules = 0;
              const sectorGroupId = sectorGroupAssignments[s.id] || 'group-danger';
              const group = workloadGroups.find(g => g.id === sectorGroupId);
              if (group) {
                activeCustomRules = group.skills.length;
              }

              return (
                <div
                  key={s.id}
                  onClick={() => setWorkloadSelectedSiteId(s.id)}
                  style={{
                    background: isSelected ? 'rgba(13,71,161,0.04)' : '#FAFBFD',
                    border: `1.5px solid ${isSelected ? 'var(--brand-primary)' : '#E3E6EE'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', justify: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: 'var(--brand-dark)', fontSize: '13.5px' }}>{s.name}</span>
                    <span style={{
                      fontSize: '9px', fontWeight: 700,
                      color: s.status === 'ONLINE' ? '#10b981' : '#ff4d4d',
                      background: s.status === 'ONLINE' ? 'rgba(16,185,129,0.08)' : 'rgba(255,77,77,0.08)',
                      padding: '2px 8px', borderRadius: '4px'
                    }}>
                      ● {s.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--outline)' }}>
                      {cctvs.length} CCTV Terpasang
                    </span>
                    {activeCustomRules > 0 ? (
                      <span style={{ fontSize: '10px', fontWeight: 600, background: '#FFF3E0', color: '#E65100', padding: '2px 6px', borderRadius: '4px' }}>
                        {activeCustomRules} Rule AI Aktif
                      </span>
                    ) : (
                      <span style={{ fontSize: '10px', color: 'var(--outline)', background: '#F0EDED', padding: '2px 6px', borderRadius: '4px' }}>
                        0 Rule AI
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: CCTV Workload Configuration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {(() => {
            const selectedSiteObj = sites.find(s => s.id === workloadSelectedSiteId) || sites[0];
            if (!selectedSiteObj) return null;

            const cctvs = selectedSiteObj.details.filter(d => d.type === 'cctv');

            return (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid #E3E6EE',
                boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
              }}>
                <div style={{ borderBottom: '1px solid #E3E6EE', paddingBottom: '14px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontSize: '16px', fontWeight: 700 }}>
                      Daftar Kamera Sektor: {selectedSiteObj.name}
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--outline)' }}>
                      Aturan deteksi AI yang aktif di bawah ini diwariskan dari Group Policy sektor.
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, background: '#F4F6FA', color: 'var(--brand-dark)', padding: '4px 10px', borderRadius: '6px' }}>
                    Total: {cctvs.length} CCTV
                  </span>
                </div>

                {/* Sector Group Assignment Header */}
                <div style={{
                  background: '#FAFBFD',
                  border: '1.5px solid #E3E6EE',
                  borderRadius: '12px',
                  padding: '20px 24px',
                  marginBottom: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        SECTOR GROUP POLICY TEMPLATE
                      </span>
                      <h4 style={{ margin: '2px 0 0', color: 'var(--brand-dark)', fontWeight: 700, fontSize: '14px' }}>
                        Pilih Group Policy untuk Sektor {selectedSiteObj.name}
                      </h4>
                    </div>

                    {/* Sector Policy Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <select
                        value={sectorGroupAssignments[selectedSiteObj.id] || 'group-danger'}
                        onChange={(e) => handleAssignSectorGroup(selectedSiteObj.id, e.target.value)}
                        style={{
                          padding: '8px 16px',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: 'var(--brand-dark)',
                          border: '1.5px solid #C3C6D4',
                          borderRadius: '8px',
                          background: 'white',
                          outline: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        {workloadGroups.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.skills.length} Rule)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Sector Rules Preview */}
                  {(() => {
                    const assignedGroupId = sectorGroupAssignments[selectedSiteObj.id] || 'group-danger';
                    const groupObj = workloadGroups.find(g => g.id === assignedGroupId);
                    if (!groupObj) return null;

                    return (
                      <div style={{ borderTop: '1px solid #E3E6EE', paddingTop: '12px' }}>
                        <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--outline)', fontWeight: 600 }}>
                          Seluruh CCTV di sektor ini otomatis mewarisi rule berikut dari <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>{groupObj.name}</span>:
                        </p>
                        {groupObj.skills.length === 0 ? (
                          <span style={{ fontSize: '12.5px', color: 'var(--outline)', fontStyle: 'italic' }}>Grup ini belum memiliki rule AI.</span>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {groupObj.skills.map(skill => (
                              <span
                                key={skill.id}
                                style={{
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  background: 'white',
                                  color: 'var(--brand-dark)',
                                  border: '1px solid #E3E6EE',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                title={skill.guidelines}
                              >
                                <span style={{ color: '#4F46E5', fontWeight: 800 }}>{skill.code}</span>
                                <span>({skill.description})</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {cctvs.map(cam => {
                    const isOffline = cam.status === 'OFFLINE';
                    const group = getCctvSectorGroup(cam.id);

                    return (
                      <div key={cam.id} style={{
                        background: '#FAFBFD',
                        border: '1px solid #E3E6EE',
                        borderRadius: '12px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        opacity: isOffline ? 0.75 : 1,
                        transition: 'all 0.2s'
                      }}>
                        {/* CCTV info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed #E3E6EE', paddingBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              background: isOffline ? 'rgba(255,77,77,0.08)' : 'rgba(13,71,161,0.06)',
                              color: isOffline ? '#ff4d4d' : 'var(--brand-primary)',
                              width: '36px', height: '36px', borderRadius: '8px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              <Camera size={18} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-dark)' }}>
                                  {cam.name}
                                </span>
                                {group && (
                                  <span style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(79,70,229,0.08)', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px' }}>
                                    {group.name}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '11px', color: 'var(--outline)', display: 'block', marginTop: '2px' }}>
                                {cam.feedDescription}
                              </span>
                            </div>
                          </div>
                          <span style={{
                            fontSize: '9px', fontWeight: 700,
                            color: isOffline ? '#ff4d4d' : '#10b981',
                            background: isOffline ? 'rgba(255,77,77,0.08)' : 'rgba(16,185,129,0.08)',
                            padding: '3px 8px', borderRadius: '4px'
                          }}>
                            {cam.status}
                          </span>
                        </div>

                        {/* Workload Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="db-layout-grid">

                          {/* Standard/Wajib Column */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Standard Workload (Selalu Aktif)
                            </span>

                            {/* APD check */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '12px 16px', background: 'white', border: '1.5px solid #DCFCE7',
                              borderRadius: '8px', opacity: 0.9
                            }}>
                              <ShieldCheck size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                              <div>
                                <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--brand-dark)', display: 'block' }}>
                                  Deteksi Kepatuhan APD (K3)
                                </span>
                                <span style={{ fontSize: '10.5px', color: '#15803D' }}>
                                  Verifikasi otomatis rompi & helm safety.
                                </span>
                              </div>
                            </div>

                            {/* Keselamatan Manusia */}
                            <div style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '12px 16px', background: 'white', border: '1.5px solid #DCFCE7',
                              borderRadius: '8px', opacity: 0.9
                            }}>
                              <Activity size={18} color="#16A34A" style={{ flexShrink: 0 }} />
                              <div>
                                <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--brand-dark)', display: 'block' }}>
                                  Deteksi Keselamatan Manusia
                                </span>
                                <span style={{ fontSize: '10.5px', color: '#15803D' }}>
                                  Perlindungan kru di dekat peralatan berat.
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Group Workload Column */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Group Workload ({group ? group.name : 'No Group'})
                            </span>

                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                              maxHeight: '150px',
                              overflowY: 'auto',
                              paddingRight: '6px'
                            }}>
                              {!group || group.skills.length === 0 ? (
                                <div style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  padding: '24px 16px', background: '#F4F6FA', border: '1.5px dashed #E3E6EE',
                                  borderRadius: '8px', height: '100%'
                                }}>
                                  <span style={{ fontSize: '12px', color: 'var(--outline)', fontStyle: 'italic' }}>
                                    Grup ini belum memiliki rule AI.
                                  </span>
                                </div>
                              ) : (
                                group.skills.map(skill => {
                                  let activeBorder = '1.5px solid #E3E6EE';
                                  let iconColor = 'var(--brand-primary)';

                                  if (skill.code === 'no_human_zone') {
                                    activeBorder = '1.5px solid #FCA5A5';
                                    iconColor = '#EF4444';
                                  } else if (skill.code === 'no_truck_stop') {
                                    activeBorder = '1.5px solid #FDE047';
                                    iconColor = '#F57F17';
                                  }

                                  return (
                                    <div
                                      key={skill.id}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        padding: '12px 16px', background: 'white', border: activeBorder,
                                        borderRadius: '8px', opacity: 0.9
                                      }}
                                    >
                                      <Settings size={18} color={iconColor} style={{ flexShrink: 0 }} />
                                      <div>
                                        <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--brand-dark)', display: 'block' }}>
                                          {skill.description}
                                        </span>
                                        {skill.guidelines && (
                                          <span style={{ fontSize: '10.5px', color: 'var(--outline)', display: 'block', marginTop: '2px' }}>
                                            {skill.guidelines}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>

      </div>

    </div>
  </section>
  );
}
