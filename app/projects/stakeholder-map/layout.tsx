'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const tools = [
  { href: '/projects/stakeholder-map', label: 'Overview' },
  { href: '/projects/stakeholder-map/register', label: 'Register' },
  { href: '/projects/stakeholder-map/matrix', label: 'Matrix' },
  { href: '/projects/stakeholder-map/comms-log', label: 'Comms Log' },
  { href: '/projects/stakeholder-map/dashboard', label: 'Dashboard' },
  { href: '/projects/stakeholder-map/decision-log', label: 'Decision Log' },
];

function GovukStyles() {
  useEffect(() => {
    const existing = document.getElementById('govuk-styles');
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/govuk-frontend.min.css';
    link.id = 'govuk-styles';
    document.head.appendChild(link);
    return () => {
      document.getElementById('govuk-styles')?.remove();
    };
  }, []);
  return null;
}

export default function StakeholderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <GovukStyles />

      {/* Sub-nav fixed just below the main waltech nav (top:16px + height:68px = bottom:84px) */}
      <div style={{
        position: 'fixed',
        top: '96px',
        left: 0,
        right: 0,
        zIndex: 99,
        background: '#fff',
        borderBottom: '1px solid #b1b4b6',
        borderTop: '1px solid #f0f0f0',
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 15px' }}>
          <nav aria-label="Stakeholder tools" style={{ display: 'flex', flexWrap: 'wrap', overflowX: 'auto' }}>
            {tools.map(item => {
              const active = item.href === '/projects/stakeholder-map'
                ? pathname === '/projects/stakeholder-map'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    fontSize: '15px',
                    fontWeight: active ? 700 : 400,
                    color: active ? '#1d70b8' : '#505a5f',
                    textDecoration: 'none',
                    borderBottom: active ? '3px solid #1d70b8' : '3px solid transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Push content below both fixed navs */}
      <div style={{ paddingTop: '160px', background: '#f3f2f1', minHeight: '100vh' }}>
        <main id="main-content" className="govuk-main-wrapper">
          {children}
        </main>
      </div>
    </>
  );
}
