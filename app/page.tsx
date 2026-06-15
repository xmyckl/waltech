import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import HeroTypewriter from '@/components/HeroTypewriter';

export const metadata: Metadata = {
  title: 'Michael Walters — Product Specialist',
  description: 'Technically minded and delivery-focused Product Specialist based in Swansea, Wales.',
};

export default function Home() {
  return (
    <section id="hero" aria-label="Introduction">
      <div className="container">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow anim">
              <div className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">Open to new opportunities</span>
            </div>

            <h1 className="hero-name anim anim-delay-1">
              Michael<br /><span className="highlight">Walters</span>
            </h1>

            <HeroTypewriter />

            <p className="hero-tagline anim anim-delay-3">
              <strong>Technically minded and delivery-focused.</strong> I&apos;m an organised, creative, and analytical thinker with a strong drive to meet objectives and deliver work to a high standard — adapting quickly to new technologies and bringing full commitment to every task.
            </p>

            <div className="hero-actions anim anim-delay-4">
              <Link href="/experience" className="btn-primary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
                View experience
              </Link>
              <Link href="/contact" className="btn-secondary">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                Get in touch
              </Link>
            </div>

            <div className="hero-stats anim anim-delay-5">
              <div>
                <div className="hero-stat-value">7<span>+</span></div>
                <div className="hero-stat-label">Years in tech</div>
              </div>
              <div>
                <div className="hero-stat-value">4</div>
                <div className="hero-stat-label">Promotions earned</div>
              </div>
              <div>
                <div className="hero-stat-value">3</div>
                <div className="hero-stat-label">Certifications</div>
              </div>
            </div>
          </div>

          <div className="hero-avatar">
            <div className="hero-avatar-ring" aria-hidden="true" />
            <div className="hero-avatar-img">
              <Image src="/pp.jpg" alt="Michael Walters" width={220} height={220} priority />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
