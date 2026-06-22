import React from 'react';
import { 
  Sparkles, AlertTriangle, Activity, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function HomeTab({ 
  agents, 
  violations, 
  onGeneratePolicy, 
  onNavigateToTab 
}) {
  const [prompt, setPrompt] = React.useState('');
  const [eventFilter, setEventFilter] = React.useState('High');

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGeneratePolicy(prompt);
  };

  const suggestions = [
    "Alert if personnel enters crane zone after working hours.",
    "Monitor workers without helmets near active excavators.",
    "Track haul trucks entering maintenance area."
  ];

  // Group events by priority
  const highEvents = violations.filter(v => v.severity === 'Critical' || v.severity === 'High');
  const mediumEvents = violations.filter(v => v.severity === 'Medium');
  const lowEvents = violations.filter(v => v.severity === 'Low');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Copilot Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D47A1] via-[#1565C0] to-[#0A2540] rounded-2xl p-8 md:p-12 shadow-lg text-white">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-yellow-400/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-yellow-300 border border-white/10 w-fit">
            <Sparkles size={14} className="text-yellow-300 animate-pulse" />
            AI Operations Copilot
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            What would you like <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-white">
              PAMAgents to monitor today?
            </span>
          </h1>
          
          <p className="text-blue-100 text-sm md:text-base max-w-2xl font-light">
            Describe your operational safety rules. The system automatically creates, maps, and deploys custom AI Agents across your CCTV infrastructure.
          </p>

          {/* Prompt input */}
          <form onSubmit={handleGenerate} className="mt-4 flex flex-col md:flex-row gap-3 w-full bg-white/5 backdrop-blur-lg p-2 rounded-xl border border-white/20 shadow-xl">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Alert if personnel enters crane zone after working hours."
              className="flex-1 px-4 py-3 bg-white/10 rounded-lg text-white placeholder-blue-200/60 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all font-sans text-sm md:text-base border border-white/5"
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Sparkles size={16} />
              Generate Agent
            </button>
          </form>

          {/* Suggestions tag cloud */}
          <div className="flex flex-wrap gap-2 items-center mt-1 text-xs">
            <span className="text-blue-200 font-medium">Suggestions:</span>
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPrompt(s)}
                className="bg-white/5 hover:bg-white/10 text-white/90 px-3 py-1.5 rounded-full border border-white/10 transition-all truncate max-w-xs text-left"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Business Value Banner (Revisi Strategis 1) */}
      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm bg-gradient-to-r from-blue-900/5 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-blue-700 font-extrabold uppercase tracking-widest block font-mono">Value Proposition</span>
            <h3 className="text-sm font-extrabold text-blue-950 uppercase tracking-tight">Operational Impact Summary</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-1 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> 5 Active AI Agents</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Monitoring 25 Connected Cameras (from 250+ Site Feeds)</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> Protecting 10 Critical Zones</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0 lg:border-l lg:border-slate-100 lg:pl-6">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Detection Time Reduction</span>
              <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <span className="line-through text-slate-400 font-medium">15 Minutes</span>
                <span className="text-slate-400 font-medium">→</span>
                <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100 font-bold">&lt;30 Seconds</span>
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Evidence Retrieval Time</span>
              <span className="text-xs font-bold text-green-700 flex items-center gap-1.5">
                <span className="line-through text-slate-400 font-medium">2 Hours</span>
                <span className="text-slate-400 font-medium">→</span>
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 font-bold">&lt;1 Minute</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Operational Coverage KPI block (Revisi Minor 1) */}
      <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Operational Coverage</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Deployed Agents</span>
            <span className="text-xl font-extrabold text-slate-900">{agents.length} Active Agents</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Connected Channels</span>
            <span className="text-xl font-extrabold text-slate-900">25 Active Demo Cameras</span>
            <span className="text-[9px] text-slate-400 font-medium">Out of 250+ site cameras</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Protected Geofences</span>
            <span className="text-xl font-extrabold text-slate-900">10 Spatial Zones</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Site Visibility</span>
            <span className="text-xl font-extrabold text-blue-700 flex items-center gap-1">
              87% Visibility
            </span>
          </div>
        </div>
      </div>

      {/* Existing Infrastructure Utilization widget (Revisi Minor 1 / Selling Point) */}
      <div className="bg-[#0B1D3A] text-slate-300 rounded-xl border border-blue-950 p-6 shadow-md flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center border-b border-blue-950 pb-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Existing Infrastructure Utilization</h3>
          <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 font-bold px-2 py-0.5 rounded uppercase font-mono">100% Reused</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Existing Infrastructure</span>
            <span className="text-sm font-extrabold text-white">250 Existing Cameras</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Across site operations</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Demo Environment</span>
            <span className="text-sm font-extrabold text-yellow-400">25 Connected Feeds</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Active demo cameras</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Hardware Expansion</span>
            <span className="text-sm font-extrabold text-green-400">0 Additional Cameras</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Required for deployment</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Asset Efficiency</span>
            <span className="text-sm font-extrabold text-white">100% Infrastructure Reused</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Zero replacement cost</span>
          </div>
        </div>
      </div>

      {/* Second Section: Active AI Agents (Mapping Policy -> Agent) (Revisi Minor 2) */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            Active AI Agents Registry
          </h3>
          <span className="text-xs text-slate-400 font-medium font-mono">
            {agents.length} Active AI Agents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent, index) => (
            <div 
              key={agent.id || index}
              className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between gap-4 relative overflow-hidden group"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
              
              <div className="flex flex-col gap-1.5">
                {/* Visual Lineage Policy -> Deployed Agent */}
                <div className="flex flex-wrap items-center gap-1 text-[9px] font-semibold text-slate-400">
                  <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded">
                    Policy: {agent.policyName}
                  </span>
                  <ChevronRight size={10} className="text-slate-300" />
                </div>
                
                <h4 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-yellow-500 animate-pulse shrink-0" />
                  {agent.name}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Zone</span>
                  <span className="font-semibold text-slate-800 truncate block">{agent.zone}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Coverage</span>
                  <span className="font-semibold text-slate-800">{agent.coverage}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Running
                  </span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Priority</span>
                  <span className={`font-semibold ${agent.priority === 'Critical' || agent.priority === 'HIGH' ? 'text-red-600' : 'text-yellow-600'}`}>{agent.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Third Section: Recent Operational Violation Events (Grouped by Priority) */}
      <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider">Recent Operational Violation Events</h3>
          
          {/* Priority Filter Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            {['High', 'Medium', 'Low'].map(p => (
              <button
                key={p}
                onClick={() => setEventFilter(p)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                  eventFilter === p 
                    ? p === 'High' ? 'bg-red-600 text-white' : p === 'Medium' ? 'bg-yellow-50 text-slate-950' : 'bg-green-600 text-white'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p} Priority
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic event feed list */}
        <div className="flex flex-col gap-3 min-h-[120px]">
          {eventFilter === 'High' && highEvents.map((a, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigateToTab('validation_center')}
              className="p-3.5 bg-red-50/20 hover:bg-red-50/40 rounded-lg border border-red-100 flex justify-between items-center gap-4 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 text-red-700 rounded-md">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Violation: {a.type}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Agent: {a.policySource.replace('Policy', 'Agent')} • Cam: {a.camera}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">{a.time}</span>
                <span className="text-[10px] font-bold text-red-700 bg-red-100/50 px-2 py-0.5 rounded mt-1 inline-block uppercase">
                  Awaiting Validation
                </span>
              </div>
            </div>
          ))}

          {eventFilter === 'Medium' && mediumEvents.map((a, idx) => (
            <div 
              key={idx}
              onClick={() => onNavigateToTab('validation_center')}
              className="p-3.5 bg-yellow-50/20 hover:bg-yellow-50/40 rounded-lg border border-yellow-100/60 flex justify-between items-center gap-4 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-800 rounded-md">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Violation: {a.type}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Agent: {a.policySource.replace('Policy', 'Agent')} • Cam: {a.camera}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">{a.time}</span>
                <span className="text-[10px] font-bold text-yellow-800 bg-yellow-100/50 px-2 py-0.5 rounded mt-1 inline-block uppercase">
                  Review Required
                </span>
              </div>
            </div>
          ))}

          {eventFilter === 'Low' && lowEvents.map((a, idx) => (
            <div 
              key={idx}
              className="p-3.5 bg-green-50/20 rounded-lg border border-green-100 flex justify-between items-center gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 text-green-700 rounded-md">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Log: {a.type}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Agent: {a.policySource.replace('Policy', 'Agent')} • Cam: {a.camera}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">{a.time}</span>
                <span className="text-[10px] font-bold text-green-700 bg-green-100/50 px-2 py-0.5 rounded mt-1 inline-block uppercase">
                  Auto Logged
                </span>
              </div>
            </div>
          ))}

          {eventFilter === 'High' && highEvents.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">No active high priority safety events.</div>
          )}
          {eventFilter === 'Medium' && mediumEvents.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">No active procedure review requests.</div>
          )}
          {eventFilter === 'Low' && lowEvents.length === 0 && (
            <div className="text-center py-6 text-slate-400 text-xs">No low priority logged data feeds.</div>
          )}
        </div>
      </div>
    </div>
  );
}
