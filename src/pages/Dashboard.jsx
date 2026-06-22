import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Home as HomeIcon, Cpu, Shield, AlertTriangle, 
  Activity, Settings, LogOut, Video, 
  Menu, X, RefreshCw, CheckCircle2, ChevronDown, Layers
} from 'lucide-react';

// Import subcomponents
import HomeTab from '../components/dashboard/HomeTab';
import PolicyStudioTab from '../components/dashboard/PolicyStudioTab';
import LiveMonitoringTab from '../components/dashboard/LiveMonitoringTab';
import ValidationCenterTab from '../components/dashboard/ValidationCenterTab';
import InvestigationCenterTab from '../components/dashboard/InvestigationCenterTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';
import InfrastructureTab from '../components/dashboard/InfrastructureTab';
import SettingsTab from '../components/dashboard/SettingsTab';

export default function Dashboard() {
  const navigate = useNavigate();

  // Navigation tabs state
  const [activeTab, setActiveTab] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [opMenuOpen, setOpMenuOpen] = useState(true);
  const [intelMenuOpen, setIntelMenuOpen] = useState(true);
  const [configMenuOpen, setConfigMenuOpen] = useState(true);
  
  // Infrastructure sub-tab selection (cameras vs geofences)
  const [infraSubTab, setInfraSubTab] = useState('cameras');

  // Shared state
  const [nlpPrompt, setNlpPrompt] = useState('');
  
  // Active Policies (PRD Alignment)
  const [activePolicies, setActivePolicies] = useState([
    { id: 'pol-1', name: 'Restricted Area Access', description: 'Detect and prevent unauthorized entries in high-hazard zones.', category: 'Security' },
    { id: 'pol-2', name: 'PPE Compliance', description: 'Log safety deviations if crew wears no safety helmet in pit face.', category: 'Safety' },
    { id: 'pol-3', name: 'After Hours Access', description: 'Enforce access rules inside critical workshop bays during operational downtime.', category: 'Security' },
    { id: 'pol-4', name: 'Crane Safety Monitoring', description: 'Validate crane lifting zone radius safety.', category: 'Safety' },
    { id: 'pol-5', name: 'Haul Road Monitoring', description: 'Audit speed limits and traffic direction violations.', category: 'Operations' }
  ]);

  // Active Deployed Agents (PRD Alignment)
  const [activeAgents, setActiveAgents] = useState([
    { id: 'agent-1', name: 'Crane Zone Safety Agent', policyName: 'Restricted Area Access', coverage: '3 Cameras', zone: 'Crane Zone A', priority: 'HIGH' },
    { id: 'agent-2', name: 'PPE Compliance Agent', policyName: 'PPE Compliance', coverage: '8 Cameras', zone: 'West Quarry Pit Face', priority: 'MEDIUM' },
    { id: 'agent-3', name: 'After Hours Monitoring Agent', policyName: 'After Hours Access', coverage: '6 Cameras', zone: 'Workshop Area', priority: 'HIGH' },
    { id: 'agent-4', name: 'Haul Road Monitoring Agent', policyName: 'Haul Road Monitoring', coverage: '5 Cameras', zone: 'Haul Road Sector B', priority: 'MEDIUM' },
    { id: 'agent-5', name: 'Workshop Safety Agent', policyName: 'Crane Safety Monitoring', coverage: '4 Cameras', zone: 'Workshop Area', priority: 'LOW' }
  ]);

  // Dynamic generator to build 50 violations with the exact PRD distribution:
  // High: 10, Medium: 20, Low: 20
  const generateInitialViolations = () => {
    const list = [];
    const camerasList = [
      'CCTV Excavator Shovel 01',
      'CCTV Crane Area 01',
      'CCTV Haul Road Incline A',
      'CCTV Workshop Main Bay',
      'CCTV Quarry Loading Dock'
    ];
    
    const highTypes = [
      'Unauthorized Restricted Area Entrance',
      'Critical Crane Zone Boundary Hit',
      'Danger Zone Entry - Personnel Close Contact',
      'High Hazard Zone Intrusion'
    ];
    
    const medTypes = [
      'Unhelmeted Worker Area Entrance',
      'Haul Truck Speed Limit Exceeded',
      'Safety Vest Not Worn - Pit Face',
      'Workshop Bay Proximity Violation'
    ];
    
    const lowTypes = [
      'Routine Operational Transit Log',
      'Equipment Drift Warning',
      'Operational Area Access Recorded',
      'Low Risk Speed Audit Recorded'
    ];

    const getRandomTime = (index) => {
      const hr = String(10 + Math.floor(index / 10)).padStart(2, '0');
      const min = String((index * 17) % 60).padStart(2, '0');
      const sec = String((index * 23) % 60).padStart(2, '0');
      return `${hr}:${min}:${sec}`;
    };

    // 10 High severity violation events
    for (let i = 1; i <= 10; i++) {
      list.push({
        id: `v-high-${i}`,
        type: highTypes[i % highTypes.length],
        camera: camerasList[i % camerasList.length],
        location: i % 2 === 0 ? 'Crane Zone A' : 'Pit Face A',
        time: getRandomTime(i),
        severity: 'Critical',
        policySource: 'Restricted Area Access',
        status: i <= 4 ? 'Dispatched' : 'Awaiting Validation'
      });
    }

    // 20 Medium severity violation events
    for (let i = 1; i <= 20; i++) {
      list.push({
        id: `v-med-${i}`,
        type: medTypes[i % medTypes.length],
        camera: camerasList[(i + 1) % camerasList.length],
        location: i % 2 === 0 ? 'Workshop Area' : 'Pit Incline West',
        time: getRandomTime(i + 10),
        severity: 'Medium',
        policySource: 'PPE Compliance',
        status: i <= 8 ? 'Closed' : 'Review Required'
      });
    }

    // 20 Low severity violation events (bypass validation -> Log Only)
    for (let i = 1; i <= 20; i++) {
      list.push({
        id: `v-low-${i}`,
        type: lowTypes[i % lowTypes.length],
        camera: camerasList[(i + 2) % camerasList.length],
        location: i % 2 === 0 ? 'Haul Road Sector B' : 'Workshop Area',
        time: getRandomTime(i + 30),
        severity: 'Low',
        policySource: 'Haul Road Monitoring',
        status: 'Auto Logged'
      });
    }

    return list;
  };

  const [violations, setViolations] = useState(generateInitialViolations());

  const [cameras, setCameras] = useState([
    { id: 'cam-1', name: 'CCTV Crane Area 01', status: 'ONLINE', feedDescription: 'Main heavy crane lifting yard monitoring' },
    { id: 'cam-2', name: 'CCTV Excavator Shovel 01', status: 'ONLINE', feedDescription: 'Excavator loading coal area' },
    { id: 'cam-3', name: 'CCTV Haul Road Incline A', status: 'ONLINE', feedDescription: 'Coal haul trucks transit incline route' },
    { id: 'cam-4', name: 'CCTV Workshop Main Bay', status: 'ONLINE', feedDescription: 'Heavy truck maintenance bay monitoring' }
  ]);

  const [activeViolation, setActiveViolation] = useState(null);

  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Demo Playbook steps
  const [demoStep, setDemoStep] = useState(1);

  // Force authentication check
  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  // Auth logout handler
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  // 1. Natural Language Policy Generation handler
  const handleGeneratePolicy = (promptText) => {
    setNlpPrompt(promptText);
    setActiveTab('policy_studio');
    setDemoStep(2); // Advance demo to deploying agent
    showToast("Intent loaded into Policy Studio. Ready to generate agent.", "info");
  };

  // 2. Policy Studio deployment trigger
  const handleActivatePolicy = (agentProfile) => {
    const newPolicy = {
      id: `pol-${Date.now()}`,
      name: agentProfile.policyName,
      description: `Natural language policy rules for ${agentProfile.name}`,
      category: agentProfile.category
    };

    const newAgent = {
      id: `agent-${Date.now()}`,
      name: agentProfile.agentName,
      policyName: agentProfile.policyName,
      coverage: agentProfile.coverage,
      zone: agentProfile.zone,
      priority: agentProfile.priority
    };

    setActivePolicies([newPolicy, ...activePolicies]);
    setActiveAgents([newAgent, ...activeAgents]);
    showToast(`AI Agent Deployed: "${newAgent.name}" is now running active monitoring missions!`, "success");
    setDemoStep(3); // Advance demo to trigger violation simulation
    setActiveTab('home');
  };

  // 3. Simulated violation event trigger
  const handleTriggerViolationSimulation = () => {
    const time = new Date().toLocaleTimeString('id-ID');
    const newViolation = {
      id: `v-sim-${Date.now()}`,
      type: 'Unauthorized Restricted Area Entrance',
      camera: 'CCTV Crane Area 01',
      location: 'Crane Zone A',
      time,
      severity: 'Critical', // Mapped as High Priority (Red)
      policySource: 'Restricted Area Access',
      status: 'Awaiting Validation'
    };

    setViolations([newViolation, ...violations]);
    showToast("⚠️ VIOLATION DETECTED: Personnel inside Crane Zone A (High Priority)!", "error");
    setDemoStep(4); // Advance demo to Validation Center
    setActiveTab('validation_center');
  };

  // 4. Validate violation status
  const handleValidateViolation = (violationObj, nextStatus) => {
    setViolations(violations.map(v => v.id === violationObj.id ? { ...v, status: nextStatus } : v));
    showToast(`Violation status validated as: ${nextStatus}.`, "success");
    if (nextStatus === 'Dispatched') {
      setActiveViolation(violationObj); // Save context for Investigation tab
      setDemoStep(5); // Advance to investigation
    }
  };

  // 5. Open Investigation Workspace for a violation
  const handleInvestigateViolation = (violationObj) => {
    setActiveViolation(violationObj);
    setActiveTab('investigation_center');
    setDemoStep(6); // Advance to asking AI
  };

  // Infrastructure modification handlers
  const handleToggleCameraStatus = (camId) => {
    setCameras(cameras.map(c => c.id === camId ? { ...c, status: c.status === 'ONLINE' ? 'OFFLINE' : 'ONLINE' } : c));
    showToast("Camera status updated.", "info");
  };

  const handleAddCamera = (newCamDetails) => {
    const newC = {
      id: `cam-${Date.now()}`,
      name: newCamDetails.name,
      status: 'ONLINE',
      feedDescription: newCamDetails.description || 'General Monitoring feed'
    };
    setCameras([...cameras, newC]);
    showToast("New camera feed registered.", "success");
  };

  const handleDeleteCamera = (camId) => {
    setCameras(cameras.filter(c => c.id !== camId));
    showToast("Camera feed deleted.", "warning");
  };

  return (
    <div className="bg-[#FAFBFD] text-slate-800 font-sans min-h-screen flex flex-col md:flex-row antialiased relative">
      
      {/* Toast Banner Overlay */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 border text-xs font-semibold animate-fade-in ${
          toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200 shadow-red-100' :
          toast.type === 'info' ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-blue-100' :
          toast.type === 'warning' ? 'bg-orange-50 text-orange-800 border-orange-200 shadow-orange-100' :
          'bg-green-50 text-green-800 border-green-200 shadow-green-100'
        }`}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          {toast.message}
        </div>
      )}

      {/* ===== SIDEBAR NAVIGATION ===== */}
      <nav className="bg-[#0B1D3A] text-slate-300 w-full md:w-64 flex flex-col justify-between shrink-0 p-4 border-r border-blue-900/30 z-30 md:h-screen md:sticky md:top-0">
        <div className="flex flex-col gap-6">
          {/* Logo / Header */}
          <div className="flex justify-between items-center px-2 py-3 border-b border-blue-950">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/95 rounded-lg flex items-center justify-center shadow-md">
                <img src="/logo.png" alt="PamAgents Logo" className="h-6 w-auto" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight flex items-center gap-0.5">
                Pam<span className="text-[#FFC107]">Agents</span>
              </span>
            </div>
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-1 hover:bg-white/10 rounded"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation links */}
          <div className={`flex-col gap-1.5 ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                activeTab === 'home' ? 'bg-white/10 text-white font-bold' : ''
              }`}
            >
              <HomeIcon size={16} />
              <span>HOME</span>
            </button>

            {/* POLICY STUDIO */}
            <button
              onClick={() => { setActiveTab('policy_studio'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                activeTab === 'policy_studio' 
                  ? 'bg-yellow-400 text-blue-950 border-yellow-400 shadow-md shadow-yellow-400/20' 
                  : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20'
              }`}
            >
              <Sparkles size={16} className={activeTab === 'policy_studio' ? 'animate-pulse' : ''} />
              <span>POLICY STUDIO ⭐</span>
            </button>

            {/* OPERATIONS Section */}
            <div className="mt-4 flex flex-col gap-1">
              <button 
                onClick={() => setOpMenuOpen(!opMenuOpen)}
                className="text-[10px] font-bold text-slate-500 px-3 py-1 uppercase tracking-widest flex items-center justify-between w-full text-left"
              >
                <span>Operations</span>
                <ChevronDown size={12} className={`transition-transform ${opMenuOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {opMenuOpen && (
                <div className="flex flex-col gap-0.5 pl-2 animate-fade-in">
                  <button
                    onClick={() => { setActiveTab('live_monitoring'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'live_monitoring' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Video size={15} />
                    <span>Live Monitoring</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('validation_center'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'validation_center' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Shield size={15} />
                    <span>Validation Center</span>
                  </button>
                </div>
              )}
            </div>

            {/* INTELLIGENCE Section */}
            <div className="mt-4 flex flex-col gap-1">
              <button 
                onClick={() => setIntelMenuOpen(!intelMenuOpen)}
                className="text-[10px] font-bold text-slate-500 px-3 py-1 uppercase tracking-widest flex items-center justify-between w-full text-left"
              >
                <span>Intelligence</span>
                <ChevronDown size={12} className={`transition-transform ${intelMenuOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {intelMenuOpen && (
                <div className="flex flex-col gap-0.5 pl-2 animate-fade-in">
                  <button
                    onClick={() => { setActiveTab('investigation_center'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'investigation_center' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Cpu size={15} />
                    <span>Investigation Workspace</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'analytics' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Activity size={15} />
                    <span>Analytics</span>
                  </button>
                </div>
              )}
            </div>

            {/* SYSTEM CONFIGURATION Section (Revisi Strategis 2 - Nested Sub-views) */}
            <div className="mt-4 flex flex-col gap-1">
              <button 
                onClick={() => setConfigMenuOpen(!configMenuOpen)}
                className="text-[10px] font-bold text-slate-500 px-3 py-1 uppercase tracking-widest flex items-center justify-between w-full text-left"
              >
                <span>System Configuration</span>
                <ChevronDown size={12} className={`transition-transform ${configMenuOpen ? '' : '-rotate-90'}`} />
              </button>
              
              {configMenuOpen && (
                <div className="flex flex-col gap-0.5 pl-2 animate-fade-in">
                  <button
                    onClick={() => { setActiveTab('infrastructure'); setInfraSubTab('cameras'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'infrastructure' && infraSubTab === 'cameras' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Video size={15} />
                    <span>Camera Mapping</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('infrastructure'); setInfraSubTab('geofences'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                      activeTab === 'infrastructure' && infraSubTab === 'geofences' ? 'bg-white/10 text-white font-bold' : ''
                    }`}
                  >
                    <Layers size={15} />
                    <span>Geofence Mapping</span>
                  </button>
                </div>
              )}
            </div>

            {/* SETTINGS */}
            <div className="mt-4 flex flex-col gap-1">
              <button
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all hover:bg-white/5 hover:text-white ${
                  activeTab === 'settings' ? 'bg-white/10 text-white font-bold' : ''
                }`}
              >
                <Settings size={15} />
                <span>SETTINGS</span>
              </button>
            </div>

          </div>
        </div>

        {/* User profile / Logout */}
        <div className={`border-t border-blue-950 pt-4 mt-auto flex items-center gap-3 justify-between ${mobileMenuOpen ? 'flex' : 'hidden md:flex'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-xs shrink-0 border border-blue-600">
              AN
            </div>
            <div className="min-w-0 leading-tight">
              <span className="text-xs font-bold text-white block truncate">Alvin Nugraha</span>
              <span className="text-[10px] text-slate-400 block truncate">Site Supervisor</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 transition-colors p-1"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* ===== MAIN WORKSPACE ===== */}
      <main className="flex-1 flex flex-col min-w-0 p-4 md:p-8 gap-6 md:pb-24 pb-36">
        
        {/* Render Tab Contents */}
        {activeTab === 'home' && (
          <HomeTab 
            policies={activePolicies} 
            agents={activeAgents} 
            violations={violations} 
            onGeneratePolicy={handleGeneratePolicy}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'policy_studio' && (
          <PolicyStudioTab 
            onActivatePolicy={handleActivatePolicy}
            nlpPrompt={nlpPrompt}
            setNlpPrompt={setNlpPrompt}
          />
        )}

        {activeTab === 'live_monitoring' && (
          <LiveMonitoringTab 
            policies={activePolicies}
            violations={violations}
            cameras={cameras}
          />
        )}

        {activeTab === 'validation_center' && (
          <ValidationCenterTab 
            violations={violations}
            onValidateViolation={handleValidateViolation}
            onInvestigateViolation={handleInvestigateViolation}
          />
        )}

        {activeTab === 'investigation_center' && (
          <InvestigationCenterTab 
            activeIncident={activeViolation}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab />
        )}

        {activeTab === 'infrastructure' && (
          <InfrastructureTab 
            cameras={cameras}
            onToggleCameraStatus={handleToggleCameraStatus}
            onAddCamera={handleAddCamera}
            onDeleteCamera={handleDeleteCamera}
            activeSubView={infraSubTab}
            setActiveSubView={setInfraSubTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}

      </main>

      {/* ===== FLOATING INTERACTIVE DEMO CONTROLLER ===== */}
      <div className="fixed bottom-4 inset-x-4 md:left-68 md:right-8 z-40 bg-slate-900/95 backdrop-blur border border-slate-800 text-white rounded-xl px-5 py-3 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-[#FFC107] text-slate-950 rounded-lg animate-pulse shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest block font-mono">Interactive Demo Playbook</span>
            <span className="text-xs text-slate-300 font-medium">
              {demoStep === 1 && "Step 1: Write a prompt on Home or click 'Generate Agent'"}
              {demoStep === 2 && "Step 2: Compile Agent and Deploy inside Policy Studio"}
              {demoStep === 3 && "Step 3: Trigger a simulated shift violation event!"}
              {demoStep === 4 && "Step 4: Go to Validation Center & Evaluate priority levels"}
              {demoStep === 5 && "Step 5: Investigate the dispatched incident in Investigation Workspace"}
              {demoStep === 6 && "Step 6: Query AI Incident Copilot in Investigation Workspace"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {demoStep === 3 ? (
            <button
              onClick={handleTriggerViolationSimulation}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 animate-bounce shadow-md shadow-red-900/20"
            >
              <AlertTriangle size={14} />
              Simulate Violation
            </button>
          ) : (
            <button
              onClick={() => {
                if (demoStep === 1) {
                  setNlpPrompt("Alert if personnel enters crane zone after working hours.");
                  setActiveTab('policy_studio');
                  setDemoStep(2);
                  showToast("Loaded restricted access prompt.", "info");
                } else if (demoStep === 2) {
                  setActiveTab('policy_studio');
                  showToast("Click 'Generate AI Agent' to compile.", "info");
                } else if (demoStep === 4) {
                  setActiveTab('validation_center');
                } else if (demoStep === 5) {
                  setActiveTab('investigation_center');
                  setDemoStep(6);
                } else if (demoStep === 6) {
                  setActiveTab('investigation_center');
                }
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              Guide Me
            </button>
          )}

          <button
            onClick={() => {
              setDemoStep(1);
              setNlpPrompt('');
              setViolations(generateInitialViolations());
              setActiveTab('home');
              showToast("Demo state reset.", "info");
            }}
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition-all"
            title="Reset Demo Flow"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
