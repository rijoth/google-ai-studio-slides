// Purpose: Slide renderer — converts slide JSON data into rendered HTML/CSS
// Responsibilities: Render all slide types (hero, content, divider, hero-alt) with all content blocks
// Public interfaces: SlideRenderer component
// Dependencies: react, ../../types
// Related files: PresentationView.tsx

import React from 'react';
import type { Slide, Settings } from '../../types';

interface Props {
  slide: Slide;
  settings: Settings | null;
}

const antigravityLogoSvg = `<svg class="ag-logo" viewBox="0 0 113 113" height="48" width="48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" fill="#3186FF"/><mask id="mask0_ag" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="13" y="18" width="85" height="78"><path d="M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z" fill="black"/></mask><g mask="url(#mask0_ag)"><ellipse cx="22.7873" cy="26.8098" rx="22.7873" ry="26.8098" transform="matrix(-0.112784 0.99362 -0.99362 -0.112781 66.2473 -15.5344)" fill="#FFE432" filter="url(#blur0_ag)"/><ellipse cx="96.491" cy="35.1231" rx="29.5007" ry="30.1492" transform="rotate(76.9243 96.491 35.1231)" fill="#FC413D" filter="url(#blur1_ag)"/><ellipse cx="9.02988" cy="41.6647" rx="30.832" ry="39.9417" transform="rotate(74.1257 9.02988 41.6647)" fill="#00B95C" filter="url(#blur2_ag)"/><ellipse cx="11.2212" cy="42.8915" rx="30.22" ry="33.2695" transform="rotate(45.6065 11.2212 42.8915)" fill="#00B95C" filter="url(#blur3_ag)"/><ellipse cx="75.7546" cy="104.822" rx="29.0177" ry="27.943" transform="rotate(76.9243 75.7546 104.822)" fill="#3186FF" filter="url(#blur4_ag)"/><ellipse cx="33.5661" cy="35.4043" rx="33.5661" ry="35.4043" transform="matrix(-0.409539 0.912293 -0.912294 -0.409537 101.25 -15.1674)" fill="#FBBC04" filter="url(#blur5_ag)"/><path d="M2.56802 149.695C-15.8116 142.48 15.5987 83.1163 23.4093 63.2203C31.22 43.3244 52.4514 33.0447 70.831 40.26C89.2107 47.4753 110.996 87.2162 103.185 107.112C95.3742 127.008 20.9477 156.91 2.56802 149.695Z" fill="#3186FF" filter="url(#blur6_ag)"/><path d="M113.934 75.8079C109.013 81.5509 96.1724 78.6224 85.253 69.2667C74.3335 59.911 69.4704 47.6711 74.391 41.928C79.3116 36.185 92.1525 39.1136 103.072 48.4692C113.991 57.8249 118.855 70.0648 113.934 75.8079Z" fill="#749BFF" filter="url(#blur7_ag)"/><ellipse cx="92.611" cy="23.7962" rx="44.2411" ry="27.5016" transform="rotate(34.0763 92.611 23.7962)" fill="#FC413D" filter="url(#blur8_ag)"/><ellipse cx="23.4949" cy="29.5887" rx="23.7071" ry="13.7869" transform="rotate(112.516 23.4949 29.5887)" fill="#FFEE48" filter="url(#blur9_ag)"/></g><defs><filter id="blur0_ag" x="2.49348" y="-26.5423" width="69.0899" height="61.2525" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.89034"/></filter><filter id="blur1_ag" x="28.7524" y="-32.0333" width="135.477" height="134.313" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="18.8078"/></filter><filter id="blur2_ag" x="-62.2884" y="-21.9253" width="142.637" height="127.18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="15.9884"/></filter><filter id="blur3_ag" x="-52.5697" y="-20.8346" width="127.582" height="127.452" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="15.9884"/></filter><filter id="blur4_ag" x="17.3619" y="45.4646" width="116.786" height="118.715" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="15.1937"/></filter><filter id="blur5_ag" x="-7.44765" y="-60.4737" width="125.303" height="122.858" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="13.7698"/></filter><filter id="blur6_ag" x="-27.7086" y="13.3597" width="157.119" height="162.029" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="12.297"/></filter><filter id="blur7_ag" x="50.4638" y="16.981" width="87.3973" height="83.7738" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="11.0036"/></filter><filter id="blur8_ag" x="34.2604" y="-28.457" width="116.701" height="104.506" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="9.29385"/></filter><filter id="blur9_ag" x="-15.1522" y="-15.9493" width="77.2941" height="91.076" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="11.5027"/></filter></defs></svg>`;

