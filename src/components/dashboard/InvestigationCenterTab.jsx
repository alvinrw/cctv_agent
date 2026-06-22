import React from 'react';
import { 
  Cpu, Sparkles, Send, RefreshCw, AlertTriangle 
} from 'lucide-react';
import img4 from '../../assets/4.png';

export default function InvestigationCenterTab({ 
  activeIncident 
}) {
  const [question, setQuestion] = React.useState('What happened during this violation event?');
  const [isAnswering, setIsAnswering] = React.useState(false);
  const [answer, setAnswer] = React.useState('');
  const [notes, setNotes] = React.useState('Investigated feed. Personnel verified as site operator retrieving a tool locker key. No safety hazard reported. Confirmed warning alert trigger.');

  const handleAsk = (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsAnswering(true);
    setAnswer('');

    setTimeout(() => {
      setIsAnswering(false);
      const qLower = question.toLowerCase();
      if (qLower.includes('who') || qLower.includes('person') || qLower.includes('worker')) {
        setAnswer("The subject was identified as Operator John Doe from Shift B. Facial indexing indicates J. Doe had clearance for Pit A, but entered the restricted Crane Zone area to retrieve tool locker keys after normal shift termination.");
      } else if (qLower.includes('helmet') || qLower.includes('ppe') || qLower.includes('gear')) {
        setAnswer("According to the CCTV feed telemetry, the worker was wearing a high-visibility safety vest but did not have a hardhat (safety helmet) properly secured, which triggered the PPE compliance audit rules of the active policy.");
      } else {
        setAnswer(`At 18:32:04, the AI agent active on CCTV feed "CCTV Crane Area 01" flagged a personnel entry inside Crane Zone A. The subject was identified as an operator walking without a safety hardhat. The active policy "Restricted Area Access" triggered an automatic warning, which was escalated to Validation Center.`);
      }
    }, 1200);
  };

  const incidentTimeline = [
    { time: '18:32:04', desc: 'AI Safety Agent flagged personnel entry inside Crane Zone A.' },
    { time: '18:32:05', desc: 'Critical warning evaluation completed by active policy guidelines.' },
    { time: '18:33:10', desc: 'Violation event escalated to Validation Center for shift verification.' },
    { time: '18:34:00', desc: 'Violation event status updated to "Dispatched" after supervisor confirmation.' }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in flex-1">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-blue-950 flex items-center gap-2">
          <Cpu className="text-blue-600 animate-pulse" />
          Investigation Workspace
        </h2>
        <p className="text-xs text-slate-500 mt-1">Deep analysis of operational safety events and AI Agent warning logs.</p>
      </div>

      {/* Visual Agent Lifecycle Tracker (Revisi Strategis 2) */}
      <div className="bg-slate-900 text-slate-300 rounded-xl p-4 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 animate-fade-in">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-yellow-400 font-extrabold uppercase tracking-widest font-mono">Agent Lifecycle Tracker</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-950 text-green-400 border border-green-900/30 rounded">
            <span>Policy Created ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-950 text-green-400 border border-green-900/30 rounded">
            <span>Agent Deployed ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-950 text-green-400 border border-green-900/30 rounded">
            <span>Monitoring Active ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-950 text-green-400 border border-green-900/30 rounded">
            <span>Violation Detected ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-950 text-green-400 border border-green-900/30 rounded">
            <span>Validation Pending ✓</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${
            activeIncident && (activeIncident.status === 'Closed' || activeIncident.status === 'Dispatched')
              ? 'bg-blue-900/50 text-blue-300 border border-blue-800 font-bold'
              : 'bg-slate-950 text-slate-500 border border-slate-900'
          }`}>
            <span>Closed {activeIncident && (activeIncident.status === 'Closed' || activeIncident.status === 'Dispatched') && '✓'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Evidence & Timeline */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Incident snapshot */}
          <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Visual Evidence Snapshot
            </h3>
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-200 relative">
              <img src={img4} alt="Incident snap" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow">
                TRIGGER SNAPSHOT
              </div>
            </div>
            <div className="text-xs text-slate-500 flex justify-between font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-1">
              <span>Event: {activeIncident ? `VIO-${activeIncident.id.substring(activeIncident.id.length - 4).toUpperCase()}` : 'VIO-9823'}</span>
              <span>Camera: {activeIncident ? activeIncident.camera : 'CCTV Crane 01'}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-blue-50 p-5 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Operational Timeline
            </h3>
            <div className="flex flex-col gap-4 relative pl-4 mt-2">
              <div className="absolute top-0 bottom-0 left-1.5 w-0.5 bg-blue-100"></div>
              {incidentTimeline.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow absolute -left-[19px] mt-1"></div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-blue-600 block">{item.time}</span>
                    <span className="text-xs text-slate-700 leading-relaxed block mt-0.5">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Summary, Root Cause & Question Box */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* AI Generated Operational Summary */}
          <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-blue-50 text-blue-600 rounded">
                  <Sparkles size={16} />
                </span>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">AI Generated Operational Summary</h3>
              </div>
            </div>

            {/* Structured details list format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Violation Details</span>
                <span className="text-xs font-semibold text-slate-800 leading-relaxed block mt-0.5">
                  At 18:32, personnel was detected inside Crane Zone A.
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Policy Source</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  Restricted Area Access
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">AI Deployed Agent</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  Crane Zone Safety Agent
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Classification</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  High Priority
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Evidence Package</span>
                <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                  1 Minute Video Package
                </span>
              </div>

              <div className="p-3.5 bg-red-50/50 rounded-lg border border-red-100 flex items-start gap-2.5 col-span-2">
                <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[9px] text-red-700 font-bold uppercase tracking-wider block">Required Action</span>
                  <span className="text-xs text-slate-800 font-semibold">
                    Supervisor Validation Required.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Natural Language Question Box */}
          <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="p-1 bg-yellow-50 text-yellow-600 rounded">
                <Cpu size={16} />
              </span>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Ask Operations Copilot</h3>
            </div>

            <form onSubmit={handleAsk} className="flex gap-2 bg-slate-50 border border-slate-100 p-1.5 rounded-lg focus-within:ring-2 focus-within:ring-blue-600 focus-within:bg-white transition-all">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question, e.g. Who was involved?"
                className="flex-1 px-3 py-2 bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none text-xs"
              />
              <button
                type="submit"
                disabled={isAnswering || !question.trim()}
                className="px-4 py-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-bold rounded-md text-xs shadow flex items-center gap-1.5 transition-all shrink-0"
              >
                {isAnswering ? <RefreshCw size={12} className="animate-spin" /> : <Send size={12} />}
                Ask AI
              </button>
            </form>

            {/* Answer Display */}
            {(isAnswering || answer) && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2 transition-all">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold">
                  <Sparkles size={14} />
                  Copilot Response
                </div>
                {isAnswering ? (
                  <div className="flex items-center gap-2 text-slate-500 py-1 text-xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span>Formulating response...</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 leading-relaxed">{answer}</p>
                )}
              </div>
            )}
          </div>

          {/* Supervisor Notes */}
          <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Supervisor Notes & Actions
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-lg p-3 text-slate-950 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all h-20 resize-none"
            />
            <div className="flex justify-end mt-1">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow">
                Save Notes
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
