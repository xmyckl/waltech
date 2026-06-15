'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type Decision } from '@/lib/supabase';

const empty = { title: '', description: '', made_by: '', decision_date: new Date().toISOString().slice(0, 10), status: 'pending', notes: '' };

const statusColour: Record<string, string> = {
  pending: 'govuk-tag--yellow',
  made: 'govuk-tag--blue',
  implemented: 'govuk-tag--green',
};

export default function DecisionLog() {
  const [rows, setRows] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('decisions').select('*').order('decision_date', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    setSaving(true); setError('');
    const { error: err } = await supabase.from('decisions').insert([{ ...form, updated_at: new Date().toISOString() }]);
    if (err) { setError(err.message); setSaving(false); return; }
    setForm(empty); setShowForm(false); setSaving(false);
    load();
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from('decisions').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    load();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete decision: "${title}"?`)) return;
    await supabase.from('decisions').delete().eq('id', id);
    load();
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="govuk-width-container">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item"><Link className="govuk-breadcrumbs__link" href="/projects/stakeholder-map">Stakeholder Map</Link></li>
          <li className="govuk-breadcrumbs__list-item">Decision Log</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Decision Log</h1>

      <button className="govuk-button" onClick={() => setShowForm(s => !s)}>
        {showForm ? 'Cancel' : '+ Record decision'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #1d70b8' }}>
          <h2 className="govuk-heading-m">New decision</h2>
          {error && <p className="govuk-error-message">{error}</p>}
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="d-title">Decision title <span style={{ color: '#d4351c' }}>*</span></label>
            <input className="govuk-input" id="d-title" type="text" value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="d-desc">Description</label>
            <textarea className="govuk-textarea" id="d-desc" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="d-by">Decision made by</label>
              <input className="govuk-input" id="d-by" type="text" value={form.made_by} onChange={e => set('made_by', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="d-date">Date</label>
              <input className="govuk-input govuk-input--width-10" id="d-date" type="date" value={form.decision_date} onChange={e => set('decision_date', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="d-status">Status</label>
              <select className="govuk-select" id="d-status" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="made">Made</option>
                <option value="implemented">Implemented</option>
              </select>
            </div>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="d-notes">Notes</label>
            <textarea className="govuk-textarea" id="d-notes" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <button className="govuk-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save decision'}</button>
        </form>
      )}

      {loading ? <p className="govuk-body">Loading…</p> : rows.length === 0 ? (
        <p className="govuk-body">No decisions recorded yet.</p>
      ) : (
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--m">{rows.length} decision{rows.length !== 1 ? 's' : ''}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header">Decision</th>
              <th className="govuk-table__header">Made by</th>
              <th className="govuk-table__header">Date</th>
              <th className="govuk-table__header">Status</th>
              <th className="govuk-table__header">Update status</th>
              <th className="govuk-table__header"><span className="govuk-visually-hidden">Delete</span></th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {rows.map(d => (
              <tr key={d.id} className="govuk-table__row">
                <td className="govuk-table__cell">
                  <p className="govuk-!-font-weight-bold govuk-!-margin-bottom-1">{d.title}</p>
                  {d.description && <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ color: '#505a5f' }}>{d.description}</p>}
                  {d.notes && <p className="govuk-body-s govuk-!-margin-bottom-0" style={{ fontStyle: 'italic', color: '#505a5f' }}>Note: {d.notes}</p>}
                </td>
                <td className="govuk-table__cell">{d.made_by ?? '—'}</td>
                <td className="govuk-table__cell" style={{ whiteSpace: 'nowrap' }}>{d.decision_date ?? '—'}</td>
                <td className="govuk-table__cell">
                  <strong className={`govuk-tag ${statusColour[d.status] ?? ''}`}>{d.status}</strong>
                </td>
                <td className="govuk-table__cell">
                  <select
                    className="govuk-select"
                    value={d.status}
                    onChange={e => updateStatus(d.id, e.target.value)}
                    style={{ fontSize: '14px', padding: '4px 8px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="made">Made</option>
                    <option value="implemented">Implemented</option>
                  </select>
                </td>
                <td className="govuk-table__cell">
                  <button className="govuk-button govuk-button--warning govuk-!-margin-bottom-0" onClick={() => handleDelete(d.id, d.title)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
