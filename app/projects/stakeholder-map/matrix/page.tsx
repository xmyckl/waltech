'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type Stakeholder } from '@/lib/supabase';

const quadrants = [
  { key: 'manage',  label: 'Manage Closely',  desc: 'High influence, high interest',  top: true,  right: true,  bg: '#d4edda', border: '#28a745' },
  { key: 'satisfy', label: 'Keep Satisfied',  desc: 'High influence, low interest',   top: true,  right: false, bg: '#fff3cd', border: '#ffc107' },
  { key: 'inform',  label: 'Keep Informed',   desc: 'Low influence, high interest',   top: false, right: true,  bg: '#cce5ff', border: '#0d6efd' },
  { key: 'monitor', label: 'Monitor',         desc: 'Low influence, low interest',    top: false, right: false, bg: '#f8f9fa', border: '#6c757d' },
];

function classify(s: Stakeholder) {
  const hi = s.influence > 5;
  const hr = s.interest > 5;
  if (hi && hr) return 'manage';
  if (hi && !hr) return 'satisfy';
  if (!hi && hr) return 'inform';
  return 'monitor';
}

export default function Matrix() {
  const [rows, setRows] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await supabase.from('stakeholders').select('*').order('name');
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const grouped = quadrants.map(q => ({
    ...q,
    stakeholders: rows.filter(s => classify(s) === q.key),
  }));

  return (
    <div className="govuk-width-container">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item"><Link className="govuk-breadcrumbs__link" href="/projects/stakeholder-map">Stakeholder Map</Link></li>
          <li className="govuk-breadcrumbs__list-item">Matrix</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Influence / Interest Matrix</h1>
      <p className="govuk-body">Stakeholders are placed based on their influence and interest scores in the <Link className="govuk-link" href="/projects/stakeholder-map/register">register</Link>. Scores above 5 are considered high.</p>

      {loading ? (
        <p className="govuk-body">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="govuk-inset-text">
          <p className="govuk-body">No stakeholders yet. <Link className="govuk-link" href="/projects/stakeholder-map/register">Add some in the register</Link> to see them plotted here.</p>
        </div>
      ) : (
        <>
          {/* Visual grid */}
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            {/* Axis labels */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', paddingLeft: '60px' }}>
              <span style={{ flex: 1, textAlign: 'center', fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '14px', fontWeight: 700 }}>LOW INTEREST</span>
              <span style={{ flex: 1, textAlign: 'center', fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '14px', fontWeight: 700 }}>HIGH INTEREST</span>
            </div>
            <div style={{ display: 'flex' }}>
              {/* Vertical axis label */}
              <div style={{ width: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '12px', fontWeight: 700, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}>HIGH INFLUENCE</span>
                <span style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '12px', fontWeight: 700, writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.05em' }}>LOW INFLUENCE</span>
              </div>
              {/* 2×2 grid */}
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px', minHeight: '340px' }}>
                {[
                  grouped.find(q => q.key === 'satisfy')!,
                  grouped.find(q => q.key === 'manage')!,
                  grouped.find(q => q.key === 'monitor')!,
                  grouped.find(q => q.key === 'inform')!,
                ].map(q => (
                  <div key={q.key} style={{ background: q.bg, border: `2px solid ${q.border}`, padding: '14px', minHeight: '160px' }}>
                    <p style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#0b0c0c' }}>{q.label}</p>
                    {q.stakeholders.length === 0 ? (
                      <p style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '12px', color: '#505a5f', fontStyle: 'italic' }}>No stakeholders</p>
                    ) : (
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {q.stakeholders.map(s => (
                          <li key={s.id}>
                            <span style={{ display: 'inline-block', background: '#fff', border: `1px solid ${q.border}`, borderRadius: '4px', padding: '3px 8px', fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '13px', fontWeight: 600 }}>
                              {s.name}
                              <span style={{ fontWeight: 400, color: '#505a5f', marginLeft: '4px' }}>({s.influence}/{s.interest})</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '12px', color: '#505a5f', marginTop: '8px', paddingLeft: '60px' }}>
              Numbers shown as influence/interest score.
            </p>
          </div>

          {/* Summary table */}
          <h2 className="govuk-heading-m">Summary</h2>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th className="govuk-table__header">Quadrant</th>
                <th className="govuk-table__header">Strategy</th>
                <th className="govuk-table__header">Stakeholders</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {grouped.map(q => (
                <tr key={q.key} className="govuk-table__row">
                  <td className="govuk-table__cell govuk-!-font-weight-bold">{q.label}</td>
                  <td className="govuk-table__cell">{q.desc}</td>
                  <td className="govuk-table__cell">{q.stakeholders.length === 0 ? '—' : q.stakeholders.map(s => s.name).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
