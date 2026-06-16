'use client';
import Link from 'next/link';
import { useLearners } from '@/hooks/assessor-track/useLearners';
import { StatusBadge } from '@/components/assessor-track/StatusBadge';
import { ProgressBar } from '@/components/assessor-track/ProgressBar';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';

export default function Learners() {
  const state = useLearners();

  if (!state) return null;

  const {
    filtered, assessors,
    search, setSearch,
    statusFilter, setStatusFilter,
    assessorFilter, setAssessorFilter,
    resetFilters, isFiltered,
  } = state;

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'Learners' }]} />

      <div style={{ marginBottom: 24 }}>
        <h1 className="at-h1">Learners</h1>
        <p className="at-muted" style={{ marginTop: 4 }}>{filtered.length} learner{filtered.length !== 1 ? 's' : ''} shown</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label className="at-label" htmlFor="search">Search</label>
          <input className="at-input" id="search" type="text" placeholder="Name or employer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: '0 0 140px' }}>
          <label className="at-label" htmlFor="status">Status</label>
          <select className="at-select" id="status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="on-track">On track</option>
            <option value="at-risk">At risk</option>
            <option value="behind">Behind</option>
          </select>
        </div>
        <div style={{ flex: '0 0 180px' }}>
          <label className="at-label" htmlFor="assessor">Assessor</label>
          <select className="at-select" id="assessor" value={assessorFilter} onChange={e => setAssessorFilter(e.target.value)}>
            <option value="all">All assessors</option>
            {assessors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        {isFiltered && (
          <button className="at-btn at-btn--ghost at-btn--sm" onClick={resetFilters}>Clear filters</button>
        )}
      </div>

      <div className="at-table-wrap">
        <table className="at-table">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Programme</th>
              <th>Status</th>
              <th>OTJ progress</th>
              <th>Last contact</th>
              <th>EPA date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: 32 }}>No learners match these filters.</td></tr>
              : filtered.map(l => (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {l.needsAttention && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} title="Needs attention" />}
                      <div>
                        <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{l.employer}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.programme}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{ minWidth: 160 }}>
                    <ProgressBar logged={l.otjLogged} target={l.otjTarget} />
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>{l.otjLogged}h / {l.otjTarget}h</p>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: '#6b7280' }}>{l.lastContact}</td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{l.epaDate}</td>
                  <td>
                    <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-btn at-btn--ghost at-btn--sm" style={{ whiteSpace: 'nowrap' }}>View →</Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
