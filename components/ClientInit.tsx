'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ClientInit() {
  const pathname = usePathname();

  // Re-run IntersectionObserver on every page change so new .anim elements animate in
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );
    document.querySelectorAll<Element>('.anim:not(.visible)').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [pathname]);

  // One-time setup: cursor glow, nav scroll, back-to-top
  useEffect(() => {
    const glow = document.getElementById('cursor-glow');
    let rafId: number;
    let cleanupMove: (() => void) | undefined;

    if (glow) {
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let gx = mx, gy = my;
      const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
      document.addEventListener('mousemove', onMove);
      cleanupMove = () => document.removeEventListener('mousemove', onMove);
      const tick = () => {
        gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
        glow.style.left = gx + 'px'; glow.style.top = gy + 'px';
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    const nav = document.querySelector('nav');
    const onNavScroll = () => {
      if (nav) nav.style.borderColor = window.scrollY > 60
        ? 'rgba(0,210,200,0.15)' : 'rgba(255,255,255,0.08)';
    };
    window.addEventListener('scroll', onNavScroll, { passive: true });

    const bt = document.getElementById('back-top');
    const onBtScroll = () => bt?.classList.toggle('show', window.scrollY > 500);
    const onBtClick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    window.addEventListener('scroll', onBtScroll, { passive: true });
    bt?.addEventListener('click', onBtClick);

    return () => {
      cancelAnimationFrame(rafId);
      cleanupMove?.();
      window.removeEventListener('scroll', onNavScroll);
      window.removeEventListener('scroll', onBtScroll);
      bt?.removeEventListener('click', onBtClick);
    };
  }, []);

  return null;
}
