'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AssessorProvider } from '@/contexts/AssessorContext';

const NAV_H = 68;
const SIDEBAR_W = 232;

const navItems = [
  {
    href: '/projects/assessor-track',
    label: 'Overview',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  },
  {
    href: '/projects/assessor-track/dashboard',
    label: 'Dashboard',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    href: '/projects/assessor-track/learners',
    label: 'Learners',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    href: '/projects/assessor-track/reviews',
    label: 'Reviews',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  },
  {
    href: '/projects/assessor-track/otj',
    label: 'OTJ Hours',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  },
  {
    href: '/projects/assessor-track/alerts',
    label: 'Alerts',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    href: '/projects/assessor-track/manager',
    label: 'Manager',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
];

const DS = `
*,*::before,*::after{box-sizing:border-box}
.at-page{max-width:1100px;margin:0 auto}
.at-card{background:#fff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:24px}
.at-card-sm{background:#fff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px 20px}
.at-stat{background:#fff;border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:20px 24px}
.at-stat-value{font-size:34px;font-weight:700;line-height:1;color:#111827;font-family:'IBM Plex Sans',sans-serif;letter-spacing:-1px}
.at-stat-label{font-size:12px;color:#6b7280;margin-top:6px;font-family:'IBM Plex Sans',sans-serif;font-weight:500;text-transform:uppercase;letter-spacing:.04em}
.at-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:600;font-family:'IBM Plex Sans',sans-serif;white-space:nowrap;text-transform:capitalize}
.at-badge--green{background:#dcfce7;color:#166534}
.at-badge--amber{background:#fef9c3;color:#713f12}
.at-badge--red{background:#fee2e2;color:#991b1b}
.at-badge--blue{background:#dbeafe;color:#1e40af}
.at-badge--purple{background:#ede9fe;color:#5b21b6}
.at-badge--grey{background:#f3f4f6;color:#374151}
.at-badge--indigo{background:#e0e7ff;color:#3730a3}
.at-h1{font-size:26px;font-weight:700;color:#111827;font-family:'IBM Plex Sans',sans-serif;margin:0 0 4px;letter-spacing:-.3px}
.at-h2{font-size:16px;font-weight:600;color:#111827;font-family:'IBM Plex Sans',sans-serif;margin:0 0 14px}
.at-h3{font-size:13px;font-weight:600;color:#374151;font-family:'IBM Plex Sans',sans-serif;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em}
.at-body{font-size:14px;color:#374151;font-family:'IBM Plex Sans',sans-serif;line-height:1.6}
.at-muted{font-size:13px;color:#6b7280;font-family:'IBM Plex Sans',sans-serif}
.at-crumb{display:flex;gap:6px;align-items:center;font-size:13px;color:#9ca3af;font-family:'IBM Plex Sans',sans-serif;margin-bottom:18px}
.at-crumb a{color:#6b7280;text-decoration:none;transition:color .15s}
.at-crumb a:hover{color:#6366f1}
.at-table-wrap{background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden}
.at-table{width:100%;border-collapse:collapse;font-family:'IBM Plex Sans',sans-serif}
.at-table th{font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:.07em;padding:11px 16px;border-bottom:1px solid #e5e7eb;text-align:left;background:#fafafa;white-space:nowrap}
.at-table td{font-size:14px;color:#374151;padding:13px 16px;border-bottom:1px solid #f3f4f6;vertical-align:middle}
.at-table tr:last-child td{border-bottom:none}
.at-table tbody tr:hover td{background:#fafafa}
.at-progress{height:6px;background:#f3f4f6;border-radius:999px;overflow:hidden;min-width:80px}
.at-progress-fill{height:100%;border-radius:999px;transition:width .3s}
.at-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;font-family:'IBM Plex Sans',sans-serif;transition:all .15s;text-decoration:none}
.at-btn:hover{opacity:.85}
.at-btn--primary{background:#6366f1;color:#fff}
.at-btn--secondary{background:#f3f4f6;color:#374151}
.at-btn--ghost{background:transparent;color:#6b7280;border:1px solid #e5e7eb}
.at-btn--ghost.active{background:#ede9fe;color:#4f46e5;border-color:#c7d2fe}
.at-btn--sm{padding:5px 12px;font-size:13px;border-radius:6px}
.at-btn--danger-soft{background:#fee2e2;color:#991b1b;border:none}
.at-input{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;font-family:'IBM Plex Sans',sans-serif;color:#111827;outline:none;background:#fff;transition:border .15s,box-shadow .15s}
.at-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.at-select{width:100%;padding:8px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;font-family:'IBM Plex Sans',sans-serif;color:#111827;outline:none;background:#fff;transition:border .15s,box-shadow .15s}
.at-select:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.12)}
.at-label{display:block;font-size:12px;font-weight:600;color:#6b7280;margin-bottom:5px;font-family:'IBM Plex Sans',sans-serif;text-transform:uppercase;letter-spacing:.04em}
.at-tabs{display:flex;gap:3px;background:#f3f4f6;padding:4px;border-radius:10px;margin-bottom:24px}
.at-tab{flex:1;padding:7px 14px;border-radius:7px;font-size:13px;font-weight:500;cursor:pointer;border:none;background:transparent;color:#6b7280;font-family:'IBM Plex Sans',sans-serif;transition:all .15s}
.at-tab.active{background:#fff;color:#111827;box-shadow:0 1px 3px rgba(0,0,0,.1);font-weight:600}
.at-inset{border-left:3px solid #6366f1;padding:12px 16px;background:#f5f3ff;border-radius:0 8px 8px 0;font-family:'IBM Plex Sans',sans-serif;font-size:14px;color:#4338ca}
.at-warning-box{display:flex;gap:10px;align-items:flex-start;padding:12px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;font-family:'IBM Plex Sans',sans-serif;font-size:14px;color:#92400e}
.at-dl{}
.at-dl-row{display:grid;grid-template-columns:160px 1fr;padding:11px 0;border-bottom:1px solid #f3f4f6;font-family:'IBM Plex Sans',sans-serif;gap:12px}
.at-dl-row:last-child{border-bottom:none}
.at-dt{font-size:12px;color:#9ca3af;font-weight:600;text-transform:uppercase;letter-spacing:.04em;align-self:center}
.at-dd{font-size:14px;color:#111827;font-weight:500}
.at-divider{border:none;border-top:1px solid #e5e7eb;margin:20px 0}
.at-link{color:#6366f1;text-decoration:none;font-weight:500;transition:color .15s}
.at-link:hover{color:#4f46e5;text-decoration:underline}
.at-section-title{font-size:14px;font-weight:600;color:#111827;font-family:'IBM Plex Sans',sans-serif;margin:0 0 12px;padding-bottom:10px;border-bottom:1px solid #e5e7eb}
.at-sidebar-link{display:flex;align-items:center;gap:10px;padding:9px 14px;margin:2px 8px;border-radius:8px;font-size:13.5px;font-weight:500;color:#9ca3af;text-decoration:none;font-family:'IBM Plex Sans',sans-serif;transition:all .15s}
.at-sidebar-link:hover{background:#1f2937;color:#e5e7eb}
.at-sidebar-link.active{background:#312e81;color:#c7d2fe}
.at-sidebar-link svg{opacity:.7;flex-shrink:0}
.at-sidebar-link.active svg{opacity:1}
`;

export default function AssessorTrackLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AssessorProvider>
      <style dangerouslySetInnerHTML={{ __html: DS }} />

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: NAV_H,
        left: 0,
        bottom: 0,
        width: SIDEBAR_W,
        background: '#111827',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #1f2937',
      }}>
        {/* Brand */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <div style={{ width: 28, height: 28, background: '#6366f1', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#f9fafb', letterSpacing: '-.2px' }}>AssessorTrack</span>
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#6b7280', margin: 0, paddingLeft: 36 }}>Caseload Management</p>
        </div>

        {/* Nav */}
        <nav style={{ padding: '10px 0', flex: 1, overflowY: 'auto' }}>
          <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '.1em', padding: '6px 22px 4px' }}>Navigation</p>
          {navItems.map(item => {
            const active = item.href === '/projects/assessor-track'
              ? pathname === '/projects/assessor-track'
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`at-sidebar-link${active ? ' active' : ''}`}>
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #1f2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 30, height: 30, background: '#374151', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 700, color: '#9ca3af', flexShrink: 0 }}>MW</div>
            <div>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#e5e7eb', margin: 0 }}>Michael W.</p>
              <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 11, color: '#6b7280', margin: 0 }}>South Wales</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <div style={{
        marginLeft: SIDEBAR_W,
        marginTop: NAV_H,
        minHeight: `calc(100vh - ${NAV_H}px)`,
        background: '#f9fafb',
        padding: '32px 40px 64px',
      }}>
        {children}
      </div>
    </AssessorProvider>
  );
}
