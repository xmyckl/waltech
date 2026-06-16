'use client';
import { useState } from 'react';
import Link from 'next/link';
import { learners, assessors, alerts } from '@/lib/assessor-track/data';

function pct(a: number, b: number) { return Math.round((a / b) * 100); }
function textColour(p: number) { return p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b'; }

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { 'on-track': 'at-badge--green', 'at-risk': 'at-badge--amber', 'behind': 'at-badge--red' };
  return <span className={`at-badge ${map[status] ?? 'at-badge--grey'}`}>{status}</span>;
}

export default function Manager() {
  const [selectedAssessor, setSelectedAssessor] = useState('all');
  const [selectedProgramme, setSelectedProgramme] = useState('all');

  const programmes = [...new Set(learners.map(l => l.programme))];

  const filtered = learners.filter(l =>
    (selectedAssessor === 'all' || l.assessorId === selectedAssessor) &&
    (selectedProgramme === 'all' || l.programme === selectedProgramme)
  );

  const assessorStats = assessors.map(a => {
    const caseload = learners.filter(l => l.assessorId === a.id);
    const avgOtj = caseload.length ? Math.round(caseload.reduce((s, l) => s + pct(l.otjLogged, l.otjTarget), 0) / caseload.length) : 0;
    const criticalCount = alerts.filter(al => al.severity === 'critical' && al.learnerId && caseload.some(l => l.id === al.learnerId)).length;
    return {
      assessor: a,
      total: caseload.length,
      onTrack: caseload.filter(l => l.status === 'on-track').length,
      atRisk: caseload.filter(l => l.status === 'at-risk').length,
      behind: caseload.filter(l => l.status === 'behind').length,
      critical: criticalCount,
      avgOtj,
    };
  });

  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects/assessor-track">AssessorTrack</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>Manager View</span>
      </nav>

      <div style={{ marginBottom: 28 }}>
        <h1 className="at-h1">Programme manager view</h1>
        <p className="at-muted" style={{ marginTop: 4 }}>Cross-assessor oversight across all regions</p>
      </div>

      <h2 className="at-h2">Assessor summary</h2>
      <div className="at-table-wrap" style={{ marginBottom: 32 }}>
        <table className="at-table">
          <thead>
            <tr>
              <th>Assessor</th>
              <th>Region</th>
              <th>Caseload</th>
              <th>On track</th>
              <th>At risk</th>
              <th>Behind</th>
              <th>Critical alerts</th>
              <th>Avg OTJ</th>
            </tr>
          </thead>
          <tbody>
            {assessorStats.map(s => (
              <tr key={s.assessor.id}>
                <td style={{ fontWeight: 700 }}>{s.assessor.name}</td>
                <td style={{ color: '#6b7280' }}>{s.assessor.region}</td>
                <td style={{ fontWeight: 600 }}>{s.total}</td>
                <td style={{ fontWeight: 700, color: '#166534' }}>{s.onTrack}</td>
                <td style={{ fontWeight: 700, color: '#713f12' }}>{s.atRisk}</td>
                <td style={{ fontWeight: 700, color: '#991b1b' }}>{s.behind}</td>
                <td>
                  {s.critical > 0
                    ? <span className="at-badge at-badge--red">{s.critical}</span>
                    : <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#9ca3af' }}>0</span>}
                </td>
                <td style={{ fontWeight: 700, color: textColour(s.avgOtj) }}>{s.avgOtj}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <h2 className="at-h2" style={{ margin: 0 }}>All learners</h2>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div>
            <label className="at-label" htmlFor="f-assessor">Assessor</label>
            <select className="at-select" id="f-assessor" value={selectedAssessor} onChange={e => setSelectedAssessor(e.target.value)} style={{ minWidth: 160 }}>
              <option value="all">All assessors</option>
              {assessors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className="at-label" htmlFor="f-prog">Programme</label>
            <select className="at-select" id="f-prog" value={selectedProgramme} onChange={e => setSelectedProgramme(e.target.value)} style={{ minWidth: 140 }}>
              <option value="all">All programmes</option>
              {programmes.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <span className="at-muted">{filtered.length} learner{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="at-table-wrap">
        <table className="at-table">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Programme</th>
              <th>Assessor</th>
              <th>Status</th>
              <th>OTJ %</th>
              <th>EPA date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => {
              const a = assessors.find(x => x.id === l.assessorId);
              const p = pct(l.otjLogged, l.otjTarget);
              return (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                      {l.needsAttention && <span className="at-badge at-badge--red" style={{ fontSize: 10 }}>!</span>}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{l.programme}</td>
                  <td style={{ color: '#6b7280' }}>{a?.name ?? '—'}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{ fontWeight: 700, color: textColour(p) }}>{p}%</td>
                  <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{l.epaDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
