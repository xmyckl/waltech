import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Projects — Michael Walters',
  description: 'A selection of projects built by Michael Walters — from product tools to full-stack apps.',
};

const projects = [
  {
    href: '/projects/stakeholder-map',
    title: 'Civil Service Stakeholder Management Tool',
    description:
      'A GOV.UK Design System–styled tool for managing stakeholders across a civil service project. Includes a register, influence/interest matrix, communication log, decision log, and engagement health dashboard — backed by Supabase.',
    tags: ['Next.js', 'GOV.UK Design System', 'Supabase', 'TypeScript'],
    status: 'Live',
  },
];

export default function ProjectsIndex() {
  return (
    <section id="projects" aria-label="Projects">
      <div className="container">
        <p className="section-label anim">Work</p>
        <h1 className="section-title anim anim-delay-1">Projects</h1>
        <p className="hero-tagline anim anim-delay-2" style={{ maxWidth: '60ch', marginBottom: '3rem' }}>
          A selection of things I&apos;ve built — spanning product tooling, data apps, and full-stack prototypes.
        </p>

        <div className="projects-list anim anim-delay-3">
          {projects.map((p) => (
            <Link key={p.href} href={p.href} className="project-card">
              <div className="project-card-header">
                <h2 className="project-card-title">{p.title}</h2>
                <span className="project-card-status">{p.status}</span>
              </div>
              <p className="project-card-desc">{p.description}</p>
              <div className="project-card-tags">
                {p.tags.map((t) => (
                  <span key={t} className="skill-tag">{t}</span>
                ))}
              </div>
              <span className="project-card-link">
                View project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
