import { Shield, Layers, Video, Cpu } from 'lucide-react';
import img1 from '../../assets/1.webp';
import img2 from '../../assets/2.jpg';
import img3 from '../../assets/3.png';
import img4 from '../../assets/4.png';

export default function LiveMonitoringTab({ 
  policies, 
  violations, 
  cameras 
}) {
  const images = [img1, img2, img3, img4];

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in flex-1 min-h-[500px]">
      
      {/* Left Area: Camera Grid */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
              <Video className="text-blue-600" />
              AI Agent Execution Grid
            </h2>
            <p className="text-xs text-slate-500">Real-time mapping layers showing active AI Agents inspecting video streams.</p>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            ACTIVE MONITORING
          </span>
        </div>

        {/* Camera Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cameras.map((cam, idx) => {
            const camImg = images[idx % images.length];
            const isOffline = cam.status === 'OFFLINE';

            // Custom overlay labels representing Agent specs
            let agentOverlay = null;
            if (idx === 0) {
              agentOverlay = {
                agent: 'Crane Zone Safety Agent',
                policy: 'Restricted Area Access',
                object: 'Personnel (Human)',
                risk: 'High Risk',
                tier: 'HIGH',
                boxColor: 'border-red-500 bg-red-500/10'
              };
            } else if (idx === 1) {
              agentOverlay = {
                agent: 'PPE Compliance Agent',
                policy: 'PPE Compliance Policy',
                object: 'Personnel, Safety Helmet',
                risk: 'Medium Risk',
                tier: 'MEDIUM',
                boxColor: 'border-yellow-500 bg-yellow-500/5'
              };
            } else if (idx === 2) {
              agentOverlay = {
                agent: 'Haul Road Monitoring Agent',
                policy: 'Haul Road Speed Limit',
                object: 'Heavy Haul Truck',
                risk: 'Low Risk',
                tier: 'MEDIUM',
                boxColor: 'border-green-500 bg-green-500/5'
              };
            }

            return (
              <div 
                key={cam.id} 
                className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all flex flex-col relative group"
              >
                {/* Overlay Header */}
                <div className="absolute top-0 inset-x-0 bg-gradient-to-b from-black/85 to-transparent p-3 flex justify-between items-center z-10">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 drop-shadow">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-slate-500' : 'bg-green-500'}`}></span>
                    {cam.name}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono drop-shadow bg-black/40 px-2 py-0.5 rounded">
                    {isOffline ? 'OFFLINE' : agentOverlay ? agentOverlay.agent : 'AI ACTIVE'}
                  </span>
                </div>

                {/* Feed Screen */}
                <div className="aspect-video relative flex items-center justify-center bg-slate-900 overflow-hidden">
                  {isOffline ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <span className="material-symbols-outlined text-4xl">videocam_off</span>
                      <span className="text-xs font-semibold">Feed Offline / Standby</span>
                    </div>
                  ) : (
                    <>
                      <img src={camImg} alt={cam.name} className="w-full h-full object-cover opacity-80" />
                      <div className="cctv-scan-line"></div>

                      {/* AI Bounding Box Overlays */}
                      {agentOverlay && (
                        <div className={`absolute top-[30%] left-[25%] w-[45%] h-[45%] border-2 rounded ${agentOverlay.boxColor}`}>
                          <div className="absolute -top-6 left-0 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-slate-700 shadow flex flex-col gap-0.5 leading-tight z-15">
                            <span className="font-bold text-yellow-400">{agentOverlay.agent}</span>
                            <span>Obj: {agentOverlay.object} | Risk: {agentOverlay.risk} | Tier: {agentOverlay.tier}</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer details about policy execution */}
                <div className="bg-slate-900 p-3 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <Cpu size={12} className="text-blue-400" />
                    {isOffline ? 'No Rules Active' : `Mapped Policy: ${agentOverlay ? agentOverlay.policy : 'Access Control'}`}
                  </span>
                  {!isOffline && (
                    <span className="text-slate-500 font-mono">1080p • 25 FPS</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Area: Policy Executions Summary & Timeline */}
      <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
        
        {/* Active Policies Tracker */}
        <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Layers size={16} className="text-blue-600" />
            Deployed AI Agents ({policies.length})
          </h3>
          <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto scrollbar-none">
            {policies.map((p, index) => (
              <div key={index} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-800 truncate">{p.name}</span>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="font-mono">{p.category}</span>
                  <span className="text-green-600 font-semibold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full text-[8px]"></span>
                    Inspecting
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Violations Feed */}
        <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex-1 flex flex-col gap-3 min-h-[300px]">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <Shield size={16} className="text-blue-600" />
            Active Violations Feed
          </h3>
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 max-h-[320px] scrollbar-none pr-1">
            {violations.map((a, idx) => (
              <div 
                key={a.id || idx} 
                className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-1"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                    a.severity === 'Critical' ? 'bg-red-50 text-red-800 border-red-200' : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                  }`}>
                    {a.severity} Tier
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{a.time}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">Violation: {a.type}</p>
                <span className="text-[9px] text-slate-400 block mt-1">Agent: {a.policySource.replace('Policy', 'Agent')}</span>
              </div>
            ))}
            {violations.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                <span className="material-symbols-outlined text-3xl text-slate-300 mb-1">radar</span>
                <p className="text-[11px] text-slate-500">Scanning for active triggers...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
