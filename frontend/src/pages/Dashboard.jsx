import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, LogOut, Map, Trash2, Clock,
  Home, Cpu, Edit, Settings, ChevronLeft, ChevronRight, ShieldAlert,
  HelpCircle, BarChart3, Video, Loader2
} from 'lucide-react';
import logoImage from '../assets/logo.png';
import initialSites from './dashboard/data/initialSites.json';
import OverviewTab from './dashboard/tabs/OverviewTab';
import MapMonitoringTab from './dashboard/tabs/MapMonitoringTab';
import AdminTab from './dashboard/tabs/AdminTab';
import LiveMultiCctvTab from './dashboard/tabs/LiveMultiCctvTab';
import PolicyManagementTab from './dashboard/tabs/PolicyManagementTab';
import IncidentCenterTab from './dashboard/tabs/IncidentCenterTab';
import AnalysisTab from './dashboard/tabs/AnalysisTab';
import CameraManagementTab from './dashboard/tabs/CameraManagementTab';

// Data Pengguna Awal
const INITIAL_USERS = [
  { id: 1, username: 'admin', fullName: 'Alvin Nugraha (Owner)', role: 'Super Admin', status: 'Aktif' },
  { id: 2, username: 'budi.s', fullName: 'Budi Santoso', role: 'Operator', status: 'Aktif' },
  { id: 3, username: 'siti.w', fullName: 'Siti Wijaya', role: 'Supervisor', status: 'Aktif' },
  { id: 4, username: 'guest.viewer', fullName: 'Guest Viewer Astra', role: 'Viewer', status: 'Aktif' }
];

// Presets wilayah di Site Tambang
const REGION_PRESETS = [
  { label: 'Pit A (Quarry Barat)', x: '25%', y: '45%' },
  { label: 'Stockpile Utara', x: '68%', y: '28%' },
  { label: 'Workshop & Main Office', x: '45%', y: '55%' },
  { label: 'Processing Plant (Crusher)', x: '75%', y: '60%' },
  { label: 'Main Security Gate', x: '15%', y: '75%' }
];

// Initial Workload Groups (Policy Presets)
const INITIAL_WORKLOAD_GROUPS = [
  {
    id: 'group-danger',
    name: 'Grup Area Bahaya (Default)',
    description: 'Aturan keselamatan standar untuk memantau area berbahaya tambang.',
    skills: [
      { id: 'skill-human', code: 'obstacle_on_road', description: 'Hambatan di jalan hauling', guidelines: 'Pastikan tidak ada alat berat atau kendaraan terparkir di jalan hauling.' },
      { id: 'skill-truck', code: 'no_truck_stop', description: 'Titik ini tidak boleh ada truk berhenti', guidelines: 'Pastikan tidak ada alat berat atau kendaraan terparkir di jalan hauling.' },
      { id: 'skill-human', code: 'unsafe_human_area', description: 'Area berbahaya bagi manusia', guidelines: 'Look for dense black or gray clouds obscuring the shovel visibility.' },
      { id: 'skill-spark', code: 'spark_hazard', description: 'Sparks detected during welding or grinding', guidelines: 'Look for bright flashes of light and flying sparks near equipment.' }
    ]
  },
  {
    id: 'group-logistics',
    name: 'Grup Logistik & Debu',
    description: 'Aturan operasional untuk mengontrol kelancaran logistik dan kepulan debu.',
    skills: [
      { id: 'skill-truck', code: 'no_truck_stop', description: 'Titik ini tidak boleh ada truk berhenti', guidelines: 'AI mendeteksi unit truk (HD) diam menghalangi jalur logistik.' },
      { id: 'skill-dust', code: 'heavy_dust_cloud', description: 'Debu pekat di jalan hauling', guidelines: 'Look for dense black or gray clouds obscuring the shovel visibility.' }
    ]
  },
  {
    id: 'group-workshop',
    name: 'Grup Workshop & Spark',
    description: 'Aturan keselamatan khusus area workshop dan bahaya percikan api.',
    skills: [
      { id: 'skill-human', code: 'no_human_zone', description: 'Titik ini ga boleh ada manusia (Bahaya)', guidelines: 'AI memicu alarm instan jika kru memasuki area berbahaya.' },
      { id: 'skill-spark', code: 'spark_hazard', description: 'Sparks detected during welding or grinding', guidelines: 'Look for bright flashes of light and flying sparks near equipment.' }
    ]
  },
  {
    id: 'group-full',
    name: 'Grup Operasional Lengkap',
    description: 'Seluruh rule lengkap untuk memantau area pit tambang utama.',
    skills: [
      { id: 'skill-human', code: 'no_human_zone', description: 'Titik ini ga boleh ada manusia (Bahaya)', guidelines: 'AI memicu alarm instan jika kru memasuki area berbahaya.' },
      { id: 'skill-truck', code: 'no_truck_stop', description: 'Titik ini ga boleh ada truk berhenti / stay', guidelines: 'AI mendeteksi unit truk (HD) diam menghalangi jalur logistik.' },
      { id: 'skill-dust', code: 'heavy_dust_cloud', description: 'High concentration of coal dust cloud', guidelines: 'Look for dense black or gray clouds obscuring the shovel visibility.' },
      { id: 'skill-distance', code: 'unsafe_truck_distance', description: 'Haul truck parked too close to excavator swing path', guidelines: 'Identify if any HD785 truck comes within the 10-meter radius boundary of the excavator cabin.' }
    ]
  }
];

// Initial Group Assignments per Sector
const INITIAL_SECTOR_GROUP_ASSIGNMENTS = {
  'pit-a': 'group-full',
  'stockpile-utara': 'group-danger',
  'workshop-main': 'group-workshop',
  'processing-crusher': 'group-danger',
  'main-security-gate': 'group-danger'
};


