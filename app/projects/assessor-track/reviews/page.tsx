'use client';
import Link from 'next/link';
import { useReviews, type ReviewWithLearner } from '@/hooks/assessor-track/useReviews';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';
import { TODAY, diffDays, typeLabel } from '@/lib/assessor-track/utils';

function ReviewCard({ r, overdue }: { r: ReviewWithLearner; overdue?: boolean }) {
  const days = overdue ? diffDays(r.scheduledDate, TODAY) : diffDays(TODAY, r.scheduledDate);
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${overdue ? '#fecaca' : '#e5e7eb'}`, borderLeft: `3px solid ${overdue ? '#ef4444' : '#6366f1'}`, padding: '14px 16px', marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <Link href={`/projects/assessor-track/learners/${r.learner.id}`} style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#111827', textDecoration: 'none', display: 'block', marginBottom: 3 }}>{r.learner.name}</Link>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: '0 0 5px' }}>{r.learner.programme}</p>
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 500, color: '#6b7280' }}>{typeLabel(r.type)}</span>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 700, color: overdue ? '#dc2626' : '#374151', margin: '0 0 4px' }}>{r.scheduledDate}</p>
          {overdue
            ? <span className="at-badge at-badge--red">{days}d overdue</span>
            : <span className="at-muted">in {days}d</span>}
        </div>
      </div>
      {r.notes && <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: '10px 0 0', fontStyle: 'italic', borderTop: '1px solid #f3f4f6', paddingTop: 8 }}>{r.notes}</p>}
    </div>
  );
}

const COLS = [
  { key: 'overdue'   as const, title: 'Overdue',    accent: '#ef4444', bg: '#fff1f2', overdue: true  },
  { key: 'thisMonth' as const, title: 'This month',  accent: '#6366f1', bg: '#f5f3ff', overdue: false },
  { key: 'upcoming'  as const, title: 'Upcoming',    accent: '#6b7280', bg: '#f9fafb', overdue: false },
];

export default function Reviews() {
  const state = useReviews();

  if (!state) return null;

  const { overdue, thisMonth, upcoming, completed, showAll, setShowAll } = state;
  const colData = { overdue, thisMonth, upcoming };

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'Reviews' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="at-h1">Review schedule</h1>
          <p className="at-muted" style={{ marginTop: 4 }}>{overdue.length + thisMonth.length + upcoming.length} pending · {completed.length} completed</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`at-btn at-btn--sm ${!showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(false)}>My caseload</button>
          <button className={`at-btn at-btn--sm ${showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(true)}>All assessors</button>
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="at-warning-box" style={{ marginBottom: 20 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
          <span>{overdue.length} review{overdue.length !== 1 ? 's are' : ' is'} overdue and need{overdue.length === 1 ? 's' : ''} immediate rescheduling.</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
        {COLS.map(col => (
          <div key={col.key}>
            <div style={{ background: col.bg, borderRadius: '10px 10px 0 0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${col.accent}` }}>
              <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 700, color: col.accent, margin: 0 }}>{col.title}</h2>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 700, color: col.accent, background: '#fff', padding: '2px 10px', borderRadius: 999, border: `1px solid ${col.accent}20` }}>{colData[col.key].length}</span>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '0 0 10px 10px', border: '1px solid #e5e7eb', borderTop: 'none', padding: 12, minHeight: 120 }}>
              {colData[col.key].length === 0
                ? <p className="at-muted" style={{ textAlign: 'center', paddingTop: 24 }}>Nothing here.</p>
                : colData[col.key].map(r => <ReviewCard key={r.id} r={r} overdue={col.overdue} />)}
            </div>
          </div>
        ))}
      </div>

      {completed.length > 0 && (
        <details style={{ marginTop: 28 }}>
          <summary style={{ cursor: 'pointer', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#6b7280', userSelect: 'none' }}>
            Completed ({completed.length})
          </summary>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 14, opacity: 0.65 }}>
            {completed.map(r => <ReviewCard key={r.id} r={r} />)}
          </div>
        </details>
      )}
    </div>
  );
}
