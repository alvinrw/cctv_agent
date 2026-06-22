import React from 'react';
import { 
  Sparkles, CheckCircle2, Cpu, Layers, RefreshCw, ArrowRight
} from 'lucide-react';

export default function PolicyStudioTab({ 
  onActivatePolicy, 
  nlpPrompt, 
  setNlpPrompt 
}) {
  const [prompt, setPrompt] = React.useState(nlpPrompt || '');
  const [isParsing, setIsParsing] = React.useState(false);
  const [parsed, setParsed] = React.useState(false);
  
  // Agent profile state - extended with deployment preview metrics
  const [agentProfile, setAgentProfile] = React.useState({
    name: 'Crane Zone Safety Agent',
    policyName: 'Restricted Area Access',
    mission: 'Monitor unauthorized personnel entering crane area after operational hours.',
    coverage: '3 Cameras',
    protectedZones: 'Crane Zone A',
    priorityTier: 'HIGH',
    coverageAnalysis: [
      '3 Cameras Identified',
      '1 Geofence Mapped',
      '2 Entry Points Covered'
    ],
    expectedFrequency: '1-2 Violations / Week',
    evidenceStorage: '12 MB / Week',
    notificationVolume: '1 Telegram Alert / Week'
  });

  const [pseudocode, setPseudocode] = React.useState(`IF Person
AND Inside Crane Zone
AND Time > 18:00
THEN Generate Critical Alert`);

  const examples = [
    "Alert if personnel enters crane zone after working hours.",
    "Monitor workers without helmets near active excavators.",
    "Track haul trucks entering maintenance area."
  ];

  const handleParse = (selectedPrompt) => {
    const text = selectedPrompt || prompt;
    if (!text.trim()) return;
    
    setIsParsing(true);
    setParsed(false);

    // Dynamic parsing mapping based on keywords
    setTimeout(() => {
      setIsParsing(false);
      setParsed(true);

      const pLower = text.toLowerCase();
      if (pLower.includes('helmet') || pLower.includes('safety') || pLower.includes('wear')) {
        setAgentProfile({
          name: 'PPE Compliance Agent',
          policyName: 'PPE Compliance',
          mission: 'Audit safety helmet (hardhat) compliance and log violations on pit faces.',
          coverage: '8 Cameras',
          protectedZones: 'West Quarry Pit Face, Shovel Loading Dock',
          priorityTier: 'MEDIUM',
          coverageAnalysis: [
            '8 Cameras Identified',
            '2 Geofences Mapped',
            '4 Entry Points Covered'
          ],
          expectedFrequency: '2-4 Violations / Week',
          evidenceStorage: '32 MB / Week',
          notificationVolume: '3 Telegram Alerts / Week'
        });
        setPseudocode(`IF Person\nAND Inside Mining Pit Face\nAND WearingHelmet() == FALSE\nTHEN Generate Medium Violation Alert`);
      } else if (pLower.includes('truck') || pLower.includes('loading') || pLower.includes('maintenance') || pLower.includes('speed')) {
        setAgentProfile({
          name: 'Haul Road Monitoring Agent',
          policyName: 'Haul Road Monitoring',
          mission: 'Monitor vehicle speed and track trucks entering restricted maintenance bays.',
          coverage: '5 Cameras',
          protectedZones: 'Haul Road Sector B, Workshop Bay 1',
          priorityTier: 'MEDIUM',
          coverageAnalysis: [
            '5 Cameras Identified',
            '1 Geofence Mapped',
            '3 Entry Points Covered'
          ],
          expectedFrequency: '1 Violation / Month',
          evidenceStorage: '15 MB / Week',
          notificationVolume: '1 Telegram Alert / Month'
        });
        setPseudocode(`IF Truck\nAND Inside Loading Area A\nAND BayMaintenanceMode() == TRUE\nTHEN Generate Medium Violation Alert`);
      } else {
        // Default (Restricted crane zone)
        setAgentProfile({
          name: 'Crane Zone Safety Agent',
          policyName: 'Restricted Area Access',
          mission: 'Monitor unauthorized personnel entering crane area after operational hours.',
          coverage: '3 Cameras',
          protectedZones: 'Crane Zone A',
          priorityTier: 'HIGH',
          coverageAnalysis: [
            '3 Cameras Identified',
            '1 Geofence Mapped',
            '2 Entry Points Covered'
          ],
          expectedFrequency: '1-2 Violations / Week',
          evidenceStorage: '12 MB / Week',
          notificationVolume: '1 Telegram Alert / Week'
        });
        setPseudocode(`IF Person\nAND Inside Crane Zone\nAND Time > 18:00\nTHEN Generate High Priority Violation`);
      }
    }, 1500);
  };

  const handleDeploy = () => {
    if (!parsed) return;
    onActivatePolicy({
      name: agentProfile.name,
      description: prompt,
      category: prompt.toLowerCase().includes('helmet') ? 'Safety' : (prompt.toLowerCase().includes('truck') ? 'Operations' : 'Security'),
      agentName: agentProfile.name,
      policyName: agentProfile.policyName,
      coverage: agentProfile.coverage,
      zone: agentProfile.protectedZones,
      priority: agentProfile.priorityTier
    });
    setPrompt('');
    setParsed(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blue-950 flex items-center gap-2">
            <Sparkles className="text-blue-600" />
            Policy Studio
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl">
            Describe operational policies in natural language. PAMAgents compiles your guidelines and deploys custom AI Agents to automatically monitor the site.
          </p>
        </div>
      </div>

      {/* Visual Agent Lifecycle Tracker */}
      <div className="bg-slate-900 text-slate-300 rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest font-mono">Agent Lifecycle Tracker</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/50 text-blue-300 border border-blue-800 rounded">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            <span>Policy Created ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-900 rounded">
            <span>Agent Deployed</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-900 rounded">
            <span>Monitoring Active</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-900 rounded">
            <span>Violation Detected</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-900 rounded">
            <span>Validation Pending</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-950 text-slate-500 border border-slate-900 rounded">
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Natural Language Input */}
        <div className="bg-white rounded-xl border border-blue-50 p-6 flex flex-col gap-4 shadow-sm relative">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <span className="p-1 bg-blue-50 text-blue-600 rounded">
              <Sparkles size={16} />
            </span>
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Natural Language Prompt</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-slate-400 font-bold uppercase">Operational Guidelines</label>
            <textarea
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setNlpPrompt(e.target.value);
              }}
              placeholder="e.g. Alert if personnel enters crane zone after working hours."
              className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-lg p-3 text-slate-950 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all h-36 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => handleParse()}
              disabled={isParsing || !prompt.trim()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all shadow flex items-center gap-2 disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Generating Agent...
                </>
              ) : (
                <>
                  <Cpu size={14} />
                  Generate AI Agent
                </>
              )}
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-col gap-2 mt-4">
            <span className="text-xs text-slate-400 font-bold uppercase">AI Templates:</span>
            <div className="flex flex-col gap-2">
              {examples.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPrompt(ex);
                    setNlpPrompt(ex);
                    handleParse(ex);
                  }}
                  className="w-full text-left p-2.5 text-xs text-slate-600 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-700 rounded-lg transition-colors border border-slate-100 hover:border-blue-100 font-medium"
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Columns: Agent Deployment Preview */}
        {isParsing ? (
          <div className="lg:col-span-2 bg-white rounded-xl border border-blue-50 p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm min-h-[350px]">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-xs font-bold text-blue-600 animate-pulse tracking-wide uppercase">Compiling Agent Profile...</p>
          </div>
        ) : parsed ? (
          <div className="lg:col-span-2 bg-white rounded-xl border border-blue-50 p-6 flex flex-col gap-6 shadow-sm min-h-[350px] relative overflow-hidden animate-fade-in">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-50 text-blue-600 rounded">
                  <Cpu size={16} />
                </span>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Agent Deployment Preview</h3>
              </div>
              <span className="text-[9px] bg-yellow-100 text-yellow-800 border border-yellow-200 font-bold px-2 py-0.5 rounded uppercase">Deployment Ready</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              
              {/* Left Sub-Column: Name, Mission, Coverage checklist */}
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Agent Name</span>
                  <h4 className="text-base font-extrabold text-blue-950 mt-1 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-yellow-500 animate-pulse shrink-0" />
                    {agentProfile.name}
                  </h4>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Mission</span>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium">
                    {agentProfile.mission}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Coverage Analysis</span>
                  <div className="flex flex-col gap-2">
                    {agentProfile.coverageAnalysis.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <span className="text-green-600 font-bold">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sub-Column: Planning metrics & Deploy CTA */}
              <div className="flex flex-col justify-between gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Expected Frequency</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">{agentProfile.expectedFrequency}</span>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Recommended Priority</span>
                    <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded mt-1 uppercase ${
                      agentProfile.priorityTier === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                    }`}>{agentProfile.priorityTier}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Est. Evidence Storage</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">{agentProfile.evidenceStorage}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Est. Notification Volume</span>
                    <span className="text-xs font-bold text-slate-800 mt-1 block">{agentProfile.notificationVolume}</span>
                  </div>
                </div>

                {/* Estimated Business Impact Block */}
                <div className="p-3.5 bg-blue-50/30 rounded-lg border border-blue-50 flex flex-col gap-2">
                  <span className="text-[9px] text-blue-700 font-bold uppercase tracking-wider block">Estimated Business Impact</span>
                  
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-slate-700 font-medium">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px]">Response Time</span>
                      <span className="font-bold text-red-600 flex items-center gap-1">
                        15 Mins <ArrowRight size={10} className="text-slate-400" /> &lt;30 Secs
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100/50 pt-1">
                      <span className="text-slate-400 text-[10px]">Evidence Retrieval</span>
                      <span className="font-bold text-green-700 flex items-center gap-1">
                        2 Hours <ArrowRight size={10} className="text-slate-400" /> &lt;1 Min
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-100/50 pt-1">
                      <span className="text-slate-400 text-[10px]">Monitoring Coverage</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        Manual <ArrowRight size={10} className="text-slate-400" /> AI Assisted
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pseudocode code review block */}
                <div className="bg-slate-950 font-mono text-[9px] text-blue-200 p-2.5 rounded-lg border border-slate-900 shadow-inner max-h-20 overflow-y-auto">
                  <pre className="whitespace-pre-wrap leading-relaxed">{pseudocode}</pre>
                </div>

                <button
                  onClick={handleDeploy}
                  className="w-full py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-bold rounded-lg text-xs shadow transition-all flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                >
                  <CheckCircle2 size={15} />
                  Deploy Agent
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-xl border border-blue-50 p-6 flex flex-col items-center justify-center text-center text-slate-400 gap-2 shadow-sm min-h-[350px]">
            <Layers size={40} className="stroke-1 text-slate-300" />
            <p className="text-xs">Provide a natural language policy prompt to generate an operational AI Agent.</p>
          </div>
        )}
      </div>
    </div>
  );
}
