import React from 'react';
import { 
  Video, Map, Settings, Trash2, Plus
} from 'lucide-react';

export default function InfrastructureTab({ 
  cameras, 
  onToggleCameraStatus, 
  onAddCamera, 
  onDeleteCamera,
  activeSubView = 'cameras',
  setActiveSubView
}) {
  
  // Camera form state
  const [newCamName, setNewCamName] = React.useState('');
  const [newCamDesc, setNewCamDesc] = React.useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCamName.trim()) return;
    onAddCamera({ name: newCamName, description: newCamDesc });
    setNewCamName('');
    setNewCamDesc('');
  };

  const geofences = [
    { id: 'geo-1', name: 'Crane Area Zone A', type: 'Restricted Zone', activePolicies: 'Restricted Access', coverage: '3 Cameras' },
    { id: 'geo-2', name: 'West Quarry Pit Face', type: 'Danger Zone', activePolicies: 'Hardhat PPE Audit', coverage: '4 Cameras' },
    { id: 'geo-3', name: 'Crusher Conveyor Line', type: 'Operational Area', activePolicies: 'Loader Proximity check', coverage: '2 Cameras' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in flex-1">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
            <Settings className="text-slate-400" />
            System Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure CCTV mapping layers and drawn spatial geofence boundaries.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveSubView('cameras')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'cameras' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video size={14} />
            Camera Mapping
          </button>
          <button
            onClick={() => setActiveSubView('geofences')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'geofences' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Map size={14} />
            Geofence Mapping
          </button>
        </div>
      </div>

      {activeSubView === 'cameras' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cameras Table */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden flex flex-col">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Camera Feed</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {cameras.map(cam => (
                  <tr key={cam.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{cam.name}</td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">{cam.feedDescription}</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => onToggleCameraStatus(cam.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          cam.status === 'ONLINE' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'ONLINE' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        {cam.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button 
                        onClick={() => onDeleteCamera(cam.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete camera feed"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Camera Form */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-blue-50 shadow-sm p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Plus size={16} /> Register New CCTV
            </h3>

            <form onSubmit={handleAdd} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Camera Name</label>
                <input
                  type="text"
                  required
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  placeholder="e.g. CCTV Excavator PC200 03"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feed Description</label>
                <input
                  type="text"
                  value={newCamDesc}
                  onChange={(e) => setNewCamDesc(e.target.value)}
                  placeholder="e.g. Western quarry haul road incline view"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow flex items-center justify-center gap-1.5 mt-2"
              >
                <Plus size={14} /> Add Camera Feed
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Geofence Zones Map & Data */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Spatial Grid representation */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col gap-3 min-h-[380px] relative">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Spatial Geofence Layout
            </h3>
            
            {/* Mock map coordinate grid */}
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-50/20 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-blue-200/50"></div>
                ))}
              </div>
              
              <span className="font-mono text-[10px] text-slate-400 select-none">Mine Site Satellitary Plotting Grid</span>

              {/* Geofence visual areas overlay */}
              <div className="absolute top-[20%] left-[15%] w-[35%] h-[25%] bg-blue-600/10 border-2 border-dashed border-blue-600/40 rounded flex items-center justify-center">
                <span className="font-bold text-[9px] text-blue-600 uppercase tracking-wide">Zone A Crane (Geofenced)</span>
              </div>

              <div className="absolute bottom-[20%] left-[50%] w-[30%] h-[30%] bg-red-600/10 border-2 border-dashed border-red-600/40 rounded flex items-center justify-center">
                <span className="font-bold text-[9px] text-red-600 uppercase tracking-wide">Danger West Pit Face</span>
              </div>
            </div>
          </div>

          {/* Zones metadata table */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Configured Geofences
            </h3>

            <div className="flex flex-col gap-3">
              {geofences.map(geo => (
                <div key={geo.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">{geo.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-50 text-blue-600 border border-blue-100 rounded">
                      {geo.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Policy: {geo.activePolicies}</span>
                    <span>Coverage: {geo.coverage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
