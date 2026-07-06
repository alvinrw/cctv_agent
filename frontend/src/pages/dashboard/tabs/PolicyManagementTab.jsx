import { useMemo, useState } from 'react';
import {
  CheckCircle, Edit, Filter, HelpCircle, Plus, Search, Trash2
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
  setShowPolicyModal
}) {
  const [activeMenu, setActiveMenu] = useState('policies');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailPolicyName, setDetailPolicyName] = useState(null);

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
    { key: 'policies', label: 'Policies' },
    { key: 'groups', label: 'Group Policy' },
    { key: 'priority', label: 'Priority Settings' },
    { key: 'cctv', label: 'CCTV Settings ->' }
  ];

  return (
    <section style={{ marginTop: '32px' }}>
      <div className="container animate-tab-fade">
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
              Policy Management
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {menuItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  style={{
                    textAlign: 'left',
                    background: activeMenu === item.key ? 'rgb(13, 72, 161)' : 'white',
                    color: activeMenu === item.key ? 'white' : 'var(--on-surface-variant)',
                    border: `1.5px solid ${activeMenu === item.key ? 'var(--brand-primary)' : '#C3C6D4'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              style={{
                marginTop: 'auto',
                textAlign: 'left',
                background: 'white',
                color: 'var(--brand-dark)',
                border: '1.5px solid #C3C6D4',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <HelpCircle size={15} /> Help?
            </button>
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
                      border: '1.5px solid #C3C6D4',
                      borderRadius: '8px',
                      padding: '8px 10px 8px 32px',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                </div>
                <button style={{
                  border: '1.5px solid #C3C6D4',
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
                    background: 'var(--brand-secondary)',
                    color: 'var(--brand-dark)',
                    borderRadius: '8px',
                    padding: '9px 14px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px'
                    // boxShadow: '0 4px 12px rgba(255,193,7,0.28)'
                  }}
                >
                  <Plus size={14} /> {isGroupView ? 'Create Group Policy' : 'Create Policy'}
                </button>
              </div>
            </div>

            <div style={{ background: 'white', border: '1.5px solid #C3C6D4', borderRadius: '12px', overflow: 'hidden', flex: 1 }}>
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
                    <tr style={{ background: '#FAFBFD', color: 'var(--brand-dark)' }}>
                      {['Group Name', 'Policies', 'Policy Count', 'CCTV Attach', ''].map((head, idx) => (
                        <th key={head || 'action'} style={{
                          textAlign: idx >= 2 ? 'center' : 'left',
                          padding: '12px 14px',
                          borderBottom: '1.5px solid #C3C6D4',
                          borderRight: idx < 4 ? '1.5px solid #C3C6D4' : 'none',
                          fontWeight: 800,
                          whiteSpace: 'nowrap'
                        }}>
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGroups.map(group => (
                      <tr key={group.id}>
                        <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', fontWeight: 800, color: 'var(--brand-dark)' }}>
                          {group.name}
                        </td>
                        <td
                          title={(group.policies || []).join(', ')}
                          style={{
                            padding: '13px 14px',
                            borderRight: '1.5px solid #C3C6D4',
                            color: 'var(--on-surface-variant)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {(group.policies || []).join(', ')}
                        </td>
                        <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', textAlign: 'center', fontWeight: 700 }}>
                          {group.policyCount}
                        </td>
                        <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', textAlign: 'center', fontWeight: 700 }}>
                          {group.cctvCount}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button
                            style={{
                              border: '1.5px solid #C3C6D4',
                              background: 'white',
                              color: 'var(--brand-dark)',
                              borderRadius: '7px',
                              padding: '6px 14px',
                              fontSize: '12px',
                              fontWeight: 800,
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
                    <tr style={{ background: '#FAFBFD', color: 'var(--brand-dark)' }}>
                      {['Policy Name', 'Deskripsi', 'Groups', 'CCTV Attach', ''].map((head, idx) => (
                        <th key={head || 'action'} style={{
                          textAlign: idx >= 2 ? 'center' : 'left',
                          padding: '12px 14px',
                          borderBottom: '1.5px solid #C3C6D4',
                          borderRight: idx < 4 ? '1.5px solid #C3C6D4' : 'none',
                          fontWeight: 800,
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
                        <tr key={policy.name} style={{ background: isSelected ? 'rgba(255,214,0,0.10)' : 'white' }}>
                          <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', fontWeight: 800, color: 'var(--brand-dark)' }}>
                            {policy.name}
                          </td>
                          <td
                            title={policy.description}
                            style={{
                              padding: '13px 14px',
                              borderRight: '1.5px solid #C3C6D4',
                              color: 'var(--on-surface-variant)',
                              maxWidth: '260px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {policy.description}
                          </td>
                          <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', textAlign: 'center', fontWeight: 700 }}>
                            {policy.groups.length}
                          </td>
                          <td style={{ padding: '13px 14px', borderRight: '1.5px solid #C3C6D4', textAlign: 'center', fontWeight: 700 }}>
                            {policy.cctvAttachments.length}
                          </td>
                          <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                            <button
                              onClick={() => setDetailPolicyName(policy.name)}
                              style={{
                                border: '1.5px solid #C3C6D4',
                                background: isSelected ? 'var(--brand-secondary)' : 'white',
                                color: 'var(--brand-dark)',
                                boxShadow: isSelected ? '0 2px 8px rgba(255,214,0,0.24)' : 'none',
                                borderRadius: '7px',
                                padding: '6px 14px',
                                fontSize: '12px',
                                fontWeight: 800,
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
                    border: '1.5px solid #C3C6D4',
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
                <button style={{ background: 'white', color: 'var(--brand-dark)', border: '1.5px solid #C3C6D4', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Edit size={14} /> Edit
                </button>
                <button onClick={() => setDetailPolicyName(null)} style={{ background: 'white', color: 'var(--brand-dark)', border: '1.5px solid #C3C6D4', borderRadius: '8px', padding: '8px 16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px' }}>
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
