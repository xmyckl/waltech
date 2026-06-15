'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, type Stakeholder } from '@/lib/supabase';

const empty = { name: '', organisation: '', role: '', email: '', phone: '', influence: 5, interest: 5, engagement_status: 'active', notes: '' };

const statusColour: Record<string, string> = {
  active: 'govuk-tag--green',
  inactive: 'govuk-tag--grey',
  'at-risk': 'govuk-tag--red',
};

export default function Register() {
  const [rows, setRows] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data } = await supabase.from('stakeholders').select('*').order('name');
    setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    const { error: err } = await supabase.from('stakeholders').insert([{ ...form, updated_at: new Date().toISOString() }]);
    if (err) { setError(err.message); setSaving(false); return; }
    setForm(empty); setShowForm(false); setSaving(false);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This will also remove their communications.`)) return;
    await supabase.from('stakeholders').delete().eq('id', id);
    load();
  }

  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="govuk-width-container">
      <div className="govuk-breadcrumbs">
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item"><Link className="govuk-breadcrumbs__link" href="/projects/stakeholder-map">Stakeholder Map</Link></li>
          <li className="govuk-breadcrumbs__list-item">Register</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Stakeholder Register</h1>

      <button className="govuk-button" onClick={() => setShowForm(s => !s)}>
        {showForm ? 'Cancel' : '+ Add stakeholder'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', marginBottom: '2rem', borderLeft: '4px solid #1d70b8' }}>
          <h2 className="govuk-heading-m">New stakeholder</h2>
          {error && <p className="govuk-error-message">{error}</p>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 2rem' }}>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-name">Name <span style={{ color: '#d4351c' }}>*</span></label>
              <input className="govuk-input" id="s-name" type="text" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-org">Organisation</label>
              <input className="govuk-input" id="s-org" type="text" value={form.organisation} onChange={e => set('organisation', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-role">Role / job title</label>
              <input className="govuk-input" id="s-role" type="text" value={form.role} onChange={e => set('role', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-email">Email</label>
              <input className="govuk-input" id="s-email" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-influence">Influence (1–10)</label>
              <input className="govuk-input govuk-input--width-5" id="s-influence" type="number" min={1} max={10} value={form.influence} onChange={e => set('influence', Number(e.target.value))} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-interest">Interest (1–10)</label>
              <input className="govuk-input govuk-input--width-5" id="s-interest" type="number" min={1} max={10} value={form.interest} onChange={e => set('interest', Number(e.target.value))} />
            </div>
            <div className="govuk-form-group">
              <label className="govuk-label" htmlFor="s-status">Engagement status</label>
              <select className="govuk-select" id="s-status" value={form.engagement_status} onChange={e => set('engagement_status', e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="at-risk">At risk</option>
              </select>
            </div>
          </div>
          <div className="govuk-form-group">
            <label className="govuk-label" htmlFor="s-notes">Notes</label>
            <textarea className="govuk-textarea" id="s-notes" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
          <button className="govuk-button" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save stakeholder'}</button>
        </form>
      )}

      {loading ? (
        <p className="govuk-body">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="govuk-body">No stakeholders added yet. Use the button above to add your first.</p>
      ) : (
        <table className="govuk-table">
          <caption className="govuk-table__caption govuk-table__caption--m">{rows.length} stakeholder{rows.length !== 1 ? 's' : ''}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              <th className="govuk-table__header">Name</th>
              <th className="govuk-table__header">Organisation</th>
              <th className="govuk-table__header">Role</th>
              <th className="govuk-table__header">Influence</th>
              <th className="govuk-table__header">Interest</th>
              <th className="govuk-table__header">Status</th>
              <th className="govuk-table__header"><span className="govuk-visually-hidden">Actions</span></th>
            </tr>
          </thead>
          <tbody className="govuk-table__body">
            {rows.map(s => (
              <tr key={s.id} className="govuk-table__row">
                <td className="govuk-table__cell govuk-!-font-weight-bold">{s.name}</td>
                <td className="govuk-table__cell">{s.organisation ?? '—'}</td>
                <td className="govuk-table__cell">{s.role ?? '—'}</td>
                <td className="govuk-table__cell">{s.influence}/10</td>
                <td className="govuk-table__cell">{s.interest}/10</td>
                <td className="govuk-table__cell">
                  <strong className={`govuk-tag ${statusColour[s.engagement_status] ?? ''}`}>{s.engagement_status}</strong>
                </td>
                <td className="govuk-table__cell">
                  <button className="govuk-button govuk-button--warning govuk-!-margin-bottom-0" onClick={() => handleDelete(s.id, s.name)}>
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
