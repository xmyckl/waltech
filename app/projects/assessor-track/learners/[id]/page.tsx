'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { learners, commsEntries, otjEntries, ksbItems, reviewEntries } from '@/lib/assessor-track/data';
import type { CommsChannel, KSBStatus } from '@/types/assessor-track';

const TODAY = '2026-06-16';
type Tab = 'overview' | 'comms' | 'otj' | 'ksb';

function pct(a: number, b: number) { return Math.round((a / b) * 100); }
function diffDays(a: string, b: string) { return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000); }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { 'on-track': 'at-badge--green', 'at-risk': 'at-badge--amber', 'behind': 'at-badge--red' };
  return <span className={`at-badge ${map[status] ?? 'at-badge--grey'}`}>{status}</span>;
}

function KsbBadge({ status }: { status: KSBStatus }) {
  const map: Record<KSBStatus, string> = { 'complete': 'at-badge--green', 'in-progress': 'at-badge--blue', 'not-started': 'at-badge--grey' };
  return <span className={`at-badge ${map[status]}`}>{status.replace(/-/g, ' ')}</span>;
}

function OtjBar({ p }: { p: number }) {
  const c = p >= 70 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="at-progress" style={{ flex: 1 }}>
      <div className="at-progress-fill" style={{ width: `${Math.min(p, 100)}%`, background: c }} />
    </div>
  );
}

const channelColour: Record<CommsChannel, string> = { visit: '#6366f1', email: '#0891b2', call: '#059669', note: '#d97706' };

