import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, Server, ShieldAlert, LogOut, MapPin, CheckCircle,
  WifiOff, Plus, UserPlus, Users, Map, Activity, Trash2, Clock,
  Home, ShieldCheck, Cpu, Terminal, Play, RotateCcw, AlertTriangle, Edit, Settings
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import cctvImg1 from '../assets/1.webp';
import cctvImg2 from '../assets/2.jpg';
import cctvImg3 from '../assets/3.png';
import cctvImg4 from '../assets/4.png';

// Data Lokasi Awal - Sektor Pertambangan Batubara Astra
const INITIAL_SITES = [
  {
    id: 'pit-a',
    name: 'Pit A (Quarry Barat)',
    x: '25%',
    y: '45%',
    cctvTotal: 12,
    cctvOnline: 12,
    cctvOffline: 0,
    status: 'ONLINE',
    details: [
      {
        id: 'cam-pit-a1',
        name: 'CCTV Excavator Shovel 01',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Excavator PC2000 loading coal into haul trucks.',
        clippings: [
          { id: 'clip-a2', time: '12:50:33', title: 'Safety Violation', camera: 'CCTV Excavator Shovel 01', duration: '10s', description: 'Pekerja melewati batas keamanan', type: 'warning' }
        ]
      },
      {
        id: 'cam-pit-a2',
        name: 'CCTV Haul Road Incline A',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Heavy truck hauling route monitoring.',
        clippings: [
          { id: 'clip-a1', time: '13:14:02', title: 'Haul Truck Overspeed', camera: 'CCTV Haul Road Incline A', duration: '15s', description: 'Truk HD785 terdeteksi melaju di atas batas 30 km/jam.', type: 'danger' }
        ]
      },
      {
        id: 'cam-pit-a3',
        name: 'CCTV Pit Face A Area',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'General wall stability monitoring.',
        clippings: [
          { id: 'clip-a3', time: '11:20:10', title: 'Wall Minor Crack Alert', camera: 'CCTV Pit Face A Area', duration: '12s', description: 'Retakan kecil terdeteksi pada dinding Pit Barat oleh sensor AI.', type: 'warning' }
        ]
      }
    ]
  },
  {
    id: 'stockpile-utara',
    name: 'Stockpile Utara',
    x: '68%',
    y: '28%',
    cctvTotal: 8,
    cctvOnline: 8,
    cctvOffline: 0,
    status: 'ONLINE',
    details: [
      {
        id: 'cam-sp-1',
        name: 'CCTV Conveyor Feed SP1',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Conveyor belt transporting coal pile to crusher.',
        clippings: [
          { id: 'clip-sp1', time: '13:01:10', title: 'Safety Violation', camera: 'CCTV Conveyor Feed SP1', duration: '12s', description: 'Objek manusia terdeteksi melewati batas dari area berbahaya', type: 'info' }
        ]
      },
      {
        id: 'cam-sp-2',
        name: 'CCTV Loading Gate SP2',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Truck weightbridge loading area monitoring.',
        clippings: [
          { id: 'clip-sp2', time: '10:45:00', title: 'Overload Truck Blocked', camera: 'CCTV Loading Gate SP2', duration: '14s', description: 'Truk bermuatan 50 ton dilarang melintas karena melebihi tonase jembatan.', type: 'danger' }
        ]
      },
      // {
      //   id: 'cam-sp-3',
      //   name: 'CCTV Stacker Reclaimer SP3',
      //   type: 'cctv',
      //   status: 'OFFLINE',
      //   feedDescription: 'Stacker reclaimer vehicle stacking coal.',
      //   clippings: [
      //     { id: 'clip-sp2', time: '10:45:00', title: 'Overload Truck Blocked', camera: 'CCTV Loading Gate SP2', duration: '14s', description: 'Truk bermuatan 50 ton dilarang melintas karena melebihi tonase jembatan.', type: 'danger' }
      //   ]
      // }
    ]
  },
  {
    id: 'workshop-main',
    name: 'Workshop & Main Office',
    x: '45%',
    y: '55%',
    cctvTotal: 6,
    cctvOnline: 6,
    cctvOffline: 0,
    status: 'ONLINE',
    details: [
      {
        id: 'cam-ws-1',
        name: 'CCTV Heavy Equipment Bay 1',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Mechanics working on dump truck wheel assemblies.',
        clippings: [
          { id: 'clip-ws1', time: '13:10:45', title: 'PPE Violation Filtered', camera: 'CCTV Heavy Equipment Bay 1', duration: '8s', description: 'Personel tanpa helm terdeteksi AI (Telah dikoreksi otomatis dalam 3s).', type: 'warning' }
        ]
      },
      {
        id: 'cam-ws-2',
        name: 'CCTV Office Lobby',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Administrative office receptionist gate monitoring.',
        clippings: [
          { id: 'clip-ws2', time: '09:15:30', title: 'VIP Guest Arrival', camera: 'CCTV Office Lobby', duration: '10s', description: 'Kunjungan Direksi Astra Group terdeteksi sistem ANPR & RFID.', type: 'info' }
        ]
      },
      {
        id: 'cam-ws-3',
        name: 'CCTV Workshop Parking 3',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Light vehicle parking area outside main workshop.',
        clippings: []
      }
    ]
  },
  {
    id: 'processing-crusher',
    name: 'Processing Plant (Crusher)',
    x: '75%',
    y: '60%',
    cctvTotal: 4,
    cctvOnline: 2,
    cctvOffline: 2,
    status: 'ALERT',
    details: [
      {
        id: 'cam-cr-1',
        name: 'CCTV Crusher Hopper (OFFLINE)',
        type: 'cctv',
        status: 'OFFLINE',
        feedDescription: 'Main feeder crusher monitor (No Signal).',
        clippings: [
          { id: 'clip-cr1', time: '13:16:30', title: 'CCTV Signal Disconnection', camera: 'CCTV Crusher Hopper (OFFLINE)', duration: '5s', description: 'WARNING: Kamera Crusher Hopper terputus dari jaringan.', type: 'danger' }
        ]
      },
      {
        id: 'cam-cr-2',
        name: 'CCTV Conveyor Line C',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Conveyor line feeding primary crusher.',
        clippings: [
          { id: 'clip-cr3', time: '08:40:12', title: 'Belt Misalignment Alert', camera: 'CCTV Conveyor Line C', duration: '15s', description: 'Sensor AI mendeteksi pergeseran kemiringan belt conveyor.', type: 'warning' }
        ]
      },
      {
        id: 'cam-cr-3',
        name: 'CCTV Screen Deck Feed (OFFLINE)',
        type: 'cctv',
        status: 'OFFLINE',
        feedDescription: 'Screening plant vibrating screens (Offline).',
        clippings: []
      }
    ]
  },
  {
    id: 'main-security-gate',
    name: 'Main Security Gate',
    x: '15%',
    y: '75%',
    cctvTotal: 2,
    cctvOnline: 2,
    cctvOffline: 0,
    status: 'ONLINE',
    details: [
      {
        id: 'cam-gate-1',
        name: 'CCTV Main Gate Barrier',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Entrance check-point boom gates.',
        clippings: [
          { id: 'clip-g2', time: '12:55:10', title: 'Blacklist Vehicle Detected', camera: 'CCTV Main Gate Barrier', duration: '15s', description: 'Plat nomor B 9123 XYZ (Blacklist) mencoba melintas masuk.', type: 'danger' }
        ]
      },
      {
        id: 'cam-gate-2',
        name: 'CCTV Weighbridge Scale',
        type: 'cctv',
        status: 'ONLINE',
        feedDescription: 'Incoming truck scale area monitor.',
        clippings: [
          { id: 'clip-g3', time: '11:05:00', title: 'Scale Sensor Offline', camera: 'CCTV Weighbridge Scale', duration: '8s', description: 'Terjadi kehilangan kalibrasi sensor timbang berat truk.', type: 'warning' }
        ]
      }
    ]
  }
];

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

  // Tab Active State ('overview' | 'map' | 'add-site' | 'users' | 'live-cctv' | 'workload')
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [adminSection, setAdminSection] = useState('sites');

  // Workload States
  const [workloadSelectedSiteId, setWorkloadSelectedSiteId] = useState(INITIAL_SITES[0]?.id || '');

  // Workload Groups & Assignments States (AWS Security Group concept)
  const [workloadGroups, setWorkloadGroups] = useState(INITIAL_WORKLOAD_GROUPS);
  const [sectorGroupAssignments, setSectorGroupAssignments] = useState(INITIAL_SECTOR_GROUP_ASSIGNMENTS);

  // Group Policy Manager Modal States
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showRulePreview, setShowRulePreview] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState('group-danger');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillCode, setSkillCode] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillGuidelines, setSkillGuidelines] = useState('');
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Expanded CCTV card in Workload Tab
  const [expandedCctvId, setExpandedCctvId] = useState(null);

  // VLM Stream Contexts State
  const [cctvContexts, setCctvContexts] = useState({
    'cam-pit-a1': 'Coal quarry excavation area with high activity of PC2000 excavators and heavy haul trucks loading coal.',
    'cam-pit-a2': 'Main haul road incline leading to the western quarry pit. Heavy mining trucks transport coal uphill.',
    'cam-cr-1': 'Primary crusher hopper where haul trucks dump raw coal for processing.',
    'cam-ws-1': 'Indoor workshop bay for heavy machinery maintenance, welding, and mechanics repair operations.'
  });

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
  const [sites, setSites] = useState(INITIAL_SITES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedSite, setSelectedSite] = useState(INITIAL_SITES[0]);

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
        .slice(0, 6)
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
  const [overviewSelectedSiteId, setOverviewSelectedSiteId] = useState(INITIAL_SITES[0]?.id || '');

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
  const [newCctvSiteId, setNewCctvSiteId] = useState(INITIAL_SITES[0]?.id || '');
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
      // Find default or another group to reassign CCTVs
      const otherGroup = workloadGroups.find(g => g.id !== groupId) || workloadGroups[0];
      setCctvGroupAssignments(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(camId => {
          if (updated[camId] === groupId) {
            updated[camId] = otherGroup.id;
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

  return (
    <main style={{ minHeight: '100vh', background: '#F4F6FA', paddingBottom: '60px' }}>

      {/* ===== CUSTOM DASHBOARD NAVBAR ===== */}
      <nav style={{
        background: 'var(--brand-dark)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '2.5px solid var(--brand-secondary)'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '3px 8px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <img src="/logo.png" alt="PamAgents" style={{ height: '22px', width: 'auto' }} />
          </div>
          <div style={{ width: '1.5px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />
          <span style={{ color: 'white', fontWeight: 700, fontSize: '15px', letterSpacing: '0.05em' }}>MONITOR PORTAL</span>
        </div>

        {/* 4 Dedicated Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveSubTab('overview')}
            style={{
              background: activeSubTab === 'overview' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              color: activeSubTab === 'overview' ? '#FFD600' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Home size={15} /> Utama
          </button>

          <button
            onClick={() => { setActiveSubTab('map'); setFilterKPI('ALL'); }}
            style={{
              background: activeSubTab === 'map' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              color: activeSubTab === 'map' ? '#FFD600' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Map size={15} /> Peta Pemantauan
          </button>

          <button
            onClick={() => setActiveSubTab('live-cctv')}
            style={{
              background: activeSubTab === 'live-cctv' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              color: activeSubTab === 'live-cctv' ? '#FFD600' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Camera size={15} /> Live Multi-CCTV
          </button>

          <button
            onClick={() => setActiveSubTab('workload')}
            style={{
              background: activeSubTab === 'workload' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              color: activeSubTab === 'workload' ? '#FFD600' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Cpu size={15} /> Workload Agen
          </button>

          <button
            onClick={() => setActiveSubTab('admin')}
            style={{
              background: activeSubTab === 'admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              color: activeSubTab === 'admin' ? '#FFD600' : 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease'
            }}
          >
            <Settings size={15} /> Administrasi
          </button>
        </div>

        {/* Profile Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '12px', fontFamily: 'monospace' }}>
            <Clock size={14} color="#FFC107" />
            <span>{timeStr}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>Alvin Nugraha</span>
              <span style={{ color: '#FFC107', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>Super Admin</span>
            </div>
            <div style={{
              width: '38px', height: '38px', borderRadius: '50%', background: '#FFC107',
              color: 'var(--brand-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '15px', border: '1.5px solid rgba(255,255,255,0.2)'
            }}>
              AN
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', padding: '6px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            title="Keluar dari Portal"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* ===== TAB 1: RINGKASAN UTAMA (OVERVIEW) ===== */}
      {activeSubTab === 'overview' && (
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
      )}


      {/* ===== TAB 2: PETA PEMANTAUAN (SATELLITE & VIDEO) ===== */}
      {activeSubTab === 'map' && (
        <section style={{ marginTop: '32px' }}>
          <div className="container animate-tab-fade">

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
                    <span style={{
                      background: selectedSite.status === 'ONLINE' ? 'rgba(16,185,129,0.08)' : 'rgba(255,77,77,0.08)',
                      border: `1px solid ${selectedSite.status === 'ONLINE' ? '#10b981' : '#ff4d4d'}`,
                      borderRadius: '4px', padding: '3px 10px', fontSize: '10px', fontWeight: 700,
                      color: selectedSite.status === 'ONLINE' ? '#10b981' : '#ff4d4d'
                    }}>
                      ● {selectedSite.status}
                    </span>
                  </div>
                </div>

                {/* CCTV Live Video Stream Player (Simulasi) */}
                <div style={{ background: '#071224', borderRadius: '10px', overflow: 'hidden', border: '1.5px solid rgba(13,71,161,0.2)', marginBottom: '20px' }}>

                  {/* Player header */}
                  <div style={{ background: 'rgba(11,29,58,0.95)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <span style={{ color: 'white', fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}>
                      {isPlayingClip ? 'REC PLAYBACK MODE' : 'LIVE CCTV FEED'}
                    </span>
                    <span style={{ color: isPlayingClip ? '#ff4d4d' : '#FFC107', fontSize: '10px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                      {activeCctv ? activeCctv.name : 'NO CAMERA SELECTED'}
                    </span>
                  </div>

                  {/* Player Screen */}
                  <div style={{ height: '200px', background: '#02060f', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
                    {/* Error / Offline State */}
                    {activeCctv && activeCctv.status === 'OFFLINE' ? (
                      <div style={{ textAlign: 'center', zIndex: 5, color: '#ff4d4d', padding: '20px' }}>
                        <WifiOff size={40} style={{ marginBottom: '10px', opacity: 0.8 }} />
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>CCTV DISCONNECTED</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Signal timeout or hardware offline.</p>
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
                  <h4 style={{ fontSize: '12.5px', color: 'var(--brand-dark)', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Daftar Kamera CCTV
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', paddingRight: '2px' }}>
                    {sectorCctvs.map(cam => {
                      const isActive = activeCctv && activeCctv.id === cam.id;
                      const isOffline = cam.status === 'OFFLINE';
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
                              <span style={{ color: isActive ? 'var(--brand-dark)' : 'var(--on-surface-variant)', fontWeight: isActive ? 700 : 500, display: 'block' }}>
                                {cam.name}
                              </span>

                              {/* Workload Badges */}
                              {!isOffline && (
                                <div style={{ display: 'flex', gap: '4px', marginTop: '2px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '8px', fontWeight: 700, background: '#E0F2FE', color: '#0369a1', padding: '1px 4px', borderRadius: '3px' }}>
                                    APD
                                  </span>
                                  <span style={{ fontSize: '8px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '1px 4px', borderRadius: '3px' }}>
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
                                          <span style={{ fontSize: '8px', fontWeight: 700, background: '#FEE2E2', color: '#B91C1C', padding: '1px 4px', borderRadius: '3px' }}>
                                            Zona Bahaya
                                          </span>
                                        )}
                                        {hasTruck && (
                                          <span style={{ fontSize: '8px', fontWeight: 700, background: '#FEF9C3', color: '#854D0E', padding: '1px 4px', borderRadius: '3px' }}>
                                            No-Stay Truk
                                          </span>
                                        )}
                                        {otherSkills.map(sk => (
                                          <span key={sk.id} style={{ fontSize: '8px', fontWeight: 700, background: '#EEF2F6', color: '#4F46E5', padding: '1px 4px', borderRadius: '3px', border: '1px solid rgba(79,70,229,0.15)' }}>
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
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            color: isOffline ? '#ff4d4d' : '#10b981',
                            background: isOffline ? 'rgba(255,77,77,0.08)' : 'rgba(16,185,129,0.08)',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {cam.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ACTIVE CCTV HISTORY CLIPPINGS LIST PANEL */}
                <div style={{ borderTop: '1px solid #F0EDED', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '12.5px', color: 'var(--brand-dark)', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Activity size={14} color="var(--brand-primary)" />
                    Riwayat Rekaman Kamera ({activeCctv ? activeCctv.name.replace('CCTV ', '') : 'Tidak Ada'})
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
      )}

      {/* ===== TAB: ADMINISTRASI (KELOLA TITIK + HAK AKSES) ===== */}
      {activeSubTab === 'admin' && (
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
              <span style={{ fontSize: '11px', color: 'var(--outline)', fontStyle: 'italic' }}>Panel Administrasi Sistem</span>
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
      )}

      {/* ===== TAB 5: MULTI-STREAM LIVE CCTV ===== */}
      {activeSubTab === 'live-cctv' && (
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
      )}

      {/* ===== TAB 6: WORKLOAD AGEN AI CONFIGURATION ===== */}
      {activeSubTab === 'workload' && (
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
      )}

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
                  /* ===== PREVIEW VIEW ===== */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Preview rule identity */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '12px', padding: '16px 20px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--outline)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '4px' }}>Rule yang dikonfigurasi</div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--brand-dark)' }}>{skillDesc || 'Titik ini ga boleh ada manusia (Bahaya)'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--outline)', fontFamily: 'monospace', marginTop: '2px' }}>{skillCode ? skillCode.toLowerCase().replace(/[^a-z0-9_]/g, '_') : 'no_human_zone'}</div>
                    </div>

                    {/* Priority */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Prioritas</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, padding: '10px 8px', borderRadius: '8px', textAlign: 'center', background: '#EF4444', border: '1.5px solid #EF4444', fontSize: '12px', fontWeight: 700, color: 'white' }}>
                          High
                        </div>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: '11px', color: 'var(--outline)' }}>Direkomendasikan berdasarkan konten event code yang dianalisis.</p>
                    </div>

                    <div style={{ borderTop: '1px solid #F0F2F7' }} />

                    {/* Time Bounds */}
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Durasi Waktu</label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                          { label: 'Sebelum Alarm', value: '3', sub: 'Detik sebelum notifikasi dikirim' },
                          { label: 'Setelah Alarm', value: '15', sub: 'Detik hold-time setelah event' }
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

                    {/* Response + Target Group */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--brand-dark)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Saluran Respons</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                            { label: 'Telegram', active: true },
                            { label: 'Email', active: true }
                          ].map(ch => (
                            <div key={ch.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, border: `2px solid ${ch.active ? 'var(--brand-primary)' : '#C3C6D4'}`, background: ch.active ? 'var(--brand-primary)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {ch.active && <span style={{ color: 'white', fontSize: '10px', fontWeight: 900, lineHeight: 1 }}>&#10003;</span>}
                              </div>
                              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--brand-dark)', flex: 1 }}>{ch.label}</span>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#10B981', background: '#F0FDF4', padding: '2px 7px', borderRadius: '3px' }}>ON</span>
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
                        {/* <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E3E6EE', borderRadius: '8px', opacity: 0.45 }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: '2px' }}>Grup Logistik</div>
                          <div style={{ fontSize: '11px', color: 'var(--outline)' }}>2 rule aktif — Stockpile, Gate</div>
                        </div> */}
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
                              onClick={() => setShowRulePreview(true)}
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
