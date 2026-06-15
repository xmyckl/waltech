'use client';
import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });
      setStatus('sent');
      form.reset();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <form
      className="contact-form"
      name="contact"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      noValidate
    >
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="bot-field" />

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-input" type="text" id="name" name="name" placeholder="Jane Smith" autoComplete="name" required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-input" type="email" id="email" name="email" placeholder="jane@company.com" autoComplete="email" required />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="subject">Subject</label>
        <input className="form-input" type="text" id="subject" name="subject" placeholder="Contract / Full-time / Project..." />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="message">Message</label>
        <textarea className="form-textarea" id="message" name="message" placeholder="Tell me about the role or opportunity..." required />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={status === 'sending'}
        style={{ alignSelf: 'flex-start', ...(status === 'sent' ? { background: '#22c55e' } : status === 'error' ? { background: '#ef4444' } : {}) }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : status === 'error' ? 'Error — try emailing directly' : 'Send message'}
      </button>
    </form>
  );
}
