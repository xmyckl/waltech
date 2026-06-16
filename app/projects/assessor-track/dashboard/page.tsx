'use client';
import Link from 'next/link';
import { learners, reviewEntries, alerts, CURRENT_ASSESSOR_ID } from '@/lib/assessor-track/data';

const TODAY = '2026-06-16';

function pct(a: number, b: number) { return Math.round((a / b) * 100); }
function diffDays(a: string, b: string) { return Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000); }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { 'on-track': 'at-badge--green', 'at-risk': 'at-badge--amber', 'behind': 'at-badge--red' };
  return <span className={`at-badge ${map[status] ?? 'at-badge--grey'}`}>{status}</span>;
}

export default function Dashboard() {
  const mine = learners.filter(l => l.assessorId === CURRENT_ASSESSOR_ID);
  const onTrack = mine.filter(l => l.status === 'on-track').length;
  const atRisk = mine.filter(l => l.status === 'at-risk').length;
  const behind = mine.filter(l => l.status === 'behind').length;
  const myIds = mine.map(l => l.id);
  const myAlerts = alerts.filter(a => a.learnerId && myIds.includes(a.learnerId));
  const critical = myAlerts.filter(a => a.severity === 'critical');

  const myReviews = reviewEntries.filter(r => myIds.includes(r.learnerId) && !r.completed);
  const overdueReviews = myReviews.filter(r => r.scheduledDate < TODAY);
  const upcomingReviews = myReviews.filter(r => r.scheduledDate >= TODAY).sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)).slice(0, 5);
  const flagged = mine.filter(l => l.needsAttention);

  const stats = [
    { label: 'My learners', value: mine.length, colour: '#6366f1', bg: '#f5f3ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
    { label: 'On track', value: onTrack, colour: '#059669', bg: '#ecfdf5', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
    { label: 'At risk', value: atRisk, colour: '#d97706', bg: '#fffbeb', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label: 'Behind', value: behind, colour: '#dc2626', bg: '#fff1f2', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
    { label: 'Critical alerts', value: critical.length, colour: '#7c3aed', bg: '#faf5ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  ];

  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects/assessor-track">AssessorTrack</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>Dashboard</span>
      </nav>

      <div style={{ marginBottom: '28px' }}>
        <h1 className="at-h1">Dashboard</h1>
        <p className="at-muted" style={{ marginTop: 4 }}>Monday 16 June 2026 &mdash; South Wales</p>
      </div>

      {critical.length > 0 && (
        <div className="at-warning-box" style={{ marginBottom: '24px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>{critical.length} critical alert{critical.length !== 1 ? 's' : ''} require{critical.length === 1 ? 's' : ''} immediate attention. <Link href="/projects/assessor-track/alerts" className="at-link">View alerts →</Link></span>
        </div>
      )}

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} className="at-stat">
            <div style={{ width: 34, height: 34, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.colour, marginBottom: 12 }}>{s.icon}</div>
            <div className="at-stat-value" style={{ color: s.colour }}>{s.value}</div>
            <div className="at-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Upcoming reviews */}
        <div className="at-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="at-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Upcoming reviews</p>
            <Link href="/projects/assessor-track/reviews" className="at-link" style={{ fontSize: 12 }}>View all →</Link>
          </div>
          {overdueReviews.length > 0 && (
            <div style={{ background: '#fff1f2', padding: '10px 20px', borderBottom: '1px solid #fee2e2', display: 'flex', gap: 8, alignItems: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#991b1b' }}>{overdueReviews.length} overdue</span>
            </div>
          )}
          <div>
            {upcomingReviews.length === 0 && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#9ca3af', padding: '16px 20px', margin: 0 }}>No upcoming reviews.</p>}
            {upcomingReviews.map(r => {
              const learner = learners.find(l => l.id === r.learnerId);
              const days = diffDays(TODAY, r.scheduledDate);
              return (
                <div key={r.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>
                      <Link href={`/projects/assessor-track/learners/${learner?.id}`} className="at-link">{learner?.name}</Link>
                    </p>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: 0, textTransform: 'capitalize' }}>{r.type.replace(/-/g, ' ')}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 600, color: days <= 7 ? '#dc2626' : '#374151', margin: '0 0 2px' }}>{r.scheduledDate}</p>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#9ca3af', margin: 0 }}>in {days}d</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flagged learners */}
        <div className="at-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="at-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Flagged learners</p>
            <Link href="/projects/assessor-track/learners" className="at-link" style={{ fontSize: 12 }}>View all →</Link>
          </div>
          <div>
            {flagged.length === 0 && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#9ca3af', padding: '16px 20px', margin: 0 }}>No flagged learners.</p>}
            {flagged.map(l => {
              const p = pct(l.otjLogged, l.otjTarget);
              const days = diffDays(TODAY, l.epaDate);
              return (
                <div key={l.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <Link href={`/projects/assessor-track/learners/${l.id}`} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', textDecoration: 'none' }}>{l.name}</Link>
                      <StatusBadge status={l.status} />
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <div className="at-progress" style={{ flex: 1 }}>
                        <div className="at-progress-fill" style={{ width: `${Math.min(p, 100)}%`, background: p >= 70 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, fontWeight: 700, color: p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b', minWidth: 32 }}>{p}%</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 600, color: days < 60 ? '#dc2626' : '#6b7280', margin: '0 0 2px' }}>EPA in {days}d</p>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#9ca3af', margin: 0 }}>{l.epaDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts panel */}
      {myAlerts.length > 0 && (
        <div className="at-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="at-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Active alerts</p>
            <Link href="/projects/assessor-track/alerts" className="at-link" style={{ fontSize: 12 }}>View all →</Link>
          </div>
          {myAlerts.slice(0, 4).map(a => {
            const learner = a.learnerId ? learners.find(l => l.id === a.learnerId) : null;
            const isCrit = a.severity === 'critical';
            return (
              <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'grid', gridTemplateColumns: '6px 1fr auto', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: isCrit ? '#ef4444' : '#f59e0b', marginTop: 7, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{a.title}</p>
                  <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#6b7280', margin: 0 }}>{a.detail}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <span className={`at-badge ${isCrit ? 'at-badge--red' : 'at-badge--amber'}`}>{isCrit ? 'Critical' : 'Warning'}</span>
                  {learner && <Link href={`/projects/assessor-track/learners/${learner.id}`} className="at-link" style={{ fontSize: 12 }}>{learner.name}</Link>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
