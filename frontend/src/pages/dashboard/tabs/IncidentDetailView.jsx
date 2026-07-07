import { useState } from 'react';
import { ArrowLeft, Share2, AlertTriangle, CheckCircle, Download, Maximize2, Play, Volume2, Settings, ZoomIn, ImagePlus, Clock, Shield, Camera, MapPin, Cpu, Info, Send, XCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import screenshot1 from '../../../assets/screenshot_example_1.png';
import screenshot2 from '../../../assets/screenshot_example_2.png';
import screenshot3 from '../../../assets/screenshot_example_3.png';

const severityConfig = {
  critical: { label: 'CRITICAL', color: '#DC2626', bg: '#FEE2E2', icon: 'error' },
  high: { label: 'HIGH', color: '#D97706', bg: '#FEF3C7', icon: 'warning' },
  medium: { label: 'MEDIUM', color: '#CA8A04', bg: '#FEF9C3', icon: 'info' },
  low: { label: 'LOW', color: '#6B7280', bg: '#F3F4F6', icon: 'info' }
};

const statusConfig = {
  open: { label: 'Requires Review', dot: '#FABD00' },
  investigating: { label: 'Under Investigation', dot: '#3B82F6' },
  resolved: { label: 'Resolved', dot: '#10B981' }
};

export default function IncidentDetailView({ incident, onBack }) {
  if (!incident) return null;

  const [finalMessage, setFinalMessage] = useState(
    incident.aiSummary ? `[Incident Alert - ${incident.type}] at ${incident.locationDetail}.\nAI Summary: ${incident.aiSummary}\nAction: Please investigate immediately.` : ''
  );
  const [selectedChannels, setSelectedChannels] = useState({
    telegram: true,
    email: false
  });
  const [supervisorQuestion, setSupervisorQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState(() => ([
    {
      role: 'ai',
      time: '10:44 AM',
      text: `AI Co-Investigator online untuk insiden ${incident.id}. Saya bisa bantu gali konteks, risiko, dan langkah tindak lanjut.`
    },
    {
      role: 'supervisor',
      time: '10:45 AM',
      text: 'Apa risiko utama kalau unit tetap bergerak di area ini?'
    },
    {
      role: 'ai',
      time: '10:45 AM',
      text: 'Risiko utama adalah eskalasi ke zona kritis di sekitar gate. Rekomendasi: tahan pergerakan, verifikasi visual, dan kirim patroli ke perimeter.'
    }
  ]));
  const quickQuestions = [
    'Apa penyebab paling mungkin dari insiden ini?',
    'Apa tindakan prioritas untuk supervisor?',
    'Apakah area ini perlu lockdown sementara?',
    'Ringkas kronologi insiden dalam 3 poin.'
  ];
  const [showIncidentTimeline, setShowIncidentTimeline] = useState(true);

  const sev = severityConfig[incident.severity] || severityConfig.low;
  const stat = statusConfig[incident.status] || statusConfig.open;

  const cardStyle = {
    background: 'white', borderRadius: '12px', border: '1px solid rgba(195,198,212,0.15)',
    boxShadow: '0 4px 20px rgba(13,71,161,0.05)'
  };

  const labelStyle = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--outline)' };
  const valueStyle = { fontSize: '14px', fontWeight: 500, color: 'var(--brand-dark)' };

  const handleSendQuestion = (questionText) => {
    const text = (questionText ?? supervisorQuestion).trim();

    if (!text) return;

    setChatMessages(prev => [
      ...prev,
      { role: 'supervisor', time: '10:46 AM', text },
      {
        role: 'ai',
        time: '10:46 AM',
        text: 'Analisis sementara: fokus pada verifikasi visual, cek area sekitar gate, dan koordinasikan patroli. Jika Anda mau, saya bisa bantu susun instruksi singkat untuk tim lapangan.'
      }
    ]);

    if (!questionText) setSupervisorQuestion('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F7F9FC' }}>
      {/* Contextual Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(247,249,252,0.92)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(195,198,212,0.2)',
        padding: '12px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={onBack} style={{
            padding: '6px', borderRadius: '50%', border: 'none', background: 'transparent',
            cursor: 'pointer', color: 'var(--outline)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} title="Back to Incident Center">
            <ArrowLeft size={20} />
          </button>
          <div style={{ width: '1px', height: '24px', background: 'rgba(195,198,212,0.5)', margin: '0 4px' }} />
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--brand-dark)', margin: 0, lineHeight: 1.3 }}>
              Incident #{incident.id}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--outline)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Camera size={14} /> {incident.camera} — {incident.locationDetail}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{
            padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #C3C6D4',
            background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            color: 'var(--brand-dark)', display: 'flex', alignItems: 'center', gap: '6px'
          }} onClick={onBack}>
            <XCircle size={15} /> False Alarm
          </button>
          <button style={{
            padding: '8px 16px', borderRadius: '8px', border: 'none',
            background: 'var(--brand-primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
            color: 'white', display: 'flex', alignItems: 'center', gap: '6px',
            boxShadow: '0 2px 8px rgba(13,71,161,0.25)'
          }} onClick={onBack}>
            <Send size={15} /> Send
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 32px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Summary Strip */}
          <section style={{ ...cardStyle, padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={labelStyle}>Severity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: sev.color, fontSize: '14px', fontWeight: 600 }}>
                <AlertTriangle size={16} /> {sev.label}
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(195,198,212,0.3)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={labelStyle}>Status</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: 'var(--brand-dark)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.dot }} /> {stat.label}
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(195,198,212,0.3)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={labelStyle}>Location</span>
              <span style={{ fontSize: '14px', color: 'var(--brand-dark)' }}>{incident.locationDetail}</span>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(195,198,212,0.3)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={labelStyle}>Detection Time</span>
              <span style={{ fontSize: '14px', fontFamily: 'monospace', color: 'var(--brand-dark)' }}>{incident.detectedAt}</span>
            </div>
          </section>

          {/* Evidence Viewer */}
          <section style={{ ...cardStyle, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              background: '#F2F4F7', padding: '10px 20px', borderBottom: '1px solid rgba(195,198,212,0.2)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px', letterSpacing: '0.03em' }}>
                <Play size={16} /> Primary Evidence Clip
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)' }}><Download size={18} /></button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--outline)' }}><Maximize2 size={18} /></button>
              </div>
            </div>
            {/* Video Area */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', overflow: 'hidden' }}>
              {/* Real Video Player */}
              <video
                src="/cctv_example.mp4"
                autoPlay muted loop playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              {/* Detection Bounding Box Overlay */}
              <div style={{
                position: 'absolute', top: '25%', left: '40%', width: '120px', height: '180px',
                border: '2px solid var(--brand-primary)', borderRadius: '3px',
                background: 'rgba(13,71,161,0.08)', boxShadow: '0 0 15px rgba(13,71,161,0.35)',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '4px'
              }}>
                <span style={{
                  background: 'var(--brand-primary)', color: 'white', fontFamily: 'monospace',
                  fontSize: '10px', padding: '1px 5px', borderRadius: '2px', width: 'fit-content'
                }}>PERSON {incident.confidence}%</span>
              </div>
              {/* Video Controls */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                padding: '32px 20px 14px', display: 'flex', flexDirection: 'column', gap: '8px'
              }}>
                {/* Scrubber */}
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: '#B0C6FF', width: '33%', borderRadius: '999px' }} />
                  <div style={{ position: 'absolute', left: '25%', top: '50%', transform: 'translateY(-50%)', width: '6px', height: '6px', background: '#DC2626', borderRadius: '50%' }} />
                  <div style={{ position: 'absolute', left: '33%', top: '50%', transform: 'translateY(-50%)', width: '8px', height: '8px', background: '#D9E2FF', borderRadius: '50%' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Play size={20} style={{ cursor: 'pointer' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>00:15 / 00:45</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Volume2 size={16} style={{ cursor: 'pointer' }} />
                    <Settings size={16} style={{ cursor: 'pointer' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Timeline */}
            <div style={{ borderTop: '1px solid rgba(195,198,212,0.2)', background: '#FBFCFE' }}>
              <button
                type="button"
                onClick={() => setShowIncidentTimeline(prev => !prev)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--brand-dark)',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} /> Incident Timestamp
                </span>
                {showIncidentTimeline ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showIncidentTimeline && (
                <div style={{ padding: '0 20px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(incident.timeline || []).map((entry, index) => (
                    <div
                      key={`${entry.time}-${index}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: entry.primary ? 'rgba(13,71,161,0.06)' : 'white',
                        border: '1px solid rgba(195,198,212,0.18)'
                      }}
                    >
                      <div style={{
                        minWidth: '54px',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: entry.primary ? 'var(--brand-primary)' : 'var(--outline)',
                        fontFamily: 'monospace'
                      }}>
                        {entry.time}
                      </div>
                      <div style={{ flex: 1, fontSize: '12px', color: 'var(--brand-dark)', lineHeight: 1.45 }}>
                        {entry.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Response Form */}
          <section style={{ ...cardStyle, padding: '20px 24px' }}>
            <h3 style={{
              fontSize: '16px', fontWeight: 600, color: 'var(--brand-dark)', margin: '0 0 16px',
              paddingBottom: '10px', borderBottom: '1px solid rgba(195,198,212,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Send size={18} /> Response
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Response Channels
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--brand-dark)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedChannels.telegram}
                      onChange={e => setSelectedChannels({ ...selectedChannels, telegram: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    Telegram Alert
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--brand-dark)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedChannels.email}
                      onChange={e => setSelectedChannels({ ...selectedChannels, email: e.target.checked })}
                      style={{ cursor: 'pointer' }}
                    />
                    Email Notification
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Final Message Editor
                </label>
                <textarea
                  value={finalMessage}
                  onChange={e => setFinalMessage(e.target.value)}
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1.5px solid #C3C6D4',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Context Data / Metadata Panel */}
          <section style={{ ...cardStyle, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '16px', fontWeight: 600, color: 'var(--brand-dark)', margin: 0,
              paddingBottom: '10px', borderBottom: '1px solid rgba(195,198,212,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Info size={18} /> Context Data
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { label: 'Triggered Policy', value: incident.policy, badge: true },
                { label: 'AI Confidence', value: `${incident.confidence}%`, mono: true },
                { label: 'Camera ID', value: incident.camera, mono: true },
                { label: 'Resolution', value: '4K UHD', mono: true },
                { label: 'Network Status', value: 'Stable', status: true }
              ].map((item, i, arr) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(224,227,230,0.5)' : 'none'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--outline)' }}>{item.label}</span>
                  {item.badge ? (
                    <span style={{ fontSize: '11px', fontWeight: 700, background: '#ECEEF1', color: 'var(--brand-dark)', padding: '3px 10px', borderRadius: '4px' }}>{item.value}</span>
                  ) : item.status ? (
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#2B5BB5', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2B5BB5' }} /> {item.value}
                    </span>
                  ) : (
                    <span style={{ fontSize: '13px', fontFamily: item.mono ? 'monospace' : 'inherit', color: 'var(--brand-dark)' }}>{item.value}</span>
                  )}
                </div>
              ))}
            </div>

          </section>

          {/* Supervisor AI Chat */}
          <section style={{ ...cardStyle, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{
              fontSize: '16px', fontWeight: 600, color: 'var(--brand-dark)', margin: 0,
              paddingBottom: '10px', borderBottom: '1px solid rgba(195,198,212,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <MessageSquare size={18} /> AI Co-Investigator
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
              {chatMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  style={{
                    alignSelf: message.role === 'supervisor' ? 'flex-end' : 'flex-start',
                    maxWidth: '86%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: message.role === 'supervisor' ? 'var(--brand-primary)' : '#F2F4F7',
                    color: message.role === 'supervisor' ? 'white' : 'var(--brand-dark)',
                    fontSize: '13px',
                    lineHeight: 1.45,
                    boxShadow: message.role === 'supervisor' ? '0 4px 14px rgba(13,71,161,0.15)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', opacity: 0.75, marginBottom: '4px', display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span>{message.role === 'supervisor' ? 'Supervisor' : 'AI Co-Investigator'}</span>
                    {message.time ? <span>{message.time}</span> : null}
                  </div>
                  {message.text}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {quickQuestions.map(question => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSendQuestion(question)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '999px',
                    border: '1px solid #D6D9E3',
                    background: 'white',
                    color: 'var(--brand-dark)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {question}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                value={supervisorQuestion}
                onChange={e => setSupervisorQuestion(e.target.value)}
                rows={3}
                placeholder="Tulis pertanyaan untuk AI tentang insiden ini..."
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1.5px solid #C3C6D4',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
              />
              <button
                type="button"
                onClick={() => handleSendQuestion()}
                style={{
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(13,71,161,0.2)'
                }}
                title="Kirim pertanyaan"
              >
                <Send size={16} />
              </button>
            </div>
          </section>

          {/* Key Frames / Snapshot Gallery */}
          <section style={{ ...cardStyle, padding: '20px 24px' }}>
            <h3 style={{
              fontSize: '16px', fontWeight: 600, color: 'var(--brand-dark)', margin: '0 0 16px',
              paddingBottom: '10px', borderBottom: '1px solid rgba(195,198,212,0.2)',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Camera size={18} /> Key Frames
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Frame 1 */}
              <div style={{
                aspectRatio: '1', borderRadius: '8px',
                overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(195,198,212,0.2)'
              }}>
                <img src={screenshot1} alt="Frame T-05s" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '1px 6px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '10px' }}>T-05s</span>
              </div>
              {/* Frame 2 (Trigger) */}
              <div style={{
                aspectRatio: '1', borderRadius: '8px',
                overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '2px solid #DC2626'
              }}>
                <img src={screenshot2} alt="Trigger Frame" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: '#DC2626', color: 'white', padding: '1px 6px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '10px' }}>Trigger</span>
              </div>
              {/* Frame 3 */}
              <div style={{
                aspectRatio: '1', borderRadius: '8px',
                overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(195,198,212,0.2)', opacity: 0.7
              }}>
                <img src={screenshot3} alt="Frame T+10s" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '1px 6px', borderRadius: '3px', fontFamily: 'monospace', fontSize: '10px' }}>T+10s</span>
              </div>
              {/* Extract More */}
              <div style={{
                aspectRatio: '1', background: '#F2F4F7', borderRadius: '8px',
                border: '1.5px dashed #C3C6D4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'background 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#ECEEF1'}
                onMouseLeave={e => e.currentTarget.style.background = '#F2F4F7'}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--brand-primary)' }}>
                  <ImagePlus size={16} /> Extract
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
