'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type Stakeholder, type CommsEntry } from '@/lib/supabase';

type CommsWithName = CommsEntry & { stakeholders: { name: string } | null };

function StatCard({ value, label, colour }: { value: number; label: string; colour: string }) {
  return (
    <div style={{ background: '#fff', border: `4px solid ${colour}`, padding: '1.5rem', flex: '1 1 160px', minWidth: '140px' }}>
      <p style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '48px', fontWeight: 700, margin: 0, color: colour }}>{value}</p>
      <p style={{ fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '16px', margin: 0, color: '#0b0c0c' }}>{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [comms, setComms] = useState<CommsWithName[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [{ data: shs }, { data: cms }] = await Promise.all([
      supabase.from('stakeholders').select('*'),
      supabase.from('comms_log').select('*, stakeholders(name)').order('date', { ascending: false }).limit(50),
    ]);
    setStakeholders(shs ?? []);
    setComms((cms ?? []) as CommsWithName[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().slice(0, 10);
  const atRisk = stakeholders.filter(s => s.engagement_status === 'at-risk').length;
  const active = stakeholders.filter(s => s.engagement_status === 'active').length;
  const overdue = comms.filter(c => c.next_action_date && c.next_action_date < today && c.next_action).length;
  const recentComms = comms.slice(0, 5);
  const upcomingActions = comms
    .filter(c => c.next_action && c.next_action_date && c.next_action_date >= today)
    .sort((a, b) => (a.next_action_date ?? '').localeCompare(b.next_action_date ?? ''))
    .slice(0, 5);

  return (
    <div className="govuk-width-container">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item"><Link className="govuk-breadcrumbs__link" href="/projects/stakeholder-map">Stakeholder Map</Link></li>
          <li className="govuk-breadcrumbs__list-item">Dashboard</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Engagement Health Dashboard</h1>

      {loading ? <p className="govuk-body">Loading…</p> : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <StatCard value={stakeholders.length} label="Total stakeholders" colour="#1d70b8" />
            <StatCard value={active} label="Active" colour="#00703c" />
            <StatCard value={atRisk} label="At risk" colour="#d4351c" />
            <StatCard value={overdue} label="Overdue actions" colour="#f47738" />
          </div>

          {atRisk > 0 && (
            <div className="govuk-warning-text">
              <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-visually-hidden">Warning</span>
                {atRisk} stakeholder{atRisk !== 1 ? 's are' : ' is'} marked as at risk. Review their engagement strategy.
              </strong>
            </div>
          )}

          {overdue > 0 && (
            <div className="govuk-inset-text" style={{ borderColor: '#f47738' }}>
              <p className="govuk-body"><strong>{overdue} overdue action{overdue !== 1 ? 's' : ''}</strong> — check the <Link className="govuk-link" href="/projects/stakeholder-map/comms-log">communication log</Link> for details.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Recent comms */}
            <div>
              <h2 className="govuk-heading-m">Recent communications</h2>
              {recentComms.length === 0 ? (
                <p className="govuk-body">None logged yet.</p>
              ) : (
                <table className="govuk-table">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th className="govuk-table__header">Date</th>
                      <th className="govuk-table__header">Stakeholder</th>
                      <th className="govuk-table__header">Channel</th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    {recentComms.map(c => (
                      <tr key={c.id} className="govuk-table__row">
                        <td className="govuk-table__cell" style={{ whiteSpace: 'nowrap' }}>{c.date}</td>
                        <td className="govuk-table__cell">{c.stakeholders?.name ?? '—'}</td>
                        <td className="govuk-table__cell">{c.channel ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <Link className="govuk-link" href="/projects/stakeholder-map/comms-log">View all communications →</Link>
            </div>

            {/* Upcoming actions */}
            <div>
              <h2 className="govuk-heading-m">Upcoming actions</h2>
              {upcomingActions.length === 0 ? (
                <p className="govuk-body">No upcoming actions.</p>
              ) : (
                <table className="govuk-table">
                  <thead className="govuk-table__head">
                    <tr className="govuk-table__row">
                      <th className="govuk-table__header">Due</th>
                      <th className="govuk-table__header">Stakeholder</th>
                      <th className="govuk-table__header">Action</th>
                    </tr>
                  </thead>
                  <tbody className="govuk-table__body">
                    {upcomingActions.map(c => (
                      <tr key={c.id} className="govuk-table__row">
                        <td className="govuk-table__cell" style={{ whiteSpace: 'nowrap' }}>
                          <strong className="govuk-tag govuk-tag--blue">{c.next_action_date}</strong>
                        </td>
                        <td className="govuk-table__cell">{c.stakeholders?.name ?? '—'}</td>
                        <td className="govuk-table__cell">{c.next_action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Stakeholder status breakdown */}
          <h2 className="govuk-heading-m" style={{ marginTop: '2rem' }}>Stakeholder status</h2>
          <table className="govuk-table">
            <thead className="govuk-table__head">
              <tr className="govuk-table__row">
                <th className="govuk-table__header">Name</th>
                <th className="govuk-table__header">Organisation</th>
                <th className="govuk-table__header">Influence</th>
                <th className="govuk-table__header">Interest</th>
                <th className="govuk-table__header">Status</th>
              </tr>
            </thead>
            <tbody className="govuk-table__body">
              {stakeholders.sort((a, b) => {
                const order = { 'at-risk': 0, active: 1, inactive: 2 };
                return (order[a.engagement_status as keyof typeof order] ?? 3) - (order[b.engagement_status as keyof typeof order] ?? 3);
              }).map(s => (
                <tr key={s.id} className="govuk-table__row">
                  <td className="govuk-table__cell govuk-!-font-weight-bold">{s.name}</td>
                  <td className="govuk-table__cell">{s.organisation ?? '—'}</td>
                  <td className="govuk-table__cell">{s.influence}/10</td>
                  <td className="govuk-table__cell">{s.interest}/10</td>
                  <td className="govuk-table__cell">
                    <strong className={`govuk-tag ${s.engagement_status === 'active' ? 'govuk-tag--green' : s.engagement_status === 'at-risk' ? 'govuk-tag--red' : 'govuk-tag--grey'}`}>
                      {s.engagement_status}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
