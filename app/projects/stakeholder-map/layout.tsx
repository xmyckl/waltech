import GovukBodyClass from './GovukBodyClass';
import Link from 'next/link';

export default function StakeholderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="stylesheet" href="/govuk-frontend.min.css" />
      <GovukBodyClass />
      <div style={{ paddingTop: 'calc(var(--nav-h) + 32px)' }}>
        <div style={{ background: '#003078', padding: '12px 0', marginBottom: '0' }}>
          <div className="govuk-width-container">
            <nav aria-label="Stakeholder tool" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { href: '/projects/stakeholder-map', label: 'Overview' },
                { href: '/projects/stakeholder-map/register', label: 'Register' },
                { href: '/projects/stakeholder-map/matrix', label: 'Matrix' },
                { href: '/projects/stakeholder-map/comms-log', label: 'Comms Log' },
                { href: '/projects/stakeholder-map/dashboard', label: 'Dashboard' },
                { href: '/projects/stakeholder-map/decision-log', label: 'Decision Log' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ color: '#fff', fontFamily: 'GDS Transport, arial, sans-serif', fontSize: '14px', fontWeight: 400, textDecoration: 'none', padding: '4px 0', borderBottom: '2px solid transparent' }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <main className="govuk-main-wrapper" id="main-content">
          {children}
        </main>
      </div>
    </>
  );
}
