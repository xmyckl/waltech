import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Michael Walters',
  description: 'Get in touch with Michael Walters — open to new roles in product, delivery, and IT operations.',
};

export default function Contact() {
  return (
    <section id="contact" aria-label="Contact Michael Walters">
      <div className="container">
        <p className="section-label anim">Contact</p>
        <h1 className="section-title anim anim-delay-1">Let&apos;s build something great</h1>

        <div className="contact-inner">
          <div className="anim anim-delay-2">
            <p className="contact-body">
              I&apos;m open to new roles in product, delivery, or IT operations —
              whether that&apos;s a full-time position, a contract, or an interesting challenge
              that needs someone who can own it end-to-end.
            </p>

            <div className="contact-links">
              <a href="mailto:Mikewalt736@gmail.com" className="contact-link-item">
                <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="contact-link-label">Mikewalt736@gmail.com</span>
              </a>

              <a href="tel:07849973741" className="contact-link-item">
                <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="contact-link-label">07849 973 741</span>
              </a>

              <a href="https://www.linkedin.com/in/michael-walters-565309292/" className="contact-link-item" target="_blank" rel="noopener noreferrer">
                <svg className="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
                </svg>
                <span className="contact-link-label">linkedin.com/in/michael-walters-565309292</span>
              </a>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
