'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type CommsEntry, type Stakeholder } from '@/lib/supabase';

const channels = ['Email', 'Meeting', 'Phone', 'Teams / Zoom', 'Letter', 'Other'];
const empty = { stakeholder_id: '', date: new Date().toISOString().slice(0, 10), channel: '', summary: '', outcome: '', next_action: '', next_action_date: '' };

export default function CommsLog() {
  const [entries, setEntries] = useState<(CommsEntry & { stakeholders: { name: string } | null })[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterSh, setFilterSh] = useState('');

  const load = useCallback(async () => {
    const [{ data: comms }, { data: shs }] = await Promise.all([
      supabase.from('comms_log').select('*, stakeholders(name)').order('date', { ascending: false }),
      supabase.from('stakeholders').select('id, name').order('name'),
    ]);
    setEntries((comms ?? []) as (CommsEntry & { stakeholders: { name: string } | null })[]);
    setStakeholders((shs ?? []) as Stakeholder[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.stakeholder_id) { setError('Select a stakeholder'); return; }
    setSaving(true); setError('');
    const payload = { ...form, next_action_date: form.next_action_date || null };
    const { error: err } = await supabase.from('comms_log').insert([payload]);
    if (err) { setError(err.message); setSaving(false); return; }
    setForm(empty); setShowForm(false); setSaving(false);
    load();
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const visible = filterSh ? entries.filter(e => e.stakeholder_id === filterSh) : entries;

  const isOverdue = (date: string | null) => date && new Date(date) < new Date();

  return (
    <div className="govuk-width-container">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item"><Link className="govuk-breadcrumbs__link" href="/projects/stakeholder-map">Stakeholder Map</Link></li>
          <li className="govuk-breadcrumbs__list-item">Communication Log</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Communication Log</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button className="govuk-button govuk-!-margin-bottom-0" onClick={() => setShowForm(s => !s)}>
          {showForm ? 'Cancel' : '+ Log communication'}
        </button>
        {stakeholders.length > 0 && (
          <div className="govuk-form-group govuk-!-margin-bottom-0">
            <label className="govuk-label" htmlFor="filter-sh">Filter by stakeholder</label>
            <select className="govuk-select" id="filter-sh" value={filterSh} onChange={e => setFilterSh(e.target.value)}>
              <option value="">All stakeholders</option>
              {stakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #1d70b8' }}>
          <h2 className="govuk-heading-m">Log a communication</h2>
          {error && <p className="govuk-error-message">{error}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="c-sh">Stakeholder <span style={{ color: '#d4351c' }}>*</span></label>
              <select className="govuk-select" id="c-sh" value={form.stakeholder_id} onChange={e => set('stakeholder_id', e.target.value)} required>
                <option value="">Select…</option>
                {stakeholders.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="c-date">Date</label>
              <input className="govuk-input govuk-input--width-10" id="c-date" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="c-channel">Channel</label>
              <select className="govuk-select" id="c-channel" value={form.channel} onChange={e => set('channel', e.target.value)}>
                <option value="">Select…</option>
                {channels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="c-next-date">Next action date</label>
              <input className="govuk-input govuk-input--width-10" id="c-next-date" type="date" value={form.next_action_date} onChange={e => set('next_action_date', e.target.value)} />
            </div>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="c-summary">Summary</label>
            <textarea className="govuk-textarea" id="c-summary" rows={2} value={form.summary} onChange={e => set('summary', e.target.value)} />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="c-outcome">Outcome</label>
            <textarea className="govuk-textarea" id="c-outcome" rows={2} value={form.outcome} onChange={e => set('outcome', e.target.value)} />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="c-next">Next action</label>
            <input className="govuk-input" id="c-next" type="text" value={form.next_action} onChange={e => set('next_action', e.target.value)} />
          </div>
          <button className="govuk-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      )}

      {loading ? <p className="govuk-body">Loading…</p> : visible.length === 0 ? (
        <p className="govuk-body">No communications logged yet.</p>
      ) : (
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--m">{visible.length} entr{visible.length !== 1 ? 'ies' : 'y'}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header">Date</th>
              <th className="govuk-table__header">Stakeholder</th>
              <th className="govuk-table__header">Channel</th>
              <th className="govuk-table__header">Summary</th>
              <th className="govuk-table__header">Next action</th>
              <th className="govuk-table__header">Due</th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {visible.map(e => (
              <tr key={e.id} className="govuk-table__row">
                <td className="govuk-table__cell" style={{ whiteSpace: 'nowrap' }}>{e.date}</td>
                <td className="govuk-table__cell govuk-!-font-weight-bold">{e.stakeholders?.name ?? '—'}</td>
                <td className="govuk-table__cell">{e.channel ?? '—'}</td>
                <td className="govuk-table__cell">{e.summary ?? '—'}</td>
                <td className="govuk-table__cell">{e.next_action ?? '—'}</td>
                <td className="govuk-table__cell">
                  {e.next_action_date ? (
                    <strong className={`govuk-tag ${isOverdue(e.next_action_date) ? 'govuk-tag--red' : 'govuk-tag--blue'}`}>
                      {e.next_action_date}
                    </strong>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