const slideStyles = `
.slide-full { position: absolute; inset: 0; padding: clamp(32px, 5vh, 64px) clamp(24px, 5vw, 84px); display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.blob-pres { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .5; z-index: 0; pointer-events: none; }
.blob-pres.b1 { width: clamp(240px, 28vw, 420px); height: clamp(240px, 28vw, 420px); background: #4285F4; top: -15%; right: -8%; opacity: .16; }
.blob-pres.b2 { width: clamp(200px, 22vw, 340px); height: clamp(200px, 22vw, 340px); background: #A142F4; bottom: -12%; left: -5%; opacity: .13; }
.content-pres { position: relative; z-index: 1; width: 100%; max-width: 1120px; margin: 0 auto; overflow: visible; }
.eyebrow-pres { font-size: clamp(.7rem, 1vw, .9rem); font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--g-blue); margin-bottom: 12px; }
.eyebrow-pres.white { color: #fff; opacity: .85; }
.eyebrow-pres.red { color: var(--g-red); }
.eyebrow-pres.purple { color: var(--g-purple); }
h2.pres { font-size: clamp(1.8rem, 3.6vw, 3.2rem); font-weight: 800; line-height: 1.06; letter-spacing: -.015em; margin-bottom: 20px; font-family: inherit; max-width: 22ch; }
.hero-pres h2.pres { font-size: clamp(2.2rem, 5vw, 4.2rem); line-height: 1.04; max-width: 24ch; }
.divider-pres h2.pres { font-size: clamp(2rem, 4.5vw, 3.8rem); }
.content-pres h2.pres:has(+ .lede-pres) { margin-bottom: 16px; }
.lede-pres { font-size: clamp(1rem, 1.5vw, 1.35rem); color: var(--slate); line-height: 1.5; font-weight: 450; max-width: 58ch; }
.sub-pres { font-size: clamp(.88rem, 1.2vw, 1.08rem); color: var(--slate); line-height: 1.5; margin-top: 14px; max-width: 64ch; }
.rule-pres { width: 64px; height: 5px; border-radius: 99px; margin: 16px 0 24px; background: var(--grad-hero); }
.row-pres { display: flex; gap: clamp(20px, 3vw, 36px); align-items: flex-start; flex-wrap: wrap; margin-top: 24px; }
.col-pres { flex: 1; min-width: 280px; }
.grid-pres { display: grid; gap: clamp(16px, 2vw, 24px); margin-top: 24px; }
.grid-2 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); }
.grid-3 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); }
.grid-4 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
.grid-5 { grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr)); }
.feat-pres { display: flex; flex-direction: column; gap: 8px; border-radius: 20px; padding: clamp(18px, 2vw, 24px); background: #fff; box-shadow: var(--shadow-sm); border-top: 5px solid var(--g-blue); height: 100%; }
.feat-pres .icon-pres { width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; font-size: 1.4rem; color: #fff; flex: none; }
.feat-pres .icon-pres.i-blue { background: #4285F4; } .feat-pres .icon-pres.i-red { background: #EA4335; }
.feat-pres .icon-pres.i-yellow { background: #FBBC04; } .feat-pres .icon-pres.i-green { background: #34A853; }
.feat-pres .icon-pres.i-purple { background: #A142F4; } .feat-pres .icon-pres.i-cyan { background: #00BCD4; }
.feat-pres .icon-pres.i-magenta { background: #D9458F; }
.feat-title-pres { font-weight: 700; font-size: clamp(.95rem, 1.2vw, 1.1rem); margin-bottom: 2px; line-height: 1.25; }
.feat-body-pres { font-size: clamp(.82rem, 1vw, .92rem); color: var(--slate); line-height: 1.45; }
.bullets-pres { list-style: none; display: flex; flex-direction: column; gap: clamp(10px, 1.5vh, 16px); }
.bullets-pres li { display: flex; gap: 12px; align-items: flex-start; font-size: clamp(.95rem, 1.4vw, 1.25rem); font-weight: 500; line-height: 1.4; }
.bullets-pres li::before { content: ""; flex: none; width: 12px; height: 12px; border-radius: 3px; margin-top: .5em; background: var(--grad-cyan); }
.card-pres { background: #fff; border-radius: 20px; padding: clamp(18px, 2vw, 24px); box-shadow: var(--shadow-sm); border: 1px solid rgba(15,23,42,.04); margin-bottom: 12px; }
.card-pres h3 { font-size: clamp(1.05rem, 1.3vw, 1.2rem); font-weight: 700; margin-bottom: 6px; line-height: 1.3; }
.card-pres .card-body { font-size: clamp(.85rem, 1vw, .95rem); color: var(--slate); line-height: 1.5; }
.code-pres { background: #0F172A; color: #E2E8F0; border-radius: 14px; padding: clamp(14px, 2vw, 20px) clamp(16px, 2vw, 24px); font-family: "SFMono-Regular", Consolas, Menlo, monospace; font-size: clamp(.78rem, .9vw, .9rem); line-height: 1.55; box-shadow: var(--shadow-sm); overflow: auto; white-space: pre-wrap; max-height: 45vh; }
.pipeline-h { display: flex; align-items: center; gap: clamp(6px, 1vw, 12px); flex-wrap: wrap; justify-content: center; margin-top: 20px; }
.pipeline-v { display: flex; flex-direction: column; gap: 4px; align-items: stretch; margin-top: 16px; max-height: 56vh; overflow-y: auto; }
.node-pres { background: #fff; border-radius: 12px; padding: clamp(9px, 1vh, 13px) clamp(14px, 1.8vw, 18px); box-shadow: var(--shadow-sm); font-weight: 700; display: flex; align-items: center; gap: 8px; border-top: 3px solid var(--g-blue); font-size: clamp(.8rem, .95vw, .92rem); }
.node-num { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-weight: 800; flex: none; font-size: .78rem; }
.arrow-pres { color: var(--mist); font-size: 1.1rem; font-weight: 800; flex: none; }
.pipeline-v .arrow-pres { text-align: center; font-size: .9rem; line-height: .7; }
.timeline-pres { position: relative; display: flex; justify-content: center; gap: clamp(8px, 1.2vw, 16px); margin-top: 28px; flex-wrap: wrap; }
.timeline-pres::before { content: ""; position: absolute; top: 28px; left: 4%; right: 4%; height: 4px; background: var(--grad-hero); border-radius: 99px; z-index: 0; }
.tl-item-pres { position: relative; z-index: 1; flex: 0 0 auto; min-width: 80px; text-align: center; }
.tl-dot-pres { width: 56px; height: 56px; border-radius: 50%; display: grid; place-items: center; color: #fff; font-weight: 800; font-size: 1.2rem; margin: 0 auto 10px; box-shadow: var(--shadow-sm); }
.tl-title-pres { font-weight: 700; font-size: clamp(.8rem, 1vw, .95rem); line-height: 1.2; }
.tl-sub-pres { font-size: clamp(.7rem, .85vw, .82rem); color: var(--slate); line-height: 1.3; }
.cmp-table-wrap { width: 100%; overflow-x: auto; margin-top: 18px; border-radius: 18px; box-shadow: var(--shadow-sm); }
.cmp-pres { width: 100%; min-width: 500px; border-collapse: separate; border-spacing: 0; border-radius: 18px; overflow: hidden; font-size: clamp(.85rem, 1.1vw, 1.05rem); }
.cmp-pres th, .cmp-pres td { padding: clamp(10px, 1.2vw, 14px) clamp(12px, 1.5vw, 18px); text-align: left; border-bottom: 1px solid rgba(15,23,42,.06); }
.cmp-pres thead th { background: var(--g-blue); color: #fff; font-weight: 700; }
.cmp-pres tbody tr:nth-child(even) { background: #fff; }
.cmp-pres tbody tr:nth-child(odd) { background: #F1F5F9; }
.cmp-pres td:first-child { font-weight: 700; }
.ba-pres { display: grid; grid-template-columns: 1fr auto 1fr; gap: clamp(12px, 2vw, 20px); align-items: stretch; margin-top: 18px; }
.ba-bad { background: #FFF5F5; border-top: 5px solid var(--g-red); border-radius: 18px; padding: clamp(16px, 2vw, 24px); box-shadow: var(--shadow-sm); }
.ba-good { background: #F0FDF4; border-top: 5px solid var(--g-green); border-radius: 18px; padding: clamp(16px, 2vw, 24px); box-shadow: var(--shadow-sm); }
.ba-arrow-pres { display: grid; place-items: center; font-size: 1.8rem; color: var(--g-blue); font-weight: 800; padding: 0 4px; }
.ba-label { font-weight: 800; font-size: clamp(.72rem, .9vw, .85rem); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 8px; }
.ba-bad .ba-label { color: var(--g-red); } .ba-good .ba-label { color: var(--g-green); }
.ba-text { font-family: "SFMono-Regular", Consolas, Menlo, monospace; font-size: clamp(.8rem, .95vw, .92rem); color: var(--ink); line-height: 1.5; background: rgba(15,23,42,.04); padding: 10px 12px; border-radius: 10px; white-space: pre-wrap; }
.interact-pres { border-radius: 18px; padding: clamp(16px, 2vw, 20px) clamp(20px, 2.5vw, 26px); color: #fff; font-weight: 600; box-shadow: var(--shadow-sm); margin-top: 18px; }
.interact-pres .q { font-size: clamp(1.05rem, 1.3vw, 1.2rem); font-weight: 800; margin-bottom: 4px; line-height: 1.35; }
.interact-pres .type-label { font-size: clamp(.72rem, .85vw, .82rem); letter-spacing: .1em; text-transform: uppercase; opacity: .9; margin-bottom: 4px; }
.interact-pres.cool { background: var(--grad-cyan); }
.interact-pres.mint { background: var(--grad-mint); }
.interact-pres.purple { background: linear-gradient(135deg, #A142F4, #4285F4); }
.interact-pres.default { background: var(--grad-warm); }
.interact-pres.hero-int { background: rgba(255,255,255,.16); color: #fff; backdrop-filter: blur(8px); }
.interact-pres.hero-int .type-label { color: #fff; }
.interact-pres.hero-int .q { color: #fff; }
.callout-pres { background: #fff; border-radius: 16px; padding: clamp(14px, 1.5vw, 18px) clamp(16px, 2vw, 22px); box-shadow: var(--shadow-sm); font-weight: 600; font-size: clamp(.88rem, 1.1vw, 1.02rem); line-height: 1.45; }
.hero-pres { background: var(--grad-hero); color: #fff; }
.hero-pres h2.pres { color: #fff; text-shadow: 0 2px 16px rgba(0,0,0,.35), 0 0 48px rgba(0,0,0,.18); margin-bottom: 32px; }
.hero-pres .lede-pres { color: rgba(255,255,255,.92); margin-top: 28px; }
.hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 40%, rgba(0,0,0,.32) 0%, transparent 65%); z-index: 0; pointer-events: none; }
.brand-google { background-image: linear-gradient(120deg, #4285F4 0%, #34A853 35%, #FBBC04 65%, #EA4335 100%); color: transparent; background-clip: text; -webkit-background-clip: text; font-weight: 800; }
.brand-antigravity { display: inline-flex; align-items: center; gap: 14px; color: #fff !important; background: none !important; -webkit-text-fill-color: #fff !important; }
.brand-antigravity .ag-logo { flex: none; height: 48px; width: 48px; }
.brand-connector { color: rgba(255,255,255,.45); font-weight: 300; font-size: .85em; margin: 0 .1em; }
.chip-row-pres { margin-top: 24px; display: flex; gap: 10px; flex-wrap: wrap; }
.hero-pres .chip-row-pres { margin-top: 36px; }
.chip-pres { background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.25); border-radius: 99px; padding: 8px 18px; font-weight: 600; font-size: clamp(.8rem, .95vw, .92rem); backdrop-filter: blur(4px); white-space: nowrap; }
.foot-meta-pres { position: absolute; bottom: clamp(16px, 3vh, 36px); left: clamp(24px, 5vw, 84px); right: clamp(24px, 5vw, 84px); display: flex; justify-content: space-between; color: rgba(255,255,255,.85); font-size: clamp(.78rem, .95vw, .9rem); font-weight: 600; z-index: 3; flex-wrap: wrap; gap: 8px; }
.divider-pres { display: flex; align-items: center; justify-content: center; }
.divider-pres .content-pres { max-width: 700px; }
.divider-pres h2.pres { color: #fff; }
.divider-pres .lede-pres { color: rgba(255,255,255,.92); }
.div-num-pres { font-size: clamp(4rem, 14vw, 11rem); font-weight: 800; line-height: 1; opacity: .12; letter-spacing: -.04em; position: absolute; right: clamp(20px, 5vw, 80px); top: 50%; transform: translateY(-50%); z-index: 0; pointer-events: none; }
.div-bg1 { background: var(--grad-hero); }
.div-bg2 { background: var(--grad-cyan); }
.div-bg3 { background: var(--grad-mint); }
.div-bg4 { background: var(--grad-warm); }
.shot-pres { margin-top: 14px; border: 2px dashed rgba(0,188,212,.35); border-radius: 16px; padding: clamp(12px, 1.5vw, 18px) clamp(14px, 2vw, 22px); background: rgba(0,188,212,.05); color: var(--slate); font-style: italic; font-size: clamp(.82rem, .95vw, .92rem); display: flex; gap: 10px; align-items: flex-start; flex-direction: column; }
.shot-pres::before { content: "🖼"; font-style: normal; font-size: 1.2rem; }
.shot-pres img { max-width: 100%; border-radius: 8px; margin-top: 6px; }
.mark-pres.blue { color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(120deg, #4285F4, #00BCD4); }
.mark-pres.purple { color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(120deg, #A142F4, #EA4335); }
.mark-pres.warm { color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(120deg, #FBBC04, #EA4335); }
.mark-pres.mint { color: transparent; background-clip: text; -webkit-background-clip: text; background-image: linear-gradient(120deg, #34A853, #00BCD4); }
.res-pres { display: flex; flex-direction: column; gap: 12px; }
.res-pres a { display: flex; gap: 14px; align-items: center; background: #fff; border-radius: 14px; padding: clamp(12px, 1.5vw, 16px) clamp(16px, 2vw, 22px); text-decoration: none; color: var(--ink); box-shadow: var(--shadow-sm); font-weight: 600; border-left: 5px solid var(--g-blue); font-size: clamp(.88rem, 1.1vw, 1rem); }

/* ── Closing slide (thank-you redesign) ── */
.thankyou-pres .content-pres { max-width: 960px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.thankyou-pres h2.pres { font-size: clamp(72px, 8vw, 84px); margin-bottom: 48px; line-height: 1.02; font-weight: 800; letter-spacing: -.02em; }
.thankyou-pres .lede-pres { font-size: clamp(1.35rem, 1.8vw, 1.65rem); margin-bottom: 64px; color: rgba(255,255,255,.78); font-weight: 400; line-height: 1.5; }

.closing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; width: 100%; max-width: 820px; }
.closing-card { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 20px; padding: 28px 24px; display: flex; flex-direction: column; gap: 12px; text-align: left; backdrop-filter: blur(12px); transition: border-color .2s; }
.closing-card:hover { border-color: rgba(255,255,255,.22); }
.closing-card .cc-icon { font-size: 1.8rem; line-height: 1; }
.closing-card .cc-title { font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.25; }
.closing-card .cc-body { font-size: .9rem; color: rgba(255,255,255,.6); line-height: 1.45; }
.closing-card .cc-url { font-size: .82rem; color: #60A5FA; font-weight: 500; margin-top: auto; }



@media (max-width: 680px) {
  .closing-grid { grid-template-columns: 1fr; }

  .thankyou-pres h2.pres { font-size: clamp(48px, 12vw, 64px); }
}
`;

