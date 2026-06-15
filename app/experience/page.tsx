import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Experience — Michael Walters',
  description: 'Work experience and education of Michael Walters — SITS Liaison Officer & Product Specialist.',
};

const jobs = [
  {
    role: 'SITS Liaison Officer',
    period: 'Sep 2025 – Present',
    company: 'Swansea University · Swansea, UK',
    current: true,
    achievements: [
      'Led UAT coordination — scheduling sessions, aligning strand leads and testers across departments',
      'Covered for the SITS Project Manager during leave, overseeing daily coordination and decisions',
      'Managed software promotions across Dev, Test, UAT, and Live environments',
      'Delivered senior DevOps support: Azure DevOps boards, dashboards, and workflow improvements',
      'Produced release notes, deployment checklists, and stakeholder updates throughout the project',
      'Monitored defects and testing progress, coordinating fixes directly with developers',
    ],
  },
  {
    role: 'Associate Solutions Developer',
    period: 'Sep 2024 – Sep 2025',
    company: 'Swansea University · Swansea, UK',
    current: false,
    achievements: [
      'Progressed from 2nd to 3rd line, taking ownership of software delivery, patching, and out-of-hours upgrades',
      'Worked with external consultants on the SITS reimplementation, providing technical input',
      'Built SRLs, SLPs, Vistas, and E:Vision containers; coordinated meetings to keep work on track',
      'Performed end-to-end student journey testing, strengthening UX and UI awareness',
    ],
  },
  {
    role: 'IT Analyst — 2nd Line',
    period: 'Sep 2023 – Sep 2024',
    company: 'Swansea University · Swansea, UK',
    current: false,
    achievements: [
      'Promoted from 1st line, gaining exposure to advanced troubleshooting and 3rd line collaboration',
      'Ensured processes, knowledge bases, and procedures were updated and implemented more efficiently',
      'Investigated and resolved escalated incidents and requests from 1st line',
    ],
  },
  {
    role: '1st Line IT Service Desk Analyst',
    period: 'Apr 2023 – Sep 2023',
    company: 'Swansea University · Swansea, UK',
    current: false,
    achievements: [
      'Provided specialist support, owning the resolution of incidents and problems for university customers',
      'Gained deep troubleshooting experience across a wide range of IT issues',
    ],
  },
  {
    role: 'Business & IT Analyst',
    period: 'Jan 2019 – Jan 2023',
    company: 'SRS Innovation Ltd · Wales, UK',
    current: false,
    achievements: [
      'Promoted to Business and IT Analyst; joined the management team attending board and leadership meetings',
      'Oversaw network, cloud computing, and website upgrades across the business',
      'Built a Customer Support Chatbot with Power Virtual Agents and Dataverse',
      'Automated business processes using PowerShell and Python scripts',
    ],
  },
];

const education = [
  { degree: 'Applied Software Engineering BSc', period: '2024 – Ongoing', institution: 'Swansea University', highlight: true },
  { degree: 'Marketing Apprenticeship', institution: 'Associated Community Training Ltd' },
  { degree: 'GCSEs incl. Computer Science, Business & Mathematics', institution: 'Pen Yr Heol Comprehensive School' },
];

export default function Experience() {
  return (
    <section id="experience" aria-label="Work experience">
      <div className="container">
        <p className="section-label anim">Experience</p>
        <h1 className="section-title anim anim-delay-1" style={{ marginBottom: '56px' }}>
          Where I&apos;ve done the work
        </h1>

        <div className="timeline">
          {jobs.map((job, i) => (
            <div key={job.role} className={`timeline-item${job.current ? ' current' : ''} anim anim-delay-${i + 1}`}>
              <div className="timeline-dot" />
              <div className="timeline-card">
                <div className="timeline-meta">
                  <span className="timeline-role">{job.role}</span>
                  <span className="timeline-period">{job.period}</span>
                </div>
                <div className="timeline-company">{job.company}</div>
                <ul className="timeline-achievements">
                  {job.achievements.map(a => <li key={a}>{a}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '64px' }}>
          <p className="section-label anim">Education</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '16px', marginTop: '24px' }}>
            {education.map((ed, i) => (
              <div
                key={ed.degree}
                className={`timeline-card anim anim-delay-${i + 1}`}
                style={ed.highlight ? { borderColor: 'rgba(0,210,200,0.15)' } : undefined}
              >
                <div className="timeline-meta">
                  <span className="timeline-role" style={{ fontSize: '15px' }}>{ed.degree}</span>
                  {ed.period && <span className="timeline-period">{ed.period}</span>}
                </div>
                <div className="timeline-company">{ed.institution}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
