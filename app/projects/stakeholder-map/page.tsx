import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Stakeholder Map — waltech',
  description: 'Stakeholder management tool built with GOV.UK Design System.',
};

const tools = [
  { href: '/projects/stakeholder-map/register', label: 'Stakeholder Register', description: 'Add and manage all project stakeholders with role, organisation, and contact details.' },
  { href: '/projects/stakeholder-map/matrix', label: 'Influence / Interest Matrix', description: 'Plot stakeholders on a 2×2 grid to prioritise engagement strategies.' },
  { href: '/projects/stakeholder-map/comms-log', label: 'Communication Log', description: 'Record every interaction — date, channel, outcome, and next action.' },
  { href: '/projects/stakeholder-map/dashboard', label: 'Engagement Health Dashboard', description: 'At-a-glance view of engagement status, overdue actions, and risk flags.' },
  { href: '/projects/stakeholder-map/decision-log', label: 'Decision Log', description: 'Track decisions made, who owns them, and their current status.' },
];

export default function StakeholderMapHome() {
  return (
    <div className="govuk-width-container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="govuk-breadcrumbs" style={{ marginBottom: '2rem' }}>
        <ol className="govuk-breadcrumbs__list">
          <li className="govuk-breadcrumbs__list-item">
            <Link className="govuk-breadcrumbs__link" href="/">Home</Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">
            <Link className="govuk-breadcrumbs__link" href="/projects">Projects</Link>
          </li>
          <li className="govuk-breadcrumbs__list-item">Stakeholder Map</li>
        </ol>
      </div>

      <h1 className="govuk-heading-xl">Stakeholder Management</h1>
      <p className="govuk-body-l">
        A structured toolkit for tracking, engaging, and communicating with project stakeholders.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {tools.map(tool => (
          <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
            <div className="govuk-inset-text" style={{ borderColor: '#1d70b8', cursor: 'pointer' }}>
              <h2 className="govuk-heading-m" style={{ marginBottom: '0.5rem' }}>{tool.label}</h2>
              <p className="govuk-body" style={{ marginBottom: 0 }}>{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
