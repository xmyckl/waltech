import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Michael Walters',
  description: 'About Michael Walters — technically minded Product Specialist with a drive to deliver IT, project work, and software solutions.',
};

const CertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

export default function About() {
  return (
    <section id="about" aria-label="About Michael Walters">
      <div className="container">
        <div className="about-grid">
          <div>
            <p className="section-label anim">About me</p>
            <h1 className="section-title anim anim-delay-1">
              Organised. Creative.<br />Technically minded.
            </h1>

            <div className="about-body anim anim-delay-2">
              <p>
                I&apos;m a technically minded <strong>Product Specialist</strong> with several years of experience across IT support, software delivery, and product roles — progressing steadily from 1st line support through to leading UAT coordination on a large-scale software reimplementation.
              </p>
              <p>
                I&apos;m the person you call when a project is stalling, stakeholders aren&apos;t aligned, or a release is approaching and nobody&apos;s sure what &ldquo;done&rdquo; looks like. I bring <strong>technical fluency, Agile discipline, and calm under pressure</strong> to every project I touch.
              </p>
              <p>
                Currently studying <strong>Applied Software Engineering BSc</strong> part-time, with plans to pursue PSPO I and PRINCE2 certification next.
              </p>
            </div>

            <div className="cert-strip anim anim-delay-3">
              <span className="cert-badge"><CertIcon />CompTIA A+</span>
              <span className="cert-badge"><CertIcon />CompTIA CySA+</span>
              <span className="cert-badge"><CertIcon />AZ-900 Azure</span>
            </div>
          </div>

          <div className="about-values">
            <div className="value-card anim anim-delay-1">
              <svg className="value-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div className="value-card-title">Delivery-first mindset</div>
              <div className="value-card-body">I&apos;ve managed software promotions across Dev, Test, UAT and Live environments. I know what it takes to get a release out the door safely.</div>
            </div>

            <div className="value-card anim anim-delay-2">
              <svg className="value-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div className="value-card-title">Cross-functional bridge</div>
              <div className="value-card-body">I&apos;ve served as the key liaison between academic, administrative, and technical teams — translating complex requirements in both directions.</div>
            </div>

            <div className="value-card anim anim-delay-3">
              <svg className="value-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
              </svg>
              <div className="value-card-title">Hands-on technical depth</div>
              <div className="value-card-body">From PowerShell automation to Azure DevOps dashboards, SQL reporting to chatbot development — I can roll up my sleeves when it matters.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
