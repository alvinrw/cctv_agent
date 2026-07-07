import { useMemo, useState } from 'react';
import {
  CheckCircle, Edit, Filter, HelpCircle, Plus, Search, Trash2,
  Shield, Layers, Sliders, Video, ChevronRight, Network, Activity,
  Cpu, ArrowRight, Sparkles, Zap, Radio, Eye
} from 'lucide-react';
import policyNoHuman from '../../../../../backend/policy/policy_no_human.json';
import policyHumanSafetyGear from '../../../../../backend/policy/policy_human_safety_gear.json';
import policyGroups from '../../../../../backend/policy/group.json';

const POLICY_SOURCE = [policyNoHuman, policyHumanSafetyGear];

const formatValue = (value) => {
  if (value === true) return 'Aktif';
  if (value === false) return 'Nonaktif';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
  if (value === undefined || value === null || value === '') return '-';
  return String(value);
};

const buildPolicyRows = (groups) => POLICY_SOURCE.map(policy => {
  const attachedGroups = groups.filter(group => group.policies.includes(policy.name));
  const cctvAttachments = attachedGroups.flatMap(group => group.cam_attachment || []);
  return {
    ...policy,
    groups: attachedGroups,
    cctvAttachments: [...new Set(cctvAttachments)],
    secondsBefore: policy.clip_window?.before ?? 5,
    secondsAfter: policy.clip_window?.after ?? 10
  };
});

const buildGroupRows = (policies) => policyGroups.map(group => {
  const attachedPolicies = group.policies
    .map(policyName => policies.find(policy => policy.name === policyName))
    .filter(Boolean);

  return {
    ...group,
    attachedPolicies,
    policyCount: attachedPolicies.length,
    cctvCount: (group.cam_attachment || []).length
  };
});

