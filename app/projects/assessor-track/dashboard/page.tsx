'use client';
import Link from 'next/link';
import { useDashboard } from '@/hooks/assessor-track/useDashboard';
import { StatusBadge } from '@/components/assessor-track/StatusBadge';
import { ProgressBar } from '@/components/assessor-track/ProgressBar';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';
import { TODAY, diffDays } from '@/lib/assessor-track/utils';

const STAT_CARDS = [
  { key: 'total',    label: 'My learners',    colour: '#6366f1', bg: '#f5f3ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { key: 'onTrack',  label: 'On track',       colour: '#059669', bg: '#ecfdf5', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> },
  { key: 'atRisk',   label: 'At risk',        colour: '#d97706', bg: '#fffbeb', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg> },
  { key: 'behind',   label: 'Behind',         colour: '#dc2626', bg: '#fff1f2', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> },
  { key: 'critical', label: 'Critical alerts', colour: '#7c3aed', bg: '#faf5ff', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
] as const;

export default function Dashboard() {
  const state = useDashboard();

  if (!state) return null;

  const { counts, criticalAlerts, allMyAlerts, overdueReviews, upcomingReviews, flaggedLearners } = state;

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'Dashboard' }]} />

      <div style={{ marginBottom: 28 }}>
        <h1 className="at-h1">Dashboard</h1>
        <p className="at-muted" style={{ marginTop: 4 }}>Monday 16 June 2026 — South Wales</p>
      </div>

      {criticalAlerts.length > 0 && (
        <div className="at-warning-box" style={{ marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>
            {criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? 's' : ''} require immediate attention.{' '}
            <Link href="/projects/assessor-track/alerts" className="at-link">View alerts →</Link>
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {STAT_CARDS.map(s => (
          <div key={s.key} className="at-stat">
            <div style={{ width: 34, height: 34, borderRadius: 8, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.colour, marginBottom: 12 }}>
              {s.icon}
            </div>
            <div className="at-stat-value" style={{ color: s.colour }}>{counts[s.key]}</div>
            <div className="at-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
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
            {upcomingReviews.length === 0
              ? <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#9ca3af', padding: '16px 20px', margin: 0 }}>No upcoming reviews.</p>
              : upcomingReviews.map(r => {
                  const days = diffDays(TODAY, r.scheduledDate);
                  return (
                    <div key={r.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <div>
                        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>
                          <Link href={`/projects/assessor-track/learners/${r.learner.id}`} className="at-link">{r.learner.name}</Link>
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
            {flaggedLearners.length === 0
              ? <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#9ca3af', padding: '16px 20px', margin: 0 }}>No flagged learners.</p>
              : flaggedLearners.map(l => {
                  const daysToEpa = diffDays(TODAY, l.epaDate);
                  return (
                    <div key={l.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                          <Link href={`/projects/assessor-track/learners/${l.id}`} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', textDecoration: 'none' }}>{l.name}</Link>
                          <StatusBadge status={l.status} />
                        </div>
                        <ProgressBar logged={l.otjLogged} target={l.otjTarget} />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 600, color: daysToEpa < 60 ? '#dc2626' : '#6b7280', margin: '0 0 2px' }}>EPA in {daysToEpa}d</p>
                        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#9ca3af', margin: 0 }}>{l.epaDate}</p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      {allMyAlerts.length > 0 && (
        <div className="at-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="at-section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Active alerts</p>
            <Link href="/projects/assessor-track/alerts" className="at-link" style={{ fontSize: 12 }}>View all →</Link>
          </div>
          {allMyAlerts.slice(0, 4).map(a => (
            <div key={a.id} style={{ padding: '12px 20px', borderBottom: '1px solid #f9fafb', display: 'grid', gridTemplateColumns: '8px 1fr auto', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: a.severity === 'critical' ? '#ef4444' : '#f59e0b', marginTop: 6, flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13.5, fontWeight: 600, color: '#111827', margin: '0 0 3px' }}>{a.title}</p>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#6b7280', margin: 0 }}>{a.detail}</p>
              </div>
              <span className={`at-badge ${a.severity === 'critical' ? 'at-badge--red' : 'at-badge--amber'}`}>{a.severity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
