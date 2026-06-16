'use client';
import Link from 'next/link';
import { useManager } from '@/hooks/assessor-track/useManager';
import { StatusBadge } from '@/components/assessor-track/StatusBadge';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';
import { otjTextColour } from '@/lib/assessor-track/utils';

export default function Manager() {
  const state = useManager();

  if (!state) return null;

  const {
    assessorSummaries, filteredLearners, assessors, programmes,
    selectedAssessor, setSelectedAssessor,
    selectedProgramme, setSelectedProgramme,
  } = state;

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'Manager View' }]} />

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
            {assessorSummaries.map(s => (
              <tr key={s.assessor.id}>
                <td style={{ fontWeight: 700 }}>{s.assessor.name}</td>
                <td style={{ color: '#6b7280' }}>{s.assessor.region}</td>
                <td style={{ fontWeight: 600 }}>{s.total}</td>
                <td style={{ fontWeight: 700, color: '#166534' }}>{s.onTrack}</td>
                <td style={{ fontWeight: 700, color: '#713f12' }}>{s.atRisk}</td>
                <td style={{ fontWeight: 700, color: '#991b1b' }}>{s.behind}</td>
                <td>{s.criticalAlerts > 0 ? <span className="at-badge at-badge--red">{s.criticalAlerts}</span> : <span style={{ color: '#9ca3af' }}>0</span>}</td>
                <td style={{ fontWeight: 700, color: otjTextColour(s.avgOtjPct) }}>{s.avgOtjPct}%</td>
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
          <span className="at-muted">{filteredLearners.length} learner{filteredLearners.length !== 1 ? 's' : ''}</span>
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
            {filteredLearners.map(l => {
              const assessor = assessors.find(a => a.id === l.assessorId);
              return (
                <tr key={l.id}>
                  <td>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                      {l.needsAttention && <span className="at-badge at-badge--red" style={{ fontSize: 10 }}>!</span>}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{l.programme}</td>
                  <td style={{ color: '#6b7280' }}>{assessor?.name ?? '—'}</td>
                  <td><StatusBadge status={l.status} /></td>
                  <td style={{ fontWeight: 700, color: otjTextColour(Math.round((l.otjLogged / l.otjTarget) * 100)) }}>
                    {Math.round((l.otjLogged / l.otjTarget) * 100)}%
                  </td>
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
