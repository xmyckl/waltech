'use client';
import { useEffect, useRef } from 'react';

export default function HeroTypewriter() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const txt = el.textContent ?? '';
    el.textContent = '';
    let i = 0;
    const cur = document.createElement('span');
    cur.textContent = '|';
    cur.style.cssText = 'animation:blink 1s step-end infinite;';
    const s = document.createElement('style');
    s.textContent = '@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}';
    document.head.appendChild(s);
    el.appendChild(cur);
    let timeout: ReturnType<typeof setTimeout>;
    function type() {
      if (i < txt.length) { cur.before(txt[i++]); timeout = setTimeout(type, 55 + Math.random() * 35); }
      else { timeout = setTimeout(() => cur.remove(), 2000); }
    }
    timeout = setTimeout(type, 800);
    return () => { clearTimeout(timeout); s.remove(); };
  }, []);

  return (
    <p className="hero-role anim anim-delay-2" ref={ref}>
      Product Specialist
    </p>
  );
}
