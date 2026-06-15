'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav role="navigation" aria-label="Primary" className={open ? 'open' : ''}>
      <Link href="/" className="nav-logo">MW<span>.dev</span></Link>

      <ul className="nav-links">
        <li><Link href="/about" className={isActive('/about') ? 'active' : ''}>About</Link></li>
        <li><Link href="/skills" className={isActive('/skills') ? 'active' : ''}>Skills</Link></li>
        <li><Link href="/experience" className={isActive('/experience') ? 'active' : ''}>Experience</Link></li>
      </ul>

      <Link href="/contact" className={`nav-cta${isActive('/contact') ? ' active' : ''}`}>
        Get in touch
      </Link>

      <button
        className="nav-mobile-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </nav>
  );
}
