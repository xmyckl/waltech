import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Skills — Michael Walters',
  description: 'Skills and expertise of Michael Walters — product, delivery, technical, and security.',
};

const categories = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Product & Delivery',
    pills: ['Agile / Scrum', 'UAT Coordination', 'Project Strategy', 'Project Scoping', 'Release Planning', 'Stakeholder Engagement', 'Incident Management', 'User Research'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    title: 'Technical',
    pills: ['PowerShell', 'Python', 'SQL', 'Azure DevOps', 'Power Platform', 'Dataverse', 'Linux', 'Intune', 'Virtual Machines', 'Script Development'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
    title: 'Tools & Platforms',
    pills: ['Jira', 'ServiceNow', 'Microsoft 365', 'Power Apps', 'Power Virtual Agents', 'CRM', 'RDP', 'Azure AD'],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Security & Infrastructure',
    pills: ['Cyber Security', 'Vulnerability Management', 'Penetration Testing', 'Technical Analysis', 'Server Monitoring', 'System Patching'],
  },
];

export default function Skills() {
  return (
    <section id="skills" aria-label="Skills">
      <div className="container">
        <div className="skills-header">
          <p className="section-label anim">Skills</p>
          <h1 className="section-title anim anim-delay-1">What I bring to the table</h1>
          <p className="section-sub anim anim-delay-2">Built across support, development, delivery, and product roles.</p>
        </div>

        <div className="skills-categories">
          {categories.map((cat, i) => (
            <div key={cat.title} className={`skill-category anim anim-delay-${i + 1}`}>
              <div className="skill-category-title">
                {cat.icon}
                {cat.title}
              </div>
              <div className="skill-pills">
                {cat.pills.map(pill => (
                  <span key={pill} className="skill-pill">{pill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
