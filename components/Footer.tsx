import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-inner">
          <p className="footer-copy">© 2026 <span>Michael Walters</span>. All rights reserved.</p>
          <nav className="footer-nav" aria-label="Footer">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/skills">Skills</Link>
            <Link href="/experience">Experience</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <p className="footer-copy" style={{ opacity: 0.5 }}>Loughor, Swansea</p>
        </div>
      </div>
    </footer>
  );
}