export default function LearnerDetail() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('overview');
  const [comms, setComms] = useState(() => commsEntries.filter(c => c.learnerId === id));
  const [otj, setOtj] = useState(() => otjEntries.filter(o => o.learnerId === id));
  const [ksb, setKsb] = useState(() => ksbItems.filter(k => k.learnerId === id));
  const [commsForm, setCommsForm] = useState({ channel: 'visit' as CommsChannel, note: '' });
  const [otjForm, setOtjForm] = useState({ hours: '', description: '' });
  const [commsOpen, setCommsOpen] = useState(false);
  const [otjOpen, setOtjOpen] = useState(false);

  const learner = learners.find(l => l.id === id);
  if (!learner) return <div className="at-page"><p className="at-body">Learner not found.</p></div>;

  const reviews = reviewEntries.filter(r => r.learnerId === id);
  const overdueReviews = reviews.filter(r => !r.completed && r.scheduledDate < TODAY);
  const upcomingReviews = reviews.filter(r => !r.completed && r.scheduledDate >= TODAY);
  const p = pct(learner.otjLogged, learner.otjTarget);
  const daysToEpa = diffDays(TODAY, learner.epaDate);

  const addComms = () => {
    if (!commsForm.note.trim()) return;
    setComms(c => [{ id: `nc-${Date.now()}`, learnerId: id, date: TODAY, channel: commsForm.channel, loggedBy: 'Michael W.', note: commsForm.note }, ...c]);
    setCommsForm({ channel: 'visit', note: '' });
    setCommsOpen(false);
  };

  const addOtj = () => {
    const h = parseFloat(otjForm.hours);
    if (!h || !otjForm.description.trim()) return;
    setOtj(o => [{ id: `no-${Date.now()}`, learnerId: id, date: TODAY, hours: h, description: otjForm.description }, ...o]);
    setOtjForm({ hours: '', description: '' });
    setOtjOpen(false);
  };

  const updateKsb = (ksbId: string, status: KSBStatus) =>
    setKsb(k => k.map(x => x.id === ksbId ? { ...x, status, lastUpdated: TODAY } : x));

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'comms', label: `Comms (${comms.length})` },
    { id: 'otj', label: `OTJ (${otj.length})` },
    { id: 'ksb', label: `KSB (${ksb.length})` },
  ];

  const epaReady = [
    { label: 'Portfolio evidence', done: ksb.length > 0 && ksb.filter(k => k.status === 'complete').length >= Math.ceil(ksb.length * 0.7) },
    { label: 'Gateway criteria', done: learner.status === 'on-track' },
    { label: 'Employer sign-off', done: learner.status === 'on-track' },
    { label: 'Mock assessment', done: reviews.some(r => r.type === 'mock-assessment' && r.completed) },
  ];

  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects/assessor-track">AssessorTrack</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <Link href="/projects/assessor-track/learners">Learners</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>{learner.name}</span>
      </nav>

      {/* Header */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>
          {learner.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <h1 className="at-h1">{learner.name}</h1>
            <StatusBadge status={learner.status} />
            {learner.needsAttention && <span className="at-badge at-badge--red">Needs attention</span>}
          </div>
          <p className="at-muted" style={{ marginTop: 3 }}>{learner.programme} &mdash; {learner.employer}</p>
        </div>
      </div>

      <div className="at-tabs">
        {tabs.map(t => (
          <button key={t.id} className={`at-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div>
          {tab === 'overview' && (
            <>
              <div className="at-card" style={{ marginBottom: 20 }}>
                <h2 className="at-h2">Key information</h2>
                <div className="at-dl">
                  {([
                    ['Programme', learner.programme],
                    ['Employer', learner.employer],
                    ['Start date', learner.startDate],
                    ['EPA date', learner.epaDate],
                    ['Days to EPA', daysToEpa > 0 ? `${daysToEpa} days` : `${Math.abs(daysToEpa)} days overdue`],
                    ['Last contact', learner.lastContact],
                    ['Next review', learner.nextReview ?? 'Not scheduled'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="at-dl-row">
                      <dt className="at-dt">{k}</dt>
                      <dd className="at-dd" style={k === 'Days to EPA' && daysToEpa < 30 ? { color: '#dc2626' } : undefined}>{v}</dd>
                    </div>
                  ))}
                </div>
              </div>

              <div className="at-card">
                <h2 className="at-h2">OTJ summary</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <OtjBar p={p} />
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 20, fontWeight: 700, color: p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b', minWidth: 48 }}>{p}%</span>
                </div>
                <p className="at-muted">{learner.otjLogged}h logged of {learner.otjTarget}h target &mdash; {learner.otjTarget - learner.otjLogged}h remaining</p>
              </div>
            </>
          )}

          {tab === 'comms' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="at-h2" style={{ margin: 0 }}>Communication log</h2>
                <button className="at-btn at-btn--primary at-btn--sm" onClick={() => setCommsOpen(o => !o)}>+ Log contact</button>
              </div>

              {commsOpen && (
                <div className="at-card" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label className="at-label" htmlFor="ch">Type</label>
                      <select className="at-select" id="ch" value={commsForm.channel} onChange={e => setCommsForm(f => ({ ...f, channel: e.target.value as CommsChannel }))}>
                        <option value="visit">Visit</option>
                        <option value="email">Email</option>
                        <option value="call">Call</option>
                        <option value="note">Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="at-label" htmlFor="note">Note</label>
                      <input className="at-input" id="note" type="text" value={commsForm.note} onChange={e => setCommsForm(f => ({ ...f, note: e.target.value }))} placeholder="Summary of contact…" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="at-btn at-btn--primary at-btn--sm" onClick={addComms}>Save</button>
                    <button className="at-btn at-btn--ghost at-btn--sm" onClick={() => setCommsOpen(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {comms.map(c => (
                  <div key={c.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: '14px 16px', borderLeft: `3px solid ${channelColour[c.channel]}` }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: "'IBM Plex Sans', sans-serif", background: channelColour[c.channel] + '18', color: channelColour[c.channel], textTransform: 'capitalize' }}>{c.channel}</span>
                      <span className="at-muted">{c.date} &mdash; {c.loggedBy}</span>
                    </div>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: '#374151', margin: 0 }}>{c.note}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'otj' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 className="at-h2" style={{ margin: 0 }}>OTJ hours</h2>
                <button className="at-btn at-btn--primary at-btn--sm" onClick={() => setOtjOpen(o => !o)}>+ Log hours</button>
              </div>

              <div className="at-card" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <OtjBar p={p} />
                  <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 18, fontWeight: 700, color: p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b' }}>{p}%</span>
                </div>
                <p className="at-muted">{learner.otjLogged}h / {learner.otjTarget}h &mdash; {learner.otjTarget - learner.otjLogged}h remaining &mdash; EPA {learner.epaDate}</p>
              </div>

              {otjOpen && (
                <div className="at-card" style={{ marginBottom: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                      <label className="at-label" htmlFor="hrs">Hours</label>
                      <input className="at-input" id="hrs" type="number" min="0.5" step="0.5" value={otjForm.hours} onChange={e => setOtjForm(f => ({ ...f, hours: e.target.value }))} />
                    </div>
                    <div>
                      <label className="at-label" htmlFor="desc">Activity</label>
                      <input className="at-input" id="desc" type="text" value={otjForm.description} onChange={e => setOtjForm(f => ({ ...f, description: e.target.value }))} placeholder="e.g. Azure fundamentals training" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="at-btn at-btn--primary at-btn--sm" onClick={addOtj}>Save</button>
                    <button className="at-btn at-btn--ghost at-btn--sm" onClick={() => setOtjOpen(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="at-table-wrap">
                <table className="at-table">
                  <thead><tr><th>Date</th><th>Hours</th><th>Activity</th></tr></thead>
                  <tbody>
                    {otj.map(o => (
                      <tr key={o.id}>
                        <td style={{ whiteSpace: 'nowrap', color: '#6b7280' }}>{o.date}</td>
                        <td style={{ fontWeight: 700 }}>{o.hours}h</td>
                        <td>{o.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'ksb' && (
            <>
              <h2 className="at-h2">KSB evidence &mdash; {learner.programme}</h2>
              {ksb.length === 0 ? (
                <p className="at-body" style={{ color: '#9ca3af' }}>No KSB items for this learner.</p>
              ) : (
                <div className="at-table-wrap">
                  <table className="at-table">
                    <thead><tr><th>Ref</th><th>Type</th><th>Description</th><th>Status</th><th>Evidence</th><th>Updated</th><th>Change</th></tr></thead>
                    <tbody>
                      {ksb.map(k => (
                        <tr key={k.id}>
                          <td style={{ fontWeight: 700, color: '#6366f1' }}>{k.reference}</td>
                          <td style={{ textTransform: 'capitalize' }}><span className="at-badge at-badge--indigo">{k.type}</span></td>
                          <td>
                            <span style={{ fontSize: 13 }}>{k.description}</span>
                            {k.note && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: '3px 0 0', fontStyle: 'italic' }}>{k.note}</p>}
                          </td>
                          <td><KsbBadge status={k.status} /></td>
                          <td style={{ textAlign: 'center', fontWeight: 600 }}>{k.evidenceCount}</td>
                          <td style={{ color: '#9ca3af', fontSize: 12, whiteSpace: 'nowrap' }}>{k.lastUpdated ?? '—'}</td>
                          <td>
                            <select className="at-select" value={k.status} onChange={e => updateKsb(k.id, e.target.value as KSBStatus)} style={{ fontSize: 12, padding: '4px 8px' }}>
                              <option value="not-started">Not started</option>
                              <option value="in-progress">In progress</option>
                              <option value="complete">Complete</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="at-card-sm">
            <h3 className="at-h3">Review schedule</h3>
            {overdueReviews.length > 0 && overdueReviews.map(r => (
              <div key={r.id} style={{ background: '#fff1f2', borderRadius: 8, padding: '8px 12px', marginBottom: 8, borderLeft: '3px solid #ef4444' }}>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 700, color: '#991b1b', margin: '0 0 2px' }}>OVERDUE</p>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#374151', margin: 0 }}>{r.scheduledDate} — {r.type.replace(/-/g, ' ')}</p>
              </div>
            ))}
            {upcomingReviews.length > 0 ? upcomingReviews.map(r => (
              <div key={r.id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                <span className="at-badge at-badge--blue" style={{ fontSize: 11, flexShrink: 0 }}>{r.scheduledDate}</span>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#374151', textTransform: 'capitalize' }}>{r.type.replace(/-/g, ' ')}</span>
              </div>
            )) : (overdueReviews.length === 0 && <p className="at-muted">No reviews scheduled.</p>)}
          </div>

          <div className="at-card-sm">
            <h3 className="at-h3">EPA readiness</h3>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="at-muted">EPA in</span>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 700, color: daysToEpa < 60 ? '#dc2626' : '#111827' }}>{daysToEpa > 0 ? `${daysToEpa}d` : 'Overdue'}</span>
              </div>
            </div>
            {epaReady.map(item => (
              <div key={item.label} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.done ? '#dcfce7' : '#f3f4f6', border: `2px solid ${item.done ? '#22c55e' : '#d1d5db'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: item.done ? '#111827' : '#9ca3af', fontWeight: item.done ? 500 : 400 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}