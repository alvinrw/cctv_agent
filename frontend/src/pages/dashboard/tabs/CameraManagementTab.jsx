import { useState } from 'react';
import { 
  Video, VideoOff, Search, Filter, 
  MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react';

export default function CameraManagementTab({ lang = 'id' }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Initial cameras dataset
  const [cameras] = useState([
    { id: 'CAM-8492', name: 'Main Gate South', zone: 'Loading Area A', location: 'Sector 4, Pillar 12', status: 'Online', health: 98 },
    { id: 'CAM-3310', name: 'Crusher Belt B', zone: 'Processing Plant', location: 'Level 2, Walkway C', status: 'Offline', health: 0 },
    { id: 'CAM-9921', name: 'Perimeter West', zone: 'Loading Area B', location: 'Fence line, Post 88', status: 'Degraded', health: 65 },
    { id: 'CAM-1044', name: 'Silo 3 Top', zone: 'Processing Plant', location: 'Silo Array Alpha', status: 'Online', health: 100 },
    { id: 'CAM-2219', name: 'Raw Material Store', zone: 'Processing Plant', location: 'Area 2 Shed', status: 'Online', health: 95 },
    { id: 'CAM-4482', name: 'Warehouse Entry', zone: 'Loading Area A', location: 'Gate 2 Entrance', status: 'Online', health: 92 },
    { id: 'CAM-7711', name: 'Conveyor Section A', zone: 'Processing Plant', location: 'Level 1 Overpass', status: 'Offline', health: 0 },
    { id: 'CAM-5541', name: 'Explosives Storage', zone: 'Loading Area B', location: 'Post 14 Bunker', status: 'Online', health: 97 }
  ]);

  // Filtering Logic
  const filteredCameras = cameras.filter(cam => {
    const matchesSearch = cam.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cam.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = selectedZone === '' || cam.zone === selectedZone;
    const matchesStatus = selectedStatus === '' || cam.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesZone && matchesStatus;
  });

  return (
    <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
      <div className="animate-tab-fade">
        {/* Header Block */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>{lang === 'id' ? 'Manajemen Kamera' : 'Camera Management'}</h2>
            <p style={{ fontSize: '14px', color: 'var(--outline)', margin: '4px 0 0' }}>{lang === 'id' ? 'Pantau dan pelihara infrastruktur pengawasan video perusahaan.' : 'Monitor and maintain enterprise surveillance infrastructure.'}</p>
          </div>

          {/* Filters Area */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--outline)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder={lang === 'id' ? 'Cari kamera...' : 'Search cameras...'}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  padding: '9px 12px 9px 36px',
                  border: '1px solid #E3E6EE',
                  borderRadius: '10px',
                  fontSize: '13px',
                  width: '220px',
                  background: 'white',
                  color: 'var(--brand-dark)',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              />
            </div>

            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              style={{
                padding: '9px 12px',
                border: '1px solid #E3E6EE',
                borderRadius: '10px',
                fontSize: '13px',
                background: 'white',
                color: 'var(--brand-dark)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">{lang === 'id' ? 'Semua Zona' : 'All Zones'}</option>
              <option value="Loading Area A">Loading Area A</option>
              <option value="Loading Area B">Loading Area B</option>
              <option value="Processing Plant">Processing Plant</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              style={{
                padding: '9px 12px',
                border: '1px solid #E3E6EE',
                borderRadius: '10px',
                fontSize: '13px',
                background: 'white',
                color: 'var(--brand-dark)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">{lang === 'id' ? 'Semua Status' : 'All Statuses'}</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="degraded">Degraded</option>
            </select>
          </div>
        </div>

        {/* Table Container Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E3E6EE',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ 
                  background: '#FAFBFD', 
                  borderBottom: '1px solid #E3E6EE',
                  color: 'var(--outline)',
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}>
                  <th style={{ padding: '14px 16px', width: '80px', textAlign: 'center' }}>Stream</th>
                  <th style={{ padding: '14px 16px' }}>{lang === 'id' ? 'ID Kamera' : 'Camera ID'}</th>
                  <th style={{ padding: '14px 16px' }}>{lang === 'id' ? 'Nama' : 'Name'}</th>
                  <th style={{ padding: '14px 16px' }}>{lang === 'id' ? 'Zona' : 'Zone'}</th>
                  <th style={{ padding: '14px 16px' }}>{lang === 'id' ? 'Lokasi' : 'Location'}</th>
                  <th style={{ padding: '14px 16px' }}>Status</th>
                  <th style={{ padding: '14px 16px' }}>{lang === 'id' ? 'Kondisi' : 'Health'}</th>
                  <th style={{ padding: '14px 16px', width: '80px', textAlign: 'right' }}>{lang === 'id' ? 'Aksi' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px', color: 'var(--brand-dark)' }}>
                {filteredCameras.map((cam, idx) => {
                  const isOnline = cam.status.toLowerCase() === 'online';
                  const isOffline = cam.status.toLowerCase() === 'offline';
                  const isDegraded = cam.status.toLowerCase() === 'degraded';
                  
                  return (
                    <tr 
                      key={cam.id} 
                      style={{ 
                        borderBottom: '1px solid #F2F4F7',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#FAFBFD'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Stream Icon Column */}
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{
                          width: '40px',
                          height: '24px',
                          background: isOffline ? '#FEE2E2' : 'rgba(13, 71, 161, 0.06)',
                          border: '1px solid #E2E8F0',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOffline ? '#EF4444' : 'var(--brand-primary)'
                        }}>
                          {isOffline ? <VideoOff size={13} /> : <Video size={13} />}
                        </div>
                      </td>

                      {/* Camera ID */}
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: 'var(--outline)' }}>
                        {cam.id}
                      </td>

                      {/* Name */}
                      <td style={{ padding: '12px 16px', fontWeight: 700 }}>
                        {cam.name}
                      </td>

                      {/* Zone */}
                      <td style={{ padding: '12px 16px', color: 'var(--brand-dark)' }}>
                        {cam.zone}
                      </td>

                      {/* Location */}
                      <td style={{ padding: '12px 16px', color: 'var(--outline)' }}>
                        {cam.location}
                      </td>

                      {/* Status badge */}
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: isOnline ? '#DEF7EC' : isOffline ? '#FDE8E8' : '#FEF3C7',
                          color: isOnline ? '#03543F' : isOffline ? '#9B1C1C' : '#92400E',
                          border: `1px solid ${isOnline ? '#BCF0DA' : isOffline ? '#FBD5D5' : '#FDE68A'}`
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: isOnline ? '#31C48D' : isOffline ? '#F8B4B4' : '#F59E0B'
                          }} />
                          {cam.status}
                        </span>
                      </td>

                      {/* Health progress bar */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, minWidth: '32px' }}>
                            {cam.health}%
                          </span>
                          <div style={{ 
                            width: '70px', 
                            height: '6px', 
                            background: '#E2E8F0', 
                            borderRadius: '999px',
                            overflow: 'hidden' 
                          }}>
                            <div style={{
                              height: '100%',
                              borderRadius: '999px',
                              width: `${cam.health}%`,
                              background: isOnline ? '#10B981' : isOffline ? '#EF4444' : '#F59E0B'
                            }} />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--outline)',
                          padding: '4px',
                          borderRadius: '4px'
                        }}>
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredCameras.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: '32px', textAlign: 'center', color: 'var(--outline)' }}>
                      {lang === 'id' ? 'Tidak ada kamera yang cocok dengan filter saat ini.' : 'No cameras found matching current filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E3E6EE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FAFBFD',
            fontSize: '13px',
            color: 'var(--outline)'
          }}>
            <span>{lang === 'id' ? `Menampilkan ${filteredCameras.length} dari ${cameras.length} entri` : `Showing ${filteredCameras.length} of ${cameras.length} entries`}</span>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              <button 
                disabled 
                style={{
                  background: 'white',
                  border: '1px solid #E3E6EE',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'not-allowed',
                  opacity: 0.5,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button style={{
                background: 'var(--brand-primary)',
                color: 'white',
                border: '1px solid var(--brand-primary)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                1
              </button>
              <button style={{
                background: 'white',
                color: 'var(--brand-dark)',
                border: '1px solid #E3E6EE',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}>
                2
              </button>
              <button 
                style={{
                  background: 'white',
                  border: '1px solid #E3E6EE',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
