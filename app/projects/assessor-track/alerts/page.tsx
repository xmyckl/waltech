'use client';
import Link from 'next/link';
import { useAlerts, type AlertWithLearner } from '@/hooks/assessor-track/useAlerts';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';

function AlertCard({ a }: { a: AlertWithLearner }) {
  const isCrit = a.severity === 'critical';
  return (
    <div style={{ background: '#fff', borderRadius: 10, border: `1px solid ${isCrit ? '#fecaca' : '#fde68a'}`, borderLeft: `3px solid ${isCrit ? '#ef4444' : '#f59e0b'}`, padding: '16px 18px', marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
            <span className={`at-badge ${isCrit ? 'at-badge--red' : 'at-badge--amber'}`}>{isCrit ? 'Critical' : 'Warning'}</span>
            {a.learner && (
              <>
                <Link href={`/projects/assessor-track/learners/${a.learner.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600 }}>{a.learner.name}</Link>
                <span className="at-muted">&mdash; {a.learner.programme}</span>
              </>
            )}
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#111827', margin: '0 0 5px' }}>{a.title}</p>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: '#6b7280', margin: 0 }}>{a.detail}</p>
        </div>
        <span className="at-muted" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>{a.createdAt}</span>
      </div>
    </div>
  );
}

export default function Alerts() {
  const state = useAlerts();

  if (!state) return null;

  const { critical, warnings, showAll, setShowAll } = state;

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'Alerts' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="at-h1">Alerts</h1>
          <p className="at-muted" style={{ marginTop: 4 }}>{critical.length} critical · {warnings.length} warnings</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`at-btn at-btn--sm ${!showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(false)}>My caseload</button>
          <button className={`at-btn at-btn--sm ${showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(true)}>All assessors</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 28 }}>
        <div style={{ background: '#fff1f2', border: '1px solid #fecaca', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 42, fontWeight: 700, color: '#dc2626', margin: 0, lineHeight: 1 }}>{critical.length}</p>
          <div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#991b1b', margin: '0 0 2px' }}>Critical</p>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#dc2626', margin: 0 }}>Require immediate action</p>
          </div>
        </div>
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 42, fontWeight: 700, color: '#d97706', margin: 0, lineHeight: 1 }}>{warnings.length}</p>
          <div>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#92400e', margin: '0 0 2px' }}>Warnings</p>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#d97706', margin: 0 }}>Monitor and address</p>
          </div>
        </div>
      </div>

      {critical.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 className="at-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            Critical alerts
          </h2>
          {critical.map(a => <AlertCard key={a.id} a={a} />)}
        </section>
      )}

      {warnings.length > 0 && (
        <section>
          <h2 className="at-h2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            Warnings
          </h2>
          {warnings.map(a => <AlertCard key={a.id} a={a} />)}
        </section>
      )}

      {critical.length === 0 && warnings.length === 0 && (
        <div className="at-inset">No alerts for the current selection.</div>
      )}
    </div>
  );
}
