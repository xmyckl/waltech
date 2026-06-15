import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ClientInit from '@/components/ClientInit';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Michael Walters — Product Specialist',
  description: 'Technically minded Product Specialist with a drive to deliver IT, project work, and software solutions to a high standard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <div id="cursor-glow" aria-hidden="true" />
        <div className="grid-bg" aria-hidden="true" />
        <Nav />
        <main>{children}</main>
        <Footer />
        <button id="back-top" aria-label="Back to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
        <ClientInit />
      </body>
    </html>
  );
}
