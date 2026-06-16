'use client';
import Link from 'next/link';
import { useOtj } from '@/hooks/assessor-track/useOtj';
import { ProgressBar } from '@/components/assessor-track/ProgressBar';
import { Breadcrumb } from '@/components/assessor-track/Breadcrumb';
import { otjTextColour } from '@/lib/assessor-track/utils';

export default function OtjOverview() {
  const state = useOtj();

  if (!state) return null;

  const { rows, critical, atRisk, onTrack, showAll, setShowAll } = state;

  const summaryCards = [
    { label: 'Critical (<40%)',  count: critical.length, colour: '#dc2626', bg: '#fff1f2' },
    { label: 'At risk (40–69%)', count: atRisk.length,   colour: '#d97706', bg: '#fffbeb' },
    { label: 'On track (≥70%)',  count: onTrack.length,  colour: '#059669', bg: '#ecfdf5' },
  ];

  return (
    <div className="at-page">
      <Breadcrumb items={[{ label: 'AssessorTrack', href: '/projects/assessor-track' }, { label: 'OTJ Hours' }]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <h1 className="at-h1">Off-the-job hours</h1>
          <p className="at-muted" style={{ marginTop: 4 }}>Sorted by lowest completion first</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`at-btn at-btn--sm ${!showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(false)}>My caseload</button>
          <button className={`at-btn at-btn--sm ${showAll ? 'at-btn--primary' : 'at-btn--ghost'}`} onClick={() => setShowAll(true)}>All assessors</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
        {summaryCards.map(s => (
          <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.colour}22`, borderRadius: 12, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 36, fontWeight: 700, color: s.colour, margin: 0, lineHeight: 1 }}>{s.count}</p>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: s.colour, margin: 0, fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="at-table-wrap">
        <table className="at-table">
          <thead>
            <tr>
              <th>Learner</th>
              <th>Programme</th>
              <th>Logged</th>
              <th>Target</th>
              <th style={{ minWidth: 180 }}>Progress</th>
              <th>Last entry</th>
              <th>EPA date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(l => (
              <tr key={l.id}>
                <td>
                  <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                </td>
                <td style={{ color: '#6b7280' }}>{l.programme}</td>
                <td style={{ fontWeight: 700, color: otjTextColour(l.pct) }}>{l.otjLogged}h</td>
                <td style={{ color: '#6b7280' }}>{l.otjTarget}h</td>
                <td><ProgressBar logged={l.otjLogged} target={l.otjTarget} /></td>
                <td style={{ color: '#9ca3af', fontSize: 13 }}>{l.lastEntryDate}</td>
                <td style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{l.epaDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
