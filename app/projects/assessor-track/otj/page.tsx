'use client';
import { useState } from 'react';
import Link from 'next/link';
import { learners, otjEntries, CURRENT_ASSESSOR_ID } from '@/lib/assessor-track/data';

function pct(a: number, b: number) { return Math.round((a / b) * 100); }
function fillColour(p: number) { return p >= 70 ? '#22c55e' : p >= 40 ? '#f59e0b' : '#ef4444'; }
function textColour(p: number) { return p >= 70 ? '#166534' : p >= 40 ? '#713f12' : '#991b1b'; }
function recentOtj(id: string) {
  const entries = otjEntries.filter(e => e.learnerId === id).sort((a, b) => b.date.localeCompare(a.date));
  return entries[0]?.date ?? '—';
}

export default function OtjOverview() {
  const [showAll, setShowAll] = useState(false);

  const pool = showAll ? learners : learners.filter(l => l.assessorId === CURRENT_ASSESSOR_ID);
  const rows = [...pool].sort((a, b) => pct(a.otjLogged, a.otjTarget) - pct(b.otjLogged, b.otjTarget));

  const critical = rows.filter(l => pct(l.otjLogged, l.otjTarget) < 40);
  const atRisk = rows.filter(l => { const p = pct(l.otjLogged, l.otjTarget); return p >= 40 && p < 70; });
  const onTrack = rows.filter(l => pct(l.otjLogged, l.otjTarget) >= 70);

  const summaryCards = [
    { label: 'Critical (<40%)', count: critical.length, colour: '#dc2626', bg: '#fff1f2' },
    { label: 'At risk (40–69%)', count: atRisk.length, colour: '#d97706', bg: '#fffbeb' },
    { label: 'On track (≥70%)', count: onTrack.length, colour: '#059669', bg: '#ecfdf5' },
  ];

  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects/assessor-track">AssessorTrack</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>OTJ Hours</span>
      </nav>

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
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: s.colour, margin: 0, fontWeight: 500, lineHeight: 1.4 }}>{s.label}</p>
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
            {rows.map(l => {
              const p = pct(l.otjLogged, l.otjTarget);
              return (
                <tr key={l.id}>
                  <td>
                    <Link href={`/projects/assessor-track/learners/${l.id}`} className="at-link" style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{l.name}</Link>
                  </td>
                  <td style={{ color: '#6b7280' }}>{l.programme}</td>
                  <td style={{ fontWeight: 700, color: textColour(p) }}>{l.otjLogged}h</td>
                  <td style={{ color: '#6b7280' }}>{l.otjTarget}h</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="at-progress" style={{ flex: 1 }}>
                        <div className="at-progress-fill" style={{ width: `${Math.min(p, 100)}%`, background: fillColour(p) }} />
                      </div>
                      <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 12, fontWeight: 700, color: textColour(p), minWidth: 34 }}>{p}%</span>
                    </div>
                  </td>
                  <td style={{ color: '#9ca3af', fontSize: 13 }}>{recentOtj(l.id)}</td>
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
