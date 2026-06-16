'use client';
import Link from 'next/link';

const tools = [
  {
    href: '/projects/assessor-track/dashboard',
    title: 'Dashboard',
    desc: 'Live snapshot of your caseload — alerts, upcoming reviews, and flagged learners at a glance.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    colour: '#6366f1',
    bg: '#f5f3ff',
  },
  {
    href: '/projects/assessor-track/learners',
    title: 'Learners',
    desc: 'Full caseload register with status, OTJ progress, and last contact. Filter by assessor or programme.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    colour: '#0891b2',
    bg: '#ecfeff',
  },
  {
    href: '/projects/assessor-track/reviews',
    title: 'Reviews',
    desc: 'Progress reviews, mock assessments, and gateway meetings — organised by overdue, this month, and upcoming.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    colour: '#059669',
    bg: '#ecfdf5',
  },
  {
    href: '/projects/assessor-track/otj',
    title: 'OTJ Hours',
    desc: 'Off-the-job hours tracker sorted by lowest completion first — spot who needs intervention before EPA.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    colour: '#d97706',
    bg: '#fffbeb',
  },
  {
    href: '/projects/assessor-track/alerts',
    title: 'Alerts',
    desc: 'Critical and warning flags surfaced automatically — EPA proximity, OTJ shortfall, and stale contact.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    colour: '#dc2626',
    bg: '#fff1f2',
  },
  {
    href: '/projects/assessor-track/manager',
    title: 'Manager View',
    desc: 'Cross-assessor oversight — per-assessor stats, average OTJ, and a filterable all-learner table.',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
    colour: '#7c3aed',
    bg: '#faf5ff',
  },
];

export default function AssessorTrackOverview() {
  return (
    <div className="at-page">
      <nav className="at-crumb">
        <Link href="/projects">Projects</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span>AssessorTrack</span>
      </nav>

      <div style={{ marginBottom: '32px' }}>
        <h1 className="at-h1">AssessorTrack</h1>
        <p className="at-body" style={{ color: '#6b7280', marginTop: '8px', maxWidth: '58ch' }}>
          A caseload management tool for apprenticeship assessors — built to complement Tribal MAYTAS with a modern, fast interface.
        </p>
      </div>

      <div className="at-inset" style={{ marginBottom: '32px' }}>
        Logged in as <strong>Michael W.</strong> &mdash; South Wales &mdash; 3 active learners
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {tools.map(t => (
          <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '22px', height: '100%', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'box-shadow .18s, border-color .18s', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.colour, flexShrink: 0 }}>
                {t.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{t.title}</p>
                <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: t.colour }}>
                Open
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: '36px', padding: '20px 24px', background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {[
          { label: 'Programmes', value: 'SE L4, BA L3' },
          { label: 'Data source', value: 'Dummy data (MAYTAS-ready)' },
          { label: 'Integration', value: 'MAYTAS API stub' },
          { label: 'Auth', value: 'SSO / role-based (planned)' },
        ].map(m => (
          <div key={m.label}>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.06em', margin: '0 0 3px' }}>{m.label}</p>
            <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: '#374151', fontWeight: 500, margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
