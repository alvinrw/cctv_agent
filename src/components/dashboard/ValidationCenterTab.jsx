import React from 'react';
import { 
  ShieldAlert, Layers, Activity 
} from 'lucide-react';
import img3 from '../../assets/3.png';
import img4 from '../../assets/4.png';

export default function ValidationCenterTab({ 
  violations, 
  onValidateViolation, 
  onInvestigateViolation 
}) {
  const [activeTab, setActiveTab] = React.useState('High');
  const [selectedIdx, setSelectedIdx] = React.useState(0);

  const images = [img4, img3];

  // Filter violations based on tab (High Priority is Critical/High, Medium is Medium)
  const filteredViolations = violations.filter(v => {
    if (activeTab === 'High') return v.severity === 'Critical' || v.severity === 'High';
    return v.severity === 'Medium';
  });

  const activeViolation = filteredViolations[selectedIdx] || null;

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in flex-1 min-h-[520px]">
      
      {/* Left Area: Validation Queue & Tabs */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-blue-50 shadow-sm overflow-hidden">
        {/* Header and Toggle Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Human-In-The-Loop Validation</h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Supervisors evaluate real-time AI Agent detections before dispatch actions.</p>
          </div>
          
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => { setActiveTab('High'); setSelectedIdx(0); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'High' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              High Priority ({violations.filter(v => v.severity === 'Critical' || v.severity === 'High').length})
            </button>
            <button
              onClick={() => { setActiveTab('Medium'); setSelectedIdx(0); }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'Medium' ? 'bg-yellow-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Medium Priority ({violations.filter(v => v.severity === 'Medium').length})
            </button>
          </div>
        </div>

        {/* Violation Queue Cards List */}
        <div className="flex-1 overflow-y-auto max-h-[480px] divide-y divide-slate-100 scrollbar-none">
          {filteredViolations.map((v, index) => {
            const isSelected = selectedIdx === index;
            return (
              <div 
                key={v.id || index}
                onClick={() => setSelectedIdx(index)}
                className={`p-4 cursor-pointer transition-all flex items-start gap-4 justify-between border-l-4 ${
                  isSelected 
                    ? activeTab === 'High' ? 'bg-red-50/10 border-l-red-600' : 'bg-yellow-50/10 border-l-yellow-500' 
                    : 'border-l-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    activeTab === 'High' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    <ShieldAlert size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                      Agent: {v.policySource.replace('Policy', 'Agent')}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 truncate mt-0.5">{v.type}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">Location: {v.location}</p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="text-[10px] font-mono text-slate-400">{v.time}</span>
                  <div className="flex gap-1.5">
                    {activeTab === 'High' && (
                      <span className="bg-blue-50 text-blue-700 text-[8px] font-extrabold px-1.5 py-0.5 rounded border border-blue-100 uppercase">
                        Telegram Sent
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${
                      v.status === 'Closed' ? 'bg-green-100 text-green-700 border-green-200' : 
                      v.status === 'Dispatched' ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' :
                      'bg-orange-100 text-orange-700 border-orange-200'
                    }`}>
                      {v.status || 'Awaiting Validation'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredViolations.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">No active violations requiring validation in this tier.</div>
          )}
        </div>
      </div>

      {/* Right Column Layout: Lineage + Matrix + Business Impact Drawer */}
      <div className="w-full lg:w-[480px] flex flex-col gap-4 shrink-0">
        
        {/* Dynamic Detail Card */}
        {activeViolation ? (
          <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col gap-4">
            <div className="pb-3 border-b border-slate-100 flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Evaluation Node</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeViolation.type}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                activeTab === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activeViolation.severity}
              </span>
            </div>

            {/* Visual Agent Lifecycle Tracker (Revisi Strategis 2) */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-col gap-2 relative">
              <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-wider block font-mono">Agent Lifecycle Tracker</span>
              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-semibold font-mono">
                <span className="px-1 py-0.5 bg-green-950 text-green-400 border border-green-900/30 rounded">Policy Created ✓</span>
                <span className="text-slate-600">→</span>
                <span className="px-1 py-0.5 bg-green-950 text-green-400 border border-green-900/30 rounded">Agent Deployed ✓</span>
                <span className="text-slate-600">→</span>
                <span className="px-1 py-0.5 bg-green-950 text-green-400 border border-green-900/30 rounded">Monitoring Active ✓</span>
                <span className="text-slate-600">→</span>
                <span className="px-1 py-0.5 bg-green-950 text-green-400 border border-green-900/30 rounded">Violation Detected ✓</span>
                <span className="text-slate-600">→</span>
                <span className={`px-1 py-0.5 rounded ${
                  activeViolation.status === 'Closed' || activeViolation.status === 'Dispatched' || activeViolation.status === 'False Alarm' || activeViolation.status === 'False Positive'
                    ? 'bg-green-950 text-green-400 border border-green-900/30'
                    : 'bg-yellow-950 text-yellow-400 border border-yellow-900/30 animate-pulse'
                }`}>Validation Pending {activeViolation.status !== 'Closed' && activeViolation.status !== 'Dispatched' ? '?' : '✓'}</span>
                <span className="text-slate-600">→</span>
                <span className={`px-1 py-0.5 rounded ${
                  activeViolation.status === 'Closed' || activeViolation.status === 'Dispatched'
                    ? 'bg-blue-950 text-blue-300 border border-blue-900/30 font-bold'
                    : 'bg-slate-950 text-slate-600 border border-slate-900'
                }`}>Closed</span>
              </div>
            </div>

            {/* Evidence package based on priority */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {activeTab === 'High' ? 'Video Evidence (1 Minute Clip)' : 'Snapshot Burst Evidence'}
              </span>
              <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 relative shadow-inner">
                <img src={images[selectedIdx % images.length]} alt="Snapshot evidence" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                  {activeTab === 'High' ? 'VIDEO READY' : 'BURST PACKAGE'}
                </div>
              </div>
            </div>

            {/* Business Impact Panel */}
            <div className="p-3.5 bg-blue-50/30 rounded-lg border border-blue-50 flex flex-col gap-2 text-xs">
              <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">Business & Compliance Impact</span>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Est. Response Time</span>
                  <span className="font-semibold text-slate-800">{activeTab === 'High' ? '< 30 Seconds' : 'Review within shift'}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase">Compliance Impact</span>
                  <span className={`font-semibold ${activeTab === 'High' ? 'text-red-700' : 'text-yellow-700'}`}>
                    {activeTab === 'High' ? 'Critical Safety Risk' : 'Procedure Violation'}
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] text-slate-400 block uppercase">Notification Node</span>
                  <span className="font-semibold text-slate-800">{activeTab === 'High' ? 'Telegram + OCC' : 'Dashboard Alert'}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] text-slate-400 block uppercase">Log Retention</span>
                  <span className="font-semibold text-slate-800">{activeTab === 'High' ? 'Permanent' : '14 Days'}</span>
                </div>
              </div>
            </div>

            {/* Why This Matters Block (Only for High Priority) */}
            {activeTab === 'High' && (
              <div className="p-3.5 bg-red-950/10 rounded-lg border border-red-900/20 flex flex-col gap-2 text-xs">
                <span className="text-[10px] text-red-700 font-bold uppercase tracking-wider block font-mono">Why This Matters</span>
                <div className="flex flex-col gap-2 text-[11px] text-slate-700 leading-relaxed font-medium">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Compliance Impact</span>
                    <span>Unauthorized personnel detected inside active crane zone.</span>
                  </div>
                  <div className="border-t border-slate-100 pt-1.5">
                    <span className="text-slate-400 text-[10px] block">Potential Consequences</span>
                    <span className="text-red-700 font-semibold">• Personnel injury, operational disruption, safety violation</span>
                  </div>
                </div>
              </div>
            )}

            {/* Validation CTA Buttons */}
            {activeViolation.status !== 'Closed' && activeViolation.status !== 'Dispatched' && (
              <div className="flex gap-2 border-t border-slate-100 pt-3 mt-1">
                <button
                  onClick={() => {
                    onValidateViolation(activeViolation, activeTab === 'High' ? 'False Positive' : 'Dismiss');
                  }}
                  className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors"
                >
                  {activeTab === 'High' ? 'Mark False Positive' : 'Dismiss'}
                </button>
                <button
                  onClick={() => {
                    onValidateViolation(activeViolation, activeTab === 'High' ? 'Dispatched' : 'Closed');
                  }}
                  className={`flex-grow-2 py-2.5 text-white font-bold rounded-lg text-xs shadow flex items-center justify-center gap-1 ${
                    activeTab === 'High' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600 text-slate-950'
                  }`}
                >
                  {activeTab === 'High' ? 'Validate & Dispatch' : 'Validate'}
                </button>
                <button
                  onClick={() => onInvestigateViolation(activeViolation)}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center"
                  title="Investigate Details"
                >
                  <Activity size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-blue-50 p-6 text-center text-slate-400 text-xs flex items-center justify-center h-48 shadow-sm">
            Select a warning feed to view metadata.
          </div>
        )}

        {/* Permanent Operational Response Matrix Panel */}
        <div className="bg-slate-900 text-slate-300 rounded-xl border border-slate-800 p-5 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5 font-mono">
            <Layers size={14} className="text-yellow-400" />
            Operational Response Matrix
          </h3>

          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-[10px] border-collapse font-sans">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-2 pr-2">Priority</th>
                  <th className="py-2 px-2">Response</th>
                  <th className="py-2 px-2">Evidence</th>
                  <th className="py-2 pl-2">Notification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                <tr className="hover:bg-slate-850/50">
                  <td className="py-2.5 pr-2 font-extrabold text-red-500 uppercase">High</td>
                  <td className="py-2.5 px-2 text-slate-100 font-semibold">Dispatch</td>
                  <td className="py-2.5 px-2 text-slate-400">1 Min Video</td>
                  <td className="py-2.5 pl-2 text-slate-400">Telegram + OCC</td>
                </tr>
                <tr className="hover:bg-slate-850/50">
                  <td className="py-2.5 pr-2 font-extrabold text-yellow-500 uppercase">Medium</td>
                  <td className="py-2.5 px-2 text-slate-100 font-semibold">Review</td>
                  <td className="py-2.5 px-2 text-slate-400">Snapshot Burst</td>
                  <td className="py-2.5 pl-2 text-slate-400">Dashboard</td>
                </tr>
                <tr className="hover:bg-slate-850/50">
                  <td className="py-2.5 pr-2 font-extrabold text-green-500 uppercase">Low</td>
                  <td className="py-2.5 px-2 text-slate-100 font-semibold">Log Only</td>
                  <td className="py-2.5 px-2 text-slate-400">Snapshot</td>
                  <td className="py-2.5 pl-2 text-slate-400">Analytics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
