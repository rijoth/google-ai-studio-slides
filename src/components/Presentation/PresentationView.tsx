// Purpose: Presentation runtime — renders slides from presentation.json dynamically
// Responsibilities: Load presentation data, render slides, handle keyboard navigation, speaker notes
// Public interfaces: PresentationView component
// Dependencies: react, framer-motion, ../store/presentationStore, ../store/settingsStore, ../types
// Related files: src/components/Presentation/SlideRenderer.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentationStore } from '../../store/presentationStore';
import { useSettingsStore } from '../../store/settingsStore';
import type { Slide } from '../../types';
import SlideRenderer from './SlideRenderer';

// CSS needed for the presentation rendering
const styles = `
:root {
  --g-blue: #4285F4; --g-red: #EA4335; --g-yellow: #FBBC04; --g-green: #34A853;
  --g-purple: #A142F4; --g-cyan: #00BCD4; --g-magenta: #D9458F;
  --ink: #0F172A; --slate: #475569; --mist: #94A3B8;
  --bg: #F8FAFC; --card: #FFFFFF;
  --grad-hero: linear-gradient(135deg, #4285F4 0%, #A142F4 55%, #EA4335 100%);
  --grad-cyan: linear-gradient(135deg, #00BCD4 0%, #4285F4 100%);
  --grad-warm: linear-gradient(135deg, #FBBC04 0%, #EA4335 100%);
  --grad-mint: linear-gradient(135deg, #34A853 0%, #00BCD4 100%);
  --shadow: 0 18px 50px -18px rgba(15,23,42,.28);
  --shadow-sm: 0 8px 24px -12px rgba(15,23,42,.22);
}
.pres-deck { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: var(--bg); }
.pres-deck * { box-sizing: border-box; margin: 0; padding: 0; }
.pres-progress { position: fixed; left: 0; bottom: 0; height: 5px; background: var(--grad-hero); z-index: 50; transition: width .4s ease; }
.pres-counter { position: fixed; left: 18px; bottom: 18px; background: #fff; color: var(--slate); font-weight: 700; font-size: .85rem; padding: 8px 14px; border-radius: 99px; box-shadow: var(--shadow-sm); z-index: 60; }
.pres-legend { position: fixed; right: 18px; top: 18px; background: #fff; border-radius: 12px; padding: 8px 14px; font-size: .78rem; color: var(--slate); box-shadow: var(--shadow-sm); z-index: 60; font-weight: 600; font-family: sans-serif; }
.pres-controls { position: fixed; right: 18px; bottom: 18px; display: flex; gap: 8px; z-index: 60; }
.pres-controls button { width: 42px; height: 42px; border-radius: 12px; border: none; background: #fff; color: var(--ink); font-size: 1.1rem; cursor: pointer; box-shadow: var(--shadow-sm); font-weight: 700; }
.pres-controls button:hover { background: var(--g-blue); color: #fff; }
.pres-notes { position: fixed; left: 50%; bottom: 78px; transform: translateX(-50%); width: min(720px, 92vw); max-height: 42vh; overflow: auto; background: #0F172A; color: #E2E8F0; border-radius: 18px; padding: 18px 22px; box-shadow: var(--shadow); font-size: .95rem; line-height: 1.55; z-index: 70; font-family: sans-serif; }
.pres-notes h4 { color: #FCD34D; font-size: .8rem; letter-spacing: .12em; text-transform: uppercase; margin-bottom: 8px; }
`;

export default function PresentationView() {
  const { presentation, loading, error, loadPresentation } = usePresentationStore();
  const { settings } = useSettingsStore();
  const [current, setCurrent] = useState(0);
  const [showNotes, setShowNotes] = useState(false);

  const slides = presentation?.slides || [];

  const goTo = useCallback((n: number) => {
    setCurrent(Math.max(0, Math.min(slides.length - 1, n)));
  }, [slides.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
      else if (e.key === 'Home') { goTo(0); }
      else if (e.key === 'End') { goTo(slides.length - 1); }
      else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen();
        else document.exitFullscreen();
      }
      else if (e.key === 'n' || e.key === 'N') { setShowNotes(s => !s); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, goTo, slides.length]);

  if (!presentation) {
    if (error) {
      const isNetwork = error.includes('Failed to fetch') || error.includes('NetworkError');
      const isHtmlJson = error.includes('Unexpected token') && error.includes('<');
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', gap: 16, padding: 40 }}>
          <div style={{ fontSize: '1.2rem', color: '#EA4335', fontWeight: 600 }}>Failed to load presentation</div>
          <div style={{ color: '#475569', fontSize: '0.9rem', maxWidth: 500, textAlign: 'center', lineHeight: 1.5 }}>{error}</div>
          {isNetwork && (
            <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: '14px 20px', maxWidth: 500, fontSize: '0.88rem', color: '#92400E', lineHeight: 1.5 }}>
              <strong>Server not reachable.</strong> Make sure the backend is running:<br />
              <code style={{ background: '#FDE68A', padding: '2px 6px', borderRadius: 4 }}>npm start</code> — then visit <code style={{ background: '#FDE68A', padding: '2px 6px', borderRadius: 4 }}>http://localhost:3001</code>
            </div>
          )}
          {isHtmlJson && (
            <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: '14px 20px', maxWidth: 500, fontSize: '0.88rem', color: '#92400E', lineHeight: 1.5 }}>
              <strong>Wrong server.</strong> The API is returning HTML instead of JSON.<br />
              Run <code style={{ background: '#FDE68A', padding: '2px 6px', borderRadius: 4 }}>npm start</code> (not a plain static server) and visit <code style={{ background: '#FDE68A', padding: '2px 6px', borderRadius: 4 }}>http://localhost:3001</code>
            </div>
          )}
          <button
            onClick={() => loadPresentation()}
            style={{
              padding: '10px 24px', borderRadius: 12, border: 'none',
              background: '#4285F4', color: '#fff', fontWeight: 700,
              fontSize: '0.95rem', cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      );
    }
    if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#475569', fontSize: '1.1rem' }}>Loading presentation…</div>;
    return <div style={{ padding: 40, fontFamily: 'sans-serif' }}>Loading presentation...</div>;
  }

  const slide = slides[current];
  const transition = settings?.transition || 'fade';

  const variants: Record<string, any> = {
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
    slide: { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -60 } },
    zoom: { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.92 } },
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pres-deck">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <SlideRenderer slide={slide} settings={settings} />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="pres-progress" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
      <div className="pres-counter">{current + 1} / {slides.length}</div>
      <div className="pres-legend">← → · F fullscreen · N notes · Home/End</div>
      <div className="pres-controls">
        <button onClick={prev}>‹</button>
        <button onClick={next}>›</button>
      </div>
      {showNotes && slide.speakerNotes && (
        <div className="pres-notes">
          <h4>Speaker notes</h4>
          <div dangerouslySetInnerHTML={{ __html: slide.speakerNotes }} />
        </div>
      )}
    </>
  );
}
