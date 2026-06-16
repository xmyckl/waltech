'use client';
import { useState } from 'react';
import Link from 'next/link';
import { learners, assessors, CURRENT_ASSESSOR_ID } from '@/lib/assessor-track/data';

function pct(a: number, b: number) { return Math.round((a / b) * 100); }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { 'on-track': 'at-badge--green', 'at-risk': 'at-badge--amber', 'behind': 'at-badge--red' };
  return <span className={`at-badge ${map[status] ?? 'at-badge--grey'}`}>{status}</span>;
}

export default function Learners() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [assessor, setAssessor] = useState(CURRENT_ASSESSOR_ID);

  const filtered = learners.filter(l =>
    (assessor === 'all' || l.assessorId === assessor) &&
    (status === 'all' || l.status === status) &&
    (search === '' || l.name.toLowerCase().includes(search.toLowerCase()) || l.employer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects/assessor-track">AssessorTrack</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>Learners</span>
      </nav>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="at-h1">Learners</h1>
        <p className="at-muted" style={{ marginTop: 4 }}>{filtered.length} of {learners.length} learners shown</p>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <label className="at-label" htmlFor="search">Search</label>
          <input className="at-input" id="search" type="text" placeholder="Name or employer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ flex: '0 0 140px' }}>
          <label className="at-label" htmlFor="status">Status</label>
          <select className="at-select" id="status" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="on-track">On track</option>
            <option value="at-risk">At risk</option>
            <option value="behind">Behind</option>
          </select>
        </div>
        <div style={{ flex: '0 0 180px' }}>
          <label className="at-label" htmlFor="assessor">Assessor</label>
          <select className="at-select" id="assessor" value={assessor} onChange={e => setAssessor(e.target.value)}>
            <option value="all">All assessors</option>
            {assessors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        {(search || status !== 'all' || assessor !== CURRENT_ASSESSOR_ID) && (
          <button className="at-btn at-btn--ghost at-btn--sm" onClick={() => { setSearch(''); setStatus('all'); setAssessor(CURRENT_ASSESSOR_ID); }}>
            Clear filters
          </button>
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#9ca3af', padding: '32px' }}>No learners match these filters.</td>
              </tr>
            )}
            {filtered.map(l => {
              const p = pct(l.otjLogged, l.otjTarget);
              const fillColour = p >= 70 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444';
              return (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {l.needsAttention && (
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} title="Needs attention" />
                      )}
                      <div>
                        <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, color: '#9ca3af', margin: '2px 0 0' }}>{l.employer}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{l.programme}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{ minWidth: 160 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="at-progress" style={{ flex: 1 }}>
                        <div className="at-progress-fill" style={{ width: `${Math.min(p, 100)}%`, background: fillColour }} />
                      </div>
                      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 700, color: p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b', minWidth: 34 }}>{p}%</span>
                    </div>
                    <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#9ca3af', margin: '4px 0 0' }}>{l.otjLogged}h / {l.otjTarget}h</p>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', color: '#6b7280' }}>{l.lastContact}</td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{l.epaDate}</td>
                  <td>
                    <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-btn at-btn--ghost at-btn--sm" style={{ whiteSpace: 'nowrap' }}>
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