export default function PolicyManagementTab({
  setShowPolicyModal,
  setActiveSubTab
}) {
  const [activeMenu, setActiveMenu] = useState('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailPolicyName, setDetailPolicyName] = useState(null);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoveredCctv, setHoveredCctv] = useState(false);
  const [selectedTopoGroup, setSelectedTopoGroup] = useState('all');

  const policies = useMemo(() => buildPolicyRows(policyGroups), []);
  const groups = useMemo(() => buildGroupRows(policies), [policies]);
  const filteredPolicies = policies.filter(policy => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;
    return [
      policy.name,
      policy.description,
      policy.priority,
      ...(policy.thresholds?.words || []),
      ...policy.groups.map(group => group.name)
    ].some(value => String(value).toLowerCase().includes(keyword));
  });
  const filteredGroups = groups.filter(group => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return true;
    return [
      group.name,
      ...(group.policies || []),
      ...(group.cam_attachment || [])
    ].some(value => String(value).toLowerCase().includes(keyword));
  });
  const detailPolicy = policies.find(policy => policy.name === detailPolicyName) || null;
  const isGroupView = activeMenu === 'groups';

  const menuItems = [
    { key: 'policies', label: 'Policies', icon: Shield },
    { key: 'groups', label: 'Group Policy', icon: Layers },
    { key: 'priority', label: 'Priority Settings', icon: Sliders }
  ];

  return (
    <section style={{ padding: '32px 40px', minHeight: '100vh' }}>
      <div className="animate-tab-fade">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0 }}>Policy Studio</h2>
            <p style={{ fontSize: '14px', color: 'var(--outline)', margin: '4px 0 0' }}>Configure real-time AI computer vision policies, triggers, and action workflows.</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '240px minmax(0, 1fr)',
          gap: '24px',
          alignItems: 'stretch'
        }} className="db-layout-grid">
          <aside style={{
            background: 'white',
            border: '1px solid #E3E6EE',
            borderRadius: '16px',
            padding: '18px',
            minHeight: '560px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 18px', color: 'var(--brand-dark)', fontSize: '15px', fontWeight: 800 }}>
              Policy Studio
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              {menuItems.map(item => {
                const Icon = item.icon;
                const isDisabled = item.key === 'priority';
                const isActive = activeMenu === item.key && !isDisabled;
                const isHovered = hoveredMenu === item.key && !isDisabled;
                
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      if (isDisabled) return;
                      setActiveMenu(item.key);
                    }}
                    onMouseEnter={() => {
                      if (isDisabled) return;
                      setHoveredMenu(item.key);
                    }}
                    onMouseLeave={() => setHoveredMenu(null)}
                    style={{
                      textAlign: 'left',
                      background: isActive 
                        ? 'rgba(13,71,161,0.08)' 
                        : (isHovered ? '#F1F5F9' : 'transparent'),
                      color: isActive 
                        ? 'var(--brand-primary)' 
                        : (isHovered ? 'var(--brand-dark)' : '#64748B'),
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      fontWeight: isActive ? 700 : 600,
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      outline: 'none'
                    }}
                  >
                    <Icon size={16} color={isActive ? 'var(--brand-primary)' : '#94A3B8'} style={{ transition: 'color 0.2s' }} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              
              <button
                onClick={() => {
                  if (setActiveSubTab) {
                    setActiveSubTab('camera-management');
                  }
                }}
                onMouseEnter={() => setHoveredCctv(true)}
                onMouseLeave={() => setHoveredCctv(false)}
                style={{
                  textAlign: 'left',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease, transform 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: hoveredCctv ? '0 4px 14px rgba(13,71,161,0.3)' : '0 2px 8px rgba(13,71,161,0.15)',
                  transform: hoveredCctv ? 'translateY(-1px)' : 'none',
                  marginTop: 'auto'
                }}
              >
                <Video size={16} />
                <span>Camera Settings</span>
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: hoveredCctv ? 1 : 0.8, transform: hoveredCctv ? 'translateX(2px)' : 'none', transition: 'all 0.2s' }} />
              </button>
            </div>
          </aside>

          <div style={{
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            padding: 0,
            minHeight: '560px',
            boxShadow: 'none',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, color: 'var(--brand-dark)', fontSize: '20px', fontWeight: 800 }}>
                {isGroupView ? `Group Policy (${groups.length})` : `Policies (${policies.length})`}
              </h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} color="var(--outline)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search"
                    style={{
                      width: '230px',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '8px 10px 8px 32px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
                <button style={{
                  border: '1px solid #CBD5E1',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px'
                }}>
                  <Filter size={14} /> Filter
                </button>
                <button
                  onClick={() => setShowPolicyModal(true)}
                  style={{
                    border: 'none',
                    background: 'var(--brand-primary)',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '9px 14px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px'
                  }}
                >
                  <Plus size={14} /> {isGroupView ? 'Create Group Policy' : 'Create Policy'}
                </button>
              </div>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #E3E6EE',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {isGroupView ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '26%' }} />
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E3E6EE', background: 'white' }}>
                      {['Group Name', 'Policies', 'Policy Count', 'CCTV Attach', ''].map((head, idx) => (
                        <th key={head || 'action'} style={{
                          textAlign: idx >= 2 ? 'center' : 'left',
                          padding: '12px 16px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'var(--outline)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap'
                        }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.map(group => (
                      <tr key={group.id}
                        style={{ borderBottom: '1px solid #F0EDED', transition: 'background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FAFBFD'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--brand-dark)' }}>
                          {group.name}
                        </td>
                        <td
                          title={(group.policies || []).join(', ')}
                          style={{
                            padding: '12px 16px',
                            color: 'var(--on-surface-variant)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {(group.policies || []).join(', ')}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--outline)' }}>
                          {group.policyCount}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--outline)' }}>
                          {group.cctvCount}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            style={{
                              border: '1px solid #CBD5E1',
                              background: 'white',
                              color: 'var(--brand-dark)',
                              borderRadius: '7px',
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed' }}>
                  <colgroup>
                    <col style={{ width: '24%' }} />
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '14%' }} />
                    <col style={{ width: '12%' }} />
                  </colgroup>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E3E6EE', background: 'white' }}>
                      {['Policy Name', 'Deskripsi', 'Groups', 'CCTV Attach', ''].map((head, idx) => (
                        <th key={head || 'action'} style={{
                          textAlign: idx >= 2 ? 'center' : 'left',
                          padding: '12px 16px',
                          fontSize: '10px',
                          fontWeight: 700,
                          color: 'var(--outline)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          whiteSpace: 'nowrap'
                        }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPolicies.map(policy => {
                      const isSelected = detailPolicyName === policy.name;
                      return (
                        <tr key={policy.name}
                          onClick={() => setDetailPolicyName(policy.name)}
                          style={{
                            borderBottom: '1px solid #F0EDED',
                            cursor: 'pointer',
                            background: isSelected ? 'rgba(13,71,161,0.05)' : 'white',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#FAFBFD'; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white'; }}
                        >
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: isSelected ? 'var(--brand-primary)' : 'var(--brand-dark)' }}>
                            {policy.name}
                          </td>
                          <td
                            title={policy.description}
                            style={{
                              padding: '12px 16px',
                              color: 'var(--outline)',
                              maxWidth: '260px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {policy.description}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--outline)' }}>
                            {policy.groups.length}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: 'var(--outline)' }}>
                            {policy.cctvAttachments.length}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDetailPolicyName(policy.name); }}
                              style={{
                                border: isSelected ? 'none' : '1px solid #CBD5E1',
                                background: isSelected ? 'var(--brand-primary)' : 'white',
                                color: isSelected ? 'white' : 'var(--brand-dark)',
                                borderRadius: '7px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* ===== SIMPLE CORPORATE TOPOLOGY OVERVIEW DIAGRAM ===== */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          border: '1px solid #E3E6EE',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
          padding: '24px',
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid #E3E6EE', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'var(--brand-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Layers size={20} color="var(--brand-primary)" />
                <span>Group Policy & Camera Attachment Overview</span>
              </h3>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--outline)' }}>
                Diagram keterikatan kamera CCTV dengan Group Policy serta aturan policy yang diterapkan.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--outline)', marginRight: '6px' }}>Filter Group:</span>
            <button
              onClick={() => setSelectedTopoGroup('all')}
              style={{
                background: selectedTopoGroup === 'all' ? 'var(--brand-primary)' : '#F1F5F9',
                color: selectedTopoGroup === 'all' ? 'white' : 'var(--brand-dark)',
                border: '1px solid #E2E8F0',
                borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s'
              }}
            >
              Semua Group ({groups.length})
            </button>
            {groups.map(g => {
              const isSel = selectedTopoGroup === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedTopoGroup(g.id)}
                  style={{
                    background: isSel ? 'var(--brand-primary)' : '#F1F5F9',
                    color: isSel ? 'white' : 'var(--brand-dark)',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Layers size={13} />
                  <span>{g.name}</span>
                </button>
              );
            })}
          </div>

          {/* Diagram Cards Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(selectedTopoGroup === 'all' ? groups : groups.filter(g => g.id === selectedTopoGroup)).map(group => (
              <div
                key={group.id}
                style={{
                  background: '#FAFBFD',
                  border: '1px solid #E3E6EE',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Group Title Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E3E6EE', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#E0F2FE', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      <Layers size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--brand-dark)' }}>{group.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--outline)' }}>ID: {group.id}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ fontSize: '12px', background: '#F1F5F9', color: 'var(--brand-dark)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      {group.cctvCount} Kamera
                    </span>
                    <span style={{ fontSize: '12px', background: '#F1F5F9', color: 'var(--brand-dark)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      {group.policyCount} Policy
                    </span>
                  </div>
                </div>

                {/* 3-Column Simple Flow Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '16px', alignItems: 'center', overflowX: 'auto', padding: '4px 0' }}>
                  {/* Column 1: CCTV Attached */}
                  <div style={{ background: 'white', border: '1px solid #E3E6EE', borderRadius: '10px', padding: '16px', minWidth: '220px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Video size={14} /> Kamera Terpasang
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(group.cam_attachment || []).length > 0 ? (
                        (group.cam_attachment || []).map(camId => (
                          <div key={camId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)' }}>{camId}</span>
                            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, background: '#F0FDF4', padding: '2px 8px', borderRadius: '4px' }}>Aktif</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--outline)', fontStyle: 'italic', padding: '8px 0' }}>Tidak ada kamera terpasang</div>
                      )}
                    </div>
                  </div>

                  {/* Arrow 1 */}
                  <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={24} />
                  </div>

                  {/* Column 2: Group Hub */}
                  <div style={{ background: '#F0F7FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '16px', minWidth: '220px', textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Layers size={20} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-dark)' }}>{group.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--outline)', marginTop: '4px' }}>Penghubung antara stream CCTV dan aturan kebijakan keamanan.</div>
                  </div>

                  {/* Arrow 2 */}
                  <div style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChevronRight size={24} />
                  </div>

                  {/* Column 3: Policies Attached */}
                  <div style={{ background: 'white', border: '1px solid #E3E6EE', borderRadius: '10px', padding: '16px', minWidth: '220px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Shield size={14} /> Rule Policy Aktif
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(group.attachedPolicies || []).length > 0 ? (
                        (group.attachedPolicies || []).map(pol => (
                          <div key={pol.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--brand-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }} title={pol.name}>{pol.name}</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: pol.priority?.toLowerCase() === 'high' ? '#EF4444' : '#F59E0B', background: pol.priority?.toLowerCase() === 'high' ? '#FEF2F2' : '#FFFBEB', padding: '2px 8px', borderRadius: '4px' }}>{pol.priority || 'Medium'}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '12px', color: 'var(--outline)', fontStyle: 'italic', padding: '8px 0' }}>Tidak ada policy aktif</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {detailPolicy && (
          <div
            onClick={() => setDetailPolicyName(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(11,29,58,0.42)',
              backdropFilter: 'blur(3px)',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '88px 24px 32px'
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: 'white',
                border: '1px solid #E3E6EE',
                borderRadius: '16px',
                width: 'min(760px, 100%)',
                maxHeight: 'calc(100vh - 120px)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <div style={{
                padding: '18px 22px 14px',
                borderBottom: '1px solid #E3E6EE',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '16px',
                alignItems: 'flex-start',
                flexShrink: 0
              }}>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ margin: 0, color: 'var(--brand-dark)', fontSize: '18px', fontWeight: 800 }}>{detailPolicy.name}</h2>
                  <p style={{ margin: '6px 0 0', color: 'var(--on-surface-variant)', lineHeight: 1.5, fontSize: '12.5px' }}>
                    {detailPolicy.description}
                  </p>
                </div>
                <button
                  onClick={() => setDetailPolicyName(null)}
                  style={{
                    border: '1px solid #CBD5E1',
                    background: 'white',
                    color: 'var(--brand-dark)',
                    borderRadius: '8px',
                    padding: '7px 10px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  Tutup
                </button>
              </div>

              <div style={{ padding: '18px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '10px' }} className="db-layout-grid">
                  {[
                    ['Priority', detailPolicy.priority],
                    ['Cooldown', `${detailPolicy.cooldown}s`],
                    ['Sebelum', `${detailPolicy.secondsBefore}s`],
                    ['Sesudah', `${detailPolicy.secondsAfter}s`],
                    ['Confidence', detailPolicy.thresholds?.conf],
                    ['Notification', detailPolicy.response?.notification],
                    ['Response', detailPolicy.response?.type],
                    ['Action', detailPolicy.response?.action]
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: '#FAFBFD', border: '1px solid #E3E6EE', borderRadius: '8px', padding: '9px 10px', minHeight: '58px' }}>
                      <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {label}
                      </span>
                      <strong style={{ display: 'block', marginTop: '4px', color: 'var(--brand-dark)', fontSize: '12.5px' }}>
                        {formatValue(value)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: detailPolicy.thresholds?.area ? '1fr 1fr' : '1fr', gap: '14px' }} className="db-layout-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontSize: '12.5px', fontWeight: 800 }}>Words</h4>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {(detailPolicy.thresholds?.words || []).map(word => (
                          <span key={word} style={{ background: '#E0F2FE', color: '#0369a1', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: 800 }}>
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontSize: '12.5px', fontWeight: 800 }}>Group Policy</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {detailPolicy.groups.map(group => (
                          <div key={group.id} style={{ border: '1px solid #E3E6EE', borderRadius: '8px', padding: '10px 12px', background: '#FAFBFD' }}>
                            <strong style={{ color: 'var(--brand-dark)', fontSize: '12.5px' }}>{group.name}</strong>
                            <p style={{ margin: '4px 0 0', color: 'var(--outline)', fontSize: '11px', lineHeight: 1.4 }}>
                              CCTV: {(group.cam_attachment || []).join(', ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {detailPolicy.thresholds?.area && (
                    <div>
                      <h4 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontSize: '12.5px', fontWeight: 800 }}>Area Threshold</h4>
                      <pre style={{ margin: 0, height: '178px', overflow: 'auto', background: '#071224', color: '#E0F2FE', borderRadius: '8px', padding: '10px', fontSize: '10.5px', lineHeight: 1.45 }}>
                        {JSON.stringify(detailPolicy.thresholds.area, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontSize: '12.5px', fontWeight: 800 }}>Response</h4>
                  <div style={{ border: '1px solid #E3E6EE', borderRadius: '8px', padding: '11px 12px', background: '#FAFBFD' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--brand-dark)', fontWeight: 800 }}>
                      {detailPolicy.response?.header_message}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', lineHeight: 1.5, color: 'var(--on-surface-variant)' }}>
                      {detailPolicy.response?.context_message_for_LLM}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                padding: '14px 22px',
                borderTop: '1px solid #E3E6EE',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                flexShrink: 0,
                background: 'white'
              }}>
                <button style={{ background: '#ec407a', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Trash2 size={14} /> Hapus
                </button>
                <button style={{ background: 'white', color: 'var(--brand-dark)', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => setDetailPolicyName(null)} style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <CheckCircle size={14} /> OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
