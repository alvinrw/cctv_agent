import {
  Edit, MapPin, Trash2, UserPlus, Users
} from 'lucide-react';

export default function AdminTab({
  adminSection,
  setAdminSection,
  manageTab,
  setManageTab,
  addMode,
  setAddMode,
  sites,
  users,
  REGION_PRESETS,
  newCctvSiteId,
  setNewCctvSiteId,
  newCctvName,
  setNewCctvName,
  newCctvDesc,
  setNewCctvDesc,
  newCctvStatus,
  setNewCctvStatus,
  handleAddCctvSubmit,
  newSiteName,
  setNewSiteName,
  newSiteRegionIdx,
  setNewSiteRegionIdx,
  newSiteCctvCount,
  setNewSiteCctvCount,
  newSiteOfflineCctv,
  setNewSiteOfflineCctv,
  handleAddSiteSubmit,
  handleDeleteSite,
  handleDeleteCctv,
  editingSiteId,
  setEditingSiteId,
  editingSiteName,
  setEditingSiteName,
  handleEditSiteSubmit,
  editingCctvId,
  setEditingCctvId,
  editingCctvName,
  setEditingCctvName,
  editingCctvDesc,
  setEditingCctvDesc,
  editingCctvStatus,
  setEditingCctvStatus,
  handleEditCctvSubmit,
  setShowAddUserModal,
  handleDeleteUser
}) {
  return (
  <section style={{ marginTop: '32px' }}>
    <div className="container animate-tab-fade">

      {/* Admin Section Toggle Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white', borderRadius: '12px', padding: '8px 16px',
        border: '1px solid #E3E6EE', marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', gap: '6px', background: '#F4F6FA', padding: '4px', borderRadius: '8px' }}>
          {[
            { key: 'sites', label: 'Kelola Titik & Sektor', icon: <MapPin size={14} /> },
            { key: 'users', label: 'Hak Akses & Akun', icon: <Users size={14} /> }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setAdminSection(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '9px 18px', border: 'none', borderRadius: '6px',
                background: adminSection === tab.key ? 'white' : 'transparent',
                color: adminSection === tab.key ? 'var(--brand-dark)' : 'var(--outline)',
                fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                boxShadow: adminSection === tab.key ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--outline)', fontStyle: 'italic' }}>Panel Sektor Management</span>
      </div>

      {/* ---- SECTION: KELOLA TITIK ---- */}
      {adminSection === 'sites' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px', alignItems: 'start' }}>

          {/* COLUMN 1: FORM TAMBAH */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E3E6EE',
            boxShadow: '0 8px 24 rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ margin: '0 0 6px', color: 'var(--brand-dark)', fontWeight: 700, fontSize: '18px' }}>Tambah Konfigurasi</h3>
            <p style={{ margin: '0 0 24px', fontSize: '12.5px', color: 'var(--outline)' }}>
              Daftarkan kamera CCTV baru atau buat sektor tambang baru di sistem monitoring.
            </p>

            {/* Mode Selector Toggle */}
            <div style={{ display: 'flex', background: '#F4F6FA', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
              <button
                onClick={() => setAddMode('cctv')}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '6px',
                  background: addMode === 'cctv' ? 'white' : 'transparent',
                  color: addMode === 'cctv' ? 'var(--brand-dark)' : 'var(--outline)',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  boxShadow: addMode === 'cctv' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Tambah Kamera CCTV
              </button>
              <button
                onClick={() => setAddMode('sector')}
                style={{
                  flex: 1, padding: '10px', border: 'none', borderRadius: '6px',
                  background: addMode === 'sector' ? 'white' : 'transparent',
                  color: addMode === 'sector' ? 'var(--brand-dark)' : 'var(--outline)',
                  fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                  boxShadow: addMode === 'sector' ? '0 2px 6px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Tambah Sektor Baru
              </button>
            </div>

            {/* FORM 1: TAMBAH CCTV */}
            {addMode === 'cctv' ? (
              <form onSubmit={handleAddCctvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Sektor Penempatan</label>
                  <select
                    value={newCctvSiteId}
                    onChange={e => setNewCctvSiteId(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px', background: 'white' }}
                  >
                    {sites.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Nama Kamera CCTV</label>
                  <input
                    type="text"
                    placeholder="Contoh: CCTV Area Loading Crusher B"
                    value={newCctvName}
                    onChange={e => setNewCctvName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Status Awal Kamera</label>
                  <select
                    value={newCctvStatus}
                    onChange={e => setNewCctvStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px', background: 'white' }}
                  >
                    <option value="ONLINE">ONLINE (Aktif/Normal)</option>
                    <option value="OFFLINE">OFFLINE (Dalam Perbaikan/Trouble)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Deskripsi Feed Video / Lokasi Detail</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pemantauan area loading coal pile crusher"
                    value={newCctvDesc}
                    onChange={e => setNewCctvDesc(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
                    background: 'var(--brand-primary)', color: 'white', fontWeight: 700, cursor: 'pointer',
                    fontSize: '14px', marginTop: '8px', boxShadow: '0 4px 14px rgba(13,71,161,0.25)'
                  }}
                >
                  Simpan & Pasang CCTV
                </button>
              </form>
            ) : (
              /* FORM 2: TAMBAH SEKTOR */
              <form onSubmit={handleAddSiteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Nama Sektor Tambang Baru</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pit B (Quarry Barat)"
                    value={newSiteName}
                    onChange={e => setNewSiteName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Plot Lokasi Koordinat Peta</label>
                  <select
                    value={newSiteRegionIdx}
                    onChange={e => setNewSiteRegionIdx(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px', background: 'white' }}
                  >
                    {REGION_PRESETS.map((r, idx) => (
                      <option key={idx} value={idx}>{r.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '13px' }}>Jumlah Kamera CCTV Awal</label>
                  <input
                    type="number"
                    min="1"
                    value={newSiteCctvCount}
                    onChange={e => setNewSiteCctvCount(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ color: '#ff4d4d', fontWeight: 600, fontSize: '13px' }}>Kamera Offline Awal (Trouble)</label>
                  <input
                    type="number"
                    min="0"
                    max={newSiteCctvCount}
                    value={newSiteOfflineCctv}
                    onChange={e => setNewSiteOfflineCctv(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
                    background: 'var(--brand-primary)', color: 'white', fontWeight: 700, cursor: 'pointer',
                    fontSize: '14px', marginTop: '8px', boxShadow: '0 4px 14px rgba(13,71,161,0.25)'
                  }}
                >
                  Simpan & Daftarkan Sektor
                </button>
              </form>
            )}
          </div>

          {/* COLUMN 2: LIST MANAGE SECTOR & CCTV */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E3E6EE',
            boxShadow: '0 8px 24 rgba(0,0,0,0.02)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '20px', borderBottom: '1.5px solid #F1F3F9', paddingBottom: '16px'
            }}>
              <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontWeight: 700, fontSize: '18px' }}>Kelola Data Pemantauan</h3>

              {/* Switch list tabs */}
              <div style={{ display: 'flex', gap: '8px', background: '#F4F6FA', padding: '4px', borderRadius: '6px' }}>
                <button
                  onClick={() => setManageTab('sectors')}
                  style={{
                    padding: '6px 12px', border: 'none', borderRadius: '4px',
                    background: manageTab === 'sectors' ? 'white' : 'transparent',
                    color: manageTab === 'sectors' ? 'var(--brand-dark)' : 'var(--outline)',
                    fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                    boxShadow: manageTab === 'sectors' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Sektor ({sites.length})
                </button>
                <button
                  onClick={() => setManageTab('cctvs')}
                  style={{
                    padding: '6px 12px', border: 'none', borderRadius: '4px',
                    background: manageTab === 'cctvs' ? 'white' : 'transparent',
                    color: manageTab === 'cctvs' ? 'var(--brand-dark)' : 'var(--outline)',
                    fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                    boxShadow: manageTab === 'cctvs' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  Kamera CCTV ({sites.reduce((acc, s) => acc + s.details.length, 0)})
                </button>
              </div>
            </div>

            {/* LIST CONTENT: SECTORS */}
            {manageTab === 'sectors' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                {sites.map(s => (
                  <div key={s.id} style={{
                    padding: '16px', background: '#FAFBFD', border: '1px solid #E3E6EE',
                    borderRadius: '12px', transition: 'all 0.2s'
                  }}>
                    {editingSiteId === s.id ? (
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={editingSiteName}
                          onChange={e => setEditingSiteName(e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #C3C6D4', borderRadius: '6px', fontSize: '13px' }}
                        />
                        <button
                          onClick={() => handleEditSiteSubmit(s.id, editingSiteName)}
                          style={{ padding: '8px 14px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                        >
                          Simpan
                        </button>
                        <button
                          onClick={() => { setEditingSiteId(null); setEditingSiteName(''); }}
                          style={{ padding: '8px 14px', background: '#F4F6FA', color: 'var(--outline)', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--brand-dark)', fontSize: '14px', display: 'block' }}>{s.name}</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--outline)' }}>
                            Koordinat Peta: <code style={{ background: '#F1F3F9', padding: '1px 4px', borderRadius: '3px' }}>{s.x}, {s.y}</code> • {s.cctvTotal} Kamera
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => { setEditingSiteId(s.id); setEditingSiteName(s.name); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(13,71,161,0.06)', color: 'var(--brand-primary)', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                          >
                            <Edit size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSite(s.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(239,68,68,0.06)', color: '#EF4444', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                          >
                            <Trash2 size={11} /> Hapus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* LIST CONTENT: CCTVS */}
            {manageTab === 'cctvs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                {sites.flatMap(s => s.details.map(cam => ({ ...cam, siteId: s.id, siteName: s.name }))).map(cam => (
                  <div key={cam.id} style={{
                    padding: '16px', background: '#FAFBFD', border: '1px solid #E3E6EE',
                    borderRadius: '12px'
                  }}>
                    {editingCctvId === cam.id ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--outline)', marginBottom: '4px' }}>Nama Kamera</label>
                            <input
                              type="text"
                              value={editingCctvName}
                              onChange={e => setEditingCctvName(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #C3C6D4', borderRadius: '6px', fontSize: '13px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--outline)', marginBottom: '4px' }}>Status Kamera</label>
                            <select
                              value={editingCctvStatus}
                              onChange={e => setEditingCctvStatus(e.target.value)}
                              style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #C3C6D4', borderRadius: '6px', fontSize: '13px', background: 'white' }}
                            >
                              <option value="ONLINE">ONLINE</option>
                              <option value="OFFLINE">OFFLINE</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--outline)', marginBottom: '4px' }}>Deskripsi Video Feed</label>
                          <input
                            type="text"
                            value={editingCctvDesc}
                            onChange={e => setEditingCctvDesc(e.target.value)}
                            style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #C3C6D4', borderRadius: '6px', fontSize: '13px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                          <button
                            onClick={() => handleEditCctvSubmit(cam.siteId, cam.id, editingCctvName, editingCctvDesc, editingCctvStatus)}
                            style={{ padding: '8px 14px', background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            Simpan
                          </button>
                          <button
                            onClick={() => { setEditingCctvId(null); }}
                            style={{ padding: '8px 14px', background: '#F4F6FA', color: 'var(--outline)', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ minWidth: 0, flex: 1, paddingRight: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--brand-dark)', fontSize: '14px' }}>{cam.name}</span>
                            <span style={{
                              fontSize: '9px', fontWeight: 700,
                              color: cam.status === 'OFFLINE' ? '#ff4d4d' : '#10b981',
                              background: cam.status === 'OFFLINE' ? 'rgba(255,77,77,0.08)' : 'rgba(16,185,129,0.08)',
                              padding: '2px 6px', borderRadius: '3px'
                            }}>
                              {cam.status}
                            </span>
                          </div>
                          <span style={{ fontSize: '11.5px', color: 'var(--outline)', display: 'block', marginBottom: '2px' }}>
                            Sektor: <span style={{ fontWeight: 600 }}>{cam.siteName}</span>
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--outline)', fontStyle: 'italic', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cam.feedDescription}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                          <button
                            onClick={() => {
                              setEditingCctvId(cam.id);
                              setEditingCctvName(cam.name);
                              setEditingCctvDesc(cam.feedDescription);
                              setEditingCctvStatus(cam.status);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(13,71,161,0.06)', color: 'var(--brand-primary)', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                          >
                            <Edit size={11} /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCctv(cam.siteId, cam.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px', background: 'rgba(239,68,68,0.06)', color: '#EF4444', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                          >
                            <Trash2 size={11} /> Hapus
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* ---- SECTION: HAK AKSES & AKUN ---- */}
      {adminSection === 'users' && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', border: '1px solid #E3E6EE', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontWeight: 700, fontSize: '20px' }}>Manajemen Hak Akses & Akun</h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--outline)' }}>
                Super Admin dapat menambah, mengedit, atau menghapus kewenangan akses personil monitoring.
              </p>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              style={{
                background: 'var(--brand-primary)', color: 'white', border: 'none',
                borderRadius: '8px', padding: '10px 18px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(13,71,161,0.2)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-600)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--brand-primary)'}
            >
              <UserPlus size={16} /> Tambah Hak Akses
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #E3E6EE', color: 'var(--brand-dark)' }}>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Username</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Nama Lengkap</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Peran (Role)</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F0EDED', color: 'var(--on-surface-variant)', transition: 'background 0.2s' }} className="user-table-row">
                    <td style={{ padding: '16px', fontWeight: 600, fontFamily: 'monospace' }}>{u.username}</td>
                    <td style={{ padding: '16px' }}>{u.fullName}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        background: u.role === 'Super Admin' ? 'rgba(255,193,7,0.15)' : u.role === 'Supervisor' ? '#E3F2FD' : 'rgba(0,0,0,0.05)',
                        color: u.role === 'Super Admin' ? 'var(--brand-secondary)' : u.role === 'Supervisor' ? 'var(--brand-primary)' : 'var(--on-surface-variant)',
                        fontWeight: 700, fontSize: '11px', padding: '4px 10px', borderRadius: '4px'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '13px', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      {u.username === 'admin' ? (
                        <span style={{ fontSize: '11px', color: 'var(--outline)', fontStyle: 'italic' }}>Utama</span>
                      ) : (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.fullName)}
                          style={{
                            background: 'none', border: 'none', color: '#ff4d4d',
                            cursor: 'pointer', padding: '6px', borderRadius: '4px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  </section>
  );
}