export default function SlideRenderer({ slide, settings }: Props) {
  const hasImageFor = (slot: string) => slide.images[slot];

  const renderMark = (text: string): string => {
    let out = text
      .replace(/<span class="mark blue">([^<]+)<\/span>/g, '<span class="mark-pres blue">$1</span>')
      .replace(/<span class="mark purple">([^<]+)<\/span>/g, '<span class="mark-pres purple">$1</span>')
      .replace(/<span class="mark warm">([^<]+)<\/span>/g, '<span class="mark-pres warm">$1</span>')
      .replace(/<span class="mark mint">([^<]+)<\/span>/g, '<span class="mark-pres mint">$1</span>')
      .replace(/<span class="mark" style="([^"]+)">([^<]+)<\/span>/g, '<span style="$1;color:transparent;background-clip:text;-webkit-background-clip:text">$2</span>')
      .replace(/<span style="([^"]+)">([^<]+)<\/span>/g, '<span style="$1">$2</span>');
    if (slide.slideType === 'hero' || slide.slideType === 'hero-alt') {
      out = out.replace(/<span class="brand-antigravity">([^<]+)<\/span>/g, `<span class="brand-antigravity">${antigravityLogoSvg}$1</span>`);
    }
    return out;
  };

  const renderImageSlot = (slot: { name: string; label: string; description?: string }) => {
    const imgPath = hasImageFor(slot.name);
    if (!imgPath) return null;
    return (
      <div key={slot.name} className="shot-pres">
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, fontStyle: 'normal' }}>{slot.label}</div>
          <img src={imgPath} alt={slot.label} style={{ maxWidth: '100%', borderRadius: 8 }} />
        </div>
      </div>
    );
  };

  const bgStyle: React.CSSProperties = {};
  if (slide.background) bgStyle.background = slide.background;
  if (slide.slideType === 'hero') bgStyle.background = slide.background || undefined;

  const baseClasses = ['slide-full'];
  if (slide.slideType === 'hero') baseClasses.push('hero-pres');
  if (slide.slideType === 'divider') baseClasses.push('divider-pres', slide.dividerBgClass || 'div-bg1');
  if (slide.slideType === 'hero-alt') baseClasses.push('hero-pres');
  const isThankYou = slide.id === 'thank-you';
  if (isThankYou) baseClasses.push('thankyou-pres');

  return (
    <>
      <style>{slideStyles}</style>
      <div className={baseClasses.join(' ')} style={bgStyle}>
        {slide.blob === 'b1' && <div className="blob-pres b1" />}
        {slide.blob === 'b2' && <div className="blob-pres b2" />}
        {slide.blob === 'both' && <><div className="blob-pres b1" /><div className="blob-pres b2" /></>}
        {slide.slideType === 'hero' && <><div className="hero-overlay" /><div className="blob-pres b1" style={{ background: '#fff', opacity: .25 }} /><div className="blob-pres b2" style={{ background: '#FBBC04', opacity: .3 }} /></>}

        {slide.dividerNum && <div className="div-num-pres">{slide.dividerNum}</div>}

        <div className="content-pres">
          {slide.eyebrow && (
            <div className={`eyebrow-pres ${slide.eyebrowClass || ''}`}>{slide.eyebrow}</div>
          )}
          {slide.title && (
            <h2 className="pres" dangerouslySetInnerHTML={{ __html: renderMark(slide.title) }} />
          )}
          {slide.rule && <div className="rule-pres" />}
          {slide.lede && (
            <p className="lede-pres" dangerouslySetInnerHTML={{ __html: slide.lede }} />
          )}
          {slide.sub && (
            <p className="sub-pres" dangerouslySetInnerHTML={{ __html: slide.sub }} />
          )}

          {/* Chip row */}
          {slide.chipRow && (
            <div className="chip-row-pres">
              {slide.chipRow.map((c, i) => <span key={i} className="chip-pres">{c}</span>)}
            </div>
          )}

          {/* Timeline */}
          {slide.timeline && (
            <div className="timeline-pres">
              {slide.timeline.map((t, i) => (
                <div key={i} className="tl-item-pres">
                  <div className="tl-dot-pres" style={{ background: t.dotBg }}>{t.dot}</div>
                  <div className="tl-title-pres">{t.title}</div>
                  <div className="tl-sub-pres">{t.sub}</div>
                </div>
              ))}
            </div>
          )}

          {/* Columns */}
          {slide.cols && (
            <div className="row-pres">
              {slide.cols.left && (
                <div className="col-pres">
                  {slide.cols.left.features?.map((feat, i) => (
                    <div key={i} className="card-pres" style={{ borderTop: `4px solid ${feat.borderColor || 'var(--g-blue)'}`, marginBottom: 16 }}>
                      {feat.title && <h3 style={{ color: feat.borderColor || 'var(--g-blue)', fontSize: 'clamp(.95rem, 1.2vw, 1.1rem)' }}>{feat.title}</h3>}
                      {feat.body && <div className="card-body" dangerouslySetInnerHTML={{ __html: feat.body }} />}
                    </div>
                  ))}
                  {slide.cols.left.bullets && (
                    <ul className="bullets-pres" style={slide.cols.left.bullets.style === 'sq' ? { /* */ } : {}}>
                      {slide.cols.left.bullets.items.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  )}
                  {slide.cols.left.codeBlock && (
                    <div className="code-pres">{slide.cols.left.codeBlock}</div>
                  )}
                  {slide.cols.left.cards?.map((card, i) => (
                    <div key={i} className="card-pres">
                      {card.title && <h3 style={{ color: card.titleColor || undefined }}>{card.title}</h3>}
                      <div className="card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
                    </div>
                  ))}
                  {slide.cols.left.callout && (
                    <div className="callout-pres" style={{ borderLeft: `5px solid ${slide.cols.left.callout.borderColor}` }}>
                      {slide.cols.left.callout.text}
                    </div>
                  )}
                  {slide.cols.left.imageSlots?.map(renderImageSlot)}
                  {slide.cols.left.interactive && renderInteractive(slide.cols.left.interactive)}
                </div>
              )}
              {slide.cols.right && (
                <div className="col-pres">
                  {slide.cols.right.features?.map((feat, i) => (
                    <div key={i} className="card-pres" style={{ borderTop: `4px solid ${feat.borderColor || 'var(--g-blue)'}`, marginBottom: 16 }}>
                      {feat.title && <h3 style={{ color: feat.borderColor || 'var(--g-blue)', fontSize: 'clamp(.95rem, 1.2vw, 1.1rem)' }}>{feat.title}</h3>}
                      {feat.body && <div className="card-body" dangerouslySetInnerHTML={{ __html: feat.body }} />}
                    </div>
                  ))}
                  {slide.cols.right.bullets && (
                    <ul className="bullets-pres">
                      {slide.cols.right.bullets.items.map((item, i) => (
                        <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                      ))}
                    </ul>
                  )}
                  {slide.cols.right.codeBlock && (
                    <div className="code-pres">{slide.cols.right.codeBlock}</div>
                  )}
                  {slide.cols.right.cards?.map((card, i) => (
                    <div key={i} className="card-pres" style={card.borderColor ? { borderTop: `5px solid ${card.borderColor}` } : {}}>
                      {card.title && <h3 style={{ color: card.titleColor || undefined }}>{card.title}</h3>}
                      <div className="card-body" dangerouslySetInnerHTML={{ __html: card.body }} />
                    </div>
                  ))}
                  {slide.cols.right.callout && (
                    <div className="callout-pres" style={{ borderLeft: `5px solid ${slide.cols.right.callout.borderColor}` }}>
                      {slide.cols.right.callout.text}
                    </div>
                  )}
                  {slide.cols.right.imageSlots?.map(renderImageSlot)}
                  {slide.cols.right.interactive && renderInteractive(slide.cols.right.interactive)}
                </div>
              )}
            </div>
          )}

          {/* Feature grid */}
          {slide.featureGrid && (
            <div className={`grid-pres grid-${slide.featureGrid.cols}`}>
              {slide.featureGrid.items.map((item, i) => (
                <div key={i} className="feat-pres" style={item.borderColor ? { borderTopColor: item.borderColor } : {}}>
                  {item.icon && <div className={`icon-pres ${item.iconClass}`}>{item.icon}</div>}
                  <div className="feat-title-pres">{item.title}</div>
                  <div className="feat-body-pres">{item.body}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pipeline */}
          {slide.pipeline && (
            <div className={slide.pipeline.direction === 'vertical' ? 'pipeline-v' : 'pipeline-h'}>
              {slide.pipeline.nodes.map((node, i) => (
                <React.Fragment key={i}>
                  <div className="node-pres" style={{ borderTopColor: node.borderColor }}>
                    <span className="node-num" style={{ background: node.bg }}>{node.num}</span>
                    {node.label}
                  </div>
                  {i < slide.pipeline!.nodes.length - 1 && (
                    <span className="arrow-pres">{slide.pipeline.direction === 'vertical' ? '↓' : '→'}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Comparison table */}
          {slide.comparisonTable && (
            <div className="cmp-table-wrap">
              <table className="cmp-pres">
                <thead>
                  <tr>{slide.comparisonTable.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {slide.comparisonTable.rows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.label}</td>
                      {row.values.map((v, j) => <td key={j}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Before/After */}
          {slide.beforeAfter && (
            <div className="ba-pres">
              <div className="ba-bad">
                <div className="ba-label">{slide.beforeAfter.badLabel}</div>
                <div className="ba-text">{slide.beforeAfter.badText}</div>
              </div>
              <div className="ba-arrow-pres">→</div>
              <div className="ba-good">
                <div className="ba-label">{slide.beforeAfter.goodLabel}</div>
                <div className="ba-text">{slide.beforeAfter.goodText}</div>
              </div>
            </div>
          )}

          {/* Bullets (standalone, not in columns) */}
          {slide.bullets && !slide.cols && (
            <ul className="bullets-pres" style={{ marginTop: 22 }}>
              {slide.bullets.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          )}

          {/* Closing cards (thank-you slide redesign) */}
          {slide.closingCards && (
            <div className="closing-grid">
              {slide.closingCards.map((card, i) => (
                <div key={i} className="closing-card">
                  <div className="cc-icon">{card.icon}</div>
                  <div className="cc-title">{card.title}</div>
                  <div className="cc-body">{card.body}</div>
                  {card.url && <div className="cc-url">{card.url}</div>}
                </div>
              ))}

            </div>
          )}

          {/* Interactive block */}
          {slide.interactive && !slide.cols && renderInteractive(slide.interactive)}

          {/* Image slots (standalone) */}
          {slide.imageSlots?.map(renderImageSlot)}

          {/* Foot meta - hero-alt variant stays inside content flow */}
          {slide.footMeta && slide.slideType === 'hero-alt' && (
            <div className="foot-meta-pres" style={{ position: 'static', marginTop: 32, color: 'rgba(255,255,255,.7)', left: 'auto', right: 'auto' }}>
              <span>{slide.footMeta.left}</span>
              <span>{slide.footMeta.right}</span>
            </div>
          )}
        </div>

        {/* Foot meta - positioned relative to slide for hero slides */}
        {slide.footMeta && slide.slideType !== 'hero-alt' && (
          <div className="foot-meta-pres">
            <span>{slide.footMeta.left}</span>
            <span>{slide.footMeta.right}</span>
          </div>
        )}
      </div>
    </>
  );
}

function renderInteractive(block: { type: string; bgClass: string; label: string; question: string }) {
  const cls = block.bgClass || 'default';
  const isHero = block.type === 'Ask the Audience' && block.bgClass === '';
  return (
    <div className={`interact-pres ${cls}${isHero ? ' hero-int' : ''}`}>
      <div className="type-label">{block.label}</div>
      <div className="q" dangerouslySetInnerHTML={{ __html: block.question }} />
    </div>
  );
}