export default function Dashboard() {
  const navigate = useNavigate();

  // Tab Active State ('overview' | 'map' | 'add-site' | 'users' | 'live-cctv' | 'policy-management')
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [adminSection, setAdminSection] = useState('sites');

  // Workload States
  const [workloadSelectedSiteId, setWorkloadSelectedSiteId] = useState(initialSites[0]?.id || '');

  // Workload Groups & Assignments States (AWS Security Group concept)
  const [workloadGroups, setWorkloadGroups] = useState(INITIAL_WORKLOAD_GROUPS);
  const [sectorGroupAssignments, setSectorGroupAssignments] = useState(INITIAL_SECTOR_GROUP_ASSIGNMENTS);

  // Group Policy Manager Modal States
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showRulePreview, setShowRulePreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('group-danger');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillCode, setSkillCode] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillGuidelines, setSkillGuidelines] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const getCctvSectorGroup = (cctvId) => {
    const parentSite = sites.find(s => s.details.some(d => d.id === cctvId));
    if (!parentSite) return null;
    const groupId = sectorGroupAssignments[parentSite.id] || 'group-danger';
    return workloadGroups.find(g => g.id === groupId) || null;
  };

  const handleAssignSectorGroup = (sectorId, groupId) => {
    setSectorGroupAssignments(prev => ({
      ...prev,
      [sectorId]: groupId
    }));
  };

  // Core States
  const [sites, setSites] = useState(initialSites);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedSite, setSelectedSite] = useState(initialSites[0]);

  // Edit states for Sectors and CCTV
  const [editingSiteId, setEditingSiteId] = useState(null);
  const [editingSiteName, setEditingSiteName] = useState('');

  const [editingCctvId, setEditingCctvId] = useState(null);
  const [editingCctvName, setEditingCctvName] = useState('');
  const [editingCctvDesc, setEditingCctvDesc] = useState('');
  const [editingCctvStatus, setEditingCctvStatus] = useState('');
  const [manageTab, setManageTab] = useState('sectors');

  // Live CCTV Layout Grid States
  const [gridSize, setGridSize] = useState(4);
  const [selectedCctvIds, setSelectedCctvIds] = useState([]);

  // Initialize selected CCTV IDs if empty
  useEffect(() => {
    if (selectedCctvIds.length === 0 && sites.length > 0) {
      const initialIds = sites
        .flatMap(s => s.details.filter(d => d.type === 'cctv'))
        .map(c => c.id);
      setSelectedCctvIds(initialIds);
    }
  }, [sites]);

  // CCTV Video Player State
  const [activeCctv, setActiveCctv] = useState(null);

  // Playback/Clippings State
  const [isPlayingClip, setIsPlayingClip] = useState(false);
  const [selectedClip, setSelectedClip] = useState(null);
  const [clipProgress, setClipProgress] = useState(0);

  // Set default CCTV when site changes
  useEffect(() => {
    const defaultCctv = selectedSite.details.find(d => d.type === 'cctv' && d.status === 'ONLINE');
    setActiveCctv(defaultCctv || selectedSite.details.find(d => d.type === 'cctv') || null);
    setIsPlayingClip(false);
    setSelectedClip(null);
  }, [selectedSite.id]);

  // Sync activeCctv reference when selectedSite details update (e.g. dynamic clippings added)
  useEffect(() => {
    if (activeCctv && selectedSite) {
      const latestCctv = selectedSite.details.find(d => d.id === activeCctv.id);
      if (latestCctv && latestCctv.clippings && activeCctv.clippings && latestCctv.clippings.length !== activeCctv.clippings.length) {
        setActiveCctv(latestCctv);
      }
    }
  }, [selectedSite, activeCctv]);

  const [logs, setLogs] = useState([
    { time: '13:14:02', message: 'Sistem monitoring PamAgents berhasil diinisialisasi.', type: 'info' },
    { time: '13:14:15', message: 'Pit A: Truk HD785 terdeteksi melaju di atas batas 30 km/jam.', type: 'error' },
    { time: '13:15:10', message: 'Processing Crusher: CCTV Screen Deck Feed terputus (Offline).', type: 'error' },
    { time: '13:16:30', message: 'Processing Crusher: CCTV Crusher Hopper mengalami gangguan sinyal (Offline).', type: 'error' },
  ]);

  // Filter KPI State ('ALL', 'CCTV_OFFLINE')
  const [filterKPI, setFilterKPI] = useState('ALL');

  // Overview Panel Filter State
  const [overviewFilterMode, setOverviewFilterMode] = useState('all');
  const [overviewSelectedSiteId, setOverviewSelectedSiteId] = useState(initialSites[0]?.id || '');

  // Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Form input states (New Site)
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteRegionIdx, setNewSiteRegionIdx] = useState(0);
  const [newSiteCctvCount, setNewSiteCctvCount] = useState(4);
  const [newSiteOfflineCctv, setNewSiteOfflineCctv] = useState(0);

  // Form mode for Tambah Titik Tab ('cctv' | 'sector')
  const [addMode, setAddMode] = useState('cctv');

  // Form input states (New CCTV)
  const [newCctvName, setNewCctvName] = useState('');
  const [newCctvSiteId, setNewCctvSiteId] = useState(initialSites[0]?.id || '');
  const [newCctvStatus, setNewCctvStatus] = useState('ONLINE');
  const [newCctvDesc, setNewCctvDesc] = useState('');

  // Form input states (New User)
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newUserRole, setNewUserRole] = useState('Operator');

  // Time Clock State
  const [timeStr, setTimeStr] = useState(new Date().toLocaleTimeString('id-ID'));

  // Auth Guard check
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('id-ID'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Clipping Playback Animation Ticker
  useEffect(() => {
    let interval;
    if (isPlayingClip) {
      interval = setInterval(() => {
        setClipProgress(prev => {
          if (prev >= 100) {
            setIsPlayingClip(false); // Playback finished, return to live
            setSelectedClip(null);
            return 0;
          }
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingClip]);

  // Auto-updating live activity logger & DYNAMIC CLIPPING SAVER
  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('id-ID');

      setSites(prevSites => {
        // Pick a random site
        const siteIndex = Math.floor(Math.random() * prevSites.length);
        const targetSite = prevSites[siteIndex];

        // Find online CCTVs in this site
        const onlineCctvs = targetSite.details.filter(d => d.type === 'cctv' && d.status === 'ONLINE');
        if (onlineCctvs.length === 0) return prevSites; // Skip if no online cameras

        const targetCctv = onlineCctvs[Math.floor(Math.random() * onlineCctvs.length)];

        // Generate dynamic event log details
        const eventTypes = [
          {
            title: 'Pergerakan Truk HD',
            message: `${targetSite.name}: ${targetCctv.name} mendeteksi perlintasan Dump Truck HD785.`,
            type: 'info',
            clipType: 'info'
          },
          {
            title: 'Audit Helm K3',
            message: `${targetSite.name}: ${targetCctv.name} memverifikasi kepatuhan APD Helm & Rompi.`,
            type: 'success',
            clipType: 'info'
          },
          {
            title: 'Unit Melanggar Batas',
            message: `${targetSite.name}: ${targetCctv.name} mendeteksi unit LV melintasi area bahaya.`,
            type: 'error',
            clipType: 'danger'
          },
          {
            title: 'Analisis Debu Area',
            message: `${targetSite.name}: Tingkat emisi debu terdeteksi aman oleh ${targetCctv.name}.`,
            type: 'success',
            clipType: 'info'
          }
        ];

        const chosenEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];

        // Create new dynamic clip
        const newClip = {
          id: `clip-dyn-${Date.now()}`,
          time,
          title: chosenEvent.title,
          camera: targetCctv.name,
          duration: '10s',
          description: chosenEvent.message,
          type: chosenEvent.clipType
        };

        // Append log to scrolling feed
        setLogs(prevLogs => [{ time, message: chosenEvent.message, type: chosenEvent.type }, ...prevLogs.slice(0, 19)]);

        // Update target CCTV inside target site
        const updatedSites = prevSites.map((s, idx) => {
          if (idx !== siteIndex) return s;

          return {
            ...s,
            details: s.details.map(device => {
              if (device.id !== targetCctv.id) return device;
              return {
                ...device,
                clippings: [newClip, ...(device.clippings || [])].slice(0, 8) // Limit to 8 clips
              };
            })
          };
        });

        // Sync selectedSite
        const updatedSelectedSite = updatedSites.find(s => s.id === selectedSite.id);
        if (updatedSelectedSite) {
          setSelectedSite(updatedSelectedSite);
        }

        return updatedSites;
      });

    }, 8000); // Trigger every 8 seconds

    return () => clearInterval(interval);
  }, [selectedSite.id]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // VLM Custom AI Event Handlers
  const handleContextChange = (cctvId, val) => {
    setCctvContexts(prev => ({
      ...prev,
      [cctvId]: val
    }));
  };

  // Group Policy Manager Action Handlers
  const handleSaveSkillToGroup = (groupId) => {
    if (!skillCode.trim()) {
      alert('Event Code tidak boleh kosong!');
      return;
    }
    if (!skillDesc.trim()) {
      alert('Event Description tidak boleh kosong!');
      return;
    }
    const sanitizedCode = skillCode.toLowerCase().trim().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_');

    setWorkloadGroups(prev => {
      return prev.map(group => {
        if (group.id !== groupId) return group;
        const currentSkills = group.skills || [];
        if (editingSkillId) {
          // Edit existing skill in this group
          const updated = currentSkills.map(sk =>
            sk.id === editingSkillId
              ? { ...sk, code: sanitizedCode, description: skillDesc.trim(), guidelines: skillGuidelines.trim() }
              : sk
          );
          return { ...group, skills: updated };
        } else {
          // Add new skill to this group
          const newSkill = {
            id: 'skill-' + Date.now(),
            code: sanitizedCode,
            description: skillDesc.trim(),
            guidelines: skillGuidelines.trim()
          };
          return { ...group, skills: [...currentSkills, newSkill] };
        }
      });
    });

    // Reset form
    setSkillCode('');
    setSkillDesc('');
    setSkillGuidelines('');
    setEditingSkillId(null);
  };

  const handleEditSkillClick = (skill) => {
    setEditingSkillId(skill.id);
    setSkillCode(skill.code);
    setSkillDesc(skill.description);
    setSkillGuidelines(skill.guidelines || '');
  };

  const handleDeleteSkillFromGroup = (groupId, skillId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus rule ini dari grup policy?')) {
      setWorkloadGroups(prev => {
        return prev.map(group => {
          if (group.id !== groupId) return group;
          return {
            ...group,
            skills: (group.skills || []).filter(sk => sk.id !== skillId)
          };
        });
      });
      if (editingSkillId === skillId) {
        setSkillCode('');
        setSkillDesc('');
        setSkillGuidelines('');
        setEditingSkillId(null);
      }
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) {
      alert('Nama grup tidak boleh kosong!');
      return;
    }
    const newGroup = {
      id: 'group-' + Date.now(),
      name: newGroupName.trim(),
      description: newGroupDesc.trim(),
      skills: []
    };
    setWorkloadGroups(prev => [...prev, newGroup]);
    setSelectedGroupId(newGroup.id);
    setNewGroupName('');
    setNewGroupDesc('');
    setIsCreatingGroup(false);
  };

  const handleDeleteGroup = (groupId) => {
    if (workloadGroups.length <= 1) {
      alert('Anda harus menyisakan minimal satu grup policy!');
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus grup policy ini? Semua CCTV yang menggunakan grup ini akan dialihkan ke grup default.')) {
      // Find default or another group to reassign sectors.
      const otherGroup = workloadGroups.find(g => g.id !== groupId) || workloadGroups[0];
      setSectorGroupAssignments(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(sectorId => {
          if (updated[sectorId] === groupId) {
            updated[sectorId] = otherGroup.id;
          }
        });
        return updated;
      });
      setWorkloadGroups(prev => prev.filter(g => g.id !== groupId));
      setSelectedGroupId(otherGroup.id);
    }
  };

  // Math totals
  const totalCCTV = sites.reduce((acc, curr) => acc + curr.cctvTotal, 0);
  const totalCCTVOffline = sites.reduce((acc, curr) => acc + curr.cctvOffline, 0);
  const totalCCTVOnline = totalCCTV - totalCCTVOffline;

  // Filtered sites for map rendering
  const filteredSites = sites.filter(s => {
    if (filterKPI === 'CCTV_OFFLINE') return s.cctvOffline > 0;
    return true;
  });

  // Action: Play Clip
  const handlePlayClip = (clip) => {
    setSelectedClip(clip);
    setIsPlayingClip(true);
    setClipProgress(0);
  };

  // Action: Add Site (Tambah Titik)
  const handleAddSiteSubmit = (e) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const region = REGION_PRESETS[newSiteRegionIdx];
    const onlineCctv = Math.max(0, newSiteCctvCount - newSiteOfflineCctv);

    // Generate details list for cctvs
    const details = [];
    for (let i = 1; i <= onlineCctv; i++) {
      details.push({ id: `cam-new-${i}`, name: `CCTV ${newSiteName} ${i} (Online)`, type: 'cctv', status: 'ONLINE', feedDescription: `Kamera Pemantauan baru di ${newSiteName}`, clippings: [] });
    }
    for (let i = 1; i <= newSiteOfflineCctv; i++) {
      details.push({ id: `cam-new-off-${i}`, name: `CCTV ${newSiteName} B${i} (Trouble)`, type: 'cctv', status: 'OFFLINE', feedDescription: `Kamera offline baru`, clippings: [] });
    }

    const newSite = {
      id: newSiteName.toLowerCase().replace(/\s+/g, '-'),
      name: newSiteName,
      x: region.x,
      y: region.y,
      cctvTotal: Number(newSiteCctvCount),
      cctvOnline: onlineCctv,
      cctvOffline: Number(newSiteOfflineCctv),
      status: (newSiteOfflineCctv > 0) ? 'ALERT' : 'ONLINE',
      details
    };

    setSites(prev => [...prev, newSite]);
    setSelectedSite(newSite);

    // Reset inputs
    setNewSiteName('');
    setNewSiteCctvCount(4);
    setNewSiteOfflineCctv(0);

    // Dynamic logging
    const time = new Date().toLocaleTimeString('id-ID');
    setLogs(prev => [
      { time, message: `LOKASI TAMBANG BARU DITAMBAHKAN: ${newSite.name} di koordinat satelit ${region.x}, ${region.y}`, type: 'success' },
      ...prev
    ]);

    // Redirect to Map tab
    setFilterKPI('ALL');
    setActiveSubTab('map');
  };

  // Action: Add CCTV (Tambah Titik CCTV)
  const handleAddCctvSubmit = (e) => {
    e.preventDefault();
    if (!newCctvName.trim()) return;

    const targetSite = sites.find(s => s.id === newCctvSiteId);
    if (!targetSite) return;

    const newCctvObj = {
      id: `cam-${newCctvSiteId}-${Date.now()}`,
      name: newCctvName.trim(),
      type: 'cctv',
      status: newCctvStatus,
      feedDescription: newCctvDesc.trim() || `Kamera Pemantauan baru di ${targetSite.name}`,
      clippings: []
    };

    const updatedSites = sites.map(s => {
      if (s.id !== newCctvSiteId) return s;

      const isOffline = newCctvStatus === 'OFFLINE';
      return {
        ...s,
        cctvTotal: s.cctvTotal + 1,
        cctvOnline: s.cctvOnline + (isOffline ? 0 : 1),
        cctvOffline: s.cctvOffline + (isOffline ? 1 : 0),
        status: (s.cctvOffline + (isOffline ? 1 : 0) > 0) ? 'ALERT' : 'ONLINE',
        details: [...s.details, newCctvObj]
      };
    });

    setSites(updatedSites);

    // Sync selectedSite if it's the one we just updated
    const updatedSelectedSite = updatedSites.find(s => s.id === selectedSite.id);
    if (updatedSelectedSite) {
      setSelectedSite(updatedSelectedSite);
      // Auto set the new CCTV as active CCTV
      setActiveCctv(newCctvObj);
    }

    // Reset inputs
    setNewCctvName('');
    setNewCctvDesc('');
    setNewCctvStatus('ONLINE');

    // Dynamic logging
    const time = new Date().toLocaleTimeString('id-ID');
    setLogs(prev => [
      { time, message: `CCTV BARU DITAMBAHKAN: ${newCctvObj.name} di Sektor ${targetSite.name}`, type: 'success' },
      ...prev
    ]);

    // Redirect to Map tab
    setFilterKPI('ALL');
    setActiveSubTab('map');
  };

  // Action: Delete Sector
  const handleDeleteSite = (siteId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus sektor ini? Semua kamera di dalamnya juga akan terhapus.")) {
      const updatedSites = sites.filter(s => s.id !== siteId);
      setSites(updatedSites);

      const time = new Date().toLocaleTimeString('id-ID');
      setLogs(prev => [
        { time, message: `SEKTOR DIHAPUS: Sektor ID ${siteId} berhasil dihapus dari sistem`, type: 'info' },
        ...prev
      ]);

      if (selectedSite.id === siteId && updatedSites.length > 0) {
        setSelectedSite(updatedSites[0]);
      }
    }
  };

  // Action: Edit Sector
  const handleEditSiteSubmit = (siteId, newName) => {
    if (!newName.trim()) return;
    const updatedSites = sites.map(s => {
      if (s.id !== siteId) return s;
      return { ...s, name: newName.trim() };
    });
    setSites(updatedSites);
    setEditingSiteId(null);
    setEditingSiteName('');

    const updatedSelectedSite = updatedSites.find(s => s.id === selectedSite.id);
    if (updatedSelectedSite) {
      setSelectedSite(updatedSelectedSite);
    }
  };

  // Action: Delete CCTV
  const handleDeleteCctv = (siteId, cctvId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kamera CCTV ini?")) {
      const updatedSites = sites.map(s => {
        if (s.id !== siteId) return s;
        const targetCam = s.details.find(c => c.id === cctvId);
        if (!targetCam) return s;
        const isOffline = targetCam.status === 'OFFLINE';
        const updatedDetails = s.details.filter(c => c.id !== cctvId);
        return {
          ...s,
          cctvTotal: s.cctvTotal - 1,
          cctvOnline: s.cctvOnline - (isOffline ? 0 : 1),
          cctvOffline: s.cctvOffline - (isOffline ? 1 : 0),
          details: updatedDetails
        };
      });
      setSites(updatedSites);

      const time = new Date().toLocaleTimeString('id-ID');
      setLogs(prev => [
        { time, message: `KAMERA DIHAPUS: CCTV ID ${cctvId} berhasil dihapus dari sektor`, type: 'info' },
        ...prev
      ]);

      const updatedSelectedSite = updatedSites.find(s => s.id === selectedSite.id);
      if (updatedSelectedSite) {
        setSelectedSite(updatedSelectedSite);
        if (activeCctv && activeCctv.id === cctvId) {
          setActiveCctv(updatedSelectedSite.details[0] || null);
        }
      }
    }
  };

  // Action: Edit CCTV
  const handleEditCctvSubmit = (siteId, cctvId, newName, newDesc, newStatus) => {
    if (!newName.trim()) return;
    const updatedSites = sites.map(s => {
      if (s.id !== siteId) return s;
      const updatedDetails = s.details.map(c => {
        if (c.id !== cctvId) return c;
        return { ...c, name: newName.trim(), feedDescription: newDesc.trim(), status: newStatus };
      });

      const cctvTotal = updatedDetails.length;
      const cctvOffline = updatedDetails.filter(c => c.status === 'OFFLINE').length;
      const cctvOnline = cctvTotal - cctvOffline;

      return {
        ...s,
        cctvTotal,
        cctvOnline,
        cctvOffline,
        status: (cctvOffline > 0) ? 'ALERT' : 'ONLINE',
        details: updatedDetails
      };
    });
    setSites(updatedSites);
    setEditingCctvId(null);

    const updatedSelectedSite = updatedSites.find(s => s.id === selectedSite.id);
    if (updatedSelectedSite) {
      setSelectedSite(updatedSelectedSite);
      const updatedCam = updatedSelectedSite.details.find(c => c.id === cctvId);
      if (updatedCam && activeCctv && activeCctv.id === cctvId) {
        setActiveCctv(updatedCam);
      }
    }
  };

  // Action: Add User
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newFullName.trim()) return;

    const newUser = {
      id: Date.now(),
      username: newUsername.toLowerCase().trim(),
      fullName: newFullName,
      role: newUserRole,
      status: 'Aktif'
    };

    setUsers(prev => [...prev, newUser]);
    setShowAddUserModal(false);
    setNewUsername('');
    setNewFullName('');

    const time = new Date().toLocaleTimeString('id-ID');
    setLogs(prev => [
      { time, message: `PENGGUNA BARU DIBUAT: ${newUser.fullName} dengan hak akses ${newUser.role}`, type: 'info' },
      ...prev
    ]);
  };

  // Action: Delete User
  const handleDeleteUser = (userId, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus hak akses untuk ${name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      const time = new Date().toLocaleTimeString('id-ID');
      setLogs(prev => [
        { time, message: `HAK AKSES DICABUT: ${name} dihapus dari daftar pengguna`, type: 'error' },
        ...prev
      ]);
    }
  };

  // Helper: Trigger KPI Filters and Route to Map
  const triggerKPIFilter = (filterType) => {
    setFilterKPI(filterType);
    setActiveSubTab('map');
  };

  // Filter CCTV list for Right Panel Detail
  const sectorCctvs = selectedSite.details.filter(d => d.type === 'cctv');
  const cctvAttributeBadgeStyle = {
    fontSize: '8px',
    fontWeight: 700,
    background: '#E0F2FE',
    color: '#0369a1',
    padding: '1px 4px',
    borderRadius: '3px'
  };

  // Gather all incidents/clippings globally from all CCTVs in all sites
  const allIncidents = sites.flatMap(s =>
    s.details
      .filter(d => d.type === 'cctv')
      .flatMap(cam =>
        (cam.clippings || []).map(clip => ({
          ...clip,
          sectorId: s.id,
          sectorName: s.name,
          cameraObj: cam
        }))
      )
  ).sort((a, b) => b.time.localeCompare(a.time));

  const sidebarWidth = sidebarCollapsed ? 84 : 260;
  const navItems = [
    { key: 'overview', label: 'Utama', icon: Home, onClick: () => setActiveSubTab('overview') },
    { key: 'map', label: 'Peta Pemantauan', icon: Map, onClick: () => { setActiveSubTab('map'); setFilterKPI('ALL'); } },
    { key: 'live-cctv', label: 'Live Multi-CCTV', icon: Camera, onClick: () => setActiveSubTab('live-cctv') },
    { key: 'policy-management', label: 'Policy Studio', icon: Cpu, onClick: () => setActiveSubTab('policy-management') },
    { key: 'incident-center', label: 'Incident Center', icon: ShieldAlert, onClick: () => setActiveSubTab('incident-center') },
    { key: 'analysis', label: 'Analisis', icon: BarChart3, onClick: () => setActiveSubTab('analysis') },
    { key: 'admin', label: 'Sektor Management', icon: Settings, onClick: () => setActiveSubTab('admin') },
    { key: 'camera-management', label: 'Camera Management', icon: Video, onClick: () => setActiveSubTab('camera-management') }
  ];

  const dashboardTabProps = {
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
    handlePlayClip,
    filteredSites,
    selectedSite,
    filterKPI,
    setFilterKPI,
    sectorCctvs,
    activeCctv,
    isPlayingClip,
    selectedClip,
    clipProgress,
    setClipProgress,
    getCctvSectorGroup,
    cctvAttributeBadgeStyle,
    adminSection,
    setAdminSection,
    manageTab,
    setManageTab,
    addMode,
    setAddMode,
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
    handleDeleteUser,
    selectedCctvIds,
    setSelectedCctvIds,
    gridSize,
    setGridSize,
    workloadGroups,
    workloadSelectedSiteId,
    setWorkloadSelectedSiteId,
    sectorGroupAssignments,
    handleAssignSectorGroup,
    setShowPolicyModal
  };

  return (
    <main style={{ minHeight: '100vh', background: '#F4F6FA', paddingBottom: '60px' }}>

      {/* ===== DASHBOARD SIDEBAR ===== */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: `${sidebarWidth}px`,
        background: 'var(--brand-dark)',
        borderRight: '2.5px solid var(--brand-secondary)',
        boxShadow: '4px 0 20px rgba(0,0,0,0.16)',
        padding: sidebarCollapsed ? '18px 12px' : '18px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        zIndex: 50,
        transition: 'width 0.25s ease, padding 0.25s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: sidebarCollapsed ? 'center' : 'space-between', gap: '12px' }}>
          <div style={{
            // background: 'rgba(255,255,255,0.95)',
            padding: sidebarCollapsed ? '6px' : '6px 10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: sidebarCollapsed ? '44px' : '96px',
            height: '42px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <img src={logoImage} alt="PamAgents" style={{ height: sidebarCollapsed ? '28px' : '30px', width: 'auto', maxWidth: sidebarCollapsed ? '32px' : '120px', objectFit: 'contain' }} />
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(true)}
              title="Collapse sidebar"
              style={{
                width: '34px', height: '34px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(255,255,255,0.06)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            title="Extend sidebar"
            style={{
              width: '44px', height: '34px', alignSelf: 'center', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(255,255,255,0.06)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <ChevronRight size={18} />
          </button>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.key;
            
            let header = null;
            if (item.key === 'map') {
              header = sidebarCollapsed ? (
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
              ) : (
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.36)', padding: '10px 6px 4px', fontWeight: 700 }}>CCTV Monitoring</div>
              );
            } else if (item.key === 'policy-management') {
              header = sidebarCollapsed ? (
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
              ) : (
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.36)', padding: '10px 6px 4px', fontWeight: 700 }}>Agents</div>
              );
            } else if (item.key === 'admin') {
              header = sidebarCollapsed ? (
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '6px 0' }} />
              ) : (
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.36)', padding: '10px 6px 4px', fontWeight: 700 }}>Settings</div>
              );
            }

            return (
              <div key={item.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {header}
                <button
                  onClick={item.onClick}
                  title={sidebarCollapsed ? item.label : undefined}
                  style={{
                    background: isActive ? 'rgba(255,214,0,0.14)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,214,0,0.45)' : 'transparent'}`,
                    borderRadius: '10px',
                    padding: sidebarCollapsed ? '12px 0' : '12px 14px',
                    color: isActive ? 'var(--brand-secondary)' : 'rgba(255,255,255,0.72)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    minHeight: '44px',
                    width: '100%'
                  }}
                >
                  <Icon size={18} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </div>
            );
          })}
        </nav>

        <div style={{
          marginTop: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%'
        }}>
          {/* Help Button */}
          <button
            title={sidebarCollapsed ? 'Bantuan & FAQ' : undefined}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.72)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: sidebarCollapsed ? '6px 0' : '6px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 700,
              minHeight: '36px',
              width: '100%'
            }}
          >
            <HelpCircle size={18} />
            {!sidebarCollapsed && <span>Bantuan</span>}
          </button>

          {/* Profile Card */}
          <div style={{
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            padding: sidebarCollapsed ? '10px 0' : '12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: sidebarCollapsed ? 'center' : 'stretch',
            gap: '10px',
            background: 'rgba(255,255,255,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '8px',
              color: 'white',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <Clock size={14} color="#FFC107" />
              {!sidebarCollapsed && <span>{timeStr}</span>}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              gap: '10px'
            }}>
              {!sidebarCollapsed && (
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ color: 'white', fontSize: '12.5px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alvin Nugraha</span>
                  <span style={{ color: '#FFC107', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>Super Admin</span>
                </div>
              )}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#FFC107',
                color: 'var(--brand-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                border: '1.5px solid rgba(255,255,255,0.2)',
                flexShrink: 0
              }}>
                AN
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Keluar dari Portal' : undefined}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.72)',
              borderRadius: '10px',
              cursor: 'pointer',
              padding: sidebarCollapsed ? '6px 0' : '6px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
              fontSize: '13px',
              fontWeight: 700,
              minHeight: '36px',
              width: '100%'
            }}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      <div style={{ marginLeft: `${sidebarWidth}px`, transition: 'margin-left 0.25s ease', minHeight: '100vh' }}>
        {/* ===== TAB 1: RINGKASAN UTAMA (OVERVIEW) ===== */}
        {activeSubTab === 'overview' && (
          <OverviewTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 2: PETA PEMANTAUAN (SATELLITE & VIDEO) ===== */}
        {activeSubTab === 'map' && (
          <MapMonitoringTab {...dashboardTabProps} />
        )}

        {/* ===== TAB: ADMINISTRASI (KELOLA TITIK + HAK AKSES) ===== */}
        {activeSubTab === 'admin' && (
          <AdminTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 5: MULTI-STREAM LIVE CCTV ===== */}
        {activeSubTab === 'live-cctv' && (
          <LiveMultiCctvTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 6: POLICY MANAGEMENT ===== */}
        {activeSubTab === 'policy-management' && (
          <PolicyManagementTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 7: INCIDENT CENTER ===== */}
        {activeSubTab === 'incident-center' && (
          <IncidentCenterTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 8: ANALISIS ===== */}
        {activeSubTab === 'analysis' && (
          <AnalysisTab {...dashboardTabProps} />
        )}

        {/* ===== TAB 9: CAMERA MANAGEMENT ===== */}
        {activeSubTab === 'camera-management' && (
          <CameraManagementTab {...dashboardTabProps} />
        )}

      </div>

      {/* ===== MODAL: KELOLA POLICY GROUP ===== */}
      {showPolicyModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,29,58,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%',
            maxWidth: '960px', height: '85vh', maxHeight: '800px', display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 64px rgba(0,0,0,0.25)', border: '1px solid #E3E6EE',
            overflow: 'hidden', position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 32px', borderBottom: '1px solid #E3E6EE' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* {showRulePreview && (
                  <button
                    onClick={() => setShowRulePreview(false)}
                    style={{ background: 'none', border: '1.5px solid #E3E6EE', color: 'var(--outline)', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <span style={{ fontSize: '14px' }}>&#8592;</span> Kembali
                  </button>
                )} */}
                <div>
                  <h3 style={{ margin: 0, color: 'var(--brand-dark)', fontWeight: 800, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={20} color="var(--brand-primary)" />
                    {showRulePreview ? 'Preview Konfigurasi AI Skills' : 'Pengaturan AI Skills'}
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--outline)' }}>
                    {showRulePreview
                      ? 'Konfigurasi berikut dihasilkan secara otomatis. Terapkan atau kembali untuk mengedit.'
                      : 'Definisikan group template dan kelola rule/skill deteksi AI di dalamnya.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPolicyModal(false);
                  setShowRulePreview(false);
                  setEditingSkillId(null);
                  setSkillCode('');
                  setSkillDesc('');
                  setSkillGuidelines('');
                  setIsCreatingGroup(false);
                }}
                style={{
                  background: 'none', border: 'none', fontSize: '20px', fontWeight: 600,
                  color: 'var(--outline)', cursor: 'pointer', padding: '4px 8px'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>

              <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
                {showRulePreview ? (
                  isPreviewLoading ? (
                    /* ===== PREVIEW LOADING VIEW ===== */
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '40px 20px',
                      flex: 1,
                      minHeight: '350px',
                      textAlign: 'center'
                    }}>
                      <style>{`
                        @keyframes spin {
                          0% { transform: rotate(0deg); }
                          100% { transform: rotate(360deg); }
                        }
                        @keyframes pulseScale {
                          0%, 100% { transform: scale(1); opacity: 0.8; }
                          50% { transform: scale(1.15); opacity: 1; }
                        }
                      `}</style>
                      <div style={{
                        position: 'relative',
                        marginBottom: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          position: 'absolute',
                          width: '72px',
                          height: '72px',
                          borderRadius: '50%',
                          background: 'rgba(13, 71, 161, 0.08)',
                          animation: 'pulseScale 2s infinite ease-in-out'
                        }} />
                        <Loader2 
                          size={40} 
                          color="var(--brand-primary)" 
                          style={{ 
                            animation: 'spin 1.2s linear infinite',
                            zIndex: 2
                          }} 
                        />
                      </div>
                      <h4 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontSize: '16px', fontWeight: 700 }}>
                        Menganalisis Kode Aturan...
                      </h4>
                      <p style={{ margin: 0, color: 'var(--outline)', fontSize: '13px', maxWidth: '320px', lineHeight: 1.5 }}>
                        AI sedang memvalidasi instruksi keselamatan, kepatuhan, dan tingkat prioritas event...
                      </p>
                    </div>
                  ) : (
                    /* ===== PREVIEW VIEW ===== */
                    (() => {
                      const text = ((skillDesc || '') + ' ' + (skillGuidelines || '') + ' ' + (skillCode || '')).toLowerCase();
                      
                      // Priority evaluation
                      let priority = 'low';
                      if (text.includes('bahaya') || text.includes('fatal') || text.includes('no_human') || text.includes('terlarang') || text.includes('blasting') || text.includes('kecelakaan') || text.includes('critical') || text.includes('kritis')) {
                        priority = 'high';
                      } else if (text.includes('helm') || text.includes('sepatu') || text.includes('rompi') || text.includes('apd') || text.includes('ppe') || text.includes('tidak memakai') || text.includes('unsafe') || text.includes('k3') || text.includes('safety')) {
                        priority = 'medium';
                      }

                      // Dynamic variables based on priority
                      let priorityLabel = 'Low';
                      let priorityColor = '#10B981'; // Green
                      let preAlarm = '5';
                      let postAlarm = '5';
                      let evidenceText = 'Snapshot Tunggal';
                      let retentionText = '7 Hari';
                      let thresholdVal = 0.60;
                      let channels = [
                        { label: 'Telegram', active: false },
                        { label: 'Email', active: true },
                        { label: 'HT OCC Gateway', active: false },
                        { label: 'Dashboard Alert', active: true }
                      ];

                      if (priority === 'high') {
                        priorityLabel = 'High';
                        priorityColor = '#EF4444'; // Red
                        preAlarm = '3';
                        postAlarm = '15';
                        evidenceText = 'Video Clip (1 Menit)';
                        retentionText = 'Permanen (Anti-tamper)';
                        thresholdVal = 0.70;
                        channels = [
                          { label: 'Telegram', active: true },
                          { label: 'Email', active: true },
                          { label: 'HT OCC Gateway', active: true },
                          { label: 'Dashboard Alert', active: true }
                        ];
                      } else if (priority === 'medium') {
                        priorityLabel = 'Medium';
                        priorityColor = '#F59E0B'; // Orange/Yellow
                        preAlarm = '5';
                        postAlarm = '10';
                        evidenceText = 'Snapshot Burst (5 Foto)';
                        retentionText = '14 Hari';
                        thresholdVal = 0.65;
                        channels = [
                          { label: 'Telegram', active: true },
                          { label: 'Email', active: true },
                          { label: 'HT OCC Gateway', active: false },
                          { label: 'Dashboard Alert', active: true }
                        ];
                      }

                      // Target Objects extraction
                      let targetObjects = ['person'];
                      if (text.includes('helm') || text.includes('sepatu') || text.includes('rompi') || text.includes('apd') || text.includes('ppe')) {
                        const objs = ['person'];
                        if (text.includes('helm')) objs.push('helmet');
                        if (text.includes('rompi') || text.includes('vest')) objs.push('safety_vest');
                        if (text.includes('sepatu') || text.includes('shoes')) objs.push('safety_shoes');
                        targetObjects = objs;
                      } else if (text.includes('truck') || text.includes('truk') || text.includes('mobil') || text.includes('excavator') || text.includes('heavy') || text.includes('alat berat')) {
                        const objs = [];
                        if (text.includes('truck') || text.includes('truk')) objs.push('dump_truck');
                        if (text.includes('excavator')) objs.push('excavator');
                        if (text.includes('mobil') || text.includes('car')) objs.push('light_vehicle');
                        if (objs.length === 0) objs.push('heavy_equipment');
                        targetObjects = objs;
                      }

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                          {/* Preview rule identity */}
                          <div style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '12px', padding: '16px 20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Rule yang dikonfigurasi</div>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-dark)' }}>{skillDesc || 'Titik ini ga boleh ada manusia (Bahaya)'}</div>
                            <div style={{ fontSize: '11px', color: 'var(--outline)', fontFamily: 'monospace', marginTop: '2px' }}>{skillCode ? skillCode.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'no_human_zone'}</div>
                            {skillGuidelines && (
                              <div style={{ marginTop: '12px', borderTop: '1px dashed #E3E6EE', paddingTop: '10px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>Prompt Agent (Petunjuk Deteksi)</div>
                                <div style={{ fontSize: '12.5px', color: 'var(--brand-dark)', fontStyle: 'italic', lineHeight: 1.4 }}>"{skillGuidelines}"</div>
                              </div>
                            )}
                          </div>

                          {/* Priority & Evidence Rules */}
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Prioritas & Aturan Bukti</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <div style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', textAlign: 'center', background: priorityColor, border: `1.5px solid ${priorityColor}`, fontSize: '12.5px', fontWeight: 700, color: 'white' }}>
                                {priorityLabel} Priority
                              </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px', marginTop: '10px' }}>
                              <div style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '10px', color: 'var(--outline)', fontWeight: 600 }}>Masa Simpan Bukti</div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', marginTop: '2px' }}>{retentionText}</div>
                              </div>
                              <div style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '10px', color: 'var(--outline)', fontWeight: 600 }}>Tipe Bukti (Evidence)</div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', marginTop: '2px' }}>{evidenceText}</div>
                              </div>
                              <div style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px', padding: '10px 12px' }}>
                                <div style={{ fontSize: '10px', color: 'var(--outline)', fontWeight: 600 }}>Human-in-the-Loop</div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', marginTop: '2px' }}>Wajib Validasi</div>
                              </div>
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--outline)' }}>Direkomendasikan secara otomatis berdasarkan klasifikasi safety K3 PAMA.</p>
                          </div>

                          <div style={{ borderTop: '1px solid #F0F2F7' }} />

                          {/* Time Bounds */}
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Durasi Waktu</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              {[
                                { label: 'Sebelum Alarm', value: preAlarm, sub: 'Detik sebelum notifikasi dikirim' },
                                { label: 'Setelah Alarm', value: postAlarm, sub: 'Detik hold-time setelah event' }
                              ].map(t => (
                                <div key={t.label} style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '10px', padding: '14px 16px' }}>
                                  <div style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600, marginBottom: '6px' }}>{t.label}</div>
                                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                    <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--brand-dark)', fontFamily: 'monospace', lineHeight: 1 }}>{t.value}</span>
                                    <span style={{ fontSize: '12px', color: 'var(--outline)', fontWeight: 600 }}>detik</span>
                                  </div>
                                  <div style={{ fontSize: '10.5px', color: 'var(--outline)', marginTop: '4px' }}>{t.sub}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div style={{ borderTop: '1px solid #F0F2F7' }} />

                          {/* Target Objects & Accuracy Threshold */}
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Target Objek & Batas Akurasi (Threshold)</label>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '10px', padding: '14px 16px', gap: '20px', flexWrap: 'wrap' }}>
                              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {targetObjects.map(obj => (
                                  <span key={obj} style={{
                                    background: 'rgba(13, 71, 161, 0.06)',
                                    border: '1px solid rgba(13, 71, 161, 0.15)',
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: 'var(--brand-primary)',
                                    fontFamily: 'monospace'
                                  }}>
                                    {obj}
                                  </span>
                                ))}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                <span style={{ fontSize: '11px', color: 'var(--outline)', fontWeight: 600 }}>Confidence Threshold:</span>
                                <span style={{
                                  background: 'white',
                                  border: '1.5px solid #E3E6EE',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '12.5px',
                                  fontWeight: 700,
                                  color: 'var(--brand-dark)',
                                  fontFamily: 'monospace'
                                }}>
                                  {(thresholdVal * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                            <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--outline)' }}>
                              Batas akurasi minimum untuk mengurangi false positive sebelum SmolVLM menganalisis video.
                            </p>
                          </div>

                          <div style={{ borderTop: '1px solid #F0F2F7' }} />

                          {/* Response + Target Group */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Saluran Respons</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {channels.map(ch => (
                                  <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, border: `2px solid ${ch.active ? 'var(--brand-primary)' : '#C3C6D4'}`, background: ch.active ? 'var(--brand-primary)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {ch.active && <span style={{ color: 'white', fontSize: '10px', fontWeight: 900, lineHeight: 1 }}>&#10003;</span>}
                                    </div>
                                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--brand-dark)', flex: 1 }}>{ch.label}</span>
                                    <span style={{ fontSize: '10px', fontWeight: 700, color: ch.active ? '#10B981' : 'var(--outline)', background: ch.active ? '#F0FDF4' : '#F2F4F7', padding: '2px 7px', borderRadius: '3px' }}>{ch.active ? 'ON' : 'OFF'}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Target Camera Group</label>
                              <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1.5px solid var(--brand-primary)', borderRadius: '8px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '2px' }}>Grup Area Bahaya</div>
                                <div style={{ fontSize: '11px', color: 'var(--outline)' }}>2 rule aktif — Pit A, Crusher</div>
                              </div>
                            </div>
                          </div>

                          {/* Preview action buttons */}
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid #E3E6EE' }}>
                            <button
                              onClick={() => setShowRulePreview(false)}
                              style={{ background: 'white', color: 'var(--on-surface-variant)', border: '1.5px solid #E3E6EE', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >Kembali ke Form</button>
                            <button
                              onClick={() => setShowRulePreview(false)}
                              style={{ background: 'white', color: 'var(--brand-primary)', border: '1.5px solid var(--brand-primary)', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                            >Edit</button>
                            <button
                              onClick={() => { setShowRulePreview(false); }}
                              style={{ background: 'var(--brand-primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(13,71,161,0.2)' }}
                            >Terapkan Konfigurasi</button>
                          </div>
                        </div>
                      );
                    })()
                  )
                ) : (
                  /* ===== FORM VIEW ===== */
                  (() => {
                    const activeGroup = workloadGroups.find(g => g.id === selectedGroupId);
                    if (!activeGroup) return null;

                    return (
                      <>
                        {/* Add/Edit Skill Form */}
                        <div style={{ background: '#FAFBFD', border: '1px solid #E3E6EE', borderRadius: '12px', padding: '20px' }}>
                          <h5 style={{ margin: '0 0 16px', color: 'var(--brand-dark)', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {editingSkillId ? '📝 Edit Rule AI' : '➕ Tambah Rule AI Baru'}
                          </h5>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '4px' }}>Event Code</label>
                                <input
                                  type="text"
                                  placeholder="e.g. no_human_zone"
                                  value={skillCode}
                                  onChange={(e) => setSkillCode(e.target.value)}
                                  style={{
                                    width: '100%', padding: '10px', fontSize: '12.5px',
                                    border: '1.5px solid #C3C6D4', borderRadius: '6px', outline: 'none'
                                  }}
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '4px' }}>Deskripsi Singkat</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Area terlarang untuk operator jalan kaki"
                                  value={skillDesc}
                                  onChange={(e) => setSkillDesc(e.target.value)}
                                  style={{
                                    width: '100%', padding: '10px', fontSize: '12.5px',
                                    border: '1.5px solid #C3C6D4', borderRadius: '6px', outline: 'none'
                                  }}
                                />
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '4px' }}>Prompt Agent</label>
                              <textarea
                                placeholder="Berikan instruksi operasional untuk AI agent, misal: Cari objek manusia menggunakan rompi oranye di dalam area marka kuning..."
                                value={skillGuidelines}
                                onChange={(e) => setSkillGuidelines(e.target.value)}
                                style={{
                                  width: '100%', padding: '10px', fontSize: '12.5px', minHeight: '94px',
                                  border: '1.5px solid #C3C6D4', borderRadius: '6px', outline: 'none',
                                  fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.4
                                }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            {editingSkillId && (
                              <button
                                onClick={() => {
                                  setEditingSkillId(null);
                                  setSkillCode('');
                                  setSkillDesc('');
                                  setSkillGuidelines('');
                                }}
                                style={{
                                  background: 'white', color: 'var(--brand-dark)',
                                  border: '1.5px solid #E3E6EE', borderRadius: '8px', padding: '8px 16px',
                                  fontSize: '12.5px', fontWeight: 600, cursor: 'pointer'
                                }}
                              >
                                Batal
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setShowRulePreview(true);
                                setIsPreviewLoading(true);
                                setTimeout(() => {
                                  setIsPreviewLoading(false);
                                }, 2000);
                              }}
                              style={{
                                background: 'white', color: 'var(--brand-primary)',
                                border: '1.5px solid var(--brand-primary)',
                                borderRadius: '8px', padding: '8px 18px',
                                fontSize: '12.5px', fontWeight: 700,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              Preview Rule
                            </button>
                          </div>
                        </div>

                        {/* Skills List in Active Group */}
                        <div>
                          <h5 style={{ margin: '0 0 12px', color: 'var(--outline)', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            AI Skills ({activeGroup.skills.length})
                          </h5>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {activeGroup.skills.length === 0 ? (
                              <div style={{ padding: '32px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center', border: '1.5px dashed #E3E6EE' }}>
                                <span style={{ fontSize: '13px', color: 'var(--outline)', fontStyle: 'italic' }}>
                                  Group policy ini belum memiliki rule deteksi AI. Tambahkan rule di atas.
                                </span>
                              </div>
                            ) : (
                              activeGroup.skills.map(skill => (
                                <div
                                  key={skill.id}
                                  style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '16px 20px', background: 'white', border: '1.5px solid #E3E6EE',
                                    borderRadius: '12px'
                                  }}
                                >
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--brand-dark)' }}>
                                        {skill.description}
                                      </span>
                                      <code style={{ fontSize: '10px', background: '#EEF2F6', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                        {skill.code}
                                      </code>
                                    </div>
                                    {/* {skill.guidelines && (
                                      <span style={{ fontSize: '12px', color: 'var(--outline)', fontStyle: 'italic', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        Guidelines: {skill.guidelines}
                                      </span>
                                    )} */}
                                  </div>

                                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button
                                      onClick={() => handleEditSkillClick(skill)}
                                      style={{
                                        background: '#F4F6FA', border: '1px solid #E3E6EE', borderRadius: '6px',
                                        width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer', color: 'var(--brand-dark)'
                                      }}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSkillFromGroup(activeGroup.id, skill.id)}
                                      style={{
                                        background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px',
                                        width: '32px', height: '32px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', cursor: 'pointer', color: '#EF4444'
                                      }}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL: TAMBAH PENGGUNA ===== */}
      {showAddUserModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(11,29,58,0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px', width: '100%',
            maxWidth: '420px', padding: '32px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
            border: '1px solid #E3E6EE'
          }}>
            <h3 style={{ margin: '0 0 8px', color: 'var(--brand-dark)', fontWeight: 700 }}>Tambah Pengguna Baru</h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--outline)' }}>
              Berikan delegasi hak akses monitoring pada operator/supervisor baru.
            </p>

            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  placeholder="Contoh: budi.s, sitiwijaya"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '14px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hak Akses (Role)</label>
                <select
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #C3C6D4', borderRadius: '8px', fontSize: '14px', background: 'white' }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Operator">Operator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  style={{
                    flex: 1, padding: '12px', border: '1.5px solid #C3C6D4', borderRadius: '8px',
                    background: 'white', color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', border: 'none', borderRadius: '8px',
                    background: 'var(--brand-primary)', color: 'white', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Style settings */}
      <style>{`
        @keyframes tabFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-tab-fade {
          animation: tabFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .hover-pop:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(13,71,161,0.06) !important;
        }

        @keyframes mapPulse {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .user-table-row:hover {
          background: #FAFBFD;
        }

        @keyframes flashRed {
          0%, 100% { border-color: #ff4d4d; box-shadow: 0 0 10px rgba(255,77,77,0.4); }
          50% { border-color: #ff3333; box-shadow: 0 0 16px rgba(255,77,77,0.6); }
        }

        @media (max-width: 900px) {
          .db-layout-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </main>
  );
}
