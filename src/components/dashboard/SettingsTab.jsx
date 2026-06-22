import React from 'react';
import { Settings, Save, Shield, Database, Cpu, Bell, Key } from 'lucide-react';

export default function SettingsTab() {
  const [model, setModel] = React.useState('gemini-3.5-flash');
  const [webhook, setWebhook] = React.useState('https://webhook.astranauts.internal/mining-security-ops');
  const [cooldown, setCooldown] = React.useState('5');
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-blue-50 p-6 shadow-sm max-w-2xl animate-fade-in">
      <div className="pb-3 border-b border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
          <Settings className="text-blue-600" />
          System Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">Configure model weights, notification thresholds, and network integrations.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-5">
        
        {/* Model Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Cpu size={14} className="text-blue-600" />
            AI Policy Inspection Engine
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all font-sans"
          >
            <option value="gemini-3.5-flash">Gemini 3.5 Flash (High Efficiency, Recommended)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Max Reasoning)</option>
            <option value="edge-vlm-mining-v3">Local Edge VLM (Mining Finetuned)</option>
          </select>
        </div>

        {/* Webhook Configuration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Bell size={14} className="text-blue-600" />
            Dispatch Alert Webhook
          </label>
          <input
            type="text"
            required
            value={webhook}
            onChange={(e) => setWebhook(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
            placeholder="https://your-webhook-endpoint"
          />
        </div>

        {/* Cooldown Timer */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock size={14} className="text-blue-600" />
            Alert Cooldown Threshold (Minutes)
          </label>
          <input
            type="number"
            required
            value={cooldown}
            onChange={(e) => setCooldown(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
            min="1"
            max="60"
          />
          <p className="text-[10px] text-slate-400">Ignores repetitive violation triggers on the same camera channel during this interval.</p>
        </div>

        {/* Security / Credentials Mock */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Key size={14} className="text-blue-600" />
            API Credentials Auth
          </label>
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 font-mono text-[10px] select-none break-all flex justify-between items-center">
            <span>PAMA_API_TOKEN_KEY=****************************************a1b2</span>
            <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-sans font-semibold">Active</span>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5 transition-all"
          >
            <Save size={14} />
            {saved ? 'Settings Saved' : 'Save Config'}
          </button>
        </div>

      </form>
    </div>
  );
}

// Simple mock Clock icon for Settings Tab
function Clock({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
