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


  // Selected Alert for Escalate tab
  const [selectedAlertIdx, setSelectedAlertIdx] = useState(0);

  // Selected Incident for Respond tab
  const [selectedIncidentIdx, setSelectedIncidentIdx] = useState(0);

  // Active CCTV for Detect tab
  const [detectGridSize, setDetectGridSize] = useState(4);

  // Active camera edit states
  const [isEditingCctv, setIsEditingCctv] = useState(false);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex antialiased">
      {/* ===== SIDEBAR NAVIGATION ===== */}
      <nav className="bg-surface-container-low h-screen w-64 fixed left-0 top-0 shadow-sm flex flex-col p-sm gap-base border-r border-outline-variant/20 z-40 hidden md:flex">
        <div className="px-sm py-md">
          <h1 className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
            PAMAgents
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Mining Intel v2.4</p>
        </div>

        <button 
          onClick={() => setActiveSubTab('policy_studio')}
          className="bg-primary text-on-primary font-label-md text-label-md py-sm px-md rounded-lg flex items-center justify-center gap-xs w-full mb-md hover:bg-on-primary-fixed hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
          New Policy
        </button>

        <div className="flex-1 flex flex-col gap-xs overflow-y-auto">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'overview' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'overview' ? "'FILL' 1" : "'FILL' 0" }}>dashboard</span>
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('detect')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'detect' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'detect' ? "'FILL' 1" : "'FILL' 0" }}>search_check</span>
            <span>Detect</span>
          </button>

          <button
            onClick={() => setActiveSubTab('escalate')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'escalate' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'escalate' ? "'FILL' 1" : "'FILL' 0" }}>priority_high</span>
            <span>Escalate</span>
          </button>

          <button
            onClick={() => setActiveSubTab('respond')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'respond' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'respond' ? "'FILL' 1" : "'FILL' 0" }}>quick_reorder</span>
            <span>Respond</span>
          </button>

          <button
            onClick={() => setActiveSubTab('analyze')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'analyze' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'analyze' ? "'FILL' 1" : "'FILL' 0" }}>analytics</span>
            <span>Analyze</span>
          </button>

          <button
            onClick={() => setActiveSubTab('policy_studio')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'policy_studio' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'policy_studio' ? "'FILL' 1" : "'FILL' 0" }}>smart_toy</span>
            <span>Policy Studio</span>
          </button>

          <button
            onClick={() => setActiveSubTab('camera_management')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'camera_management' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'camera_management' ? "'FILL' 1" : "'FILL' 0" }}>videocam</span>
            <span>Camera Management</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`flex items-center gap-sm px-md py-sm rounded-lg font-label-md text-label-md hover:scale-[1.02] transition-transform duration-150 text-left w-full ${
              activeSubTab === 'settings' ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSubTab === 'settings' ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
            <span>Settings</span>
          </button>
        </div>

        <div className="mt-auto pt-sm border-t border-outline-variant/20 flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-label-md font-bold text-xs">
            AN
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-label-md text-label-md text-on-surface block truncate">Alvin Nugraha</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block truncate">Owner (Super Admin)</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1 text-on-surface-variant hover:text-error transition-colors"
            title="Keluar dari Portal"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </nav>

      {/* ===== MAIN WORKSPACE AREA ===== */}
      <div className="flex-1 flex flex-col md:ml-64 min-w-0 min-h-screen">
        {/* TOP BAR */}
        <header className="bg-surface-container-lowest shadow-sm flex justify-between items-center w-full px-gutter h-16 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-sm md:hidden">
            <span className="material-symbols-outlined text-primary text-2xl">menu</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">PAMAgents</span>
          </div>

          <div className="hidden md:flex flex-1">
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                className="w-full pl-xl pr-sm py-sm rounded-lg border border-outline-variant bg-surface-container-lowest text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                placeholder="Search operational intel..." 
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="flex items-center gap-1 font-mono-data text-mono-data text-on-surface-variant text-xs bg-surface-container-low px-2 py-1 rounded">
              <span className="material-symbols-outlined text-xs text-[#FFC107] animate-pulse">schedule</span>
              <span>{timeStr}</span>
            </div>
            
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200 relative">
              <span className="material-symbols-outlined">notifications</span>
              {allIncidents.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface-container-lowest"></span>
              )}
            </button>
            <button className="text-on-surface-variant hover:text-primary transition-colors duration-200">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container overflow-hidden border border-outline-variant cursor-pointer">
              <span className="material-symbols-outlined text-sm">person</span>
            </div>
          </div>
        </header>

        {/* CONTAINER FOR ACTIVE TAB CONTENT */}
        <main className="flex-1 p-gutter max-w-container-max mx-auto w-full flex flex-col gap-md">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="flex flex-col gap-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Operational Overview</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">Real-time telemetry and incident tracking across active zones.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-[#0D47A1] text-[#0D47A1] rounded-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors">Generate Report</button>
                  <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-[#1565C0] transition-colors flex items-center gap-2 shadow-sm ai-glow">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                    AI Assist
                  </button>
                </div>
              </div>

              {/* Bento KPI Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-sm md:gap-md">
                <div onClick={() => setActiveSubTab('camera_management')} className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Cameras</span>
                    <span className="material-symbols-outlined text-primary bg-primary-fixed p-1.5 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">{totalCCTVOnline}</span>
                    <span className="font-label-md text-label-md text-[#4CAF50] bg-[#E8F5E9] px-1.5 py-0.5 rounded flex items-center">
                      /{totalCCTV}
                    </span>
                  </div>
                </div>

                <div onClick={() => setActiveSubTab('policy_studio')} className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Policies</span>
                    <span className="material-symbols-outlined text-secondary bg-secondary-fixed p-1.5 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>policy</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">{workloadGroups.length}</span>
                    <span className="font-label-md text-label-md text-on-surface-variant">Groups</span>
                  </div>
                </div>

                <div onClick={() => setActiveSubTab('escalate')} className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border-l-4 border-l-[#FFC107] flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Alerts</span>
                    <span className="material-symbols-outlined text-tertiary-fixed-dim bg-tertiary-fixed/30 p-1.5 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">
                      {allIncidents.filter(i => i.type === 'danger' || i.type === 'warning').length}
                    </span>
                    <span className="font-label-md text-label-md text-tertiary-fixed-dim bg-tertiary-fixed/20 px-1.5 py-0.5 rounded">Action Req</span>
                  </div>
                </div>

                <div onClick={() => setActiveSubTab('respond')} className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border-l-4 border-l-error flex flex-col gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                  <div className="flex justify-between items-center">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Open Incidents</span>
                    <span className="material-symbols-outlined text-error bg-error-container p-1.5 rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display-lg text-display-lg text-on-surface">{allIncidents.length}</span>
                    <span className="font-label-md text-label-md text-error bg-error-container/50 px-1.5 py-0.5 rounded">Total</span>
                  </div>
                </div>
              </div>

              {/* 2-Column layout: Map & Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                {/* Dynamic Map Card */}
                <div className="lg:col-span-2 bg-surface-container-lowest rounded-[16px] shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 flex flex-col overflow-hidden relative min-h-[420px]">
                  <div className="p-md pb-0 flex justify-between items-center absolute top-0 w-full z-10 bg-gradient-to-b from-surface-container-lowest/90 to-transparent">
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Mine Site Alpha Coordinates Map</h3>
                    <div className="flex gap-2">
                      <span className="flex items-center gap-1 font-body-sm text-body-sm bg-surface-container-lowest/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm"><span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Normal</span>
                      <span className="flex items-center gap-1 font-body-sm text-body-sm bg-surface-container-lowest/80 px-2 py-1 rounded backdrop-blur-sm shadow-sm"><span className="w-2 h-2 rounded-full bg-[#BA1A1A]"></span> Alarm</span>
                    </div>
                  </div>

                  <div className="flex-1 bg-surface-container-low relative" style={{ backgroundImage: "url('/mine_site_satellite.png')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '380px' }}>
                    {/* SVG Connections from office HQ to other sites */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {sites.map(s => {
                        if (s.id === 'workshop-main') return null;
                        return (
                          <line 
                            key={s.id} 
                            x1="45%" y1="55%" 
                            x2={s.x} y2={s.y} 
                            stroke={s.status === 'ALERT' ? 'rgba(186,26,26,0.6)' : 'rgba(13,71,161,0.4)'} 
                            strokeWidth="2" 
                            strokeDasharray="4 4"
                          />
                        );
                      })}
                    </svg>

                    {/* Interactive pins */}
                    {sites.map(s => {
                      const isSelected = selectedSite.id === s.id;
                      const isAlert = s.status === 'ALERT' || s.cctvOffline > 0;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSelectedSite(s)}
                          className="absolute flex flex-col items-center cursor-pointer group"
                          style={{ left: s.x, top: s.y, transform: 'translate(-50%, -50%)', background: 'none', border: 'none', outline: 'none' }}
                        >
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            <span className={`absolute w-full h-full rounded-full opacity-40 animate-pulse ${isAlert ? 'bg-error' : 'bg-primary'}`}></span>
                            <span className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-125 ${isAlert ? 'bg-error' : 'bg-primary'} ${isSelected ? 'scale-110 ring-2 ring-primary ring-offset-1' : ''}`}></span>
                          </div>
                          <span className={`mt-1 font-label-md text-[10px] text-white px-2 py-0.5 rounded shadow-md border ${isSelected ? 'bg-primary border-primary-fixed-dim' : 'bg-inverse-surface border-transparent opacity-85 group-hover:opacity-100'} transition-all`}>
                            {s.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Alerts Feed */}
                <div className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 flex flex-col h-[420px] overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Recent Activity Logs</h3>
                    <button onClick={() => setActiveSubTab('escalate')} className="font-label-md text-label-md text-primary hover:underline">View All</button>
                  </div>
                  <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2 custom-scrollbar">
                    {logs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={`p-sm bg-surface-container-low rounded-lg border-l-2 transition-colors cursor-pointer hover:bg-surface-container ${
                          log.type === 'error' ? 'border-error' : log.type === 'success' ? 'border-green-500' : 'border-outline-variant'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-label-md text-label-md text-on-surface font-semibold">{log.time}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            log.type === 'error' ? 'bg-error/10 text-error' : log.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {log.type === 'error' ? 'Alert' : log.type === 'success' ? 'Info' : 'Log'}
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{log.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Table & Charts preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
                {/* Incidents Table */}
                <div className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Incident Summary</h3>
                    <button onClick={() => setActiveSubTab('respond')} className="text-primary font-label-md text-label-md hover:underline">Full Log</button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20">
                        <th className="py-2 px-2 font-label-md text-label-md text-on-surface-variant">ID</th>
                        <th className="py-2 px-2 font-label-md text-label-md text-on-surface-variant">Type</th>
                        <th className="py-2 px-2 font-label-md text-label-md text-on-surface-variant">Location</th>
                        <th className="py-2 px-2 font-label-md text-label-md text-on-surface-variant">Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm">
                      {allIncidents.slice(0, 4).map((inc, index) => (
                        <tr 
                          key={index} 
                          onClick={() => {
                            setSelectedIncidentIdx(index);
                            setActiveSubTab('respond');
                          }}
                          className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-2 font-mono-data text-on-surface font-semibold">INC-{inc.id.substring(inc.id.length - 4)}</td>
                          <td className="py-3 px-2 text-on-surface font-medium">{inc.title}</td>
                          <td className="py-3 px-2 text-on-surface-variant">{inc.camera}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              inc.type === 'danger' ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-container'
                            }`}>
                              Open
                            </span>
                          </td>
                        </tr>
                      ))}
                      {allIncidents.length === 0 && (
                        <tr>
                          <td colSpan="4" className="text-center py-4 text-outline font-body-sm">No incidents reported today.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Simple analytics placeholder */}
                <div className="bg-surface-container-lowest rounded-[16px] p-md shadow-[0px_4px_20px_rgba(13,71,161,0.05)] border border-outline-variant/10 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider">Analytics Trends</h3>
                    <button onClick={() => setActiveSubTab('analyze')} className="text-primary font-label-md text-label-md hover:underline">Analyze Module</button>
                  </div>
                  <div className="flex-1 flex gap-4">
                    <div className="flex-1 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-center p-4 relative min-h-[140px]">
                      <span className="font-body-sm text-body-sm text-on-surface-variant absolute top-2 left-2">Incident Trend</span>
                      <div className="flex items-end gap-2 h-20 w-full justify-center mt-6">
                        <div className="w-5 bg-primary-fixed-dim rounded-t h-1/3"></div>
                        <div className="w-5 bg-primary-fixed rounded-t h-1/2"></div>
                        <div className="w-5 bg-primary rounded-t h-3/4"></div>
                        <div className="w-5 bg-secondary rounded-t h-1/4"></div>
                        <div className="w-5 bg-error rounded-t h-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-surface-container-low rounded-lg border border-outline-variant/20 flex items-center justify-center p-4 relative min-h-[140px]">
                      <span className="font-body-sm text-body-sm text-on-surface-variant absolute top-2 left-2">Zones Breakdown</span>
                      <div className="w-16 h-16 rounded-full border-8 border-primary border-r-secondary border-b-tertiary-fixed-dim mt-6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DETECT (LIVE STREAM GRID) */}
          {activeSubTab === 'detect' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-md overflow-hidden min-h-[500px]">
              {/* Left Column: Streams Grid */}
              <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 p-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-variant pb-sm mb-md flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <h2 className="font-headline-md text-headline-md text-on-surface">Live Monitoring Grid</h2>
                    <span className="bg-error/10 text-error font-label-md text-label-md px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-surface-container-low rounded-lg p-1 border border-outline-variant/20">
                      <button 
                        onClick={() => setDetectGridSize(4)} 
                        className={`px-3 py-1.5 rounded font-label-md text-label-md flex items-center gap-1.5 transition-all ${
                          detectGridSize === 4 ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">grid_view</span>
                        <span>4 Grid</span>
                      </button>
                      <button 
                        onClick={() => setDetectGridSize(9)} 
                        className={`px-3 py-1.5 rounded font-label-md text-label-md flex items-center gap-1.5 transition-all ${
                          detectGridSize === 9 ? 'bg-surface-container-lowest shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">grid_on</span>
                        <span>9 Grid</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Streams Container Grid */}
                <div className="flex-1 overflow-y-auto">
                  <div className={`grid gap-sm md:gap-md ${
                    detectGridSize === 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'
                  }`}>
                    {sites.flatMap(s => s.details.filter(d => d.type === 'cctv')).slice(0, detectGridSize).map((cam, idx) => {
                      const isCamOffline = cam.status === 'OFFLINE';
                      const isCurrentlyPlaying = activeCctv && activeCctv.id === cam.id;
                      const hasClips = cam.clippings && cam.clippings.length > 0;
                      
                      return (
                        <div 
                          key={cam.id} 
                          onClick={() => {
                            setActiveCctv(cam);
                            setSelectedSite(sites.find(s => s.details.some(d => d.id === cam.id)) || selectedSite);
                          }}
                          className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border flex flex-col relative group cursor-pointer ${
                            isCurrentlyPlaying ? 'ring-2 ring-primary bg-primary-container/5' : 'border-outline-variant/20 hover:border-primary/50'
                          }`}
                        >
                          <div className="px-4 py-2 border-b border-surface-variant flex justify-between items-center bg-surface-container-low shrink-0">
                            <span className="font-label-md text-label-md text-on-surface font-semibold truncate flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">videocam</span>
                              {cam.name}
                            </span>
                            <span className="font-mono-data text-mono-data text-outline text-xs">
                              {isCamOffline ? 'Offline' : 'Online • 30fps'}
                            </span>
                          </div>

                          <div className="flex-1 relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                            {isCamOffline ? (
                              <div className="flex flex-col items-center justify-center text-outline gap-2">
                                <span className="material-symbols-outlined text-3xl">videocam_off</span>
                                <span className="font-body-sm text-body-sm">No Signal / Disconnected</span>
                              </div>
                            ) : (
                              <>
                                {/* Show video feed */}
                                {isCurrentlyPlaying && isPlayingClip && selectedClip ? (
                                  <div className="w-full h-full relative">
                                    <VideoPlayer videoSrc="/cctv_example.mp4" />
                                    <div className="absolute top-2 left-2 bg-error/95 text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider z-20 flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                                      REPLAY: {selectedClip.title}
                                    </div>
                                    <div className="absolute bottom-2 left-2 right-2 z-20">
                                      <div className="w-full bg-black/60 rounded h-1 overflow-hidden">
                                        <div className="bg-error h-full" style={{ width: `${clipProgress}%` }}></div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-full h-full relative">
                                    {/* Static visual representation with placeholder imagery */}
                                    <img 
                                      src={idx % 4 === 0 ? cctvImg1 : idx % 4 === 1 ? cctvImg2 : idx % 4 === 2 ? cctvImg3 : cctvImg4} 
                                      alt="CCTV stream placeholder" 
                                      className="w-full h-full object-cover opacity-80"
                                    />
                                    {/* Simulation drawing bounding boxes on Cam 0 */}
                                    {idx === 0 && (
                                      <div className="absolute top-[35%] left-[20%] w-[30%] h-[40%] border-2 border-[#ffb703] bg-[#ffb703]/10 rounded-sm">
                                        <span className="absolute -top-5 left-0 bg-[#ffb703] text-black font-mono-data text-[9px] px-1 py-0.2 rounded font-bold uppercase">
                                          Excavator 98%
                                        </span>
                                      </div>
                                    )}
                                    {idx === 1 && (
                                      <div className="absolute top-[45%] left-[50%] w-[25%] h-[30%] border-2 border-error bg-error/10 rounded-sm">
                                        <span className="absolute -top-5 left-0 bg-error text-white font-mono-data text-[9px] px-1 py-0.2 rounded font-bold uppercase animate-pulse">
                                          No-Helmet 95%
                                        </span>
                                      </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 bg-on-surface/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                                      LIVE - 1080p
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Live Detection Feed */}
              <aside className="w-full lg:w-80 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-md flex flex-col h-[500px] lg:h-auto overflow-hidden flex-shrink-0">
                <div className="pb-sm border-b border-surface-variant flex justify-between items-center shrink-0">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">feed</span>
                    Detection Feed
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="font-mono-data text-mono-data text-outline text-[10px]">Updates</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto mt-md space-y-sm pr-1 custom-scrollbar">
                  {allIncidents.slice(0, 8).map((inc, index) => (
                    <div 
                      key={index}
                      onClick={() => {
                        setSelectedSite(sites.find(s => s.id === inc.sectorId) || selectedSite);
                        setActiveCctv(inc.cameraObj);
                        handlePlayClip(inc);
                      }}
                      className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/10 shadow-sm relative hover:border-primary transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          inc.type === 'danger' ? 'bg-error/10 text-error' : 'bg-tertiary-fixed text-tertiary-container'
                        }`}>
                          {inc.title}
                        </span>
                        <span className="font-mono-data text-outline text-[10px]">{inc.time}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant font-medium line-clamp-2">{inc.description}</p>
                      <div className="mt-2 flex justify-between items-center text-[10px] text-outline">
                        <span className="flex items-center gap-0.5"><span className="material-symbols-outlined text-[12px]">videocam</span>{inc.camera}</span>
                        <span className="text-primary group-hover:underline flex items-center gap-0.5 font-bold">
                          Replay <span className="material-symbols-outlined text-[10px]">play_arrow</span>
                        </span>
                      </div>
                    </div>
                  ))}
                  {allIncidents.length === 0 && (
                    <div className="text-center py-8 text-outline text-body-sm">Waiting for live detection incidents...</div>
                  )}
                </div>
              </aside>
            </div>
          )}

          {/* TAB 3: ESCALATE (ALERT LOGS) */}
          {activeSubTab === 'escalate' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-md h-[calc(100vh-140px)] overflow-hidden min-h-[500px]">
              {/* Left Column: Alert Queue */}
              <div className="lg:col-span-4 flex flex-col gap-sm overflow-y-auto pr-2 pb-8 h-full bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20">
                <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-xs flex-shrink-0">
                  <h2 className="font-headline-md text-headline-md text-on-surface">Alert Center Queue</h2>
                  <span className="bg-primary/15 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{allIncidents.length} Alerts</span>
                </div>

                <div className="space-y-sm overflow-y-auto flex-1 pr-1 custom-scrollbar">
                  {allIncidents.map((inc, idx) => {
                    const isSelected = selectedAlertIdx === idx;
                    return (
                      <div 
                        key={inc.id || idx}
                        onClick={() => setSelectedAlertIdx(idx)}
                        className={`rounded-xl p-sm border-l-4 cursor-pointer transition-all border ${
                          inc.type === 'danger' ? 'border-l-error' : 'border-l-[#ffb703]'
                        } ${
                          isSelected ? 'bg-surface-container-high ring-1 ring-primary' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`font-label-md text-label-md ${
                            inc.type === 'danger' ? 'text-error' : 'text-[#d97706]'
                          }`}>
                            {inc.type === 'danger' ? 'High Risk' : 'Warning'}
                          </span>
                          <span className="font-mono-data text-outline text-xs">{inc.time}</span>
                        </div>
                        <h3 className="font-label-md text-label-md text-on-surface mb-1 font-semibold">{inc.title}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 mb-2">{inc.description}</p>
                        <span className="text-[10px] text-outline flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">videocam</span> {inc.camera}
                        </span>
                      </div>
                    );
                  })}
                  {allIncidents.length === 0 && (
                    <div className="text-center py-12 text-outline text-body-sm">No alerts queued for review.</div>
                  )}
                </div>
              </div>

              {/* Right Column: Alert Detail View */}
              <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-md border border-outline-variant/20 flex flex-col h-full overflow-hidden">
                {allIncidents[selectedAlertIdx] ? (
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-md pb-sm border-b border-outline-variant/20 shrink-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[10px] font-bold uppercase">
                            {allIncidents[selectedAlertIdx].type === 'danger' ? 'Critical' : 'Alert'}
                          </span>
                          <span className="font-mono-data text-on-surface-variant text-sm">Alert ID: #{allIncidents[selectedAlertIdx].id.substring(allIncidents[selectedAlertIdx].id.length - 8)}</span>
                        </div>
                        <h2 className="font-headline-lg text-[22px] leading-tight text-on-surface font-semibold">{allIncidents[selectedAlertIdx].title}</h2>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Triggered by Policy Engine</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono-data text-on-surface font-semibold text-lg">{allIncidents[selectedAlertIdx].time}</p>
                        <p className="font-body-sm text-outline text-xs">Today</p>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 overflow-y-auto space-y-md pr-1 custom-scrollbar">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                        {/* Thermal Image Overlay Representation */}
                        <div className="rounded-lg overflow-hidden border border-outline-variant/20 relative aspect-video bg-black flex items-center justify-center">
                          <img 
                            src={cctvImg3} 
                            alt="Thermal incident snapshot" 
                            className="w-full h-full object-cover opacity-80"
                          />
                          <div className="absolute top-2 right-2 bg-error text-white font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                            Trigger Frame
                          </div>
                        </div>
                        
                        {/* Metadata Grid */}
                        <div className="flex flex-col gap-sm justify-between">
                          <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/10">
                            <span className="block font-label-md text-[10px] text-on-surface-variant mb-0.5 uppercase">Location</span>
                            <span className="font-body-md text-body-md font-medium text-on-surface flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                              {allIncidents[selectedAlertIdx].sectorName}
                            </span>
                          </div>
                          <div className="bg-surface-container-low p-sm rounded-lg border border-outline-variant/10">
                            <span className="block font-label-md text-[10px] text-on-surface-variant mb-0.5 uppercase">Camera Source</span>
                            <span className="font-body-md text-body-md font-medium text-on-surface flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[16px] text-primary">videocam</span>
                              {allIncidents[selectedAlertIdx].camera}
                            </span>
                          </div>
                          <div className="bg-secondary/15 border-l-4 border-tertiary-fixed-dim p-sm rounded-r-lg">
                            <div className="flex gap-2">
                              <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim shrink-0">smart_toy</span>
                              <div>
                                <h4 className="font-label-md text-[11px] font-bold text-on-surface mb-0.5">AI Engine Suggestion</h4>
                                <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight">
                                  System reports confidence level of 95.8%. Flagged anomaly details match rules in security guidelines.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Log Anomaly Text details */}
                      <div>
                        <h4 className="font-label-md text-label-md text-on-surface-variant mb-xs uppercase tracking-wider">Detailed Description</h4>
                        <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/15 text-body-md text-on-surface">
                          {allIncidents[selectedAlertIdx].description}
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="mt-auto pt-sm border-t border-outline-variant/20 flex gap-2 justify-end shrink-0">
                      <button className="px-4 py-2 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                        Dismiss Alert
                      </button>
                      <button 
                        onClick={() => {
                          const time = new Date().toLocaleTimeString('id-ID');
                          setLogs(prev => [{ time, message: `ESKALASI MANUAL: Alert ${allIncidents[selectedAlertIdx].title} dieskalasikan ke Tim Rescue Sektor`, type: 'error' }, ...prev]);
                          alert('Alert dieskalasikan ke Tim Lapangan.');
                        }}
                        className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/95 shadow-sm flex items-center gap-1.5 ai-glow"
                      >
                        <span className="material-symbols-outlined text-[16px]">priority_high</span>
                        Escalate Warning
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-outline text-body-sm">
                    Select an alert from the queue to view details.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: RESPOND (INCIDENTS ARCHIVE) */}
          {activeSubTab === 'respond' && (
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-md h-[calc(100vh-140px)] overflow-hidden min-h-[500px]">
              {/* Left Column: Incidents List */}
              <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden h-full">
                {/* Filters */}
                <div className="p-md border-b border-surface-variant flex items-center justify-between flex-wrap gap-sm flex-shrink-0 bg-surface-container-low">
                  <div className="flex gap-2">
                    <span className="bg-primary-container text-on-primary-container font-label-md text-xs px-2.5 py-1 rounded">Open Incidents</span>
                  </div>
                  <span className="font-mono-data text-outline text-xs">{allIncidents.length} logs found</span>
                </div>

                {/* Table Container */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface-container-lowest border-b border-surface-variant z-10">
                      <tr className="font-label-md text-label-md text-on-surface-variant">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Anomalies Type</th>
                        <th className="py-3 px-4">Severity</th>
                        <th className="py-3 px-4">Camera Location</th>
                        <th className="py-3 px-4">Time</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/10">
                      {allIncidents.map((inc, index) => {
                        const isSelected = selectedIncidentIdx === index;
                        return (
                          <tr 
                            key={inc.id || index}
                            onClick={() => setSelectedIncidentIdx(index)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-primary-container/20 font-semibold' : 'hover:bg-surface-container-low'
                            }`}
                          >
                            <td className="py-3 px-4 font-mono-data text-primary">INC-{inc.id.substring(inc.id.length - 4)}</td>
                            <td className="py-3 px-4">{inc.title}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                inc.type === 'danger' ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-container'
                              }`}>
                                {inc.type === 'danger' ? 'Critical' : 'Warning'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-on-surface-variant">{inc.camera}</td>
                            <td className="py-3 px-4 font-mono-data text-on-surface-variant">{inc.time}</td>
                          </tr>
                        );
                      })}
                      {allIncidents.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-8 text-outline">No active incidents logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Detail Panel Drawer */}
              <aside className="lg:col-span-4 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/20 flex flex-col h-full overflow-hidden">
                {allIncidents[selectedIncidentIdx] ? (
                  <div className="flex flex-col h-full">
                    {/* Drawer Header */}
                    <div className="p-md border-b border-outline-variant/20 flex flex-col shrink-0 bg-surface-container-low">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono-data text-primary font-bold">INC-{allIncidents[selectedIncidentIdx].id.substring(allIncidents[selectedIncidentIdx].id.length - 8)}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          allIncidents[selectedIncidentIdx].type === 'danger' ? 'bg-error-container text-error' : 'bg-tertiary-fixed text-tertiary-container'
                        }`}>
                          {allIncidents[selectedIncidentIdx].type === 'danger' ? 'Critical' : 'Warning'}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-[18px] text-on-surface font-bold truncate">{allIncidents[selectedIncidentIdx].title}</h3>
                      <span className="text-[11px] text-outline mt-1">Logged {allIncidents[selectedIncidentIdx].time}</span>
                    </div>

                    {/* Drawer Body Scrollable */}
                    <div className="flex-grow overflow-y-auto p-md space-y-md pr-1 custom-scrollbar">
                      {/* AI Triage Details */}
                      <div className="bg-[#e3f2fd]/40 border-l-4 border-primary rounded-r-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">smart_toy</span>
                          <div>
                            <h4 className="font-label-md text-[11px] font-bold text-primary mb-0.5">AI Triage Analysis</h4>
                            <p className="font-body-sm text-[12px] text-on-surface">
                              Autonomous agent detected anomalous behaviour matching the parameters of policy template. Security dispatch or intervention requested.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="space-y-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant/10">
                        <div className="flex justify-between">
                          <span className="text-xs text-outline">Sektor</span>
                          <span className="text-xs font-semibold text-on-surface">{allIncidents[selectedIncidentIdx].sectorName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-outline">Kamera</span>
                          <span className="text-xs font-semibold text-primary">{allIncidents[selectedIncidentIdx].camera}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-outline">Rule/Policy</span>
                          <span className="text-xs font-semibold text-on-surface">Rule {allIncidents[selectedIncidentIdx].title}</span>
                        </div>
                      </div>

                      {/* Snapshot Visual Evidence */}
                      <div>
                        <h4 className="font-label-md text-[11px] uppercase tracking-wider text-outline mb-2">Visual Evidence Frame</h4>
                        <div className="rounded-lg overflow-hidden border border-outline-variant/20 relative aspect-video bg-black flex items-center justify-center shadow-inner">
                          <img 
                            src={cctvImg4} 
                            alt="Visual incident snapshot" 
                            className="w-full h-full object-cover opacity-80"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Drawer Footer Actions */}
                    <div className="p-md border-t border-outline-variant/20 flex gap-2 shrink-0 bg-surface-container-low">
                      <button 
                        onClick={() => {
                          const id = allIncidents[selectedIncidentIdx].id;
                          // Remove the incident by filtering it out
                          setSites(prevSites => {
                            return prevSites.map(s => ({
                              ...s,
                              details: s.details.map(device => {
                                if (device.clippings) {
                                  return {
                                    ...device,
                                    clippings: device.clippings.filter(c => c.id !== id)
                                  };
                                }
                                return device;
                              })
                            }));
                          });
                          alert('Klip insiden dibuang sebagai false alarm.');
                          setSelectedIncidentIdx(0);
                        }}
                        className="flex-1 py-2 px-3 border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container transition-colors"
                      >
                        False Alarm
                      </button>
                      <button 
                        onClick={() => {
                          const time = new Date().toLocaleTimeString('id-ID');
                          setLogs(prev => [{ time, message: `RESOLVED: Insiden ${allIncidents[selectedIncidentIdx].title} berhasil diselesaikan.`, type: 'success' }, ...prev]);
                          const id = allIncidents[selectedIncidentIdx].id;
                          setSites(prevSites => {
                            return prevSites.map(s => ({
                              ...s,
                              details: s.details.map(device => {
                                if (device.clippings) {
                                  return {
                                    ...device,
                                    clippings: device.clippings.filter(c => c.id !== id)
                                  };
                                }
                                return device;
                              })
                            }));
                          });
                          alert('Status insiden berhasil dirubah menjadi RESOLVED.');
                          setSelectedIncidentIdx(0);
                        }}
                        className="flex-1 py-2 px-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/95 transition-colors shadow-sm"
                      >
                        Resolve Issue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-outline text-body-sm">
                    Select an incident from the log to view details.
                  </div>
                )}
              </aside>
            </div>
          )}

          {/* TAB 5: ANALYZE */}
          {activeSubTab === 'analyze' && (
            <div className="flex-grow space-y-md">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">Telemetry Analytics</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Executive safety trends & site anomaly insights.</p>
                </div>
              </div>

              {/* Summary cards row */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
                <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Weekly Alerts</span>
                    <span className="material-symbols-outlined text-outline">trending_down</span>
                  </div>
                  <div className="mt-sm flex items-end gap-sm">
                    <span className="font-display-lg text-display-lg text-on-surface">142</span>
                    <span className="font-body-sm text-body-sm text-green-600 mb-xs">-12% vs last week</span>
                  </div>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Monthly Severity</span>
                    <span className="material-symbols-outlined text-outline">calendar_month</span>
                  </div>
                  <div className="mt-sm flex items-end gap-sm">
                    <span className="font-display-lg text-display-lg text-on-surface">680</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant mb-xs">Stable</span>
                  </div>
                </div>

                <div className="bg-secondary/15 border-l-4 border-tertiary-fixed-dim rounded-xl p-md flex flex-col justify-between relative overflow-hidden shadow-sm">
                  <span className="font-label-md text-label-md text-secondary uppercase tracking-wider flex items-center gap-xs">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span> Agent Insight
                  </span>
                  <p className="font-body-md text-body-md text-on-surface mt-sm">Conveyor Line C shows repeated minor crack warnings during high heat periods.</p>
                </div>

                <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/10 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">High Risk Events</span>
                    <span className="material-symbols-outlined text-error animate-pulse">warning</span>
                  </div>
                  <div className="mt-sm flex items-end gap-sm">
                    <span className="font-display-lg text-display-lg text-on-surface">{allIncidents.filter(i => i.type === 'danger').length}</span>
                    <span className="font-body-sm text-body-sm text-error mb-xs">Critical today</span>
                  </div>
                </div>
              </div>

              {/* Graph Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
                <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/10 min-h-[360px] flex flex-col">
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-sm">Violation Trend (Last 30 Days)</h3>
                  <div className="flex-1 bg-surface rounded-lg flex items-center justify-center border border-outline-variant/30 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end px-md gap-2 opacity-80">
                      <div className="w-full h-[30%] bg-primary/20 rounded-t-sm"></div>
                      <div className="w-full h-[50%] bg-primary/20 rounded-t-sm"></div>
                      <div className="w-full h-[40%] bg-primary/20 rounded-t-sm"></div>
                      <div className="w-full h-[60%] bg-primary/20 rounded-t-sm"></div>
                      <div className="w-full h-[80%] bg-error/30 rounded-t-sm border-t-2 border-error"></div>
                      <div className="w-full h-[40%] bg-primary/20 rounded-t-sm"></div>
                    </div>
                    <p className="font-mono-data text-mono-data text-on-surface-variant z-10 bg-surface/80 px-2 py-1 rounded">Interactive Telemetry Chart Area</p>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/10 min-h-[360px] flex flex-col justify-between">
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-sm">Top Violated Rules</h3>
                  <div className="space-y-sm flex-1 mt-md">
                    <div className="flex justify-between items-center p-sm bg-surface-container-low rounded-lg border border-outline-variant/10">
                      <span className="font-body-sm text-body-sm font-semibold">Haul Truck Overspeed</span>
                      <span className="font-mono-data text-outline">48%</span>
                    </div>
                    <div className="flex justify-between items-center p-sm bg-surface-container-low rounded-lg border border-outline-variant/10">
                      <span className="font-body-sm text-body-sm font-semibold">Safety Zone Violation</span>
                      <span className="font-mono-data text-outline">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-sm bg-surface-container-low rounded-lg border border-outline-variant/10">
                      <span className="font-body-sm text-body-sm font-semibold">CCTV Disconnections</span>
                      <span className="font-mono-data text-outline">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: POLICY STUDIO */}
          {activeSubTab === 'policy_studio' && (
            <div className="flex-grow space-y-md">
              <div className="flex flex-col gap-xs">
                <h2 className="font-display-lg text-display-lg md:font-display-lg text-primary tracking-tight">AI Policy Studio</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Design operational monitoring rules using natural language. The AI agent will parse your request and generate structured telemetry conditions automatically.</p>
              </div>

              {/* Bento Grid parser layouts */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-md h-full min-h-[320px]">
                <div className="lg:col-span-7 flex flex-col gap-md">
                  {/* Natural Language input */}
                  <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/30 flex flex-col gap-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="flex items-center gap-sm mb-xs relative z-10">
                      <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                      <span className="font-label-md text-label-md text-primary uppercase tracking-widest">Natural Language Prompt Builder</span>
                    </div>
                    <div className="relative z-10 flex flex-col gap-sm">
                      <textarea 
                        className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg p-md font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none h-28 focus:bg-surface-container-lowest ai-glow" 
                        placeholder="Ask AI to create a policy... e.g., 'Alert if worker enters restricted area without PPE.'"
                      ></textarea>
                      <div className="flex justify-end shrink-0">
                        <button className="bg-gradient-to-r from-primary to-[#1565C0] text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg flex items-center gap-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                          <span className="material-symbols-outlined text-sm">send</span>
                          Parse Policy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parser Confidence result */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/30 flex flex-col gap-sm relative">
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-sm">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-on-surface-variant text-xl">psychology</span>
                      <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">AI Intent Parsing</h3>
                    </div>
                    <span className="bg-secondary-fixed/50 text-on-secondary-fixed font-label-md text-label-md px-2 py-0.5 rounded text-[10px] border border-secondary-fixed-dim/30">Confidence: 98%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-sm flex-grow">
                    <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/20 flex flex-col gap-xs">
                      <span className="font-label-md text-label-md text-outline text-[10px] uppercase">Object Detected</span>
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Personnel (Human)</span>
                    </div>
                    <div className="bg-surface-container-low rounded-lg p-sm border border-outline-variant/20 flex flex-col gap-xs">
                      <span className="font-label-md text-label-md text-outline text-[10px] uppercase">Rule Trigger Condition</span>
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">Missing Safety Helmet</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group Policy configuration editor */}
              <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant/20 space-y-md">
                <div className="border-b border-outline-variant/20 pb-sm flex justify-between items-center">
                  <h3 className="font-headline-md text-headline-md text-on-surface">Security Policy Configuration Groups</h3>
                  <button 
                    onClick={() => {
                      const name = prompt('Masukkan Nama Policy Group Baru:');
                      if (name && name.trim()) {
                        const desc = prompt('Masukkan Deskripsi Group:');
                        const newGrp = { id: `group-${Date.now()}`, name: name.trim(), description: desc || '', skills: [] };
                        setWorkloadGroups(prev => [...prev, newGrp]);
                        setSelectedGroupId(newGrp.id);
                      }
                    }}
                    className="px-3 py-1.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/95 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Create Policy Group
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
                  {/* Sidebar list of policy groups */}
                  <div className="space-y-sm border-r border-outline-variant/10 pr-md">
                    {workloadGroups.map(group => (
                      <div 
                        key={group.id}
                        onClick={() => setSelectedGroupId(group.id)}
                        className={`p-sm rounded-lg border transition-all cursor-pointer ${
                          selectedGroupId === group.id ? 'bg-primary-container text-on-primary-container border-primary shadow-sm font-semibold' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'
                        }`}
                      >
                        <h4 className="font-label-md text-label-md truncate">{group.name}</h4>
                        <p className="font-body-sm text-body-sm opacity-80 line-clamp-1">{group.description}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skills lists of the active group */}
                  <div className="lg:col-span-2 space-y-md">
                    {(() => {
                      const activeGroup = workloadGroups.find(g => g.id === selectedGroupId) || workloadGroups[0];
                      if (!activeGroup) return <div className="text-outline text-body-sm py-4">No policy group selected.</div>;
                      return (
                        <div className="space-y-md">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-headline-md text-headline-md text-on-surface">{activeGroup.name}</h4>
                              <button 
                                onClick={() => handleDeleteGroup(activeGroup.id)}
                                className="text-error hover:underline font-label-md text-label-md flex items-center gap-0.5"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span> Delete Group
                              </button>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{activeGroup.description}</p>
                          </div>

                          {/* Skill lists CRUD */}
                          <div className="space-y-sm">
                            <div className="flex justify-between items-center">
                              <h5 className="font-label-md text-label-md uppercase tracking-wider text-outline">Detection Rules / Skills</h5>
                              <button 
                                onClick={() => {
                                  const code = prompt('Masukkan Event Code (e.g. no_human_zone, overspeed):');
                                  const desc = prompt('Masukkan Deskripsi Rule:');
                                  if (code && desc) {
                                    setWorkloadGroups(prev => {
                                      return prev.map(g => {
                                        if (g.id !== activeGroup.id) return g;
                                        return {
                                          ...g,
                                          skills: [...g.skills, { id: `skill-${Date.now()}`, code: code.trim(), description: desc.trim(), guidelines: '' }]
                                        };
                                      });
                                    });
                                  }
                                }}
                                className="px-2.5 py-1 border border-primary text-primary font-label-md text-xs rounded hover:bg-primary-container/10 flex items-center gap-1 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px]">add</span> Add Rule
                              </button>
                            </div>

                            <div className="divide-y divide-outline-variant/10">
                              {activeGroup.skills.map(sk => (
                                <div key={sk.id} className="py-2.5 flex justify-between items-center">
                                  <div>
                                    <span className="font-body-sm text-body-sm font-semibold text-on-surface block">{sk.description}</span>
                                    <code className="text-[10px] font-mono bg-surface-container-high px-1.5 py-0.2 rounded text-primary mt-1 inline-block">{sk.code}</code>
                                  </div>
                                  <button 
                                    onClick={() => handleDeleteSkillFromGroup(activeGroup.id, sk.id)}
                                    className="p-1 text-on-surface-variant hover:text-error transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                  </button>
                                </div>
                              ))}
                              {activeGroup.skills.length === 0 && (
                                <div className="text-center py-6 text-outline font-body-sm border border-dashed border-outline-variant/20 rounded-lg">No AI rules added to this policy group.</div>
                              )}
                            </div>
                          </div>

                          {/* Sector Assignments */}
                          <div className="border-t border-outline-variant/20 pt-md">
                            <h5 className="font-label-md text-label-md uppercase tracking-wider text-outline">Sector Deployments</h5>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
                              {sites.map(site => {
                                const currentGroupId = sectorGroupAssignments[site.id] || 'group-danger';
                                const isAssignedToThisGroup = currentGroupId === activeGroup.id;
                                return (
                                  <div key={site.id} className="p-sm rounded-lg bg-surface border border-outline-variant/20 flex flex-col justify-between gap-sm">
                                    <span className="font-body-sm text-body-sm font-bold text-on-surface">{site.name}</span>
                                    {isAssignedToThisGroup ? (
                                      <span className="bg-green-100 text-green-700 font-label-md text-[10px] font-bold px-2 py-0.5 rounded text-center">Deployed Here</span>
                                    ) : (
                                      <button 
                                        onClick={() => handleAssignSectorGroup(site.id, activeGroup.id)}
                                        className="text-xs font-semibold text-primary hover:underline text-left"
                                      >
                                        Deploy to Sector
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: CAMERA MANAGEMENT */}
          {activeSubTab === 'camera_management' && (
            <div className="flex-grow space-y-md">
              <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                <div>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface">Camera Management</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">Monitor and maintain enterprise surveillance infrastructure.</p>
                </div>
                
                {/* Add new camera trigger button */}
                <button 
                  onClick={() => {
                    const name = prompt('Masukkan Nama Kamera Baru:');
                    if (name && name.trim()) {
                      const desc = prompt('Masukkan Deskripsi/Feed:');
                      const siteId = prompt(`Pilih Sektor ID (${sites.map(s=>s.id).join(', ')}):`);
                      if (sites.some(s => s.id === siteId)) {
                        // Trigger add action
                        const newC = {
                          id: `cam-${siteId}-${Date.now()}`,
                          name: name.trim(),
                          type: 'cctv',
                          status: 'ONLINE',
                          feedDescription: desc || `Kamera baru di Sektor ${siteId}`,
                          clippings: []
                        };
                        setSites(prev => prev.map(s => {
                          if (s.id !== siteId) return s;
                          return {
                            ...s,
                            cctvTotal: s.cctvTotal + 1,
                            cctvOnline: s.cctvOnline + 1,
                            details: [...s.details, newC]
                          };
                        }));
                        alert('Kamera Baru Berhasil Ditambahkan.');
                      } else {
                        alert('Sektor tidak valid.');
                      }
                    }
                  }}
                  className="bg-primary text-on-primary font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center gap-xs shadow-sm hover:bg-primary/95 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add CCTV Camera
                </button>
              </div>

              {/* Data Grid Table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant/20 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                        <th className="py-3 px-4">Camera ID</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Zone Sektor</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/10">
                      {sites.flatMap(s => s.details.filter(d => d.type === 'cctv').map(cam => ({ ...cam, site: s }))).map((cam, idx) => {
                        const isCamOffline = cam.status === 'OFFLINE';
                        return (
                          <tr key={cam.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3 px-4 font-mono-data text-on-surface-variant">{cam.id}</td>
                            <td className="py-3 px-4 font-semibold">{cam.name}</td>
                            <td className="py-3 px-4">{cam.site.name}</td>
                            <td className="py-3 px-4 text-on-surface-variant max-w-xs truncate">{cam.feedDescription}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                isCamOffline ? 'bg-error-container text-error border border-error/20' : 'bg-green-50 text-green-700 border border-green-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isCamOffline ? 'bg-error animate-pulse' : 'bg-green-500'}`}></span>
                                {cam.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right flex justify-end gap-1.5">
                              <button 
                                onClick={() => {
                                  const newStatus = cam.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
                                  setSites(prev => prev.map(s => {
                                    if (s.id !== cam.site.id) return s;
                                    return {
                                      ...s,
                                      cctvOffline: s.cctvOffline + (newStatus === 'OFFLINE' ? 1 : -1),
                                      cctvOnline: s.cctvOnline + (newStatus === 'ONLINE' ? 1 : -1),
                                      details: s.details.map(d => d.id === cam.id ? { ...d, status: newStatus } : d)
                                    };
                                  }));
                                }}
                                className="text-xs font-semibold text-primary hover:underline p-1"
                                title="Toggle status online/offline"
                              >
                                Toggle Status
                              </button>
                              <span className="text-outline">|</span>
                              <button 
                                onClick={() => handleDeleteCctv(cam.site.id, cam.id)}
                                className="text-xs font-semibold text-error hover:underline p-1"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeSubTab === 'settings' && (
            <div className="flex-grow space-y-md">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">User Settings</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage system operators and authorization logs.</p>
                </div>
                
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-primary text-on-primary font-label-md text-label-md py-2.5 px-4 rounded-lg flex items-center justify-center gap-xs shadow-sm hover:bg-primary/95 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Add User Access
                </button>
              </div>

              {/* Users table */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                      <th className="py-3 px-4">Username</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Role Access</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm text-body-sm text-on-surface divide-y divide-outline-variant/10">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="py-3 px-4 font-mono-data text-primary">@{u.username}</td>
                        <td className="py-3 px-4 font-semibold">{u.fullName}</td>
                        <td className="py-3 px-4">{u.role}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="text-xs font-semibold text-error hover:underline"
                            disabled={u.username === 'admin'}
                            style={{ opacity: u.username === 'admin' ? 0.4 : 1 }}
                          >
                            Revoke Access
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ===== MODAL: ADD USER MODAL ===== */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center z-50 p-sm">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-md shadow-lg border border-outline-variant/20 flex flex-col gap-md relative">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-on-surface font-bold">Add Operator Access</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Delegate monitoring permissions to a new team member.</p>
              </div>
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface rounded-full transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Username</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="e.g. fawwas.a" 
                  required
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="e.g. Fawwas Az-zuhri" 
                  required
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Role Permission</label>
                <select 
                  value={newUserRole}
                  onChange={e => setNewUserRole(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-md"
                >
                  <option value="Operator">Operator</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant/15">
                <button 
                  type="button" 
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary/95 transition-colors shadow-sm"
                >
                  Confirm User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
// End of Dashboard component

