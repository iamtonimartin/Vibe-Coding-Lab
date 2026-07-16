import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { QUESTIONS_PROMPT, REPORT_PROMPT, FIRST_CLIENT_PROMPT } from '../data/auditPrompts';

// Deck-specific styling. Palette and type are the Vibe Coding Lab house system:
// Outfit for display, Inter for everything else, terracotta on forest green and warm cream.
const CSS = `
#aota{
  --forest:#0e1f16;--forest-2:#16291c;--forest-card:#152a1c;--cream:#F5F5F0;--paper:#ffffff;--sand:#EDE7DE;
  --terra:#C25E44;--terra-deep:#B45309;--ink:#0e1f16;--body:#4c5a51;--muted:#8d968c;
  --card-text:#EDE7DE;--ph:#E08A6F;--line:rgba(14,31,22,.12);--line-dark:rgba(237,231,222,.16);
  --sans:"Inter",ui-sans-serif,system-ui,sans-serif;
  --display:"Outfit",ui-sans-serif,system-ui,sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --ease:cubic-bezier(.7,0,.2,1);
  position:fixed;inset:0;background:var(--forest);color:var(--body);
  font-family:var(--sans);font-size:clamp(16px,1.6vw,19px);line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
body.aota-lock{overflow:hidden}
#aota *{box-sizing:border-box}
.stage{position:fixed;inset:0;overflow:hidden}
.track{position:absolute;inset:0}
/* Slides stack and cross-dissolve. The outgoing one sits below the incoming one
   and shows through it as it fades up. Visibility is delayed off the fade so a
   departing slide stays painted for the duration, then stops taking hit-tests. */
.slide{position:absolute;inset:0;isolation:isolate;overflow:hidden;display:flex;align-items:center;
  padding:clamp(28px,4.5vw,60px) clamp(28px,6vw,110px) clamp(28px,4.5vw,60px) clamp(66px,10vw,168px);
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .5s var(--ease),visibility 0s linear .5s}
.slide.reveal{opacity:1;visibility:visible;pointer-events:auto;z-index:2;
  transition:opacity .5s var(--ease),visibility 0s linear 0s}
.slide.cream{background:var(--cream);color:var(--body)}
.slide.forest{background:radial-gradient(120% 120% at 80% 10%,var(--forest-2),var(--forest) 60%);color:var(--card-text)}
.slide.terra{background:var(--terra);color:#fff1ea}
/* House grain, same fractal noise the landing page uses. Multiply reads on the
   light slides; the dark ones need overlay or the texture disappears into them. */
.slide::after{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.slide.cream::after{opacity:.035;mix-blend-mode:multiply}
.slide.forest::after{opacity:.07;mix-blend-mode:overlay}
.slide.terra::after{opacity:.09;mix-blend-mode:overlay}
.scroller{width:100%;max-height:100%;overflow-y:auto;padding:2px;position:relative;z-index:2}
.wrap{width:100%;max-width:920px;margin:0 auto;position:relative;z-index:2}
/* Oversized act numeral bleeding off the bottom-right of the section covers. */
.ghost{position:absolute;z-index:0;right:clamp(-8px,2vw,40px);bottom:clamp(-24px,-2vw,8px);
  font-family:var(--display);font-weight:800;font-size:clamp(180px,38vw,520px);line-height:.8;
  letter-spacing:-.05em;pointer-events:none;user-select:none}
.cream .ghost{color:rgba(14,31,22,.045)}
.forest .ghost{color:rgba(237,231,222,.05)}
.terra .ghost{color:rgba(255,255,255,.1)}
.eyebrow{font-weight:700;font-size:clamp(11px,1.05vw,12.5px);letter-spacing:.22em;text-transform:uppercase;color:var(--terra);display:flex;align-items:center;gap:.7em;margin:0 0 clamp(14px,2vw,24px);flex-wrap:wrap}
.eyebrow::before{content:"";width:28px;height:2px;background:currentColor;display:inline-block;flex:0 0 auto}
.forest .eyebrow{color:var(--ph)}.terra .eyebrow{color:#ffe4da}
.stepc{font-family:var(--mono);font-weight:600;font-size:11px;letter-spacing:.06em;color:var(--terra);border:1px solid var(--terra);border-radius:999px;padding:2px 10px}
.forest .stepc{color:var(--ph);border-color:var(--ph)}.terra .stepc{color:#ffe4da;border-color:rgba(255,228,218,.5)}
h1.d{font-family:var(--display);font-weight:800;color:var(--ink);font-size:clamp(32px,5.8vw,70px);line-height:1;letter-spacing:-.03em;margin:0;text-wrap:balance}
h1.d.dsm{font-size:clamp(25px,4vw,48px)}
.forest h1.d,.terra h1.d{color:#fff}
h2{font-family:var(--display);font-weight:800;color:var(--ink);font-size:clamp(25px,3.7vw,44px);line-height:1.06;letter-spacing:-.022em;margin:0 0 .45em;text-wrap:balance}
.forest h2,.terra h2{color:#fff}
.hl{color:var(--terra)}.forest .hl{color:var(--ph)}.terra .hl{color:var(--forest)}
.lead{font-style:italic;font-size:clamp(17px,2.1vw,25px);color:var(--body);margin:clamp(16px,2.2vw,28px) 0 0;line-height:1.4;max-width:27em;text-wrap:pretty}
.forest .lead{color:var(--card-text)}.terra .lead{color:#fff0ea}
p{margin:0 0 1em;max-width:42em;text-wrap:pretty}
.forest p{color:rgba(237,231,222,.85)}.terra p{color:#fff1ea}
.big{font-size:clamp(18px,2.05vw,25px);line-height:1.42;color:var(--ink);max-width:30em;text-wrap:pretty}
.forest .big,.terra .big{color:#fff}
/* Element selectors stay unprefixed: every class-level override below (.punch b,
   .forest strong, .donotdo b) must be able to win the cascade. */
strong,b{color:var(--ink);font-weight:700}
.forest strong,.forest b,.terra strong,.terra b{color:#fff}
.note{font-style:italic;color:var(--body);font-size:clamp(15px,1.6vw,19px);margin-top:1.1em;max-width:38em;text-wrap:pretty}
.forest .note{color:rgba(237,231,222,.9)}.terra .note{color:rgba(255,244,238,.94)}
.pull{font-style:italic;font-size:clamp(16px,1.8vw,21px);line-height:1.4;margin:.8em 0 0;max-width:38em;color:var(--ink)}
.forest .pull,.terra .pull{color:#fff}
.ask{font-family:var(--display);font-weight:800;color:var(--ink);font-size:clamp(16px,1.75vw,21px);letter-spacing:-.01em;margin:clamp(16px,2vw,22px) 0 0}
.anim{opacity:0}.slide.reveal .anim{animation:aota-rise .66s var(--ease) both;animation-delay:var(--d,0s)}
@keyframes aota-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
.slide.reveal .pop{animation:aota-pop .5s var(--ease) both;animation-delay:calc(var(--d,0s) + .12s)}
@keyframes aota-pop{0%{opacity:0;transform:translateY(24px) scale(.92)}60%{opacity:1}100%{opacity:1;transform:none}}
.tag{font-family:var(--mono);font-size:clamp(12px,1.3vw,15px);color:var(--ph);letter-spacing:.05em}
.cursor{display:inline-block;width:.6em;height:.92em;background:var(--terra);margin-left:.1em;transform:translateY(.1em);animation:aota-blink 1.05s steps(1) infinite}
@keyframes aota-blink{50%{opacity:0}}
.hint{margin-top:clamp(24px,3.4vw,44px);font-size:clamp(11px,1.2vw,13px);letter-spacing:.18em;text-transform:uppercase;color:rgba(237,231,222,.6);font-weight:700}
.key{display:inline-grid;place-items:center;min-width:1.9em;height:1.9em;padding:0 .5em;border:1px solid var(--line-dark);border-radius:8px;color:var(--card-text);font-family:var(--mono);font-size:.85em;margin:0 .2em}
.leave{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:clamp(22px,2.8vw,34px);max-width:760px}
.lcard{background:rgba(237,231,222,.06);border:1px solid var(--line-dark);border-radius:16px;padding:16px 18px}
.lcard .ln{font-family:var(--mono);color:var(--ph);font-size:12px;font-weight:700}
.lcard .lt{font-family:var(--display);font-weight:800;color:#fff;font-size:clamp(16px,1.7vw,19px);margin:6px 0 3px;line-height:1.1;letter-spacing:-.01em}
.lcard .lx{font-size:clamp(14px,1.4vw,15.5px);color:rgba(237,231,222,.88);line-height:1.4}
.replay{display:flex;gap:11px;align-items:flex-start;margin-top:22px;padding:12px 16px;border:1px dashed var(--line);border-radius:14px;font-size:clamp(14px,1.45vw,16.5px);line-height:1.5;color:var(--body);max-width:52em}
.forest .replay,.terra .replay{border-color:var(--line-dark);color:rgba(237,231,222,.9)}
.replay .ic{color:var(--terra);font-size:10px;margin-top:4px;flex:0 0 auto}.forest .replay .ic{color:var(--ph)}.terra .replay .ic{color:#ffe4da}
.replay b{color:var(--ink)}.forest .replay b,.terra .replay b{color:#fff}
.shot{display:inline-flex;align-items:center;gap:7px;background:var(--terra);color:#fff;font-weight:700;font-size:12px;padding:7px 13px;border-radius:999px;margin-bottom:14px;box-shadow:0 12px 26px -12px rgba(194,94,68,.6);transform:rotate(-1.4deg)}
.btn{font-family:var(--sans);font-weight:700;font-size:clamp(14px,1.45vw,16px);background:var(--terra);color:#fff;border:none;border-radius:999px;padding:12px 24px;cursor:pointer;transition:.2s;margin-top:clamp(14px,2vw,22px);box-shadow:0 12px 26px -14px rgba(194,94,68,.7)}
.btn:hover{background:var(--terra-deep)}.btn:active{transform:translateY(1px)}.btn:disabled{opacity:.55;cursor:default;box-shadow:none}
.terra .btn{background:var(--forest);color:#fff;box-shadow:none}.terra .btn:hover{background:var(--forest-2)}
.controls-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.path{display:flex;flex-direction:column;margin-top:6px;max-width:48em}
.pstep{display:grid;grid-template-columns:auto 1fr;gap:18px;padding:14px 0;border-top:1px solid var(--line-dark);align-items:baseline}
.path>.build:first-child .pstep{border-top:none}
.pstep .pn{font-family:var(--display);font-weight:800;color:var(--ph);font-size:clamp(22px,2.4vw,32px);line-height:1}
.pstep .pt{font-family:var(--display);font-weight:800;color:#fff;font-size:clamp(16px,1.7vw,21px);letter-spacing:-.01em}
.pstep .pd{color:rgba(237,231,222,.9);font-size:clamp(14.5px,1.5vw,16.5px);margin-top:2px}
.cover{align-items:center}
.cover .cnum{font-family:var(--display);font-weight:800;color:var(--ph);font-size:clamp(64px,13vw,168px);line-height:.82;letter-spacing:-.05em;margin-bottom:.04em}
.cover h1.d{font-size:clamp(34px,6.4vw,80px)}
.cover .lead{max-width:22em;margin-top:clamp(14px,1.8vw,22px)}
.two{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,22px);margin-top:8px}
.tcard{border-radius:18px;padding:clamp(16px,2vw,22px);border:1px solid var(--line);background:var(--paper)}
.tcard .th{font-weight:700;letter-spacing:.09em;text-transform:uppercase;font-size:10.5px;color:var(--terra);margin-bottom:10px}
.tcard li{font-size:clamp(14px,1.4vw,15.8px);color:var(--body);line-height:1.4;padding:5px 0;list-style:none}
.tcard ul{margin:0;padding:0}
.tcard li::before{content:"";display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--terra);margin-right:9px;transform:translateY(-2px)}
.lenses{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin-top:8px}
.lens{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:17px 19px;display:flex;flex-direction:column}
.lens.mine{border-color:var(--terra);background:#fbeee8}
.lens .lh{font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:11.5px;color:var(--body);margin-bottom:10px}
.lens.mine .lh{color:var(--terra)}
.lens .lq{font-style:italic;color:var(--ink);font-size:clamp(14px,1.4vw,15.8px);line-height:1.4;padding:7px 0;border-top:1px solid var(--line)}
.lens .lq:first-of-type{border-top:none;padding-top:0}
.movement{display:flex;align-items:center;gap:12px;margin:clamp(14px,1.8vw,22px) 0 4px}
.movement .ml{font-weight:700;letter-spacing:.16em;text-transform:uppercase;font-size:10.5px;color:var(--ph);white-space:nowrap}
.movement .mline{height:1px;background:var(--line-dark);flex:1}
.path>.build:first-child>.movement{margin-top:6px}
.cream .movement .ml{color:var(--terra)}.cream .movement .mline{background:var(--line)}
.fic{display:inline-flex;align-items:center;gap:8px;background:rgba(194,94,68,.12);border:1px solid rgba(194,94,68,.35);color:var(--terra);font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.08em;text-transform:uppercase;padding:6px 13px;border-radius:999px;margin-bottom:14px}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:clamp(16px,2vw,24px)}
.fact{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:15px 17px}
.fact .fv{font-family:var(--display);font-weight:800;color:var(--terra);font-size:clamp(20px,2.4vw,30px);line-height:1;letter-spacing:-.02em}
.fact .fl{font-size:clamp(13px,1.3vw,14.5px);color:var(--body);line-height:1.35;margin-top:5px}
.myths{display:flex;flex-direction:column;gap:11px;margin-top:4px}
.myth{background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:15px 20px;display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start}
.myth .mn{font-family:var(--mono);font-size:12.5px;color:var(--terra);font-weight:700;padding-top:3px}
.myth .ms{font-size:clamp(16px,1.65vw,19px);font-weight:600;line-height:1.4;color:var(--ink)}
.myth .tg{font-size:13px;color:var(--body);margin-top:5px;font-style:italic}
.guess{display:flex;gap:8px;margin-top:11px;flex-wrap:wrap}
.gbtn{font-family:var(--mono);font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;padding:7px 13px;border-radius:8px;border:1px solid var(--line);background:var(--cream);color:var(--body);cursor:pointer;transition:.15s}
.gbtn:hover:not(:disabled){border-color:var(--terra);color:var(--terra)}.gbtn:disabled{cursor:default}
.gbtn.correct{background:rgba(120,176,106,.16);border-color:#5f9150;color:#3f7a34}
.gbtn.wrong{background:rgba(194,94,68,.14);border-color:var(--terra);color:var(--terra)}.gbtn.miss{opacity:.4}
.verdict{margin-top:11px;display:none}.myth.answered .verdict{display:block;animation:aota-rise .35s var(--ease)}
.vchip{display:inline-block;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:6px}
.vchip.no{background:rgba(194,94,68,.16);color:var(--terra)}.vchip.yes{background:rgba(120,176,106,.18);color:#3f7a34}.vchip.maybe{background:rgba(224,150,47,.2);color:#a96b12}
.vwhy{font-size:clamp(14.5px,1.45vw,16px);line-height:1.55;color:var(--body);margin-top:8px;max-width:60ch}
.myscore{font-family:var(--mono);font-size:13px;color:var(--terra);font-weight:700;margin-left:4px}
.qgroups{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:clamp(14px,1.8vw,26px);margin-top:6px}
.qgt{font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--terra);margin:0 0 8px}
.qline{font-size:clamp(15px,1.5vw,17px);color:var(--body);line-height:1.38;padding:8px 0;border-top:1px solid var(--line)}
.qgroups>div>.qline:first-of-type{border-top:none}
.qline.keep{color:var(--ink);font-weight:700}
.msgcard{background:var(--paper);border:1px solid var(--line);border-radius:20px;overflow:hidden;max-width:640px;box-shadow:0 20px 50px -30px rgba(14,31,22,.4)}
.msgcard .mh{display:flex;align-items:center;gap:11px;padding:14px 18px;border-bottom:1px solid var(--line);background:var(--sand)}
.msgcard .av{width:38px;height:38px;border-radius:50%;background:var(--terra);color:#fff;display:grid;place-items:center;font-weight:800;font-family:var(--display)}
.msgcard .mfrom{font-weight:700;color:var(--ink);font-size:15px}.msgcard .mrole{font-size:13.5px;color:var(--body)}
.msgcard .mbody{padding:18px 20px;font-size:clamp(15.5px,1.6vw,18px);line-height:1.6;color:var(--ink)}
.quotes{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-top:6px}
.quote{background:var(--paper);border:1px solid var(--line);border-left:3px solid var(--terra);border-radius:16px;padding:15px 17px}
.quote .qn{font-weight:700;font-size:12.5px;color:var(--ink)}.quote .qr{font-size:12.5px;color:var(--body);margin-bottom:8px}
.quote .qt{font-style:italic;font-size:clamp(14.5px,1.45vw,16px);line-height:1.45;color:var(--body)}
.splitgrid .quotes{grid-template-columns:1fr;gap:12px;margin-top:0}
.splitgrid .quote{padding:18px 22px;border-left-width:4px}
.splitgrid .quote .qn{font-size:13.5px}
.splitgrid .quote .qt{font-size:clamp(15px,1.55vw,18px);line-height:1.5}
.reveal-box{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s var(--ease)}
.reveal-box.show{grid-template-rows:1fr;margin-top:22px}.reveal-inner{overflow:hidden}
.finding{display:grid;grid-template-columns:auto 1fr;gap:15px;padding:14px 0;border-top:1px solid var(--line)}.finding:first-child{border-top:none}
.fnum{width:24px;height:24px;border-radius:50%;background:var(--terra);color:#fff;font-family:var(--mono);font-size:12px;font-weight:700;display:grid;place-items:center;margin-top:1px}
.finding h4{font-family:var(--display);font-size:clamp(16px,1.6vw,18.5px);font-weight:800;color:var(--ink);margin:0 0 5px;letter-spacing:-.01em}
.finding p{font-size:clamp(14px,1.4vw,15.5px);color:var(--body);margin:0;line-height:1.5}
.reveal-box.show .finding{animation:aota-rise .45s var(--ease) both}
.reveal-box.show .finding:nth-child(2){animation-delay:.09s}.reveal-box.show .finding:nth-child(3){animation-delay:.18s}.reveal-box.show .finding:nth-child(4){animation-delay:.27s}
.punch{display:none;margin-top:18px;background:var(--forest);color:var(--cream);border-radius:18px;padding:16px 20px;font-style:italic;font-size:clamp(15.5px,1.6vw,18px);line-height:1.45;max-width:44em}
.punch.show{display:block;animation:aota-rise .5s var(--ease) both}.punch b{color:#fff}
.answer{display:none;margin-top:18px}.answer.show{display:block;animation:aota-rise .45s var(--ease) both}
.jobstrip{display:grid;grid-template-columns:auto 1fr;gap:14px;align-items:start;background:#fbeee8;border:1px solid rgba(194,94,68,.28);border-left:3px solid var(--terra);border-radius:16px;padding:13px 17px;margin:0 0 clamp(14px,1.8vw,20px);max-width:52em}
.jobstrip .jl{font-weight:700;letter-spacing:.09em;text-transform:uppercase;font-size:10.5px;color:var(--terra);white-space:nowrap;padding-top:3px}
.jobstrip .jt{font-size:clamp(14px,1.45vw,16.5px);color:var(--ink);line-height:1.42;text-wrap:pretty}
.jobstrip .jt b{color:var(--terra)}
.spot{transition:background .5s ease,box-shadow .5s ease;border-radius:4px;padding:0 2px}
.revealed-spot .spot{background:rgba(194,94,68,.18);box-shadow:0 0 0 3px rgba(194,94,68,.18)}
.rtable td.hidecell{color:transparent;background:repeating-linear-gradient(-45deg,rgba(194,94,68,.13) 0 7px,rgba(194,94,68,.03) 7px 14px);border-radius:6px;transition:color .45s ease,background .45s ease;user-select:none}
.revealed-fix .rtable td.hidecell{color:var(--body);background:none}
.report{background:var(--paper);border:1px solid var(--line);border-radius:20px;overflow:hidden;max-width:760px;box-shadow:0 24px 60px -34px rgba(14,31,22,.45)}
.report .rtop{display:flex;align-items:center;justify-content:space-between;padding:11px 20px;background:var(--forest);color:var(--card-text)}
.report .rtop .rt{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase}.report .rtop .rp{font-family:var(--mono);font-size:11px;color:var(--ph)}
.report .rbody{padding:clamp(20px,2.4vw,30px)}
.report h3{font-family:var(--display);font-weight:800;color:var(--ink);font-size:clamp(19px,2.1vw,26px);line-height:1.12;margin:0 0 .5em;letter-spacing:-.02em}
.report .rlede{font-style:italic;color:var(--body);font-size:clamp(14px,1.45vw,16.5px);line-height:1.5;margin:0 0 1em}
.report p{font-size:clamp(14.5px,1.45vw,16px);color:var(--body);line-height:1.6;margin:0 0 .8em;max-width:none}
.report .rbeat{display:grid;grid-template-columns:auto 1fr;gap:12px;padding:9px 0;border-top:1px solid var(--line)}.report .rbeat:first-of-type{border-top:none}
.report .rbeat .bl{font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--terra);padding-top:2px}
.report .rbeat .bx{font-size:clamp(14px,1.4vw,15.5px);color:var(--body);line-height:1.45}
.rtable{width:100%;border-collapse:collapse;margin-top:4px}
.rtable th{font-weight:700;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--terra);text-align:left;padding:0 12px 8px 0;vertical-align:top}
.rtable td{font-size:clamp(13.5px,1.35vw,15px);color:var(--body);padding:10px 12px 10px 0;border-top:1px solid var(--line);vertical-align:top;line-height:1.4}
.donotdo{margin-top:14px;background:#fbeee8;border:1px solid rgba(194,94,68,.3);border-left:3px solid var(--terra);border-radius:16px;padding:14px 18px;font-size:clamp(14.5px,1.45vw,16px);color:var(--ink);line-height:1.5;max-width:44em}.donotdo b{color:var(--terra)}
.caption{font-style:italic;color:var(--body);font-size:clamp(15px,1.6vw,19px);margin-top:14px;max-width:40em;text-wrap:pretty}
.forest .caption,.terra .caption{color:rgba(237,231,222,.9)}
.forest .ask,.terra .ask{color:#fff}
/* Split composition: the deck's alternative to the standard single column. */
.slide.split .wrap{max-width:1180px}
.splitgrid{display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(20px,3.5vw,56px);align-items:center}
.splitgrid>div{min-width:0}
@media (max-width:900px){.splitgrid{grid-template-columns:1fr;gap:22px}}
/* Elements that wait for a click rather than arriving with the slide. */
.build{opacity:0;transform:translateY(16px);transition:opacity .5s var(--ease),transform .5s var(--ease)}
.build.on{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.build{transition:none}}
.more{display:inline-flex;align-items:center;gap:7px;margin-top:14px;font-size:11px;font-weight:700;
  letter-spacing:.16em;text-transform:uppercase;color:var(--terra);opacity:.75}
.forest .more,.terra .more{color:var(--ph)}
.more i{font-style:normal;animation:aota-nudge 1.4s ease-in-out infinite}
@keyframes aota-nudge{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
@media (prefers-reduced-motion:reduce){.more i{animation:none}}
.anatomy{display:grid;grid-template-columns:1fr 1fr;gap:4px 30px;margin-top:8px;max-width:52em}
.arow{display:grid;grid-template-columns:auto 1fr;gap:13px;padding:9px 0;border-top:1px solid var(--line-dark);align-items:baseline}
.arow .an{font-family:var(--mono);color:var(--ph);font-size:12px;font-weight:700}
.arow .at{color:#fff;font-weight:700;font-size:clamp(14.5px,1.45vw,16.5px)}
.arow .ax{color:rgba(237,231,222,.78);font-size:13.5px;font-weight:400}
.terminal{background:var(--forest-card);border-radius:20px;overflow:hidden;box-shadow:0 30px 70px -34px rgba(0,0,0,.55);border:1px solid rgba(237,231,222,.09);max-width:860px}
.tbar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid rgba(237,231,222,.09)}
.dot{width:11px;height:11px;border-radius:50%}.dot.r{background:#e0655a}.dot.y{background:#e0b24f}.dot.g{background:#78b06a}
.tname{margin-left:8px;font-family:var(--mono);font-size:12px;color:#9fb0a2}
.copy{margin-left:auto;font-weight:700;font-size:12px;letter-spacing:.04em;color:var(--card-text);background:rgba(237,231,222,.09);border:1px solid rgba(237,231,222,.14);border-radius:999px;padding:6px 15px;cursor:pointer;transition:.2s;font-family:var(--sans)}
.copy:hover{background:var(--terra);border-color:var(--terra);color:#fff}.copy.done{background:#78b06a;border-color:#78b06a;color:#0e1f16}
.terminal pre{margin:0;padding:clamp(16px,1.9vw,24px) clamp(18px,2.2vw,28px);font-family:var(--mono);font-size:clamp(11px,1.05vw,13px);line-height:1.7;color:var(--card-text);white-space:pre-wrap;overflow-wrap:break-word;max-height:48vh;overflow:auto}
.ph{color:var(--ph)}
.templates{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:8px}
.tpl{background:var(--paper);border:1px solid var(--line);border-radius:20px;padding:20px;display:flex;flex-direction:column}
.tpl .ti{width:40px;height:40px;border-radius:12px;background:var(--terra);color:#fff;display:grid;place-items:center;font-family:var(--display);font-weight:800;font-size:19px;margin-bottom:12px}
.tpl .tt{font-family:var(--display);font-weight:800;color:var(--ink);font-size:clamp(16px,1.6vw,19px);line-height:1.12;margin-bottom:6px;letter-spacing:-.01em}
.tpl .tx{font-size:clamp(14px,1.4vw,15.5px);color:var(--body);line-height:1.45}
.tpl .tf{margin-top:auto;padding-top:12px;font-family:var(--mono);font-size:11px;color:var(--terra);letter-spacing:.04em}
.tpl-link{text-decoration:none;transition:border-color .2s,transform .2s,box-shadow .2s}
.tpl-link:hover{border-color:var(--terra);transform:translateY(-3px);box-shadow:0 18px 34px -22px rgba(14,31,22,.5)}
.tpl-link .tgo{display:inline-block;transition:transform .2s}
.tpl-link:hover .tgo{transform:translateX(4px)}
.stack{display:flex;flex-direction:column;gap:11px;margin-top:6px;max-width:44em}
.row{display:flex;gap:13px;align-items:flex-start;font-size:clamp(15px,1.5vw,17.5px)}
.row .tk{flex:0 0 22px;width:22px;height:22px;border-radius:50%;background:var(--terra);color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700;margin-top:2px}
.terra .row .tk{background:var(--forest);color:#fff}
.map{display:grid;gap:10px;margin-top:8px;max-width:47em}
.mrow{display:grid;grid-template-columns:1fr auto 1fr;gap:14px;align-items:center;background:rgba(237,231,222,.06);border:1px solid var(--line-dark);border-radius:16px;padding:12px 18px}
.mrow .fr{color:var(--card-text);font-size:clamp(15px,1.5vw,17px)}.mrow .to{color:#fff;font-weight:700;font-size:clamp(15px,1.5vw,17px)}
.mrow .via{color:var(--ph);font-weight:800;font-size:18px}.mrow .tg2{display:block;font-family:var(--mono);font-size:11px;color:var(--ph);margin-top:2px;letter-spacing:.03em}
.styles{display:grid;grid-template-columns:1fr 1fr;gap:clamp(14px,2vw,22px);margin-top:8px}
.sc{border-radius:20px;padding:clamp(17px,2.1vw,25px)}.sc.warm{background:var(--sand);border:1px solid var(--line)}.sc.bold{background:var(--forest);border:1px solid rgba(237,231,222,.12)}
.sc .st{font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-size:11px;margin:0 0 8px}.sc.warm .st{color:var(--terra)}.sc.bold .st{color:var(--ph)}
.sc.warm .ex{font-style:italic;color:var(--ink);font-size:clamp(15.5px,1.6vw,18px);line-height:1.4}
.sc.bold .ex{font-family:var(--display);font-weight:800;color:var(--cream);font-size:clamp(15.5px,1.6vw,18px);line-height:1.18;letter-spacing:-.02em}
.selfaudit{display:flex;flex-direction:column;gap:9px;margin-top:8px;max-width:46em}
.chk{display:flex;gap:14px;padding:13px 16px;background:var(--paper);border:1px solid var(--line);border-radius:16px;cursor:pointer;align-items:flex-start;user-select:none;transition:.15s}.chk:hover{border-color:var(--terra)}
.chk .cb{width:22px;height:22px;border-radius:7px;border:2px solid var(--muted);flex:0 0 auto;margin-top:1px;position:relative;transition:.15s}
.chk.on .cb{background:var(--terra);border-color:var(--terra)}.chk.on .cb::after{content:"";position:absolute;left:6px;top:1px;width:6px;height:12px;border:solid #fff;border-width:0 2px 2px 0;transform:rotate(45deg)}
.chk .ct{font-size:clamp(15px,1.5vw,17px);color:var(--ink);line-height:1.4}.chk.on .ct{color:var(--body)}
.wordmark{position:fixed;top:clamp(14px,2.2vw,24px);left:clamp(18px,3vw,42px);z-index:30;font-family:var(--display);font-weight:800;letter-spacing:-.05em;font-size:clamp(13px,1.3vw,16px);color:var(--ink);text-decoration:none;opacity:.75;transition:.2s}
.wordmark:hover{opacity:1}
.dark-ui .wordmark{color:var(--cream)}
.wordmark span{color:var(--terra)}.dark-ui .wordmark span{color:var(--ph)}
.terra-ui .wordmark{color:#fff}.terra-ui .wordmark span{color:var(--forest)}
.rail{position:fixed;left:clamp(18px,3vw,42px);top:50%;transform:translateY(-50%);height:min(60vh,540px);z-index:30}
.railline{position:absolute;left:5px;top:6px;bottom:6px;width:2px;background:rgba(140,150,135,.28)}.dark-ui .railline{background:rgba(237,231,222,.22)}
.railfill{position:absolute;left:5px;top:6px;width:2px;background:var(--terra);height:0;transition:height .6s var(--ease)}
.dark-ui .railfill{background:var(--ph)}
.terra-ui .railfill{background:var(--cream)}
.terra-ui .railline{background:rgba(245,245,240,.28)}
.terra-ui .node .nd{background:var(--terra);border-color:rgba(245,245,240,.45)}
.terra-ui .node.done .nd{background:var(--cream);border-color:var(--cream)}
.terra-ui .node.active .nd{background:var(--cream);border-color:var(--cream);box-shadow:0 0 0 5px rgba(245,245,240,.22)}
.terra-ui .node.active .nl{color:var(--cream)}
.terra-ui .count{color:#e8f1ea}
.terra-ui .progress{background:rgba(245,245,240,.16)}
.terra-ui .progress span{background:var(--cream)}
.terra-ui .ctrl{background:rgba(14,31,22,.55);color:#eef3ef;border-color:rgba(245,245,240,.3)}
.terra-ui .ctrl:hover{background:var(--cream);color:var(--forest);border-color:var(--cream)}
.dark-ui .node.done .nd{background:var(--ph);border-color:var(--ph)}
.dark-ui .node.active .nd{background:var(--ph);border-color:var(--ph);box-shadow:0 0 0 5px rgba(224,138,111,.18)}
.node{position:absolute;transform:translateY(-50%);display:flex;align-items:center;gap:11px;background:none;border:none;cursor:pointer;padding:0;color:var(--muted);font-family:var(--sans)}
.node .nd{width:12px;height:12px;border-radius:50%;background:var(--cream);border:2px solid rgba(140,150,135,.5);transition:.25s;flex:0 0 auto}
.dark-ui .node .nd{background:var(--forest);border-color:rgba(237,231,222,.4)}
.node .nl{font-size:12px;font-weight:700;opacity:0;transform:translateX(-6px);transition:.25s;white-space:nowrap}.node:hover .nl{opacity:.8;transform:none}
.node.done .nd{background:var(--terra);border-color:var(--terra)}
.node.active .nd{background:var(--terra);border-color:var(--terra);transform:scale(1.5);box-shadow:0 0 0 5px rgba(194,94,68,.16)}
.node.active .nl{opacity:1;transform:none;color:var(--terra)}.dark-ui .node.active .nl{color:var(--ph)}
.controls{position:fixed;bottom:clamp(14px,2.2vw,26px);right:clamp(14px,2.4vw,30px);z-index:40;display:flex;align-items:center;gap:8px}
.count{font-family:var(--mono);font-size:13px;color:var(--muted);margin-right:6px}
@media (max-width:560px){.count .ca{display:none}}.dark-ui .count{color:var(--ph)}
.ctrl{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:rgba(255,255,255,.85);color:var(--ink);cursor:pointer;display:grid;place-items:center;transition:.18s;backdrop-filter:blur(6px)}
.ctrl:hover{background:var(--terra);color:#fff;border-color:var(--terra)}
.ctrl svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.dark-ui .ctrl{background:rgba(21,42,28,.72);color:var(--card-text);border-color:var(--line-dark)}.dark-ui .ctrl:hover{background:var(--terra);color:#fff}
.progress{position:fixed;top:0;left:0;right:0;height:3px;background:rgba(194,94,68,.12);z-index:50}
.progress span{display:block;height:100%;width:0;background:var(--terra);transition:width .5s var(--ease)}
.menu{position:fixed;inset:0;z-index:60;background:rgba(14,31,22,.975);display:none;padding:clamp(40px,6vw,80px);overflow-y:auto}.menu.open{display:block}
.menu h3{font-family:var(--display);font-weight:800;color:var(--cream);font-size:clamp(22px,3vw,34px);margin:0 0 6px;letter-spacing:-.03em}
.menu .sub{color:var(--ph);font-family:var(--mono);font-size:13px;margin:0 0 clamp(22px,3vw,36px)}
.act{margin-bottom:clamp(16px,2.2vw,26px)}
.actlab{font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:var(--ph);margin:0 0 10px}
.mgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.mitem{text-align:left;background:rgba(237,231,222,.05);border:1px solid var(--line-dark);border-radius:14px;padding:13px 15px;cursor:pointer;color:var(--card-text);font-family:var(--sans);transition:.18s;display:flex;gap:11px;align-items:baseline}
.mitem:hover{background:var(--terra);border-color:var(--terra);color:#fff}
.mitem .mn2{font-family:var(--mono);color:var(--ph);font-size:12px;font-weight:700}.mitem:hover .mn2{color:#fff}
.mitem .mt{font-weight:700;font-size:13.5px;line-height:1.25}
.mclose{position:fixed;top:clamp(22px,4vw,40px);right:clamp(22px,4vw,44px);background:none;border:1px solid var(--line-dark);color:var(--cream);width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:20px}
.mclose:hover{background:var(--terra);border-color:var(--terra)}
@media (max-width:860px){.rail{display:none}.slide{padding-left:clamp(28px,6vw,110px)}}
@media (max-width:720px){
  /* The wordmark sits top-left, so the slide needs headroom to clear it. */
  .slide{padding-top:56px;padding-bottom:88px;padding-left:22px;padding-right:22px}
  .two{grid-template-columns:1fr}
  .jobstrip{grid-template-columns:1fr;gap:6px}
  .report .rbeat{grid-template-columns:1fr;gap:3px}
  .lenses,.qgroups,.facts{grid-template-columns:1fr}
  .myth{padding:14px 16px;gap:12px}
  .terminal pre{max-height:none;font-size:11.5px;line-height:1.6}
  .scroller{-webkit-overflow-scrolling:touch}
  .controls{bottom:12px;right:12px;gap:6px}
  .ctrl{width:38px;height:38px}
  .hint{margin-top:22px}
  .cover .cnum{font-size:clamp(56px,20vw,110px)}
  .ghost{font-size:clamp(150px,46vw,300px)}
}
/* Touch devices get the swipe wording; pointer devices get the key. */
.key-hint{display:inline}.swipe-hint{display:none}
@media (hover:none) and (pointer:coarse){.key-hint{display:none}.swipe-hint{display:inline}}
@media (max-width:720px){.styles,.quotes,.leave,.templates,.anatomy{grid-template-columns:1fr}.mrow{grid-template-columns:1fr;gap:5px}.slide{padding-bottom:92px}.rtable,.rtable tbody,.rtable tr,.rtable td,.rtable th{display:block}.rtable th{padding-top:8px}}
@media (prefers-reduced-motion:reduce){.slide{transition:none}.slide.reveal .anim,.slide.reveal .pop{animation:none;opacity:1}.cursor{animation:none}}
`;

// Animation delay helper for the staggered .anim entrances.
const d = (delay: string): CSSProperties => ({ '--d': delay }) as CSSProperties;

const pad = (n: number) => String(n).padStart(2, '0');

// Renders a prompt, tinting anything in [square brackets] as a placeholder.
function Terminal({ name, text }: { name: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* nothing else to try */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const parts = text.split(/(\[[^\]]+\])/g);

  return (
    <div className="terminal anim" style={d('.1s')}>
      <div className="tbar">
        <span className="dot r" />
        <span className="dot y" />
        <span className="dot g" />
        <span className="tname">{name}</span>
        <button className={`copy${copied ? ' done' : ''}`} onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre>
        {parts.map((p, i) =>
          p.startsWith('[') && p.endsWith(']') ? (
            <span className="ph" key={i}>
              {p}
            </span>
          ) : (
            p
          )
        )}
      </pre>
    </div>
  );
}

// ─── INTERACTIVE SLIDES ──────────────────────────────────────────────────────

function BriefSlide() {
  const [shown, setShown] = useState(false);
  return (
    <>
      <div className="eyebrow anim">
        My process<span className="stepc">1 &middot; Scope</span>
      </div>
      <h2 className="anim" style={d('.05s')}>
        Then the client tells you the problem
      </h2>
      <p className="anim" style={{ ...d('.1s'), maxWidth: '40em' }}>
        You have scoped it. Now Elena tells you what she thinks the problem is. Here is the brief
        that comes in.
      </p>
      <div className="msgcard anim" style={d('.18s')}>
        <div className="mh">
          <span className="av">E</span>
          <div>
            <div className="mfrom">Elena</div>
            <div className="mrole">Founder, Maple and Moss</div>
          </div>
        </div>
        <div className="mbody">
          "Everyone is talking about AI and I know we are behind. I want us to bring it in but I have
          no idea where to start. Can you come and tell us what to buy or build us something?"
        </div>
      </div>
      <p className="ask anim" style={d('.26s')}>
        She has told you what she wants. What do you do first?
      </p>
      <div className="replay anim" style={d('.32s')}>
        <span className="ic">&#9654;</span>
        <span>
          <b>On the replay:</b> decide your first move, then reveal.
        </span>
      </div>
      <div className="controls-row anim" style={d('.38s')}>
        <button className="btn" disabled={shown} onClick={() => setShown(true)}>
          {shown ? '✓ Revealed' : 'Reveal the trap →'}
        </button>
      </div>
      <div className={`answer${shown ? ' show' : ''}`}>
        <div className="punch show" style={{ display: 'block' }}>
          <b>The trap is taking the brief at face value.</b> She has handed you a solution, not a
          problem. The easy money is to nod, sell an AI project and start building. You do not. You
          go and look, then you listen, because the brief is what she believes, not what is true.
        </div>
      </div>
    </>
  );
}

function DiagnosisSlide() {
  const [shown, setShown] = useState(false);
  const [punch, setPunch] = useState(false);

  const reveal = () => {
    setShown(true);
    setTimeout(() => setPunch(true), 520);
  };

  return (
    <>
      <div className="eyebrow anim">
        My process<span className="stepc">4 &middot; Locate</span>
      </div>
      <h2 className="anim" style={d('.05s')}>
        So, what is really going on here?
      </h2>
      <p className="anim" style={{ ...d('.1s'), fontSize: 'clamp(16px,1.65vw,19px)' }}>
        Elena asked where to start with AI. You have looked and you have listened. So what is
        actually wrong here?
      </p>
      <div className="replay anim" style={d('.18s')}>
        <span className="ic">&#9654;</span>
        <span>
          <b>On the replay:</b> say it out loud, then reveal the findings.
        </span>
      </div>
      <div className="controls-row anim" style={d('.24s')}>
        <button className="btn" disabled={shown} onClick={reveal}>
          {shown ? '✓ Findings revealed' : 'Reveal the findings →'}
        </button>
      </div>
      <div className={`reveal-box${shown ? ' show' : ''}`}>
        <div className="reveal-inner">
          {[
            [
              'A job exists on paper and nowhere else',
              'Written on a sheet, photographed, sent to a chat group. Nothing structured survives.',
            ],
            [
              "The schedule lives in one person's head",
              'Six years of judgement. The spreadsheet is only the output.',
            ],
            [
              'Invoices are re-keyed by hand, weeks late',
              'Read off the photos, typed in again, so work gets missed entirely.',
            ],
            [
              'No question can be answered without a phone call',
              'Where is the team, is the job done, was it signed off.',
            ],
          ].map(([title, body], i) => (
            <div className="finding" key={i}>
              <span className="fnum">{i + 1}</span>
              <div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`punch${punch ? ' show' : ''}`}>
        <b>
          Elena asked where to start with AI. The honest answer is that she cannot start with AI at
          all.
        </b>{' '}
        Almost nothing about a job exists in a form a computer could read. Any AI you sold her today
        would sit on top of paper and a chat thread and tell her nothing. That gap is the whole
        report.
      </div>
    </>
  );
}

function SummarySlide() {
  const [spot, setSpot] = useState(false);
  return (
    <div className={spot ? 'revealed-spot' : undefined}>
      <div className="eyebrow anim">
        The report<span className="stepc">Section 01</span>
      </div>
      <h2 className="anim" style={d('.05s')}>
        The one page that does the work
      </h2>
      <div className="jobstrip anim" style={d('.1s')}>
        <span className="jl">Its job</span>
        <span className="jt">
          To be the only page a busy founder actually reads. It states the core truth in a sentence,
          lists the findings in brief and gives the recommendation.{' '}
          <b>If they read nothing else, they still know what you found.</b>
        </span>
      </div>
      <div className="report anim" style={d('.18s')}>
        <div className="rtop">
          <span className="rt">Maple and Moss &middot; Systems Audit</span>
          <span className="rp">Summary</span>
        </div>
        <div className="rbody">
          <h3>You do not have an AI problem yet.</h3>
          <p className="rlede">
            An assessment of how Maple and Moss runs today, what would have to be true before AI
            could help and the order to do it in.
          </p>
          <p>
            Maple and Moss has built something solid. Twelve years, twenty-four people and a
            reputation that wins work without much selling. The instinct that the business is falling
            behind on technology is correct. The conclusion that the answer is to buy some AI is not,
            at least not yet.
          </p>
          <p>
            <strong>The gap worth naming.</strong>{' '}
            <span className="spot">
              The brief was where do we start with AI. Every conversation pointed at something
              underneath it. AI needs something to read. Right now your operation leaves almost no
              readable trace.
            </span>
          </p>
        </div>
      </div>
      <p className="ask anim" style={d('.24s')}>
        One part of that page is doing most of the work. Which?
      </p>
      <div className="controls-row anim" style={d('.28s')}>
        <button className="btn" disabled={spot} onClick={() => setSpot(true)}>
          {spot ? '✓ There it is' : 'Show me →'}
        </button>
      </div>
      <p className="caption anim" style={d('.32s')}>
        It tells her the thing she did not want to hear, on page one, in the title, then names the
        gap outright. Bury that and the whole report is just a list of complaints.
      </p>
    </div>
  );
}

function RiskSlide() {
  const [fix, setFix] = useState(false);
  return (
    <div className={fix ? 'revealed-fix' : undefined}>
      <div className="eyebrow anim">
        The report<span className="stepc">Sections 05 and 08</span>
      </div>
      <h2 className="anim" style={d('.05s')}>
        Risk, plus the line that builds trust
      </h2>
      <div className="jobstrip anim" style={d('.1s')}>
        <span className="jl">Its job</span>
        <span className="jt">
          This is the section that makes a founder actually act, because it turns{' '}
          <b>a problem into a problem that compounds.</b> Same findings, read forward in time.
        </span>
      </div>
      <div className="report anim" style={d('.18s')}>
        <div className="rtop">
          <span className="rt">Maple and Moss &middot; Systems Audit</span>
          <span className="rp">Risk register</span>
        </div>
        <div className="rbody">
          <table className="rtable">
            <tbody>
              <tr>
                <th>Risk</th>
                <th>Today</th>
                <th>How it grows</th>
                <th>What removes it</th>
              </tr>
              <tr>
                <td>The business cannot see itself</td>
                <td>Job records exist only as photos in a chat thread</td>
                <td>Every new site adds volume nobody can count or report on</td>
                <td className="hidecell">A structured job record, captured once, on site</td>
              </tr>
              <tr>
                <td>Scheduling is one person deep</td>
                <td>Six years of judgement lives in Sam's head, not the system</td>
                <td>A leaver takes all of it with them</td>
                <td className="hidecell">Scheduling logic captured in a system the team shares</td>
              </tr>
              <tr>
                <td>AI cannot be adopted at all</td>
                <td>There is no readable data for any tool to work from</td>
                <td>The gap between ambition and reality widens each year</td>
                <td className="hidecell">
                  One reliable record of a job. The precondition for everything else
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="ask anim" style={d('.2s')}>
        Every risk needs a fix. What would you put in that last column?
      </p>
      <div className="controls-row anim" style={d('.24s')}>
        <button className="btn" disabled={fix} onClick={() => setFix(true)}>
          {fix ? '✓ Revealed' : 'Reveal what removes them →'}
        </button>
      </div>
      <div className="donotdo anim" style={d('.28s')}>
        <b>One thing not to do.</b> Do not buy an AI tool yet. Anything you bought today would sit on
        top of paper and a chat thread and tell you nothing you do not already know. Telling a client
        not to spend money, on the very thing they asked you for, is the single most trust-building
        line in the report.
      </div>
    </div>
  );
}

type Verdict = 'no' | 'yes' | 'maybe';

const MYTHS: { id: string; claim: string; answer: Verdict; label: string; why: string }[] = [
  {
    id: 'M1',
    claim: 'The main job of an audit is looking at what they have got.',
    answer: 'maybe',
    label: 'Bit of both',
    why: 'You do go in and look. It matters. But it is the easy half. The listening is where the finding actually comes from.',
  },
  {
    id: 'M2',
    claim: 'The founder usually knows what is really slowing their business down.',
    answer: 'no',
    label: 'Myth',
    why: 'What leadership believes and what the team lives rarely match. Elena was certain she needed AI. She needed a job record a computer could read.',
  },
  {
    id: 'M3',
    claim: 'You should give the audit away free to win the work that follows.',
    answer: 'no',
    label: 'Myth',
    why: 'Charge for it. A paid audit makes you the authority rather than a supplier hoping for the next job. A business values what it pays for.',
  },
  {
    id: 'M4',
    claim: 'Even if they say no to what you propose, the audit still pays off.',
    answer: 'yes',
    label: 'Fact',
    why: 'A no still makes you the person who understood them best. They remember it, they come back, they tell other people.',
  },
  {
    id: 'M5',
    claim: 'You should stick to one industry so you look like a specialist.',
    answer: 'no',
    label: 'Myth',
    why: 'Filter by size, not by sector. Staying open across industries means you learn faster and see opportunities you would otherwise miss.',
  },
  {
    id: 'M6',
    claim: 'You need to be able to fix everything you find.',
    answer: 'no',
    label: 'Myth',
    why: 'You will never fix all of it. Name it honestly, do the part that is yours, then have good partners for the rest.',
  },
];

const GUESS_LABELS: Record<Verdict, string> = { no: 'Myth', yes: 'Fact', maybe: 'Bit of both' };

function MythRevealSlide() {
  const [picks, setPicks] = useState<Record<number, Verdict | null>>({});
  const answeredCount = Object.keys(picks).length;
  const correct = MYTHS.filter((m, i) => picks[i] === m.answer).length;
  const allDone = answeredCount === MYTHS.length;

  const pick = (i: number, choice: Verdict | null) =>
    setPicks(p => (i in p ? p : { ...p, [i]: choice }));

  const revealAll = () =>
    setPicks(p => {
      const next = { ...p };
      MYTHS.forEach((_, i) => {
        if (!(i in next)) next[i] = null;
      });
      return next;
    });

  const tag = allDone ? (correct >= 5 ? '  nice work' : correct >= 3 ? '  not bad' : '') : '';

  return (
    <>
      <div className="eyebrow anim">Back to the gut check</div>
      <h2 className="anim" style={d('.05s')}>
        So, myth or fact?
      </h2>
      <p className="anim" style={{ ...d('.1s'), maxWidth: '44em' }}>
        You have seen enough to call these yourself now. Lock in a guess on each, watch your score or
        reveal the lot.
      </p>
      <div className="myths anim" style={d('.16s')}>
        {MYTHS.map((m, i) => {
          const answered = i in picks;
          return (
            <div className={`myth${answered ? ' answered' : ''}`} key={m.id}>
              <span className="mn">{m.id}</span>
              <div>
                <div className="ms">{m.claim}</div>
                <div className="guess">
                  {(['no', 'yes', 'maybe'] as Verdict[]).map(opt => {
                    let cls = 'gbtn';
                    if (answered) {
                      if (opt === m.answer) cls += ' correct';
                      else if (opt === picks[i]) cls += ' wrong';
                      else cls += ' miss';
                    }
                    return (
                      <button
                        type="button"
                        className={cls}
                        key={opt}
                        disabled={answered}
                        onClick={() => pick(i, opt)}
                      >
                        {GUESS_LABELS[opt]}
                      </button>
                    );
                  })}
                </div>
                <div className="verdict">
                  <span className={`vchip ${m.answer}`}>{m.label}</span>
                  <div className="vwhy">{m.why}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="controls-row anim" style={d('.24s')}>
        <button className="btn" disabled={allDone} onClick={revealAll}>
          {allDone ? '✓ Answers revealed' : 'Reveal the answers'}
        </button>
        <span className="myscore">
          {answeredCount ? `${correct} / ${MYTHS.length}${tag}` : ''}
        </span>
      </div>
    </>
  );
}

const SELF_AUDIT = [
  'You know a business that would let you look under the bonnet.',
  'You can ask the right questions and, more importantly, listen.',
  'You can turn a day of notes into a proper report with the prompts.',
  'You can price it, then offer discovery as the low-risk first step.',
];

function SelfAuditSlide() {
  const [on, setOn] = useState<boolean[]>(() => SELF_AUDIT.map(() => false));
  const fired = useRef(false);

  const toggle = (i: number) =>
    setOn(prev => {
      const next = prev.map((v, k) => (k === i ? !v : v));
      const all = next.every(Boolean);
      if (all && !fired.current) {
        fired.current = true;
        confetti();
      }
      if (!all) fired.current = false;
      return next;
    });

  return (
    <>
      <div className="shot anim">&#128248; Screenshot this</div>
      <div className="eyebrow anim" style={d('.04s')}>
        Your turn
      </div>
      <h2 className="anim" style={d('.08s')}>
        Could you run one? You already can.
      </h2>
      <p className="anim" style={{ ...d('.14s'), maxWidth: '40em' }}>
        Tick what you have. Anything you cannot tick is the only thing between you and your first
        paid audit.
      </p>
      <div className="selfaudit anim" style={d('.2s')}>
        {SELF_AUDIT.map((text, i) => (
          <div className={`chk${on[i] ? ' on' : ''}`} key={i} onClick={() => toggle(i)}>
            <span className="cb" />
            <span className="ct">{text}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function confetti() {
  if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const c = document.createElement('canvas');
  c.style.cssText =
    'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:200';
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr;
  c.height = innerHeight * dpr;
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  const cols = ['#C25E44', '#0e1f16', '#E08A6F', '#F5F5F0', '#B45309'];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight * 0.4,
    r: 5 + Math.random() * 6,
    col: cols[(Math.random() * cols.length) | 0],
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 3.5,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.32,
  }));
  const start = performance.now();
  const dur = 2600;
  const frame = (t: number) => {
    const el = t - start;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.045;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - el / dur);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.62);
      ctx.restore();
    });
    if (el < dur) requestAnimationFrame(frame);
    else c.remove();
  };
  requestAnimationFrame(frame);
}

// Lets a slide drive the deck it is sitting in.
const DeckNav = createContext<(n: number) => void>(() => {});

// How many build steps of the current slide have been revealed. A slide declaring
// `steps: n` absorbs the next n forward presses before the deck moves on.
const DeckStep = createContext(0);

// Wraps one unit of a build so it fades in once the deck reaches `at`.
function Build({ at, children }: { at: number; children: ReactNode }) {
  const step = useContext(DeckStep);
  return <div className={`build${step >= at ? ' on' : ''}`}>{children}</div>;
}

// The nudge that tells a presenter this slide has more to give before moving on.
function More({ at, label }: { at: number; label: string }) {
  const step = useContext(DeckStep);
  if (step > at) return null;
  return (
    <div className="more">
      {label} <i>&rarr;</i>
    </div>
  );
}

function GoSlide() {
  const go = useContext(DeckNav);
  return (
    <>
      <div className="shot anim">&#128248; Screenshot this</div>
      <div className="eyebrow anim" style={d('.04s')}>
        Go
      </div>
      <h1 className="d anim" style={d('.1s')}>
        Make it yours and <span className="hl pop">go and do one.</span>
      </h1>
      <p className="big anim" style={d('.3s')}>
        The first audit is the hardest. It is also the only hard one. Find a business you know.
        Listen harder than you look. Hand them something honest they did not have before.
      </p>
      <button className="btn anim" style={d('.48s')} onClick={() => go(0)}>
        Back to the start
      </button>
    </>
  );
}

// ─── SLIDE DECK ──────────────────────────────────────────────────────────────

type Tone = 'cream' | 'forest' | 'terra';
type Slide = {
  title: string;
  act: number;
  tone: Tone;
  cover?: boolean;
  /** Uses the wide two-column composition rather than the standard single column. */
  split?: boolean;
  /** Oversized numeral bled off the bottom-right corner. */
  ghost?: string;
  /** Forward presses this slide absorbs to build itself before the deck advances. */
  steps?: number;
  body: ReactNode;
};

const ACTS: { label: string; slide: number }[] = [
  { label: 'Open', slide: 0 },
  { label: 'Why now', slide: 1 },
  { label: 'My process', slide: 9 },
  { label: 'The report', slide: 30 },
  { label: 'Your templates', slide: 38 },
  { label: 'Get paid and go', slide: 40 },
];

const SLIDES: Slide[] = [
  // ── OPEN ──
  {
    title: 'The Art of the Audit',
    act: 0,
    tone: 'forest',
    body: (
      <>
        <div className="tag anim" style={d('.05s')}>
          VIBE CODING LAB &middot; LIVE SESSION
        </div>
        <h1 className="d anim" style={{ ...d('.16s'), marginTop: '.3em' }}>
          The Art of
          <br />
          the <span className="hl">Audit</span>
          <span className="cursor" />
        </h1>
        <p className="lead anim" style={d('.36s')}>
          Exactly how I run an audit, exactly what goes in the report and exactly what you are
          walking away with.
        </p>
        <div className="leave anim" style={d('.56s')}>
          {[
            ['01', 'My process', 'How I run an audit, start to finish.'],
            ['02', 'The report', 'Exactly what goes into it, on screen.'],
            ['03', 'Your templates', 'The resources you leave with today.'],
          ].map(([n, t, x]) => (
            <div className="lcard" key={n}>
              <div className="ln">{n}</div>
              <div className="lt">{t}</div>
              <div className="lx">{x}</div>
            </div>
          ))}
        </div>
        <div className="hint anim" style={d('.72s')}>
          <span className="key-hint">
            Press <span className="key">&rarr;</span> to begin
          </span>
          <span className="swipe-hint">Swipe to begin</span>
        </div>
      </>
    ),
  },

  // ── ACT 1: WHY NOW ──
  {
    title: 'Section 01: Why now',
    act: 1,
    tone: 'forest',
    cover: true,
    ghost: '01',
    body: (
      <>
        <div className="cnum anim">01</div>
        <h1 className="d anim" style={d('.14s')}>
          Why now
        </h1>
        <p className="lead anim" style={d('.3s')}>
          What changed, what this is and the myths worth busting first.
        </p>
      </>
    ),
  },
  {
    title: 'I have been doing this a while',
    act: 1,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Why now</div>
        <h2 className="anim" style={d('.05s')}>
          I have been running audits for years
        </h2>
        <p className="big anim" style={d('.12s')}>
          Long before any of this. They were useful. Clients valued them. They also took a very long
          time.
        </p>
        <p className="anim" style={d('.26s')}>
          Weeks of pulling notes together. Wrestling everything I had seen and heard into something
          structured and readable. The thinking was the quick part. The writing up was the slog. It
          is what made audits expensive to deliver and slow to turn around.
        </p>
      </>
    ),
  },
  {
    title: 'What changed',
    act: 1,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">Why now</div>
        <h1 className="d dsm anim" style={d('.06s')}>
          Then the tech caught up.
        </h1>
        <p className="big anim" style={d('.2s')}>
          I now run audits faster than I ever could, to a higher standard than I ever could.
        </p>
        <p className="anim" style={{ ...d('.34s'), maxWidth: '40em', fontSize: 'clamp(15.5px,1.6vw,18px)' }}>
          Not because AI does the audit. It does not. The looking and the listening are still
          entirely human. They always will be. But the collating, the structuring, the drafting, all
          the parts that used to eat weeks, now take hours. A team of eight is five or six hours of
          work, end to end.
        </p>
        <p className="pull anim" style={d('.48s')}>
          That is what makes this worth your time now. The economics changed.
        </p>
      </>
    ),
  },
  {
    title: 'What I am talking about',
    act: 1,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Be clear about the scope</div>
        <h2 className="anim" style={d('.05s')}>
          What I do and what I am giving you
        </h2>
        <p className="anim" style={{ ...d('.1s'), fontSize: 'clamp(16px,1.7vw,19px)' }}>
          To be straight with you about where I am coming from.
        </p>
        <div className="stack anim" style={d('.18s')}>
          <div className="row">
            <span className="tk">1</span>
            <span>
              <strong>My work is AI and systems consultancy.</strong> That is the space I audit in.
              It may well be a space you move into as you keep learning Claude and building apps.
              There is a lot of room in it.
            </span>
          </div>
          <div className="row">
            <span className="tk">2</span>
            <span>
              <strong>But that is not the point of today.</strong> What I am handing you is a
              framework. It applies to any kind of consultancy at all.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.34s')}>
          You do not have to become an AI consultant to use any of this.
        </p>
      </>
    ),
  },
  {
    title: 'You do not need to know everything',
    act: 1,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">The opportunity</div>
        <h2 className="anim" style={d('.05s')}>
          You do not need to be an expert in everything
        </h2>
        <p className="big anim" style={d('.12s')}>
          I am not. Nobody is. What I have is one thing I know deeply. I go in and look through it.
        </p>
        <p className="anim" style={d('.26s')}>
          For me that is systems. So I walk in, look, then say this is not working, you are losing
          ten hours a week here. I might not know the solution in the moment. That is fine. Spotting
          the problem is the value.
        </p>
        <p className="note anim" style={d('.38s')}>
          That is what consultants actually do. They understand how to evaluate something and reach a
          decision.
        </p>
      </>
    ),
  },
  {
    title: 'Lead with what you know',
    act: 1,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">The opportunity</div>
        <h1 className="d dsm anim" style={d('.06s')}>
          Systems is my thing.
          <br />
          Yours will be <span className="hl pop">something else.</span>
        </h1>
        <p className="big anim" style={d('.24s')}>
          This is the bit that matters. Do not copy my area of expertise. Lead with your own,
          whatever you already know better than the business you are walking into.
        </p>
        <div className="stack anim" style={d('.36s')}>
          {[
            'If content marketing is your area, you audit how they create, plan and repurpose their content, plus where that leaks time.',
            'If voice and delivery is your area, you audit how they show up, pitch and present.',
            'If coaching or operations is your area, you audit through that.',
          ].map((t, i) => (
            <div className="row" key={i}>
              <span className="tk">&rarr;</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <p className="pull anim" style={d('.5s')}>
          The process that follows is identical. Only your area of expertise changes.
        </p>
      </>
    ),
  },
  {
    title: 'They have not even started',
    act: 1,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">The opportunity</div>
        <h2 className="anim" style={d('.05s')}>
          Most businesses have not even started
        </h2>
        <p className="big anim" style={d('.12s')}>
          Forget the noise online telling everyone they are already behind. The businesses I walk
          into are good, solid, established companies. They are in the dark ages when it comes to
          their systems.
        </p>
        <p className="anim" style={d('.26s')}>
          They have systems, but the systems are miles behind the curve. Real example: a leadership
          team sat in an investor meeting hearing "Claude can do this, Claude can do that" and
          suggested inviting Claude to the next one, because they did not realise it was AI.
        </p>
        <p className="note anim" style={d('.38s')}>
          We have not hit the tipping point. There is still a wave to ride. Hardly anyone is on it.
        </p>
      </>
    ),
  },
  {
    title: 'Myth or fact (warm up)',
    act: 1,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Gut check</div>
        <h2 className="anim" style={d('.05s')}>
          Six things people believe about all this
        </h2>
        <p className="big anim" style={d('.12s')}>
          No answers yet. Just decide in your head, myth or fact, for each. We will settle them at
          the end, by which point you will already know.
        </p>
        <div className="myths anim" style={d('.2s')}>
          {MYTHS.map(m => (
            <div className="myth" key={m.id}>
              <span className="mn">{m.id}</span>
              <div>
                <div className="ms">{m.claim}</div>
                <div className="tg">Myth or fact?</div>
              </div>
            </div>
          ))}
        </div>
        <div className="replay anim" style={d('.3s')}>
          <span className="ic">&#9654;</span>
          <span>
            <b>On the replay:</b> pause, read all six and lock in your gut answer before you play on.
          </span>
        </div>
      </>
    ),
  },

  // ── ACT 2: MY PROCESS ──
  {
    title: 'Section 02: My process',
    act: 2,
    tone: 'forest',
    cover: true,
    ghost: '02',
    body: (
      <>
        <div className="cnum anim">02</div>
        <h1 className="d anim" style={d('.14s')}>
          My process
        </h1>
        <p className="lead anim" style={d('.3s')}>
          How I actually run an audit, in five steps, start to finish.
        </p>
      </>
    ),
  },
  {
    title: 'The framework',
    act: 2,
    tone: 'forest',
    steps: 4,
    body: (
      <>
        <div className="eyebrow anim">My process</div>
        <h1 className="d dsm anim" style={d('.08s')}>
          Every audit I run has the <span className="hl">same five moves.</span>
        </h1>
        <p className="anim" style={{ ...d('.18s'), maxWidth: '38em' }}>
          The first move sets it up. The next two take everything in. The last two make sense of it.
          That shape never changes, whatever the business and whatever you know best.
        </p>
        <div className="path anim" style={d('.28s')}>
          <Build at={0}>
            <div className="movement">
              <span className="ml">Set up</span>
              <span className="mline" />
            </div>
            <div className="pstep">
              <span className="pn">1</span>
              <div>
                <div className="pt">Scope the engagement</div>
                <div className="pd">
                  What you are looking at, who you will speak to, what they get.
                </div>
              </div>
            </div>
          </Build>
          <Build at={1}>
            <div className="movement">
              <span className="ml">Take it in</span>
              <span className="mline" />
            </div>
            <div className="pstep">
              <span className="pn">2</span>
              <div>
                <div className="pt">Observe the work</div>
                <div className="pd">How the business actually runs, not how it says it runs.</div>
              </div>
            </div>
          </Build>
          <Build at={2}>
            <div className="pstep">
              <span className="pn">3</span>
              <div>
                <div className="pt">Listen to the people</div>
                <div className="pd">The right questions, to the right people. The real skill.</div>
              </div>
            </div>
          </Build>
          <Build at={3}>
            <div className="movement">
              <span className="ml">Make sense of it</span>
              <span className="mline" />
            </div>
            <div className="pstep">
              <span className="pn">4</span>
              <div>
                <div className="pt">Locate the gap</div>
                <div className="pd">
                  Where what leadership believes and what the team lives diverge.
                </div>
              </div>
            </div>
          </Build>
          <Build at={4}>
            <div className="pstep">
              <span className="pn">5</span>
              <div>
                <div className="pt">Deliver the report</div>
                <div className="pd">
                  Turn what you saw and heard into the written thing they own.
                </div>
              </div>
            </div>
          </Build>
        </div>
        <More at={3} label="Build the moves" />
      </>
    ),
  },
  {
    title: 'Meet Maple and Moss',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="fic anim">&#9678; Fictional business</div>
        <div className="eyebrow anim" style={d('.04s')}>
          Setting the scene
        </div>
        <h2 className="anim" style={d('.08s')}>
          Meet Maple and Moss
        </h2>
        <p className="anim" style={{ ...d('.14s'), fontSize: 'clamp(16px,1.7vw,19px)' }}>
          <strong>Maple and Moss does not exist. I made it up.</strong> My real reports are full of
          real client data, so I cannot put them on a screen. Instead I built a business that behaves
          exactly like the ones I actually walk into, so I can show you everything rather than hiding
          half of it. Every name and number is invented. Every finding is one I have genuinely seen.
        </p>
        <p className="anim" style={d('.24s')}>
          Commercial grounds maintenance. Business parks, schools and housing developments. Elena
          started it twelve years ago with a van and one contract. Twenty-four staff now, eighteen
          out on the road in six teams and six in the office.
        </p>
        <div className="facts anim" style={d('.32s')}>
          {[
            ['24', 'Staff. The office has not grown with the contract book'],
            ['12 yrs', 'Trading, profitably, on effort rather than systems'],
            ['10 wks', 'Until their biggest ever contract adds 40% more sites'],
          ].map(([v, l]) => (
            <div className="fact" key={v}>
              <div className="fv">{v}</div>
              <div className="fl">{l}</div>
            </div>
          ))}
        </div>
        <p className="note anim" style={d('.42s')}>
          A good, solid business that has absorbed every bit of growth by working harder. Nobody has
          stopped to look.
        </p>
      </>
    ),
  },
  {
    title: 'Step 1: Scope the engagement',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">1 &middot; Scope</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Scope the engagement before you start
        </h2>
        <p className="big anim" style={d('.12s')}>
          Agree exactly what you are auditing, who you will speak to and how long you need. This is a
          paid piece of work, so scope it like one.
        </p>
        <div className="stack anim" style={d('.22s')}>
          {[
            'What you will look at, plus what is out of scope.',
            'Who you will speak to, across the team and not just the top.',
            'How long you need, plus exactly what they get at the end.',
          ].map((t, i) => (
            <div className="row" key={i}>
              <span className="tk">&#10003;</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <p className="note anim" style={d('.34s')}>
          The narrower and clearer the frame, the more the client trusts the finding.
        </p>
      </>
    ),
  },
  { title: 'Step 1: Meet the client', act: 2, tone: 'cream', body: <BriefSlide /> },
  {
    title: 'Step 1: Onsite and timings',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">1 &middot; Scope</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Go onsite if you possibly can
        </h2>
        <p className="anim" style={d('.1s')}>
          Onsite beats online every time. You see the work. You can talk to everyone who is in that
          day rather than waiting weeks for diary slots.
        </p>
        <div className="stack anim" style={d('.18s')}>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>A team of eight, onsite.</strong> One day there, then the report. Five or six
              hours of actual work, start to finish.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>A team of fifty, remote.</strong> Six weeks elapsed, but only fifteen to twenty
              hours of real work. The rest is waiting on diaries and system access.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.34s')}>
          The elapsed time is what scares people off. Look at the hours instead. This is not a
          complicated thing to do.
        </p>
      </>
    ),
  },
  {
    title: 'Step 2: Observe the work',
    act: 2,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">2 &middot; Observe</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Observe the work
        </h2>
        <p className="big anim" style={d('.12s')}>
          Before anyone speaks, you observe. How an order moves from click to doorstep, which tools
          people actually open, where the same thing gets entered twice.
        </p>
        <p className="note anim" style={d('.3s')}>
          You are mapping, not judging. Most of what matters is not in the systems, it is in how
          people move around them.
        </p>
      </>
    ),
  },
  {
    title: 'Step 2: The flashing lights',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">2 &middot; Observe</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          What you are looking for
        </h2>
        <div className="stack anim" style={d('.14s')}>
          {[
            'The spreadsheet that has quietly become the source of truth.',
            'The same number entered by hand in three places.',
            'The task only one person knows how to do.',
            'The workaround nobody ever wrote down.',
          ].map((t, i) => (
            <div className="row" key={i}>
              <span className="tk">!</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <p className="anim" style={{ ...d('.32s'), marginTop: '1.1em' }}>
          At Maple and Moss they all light up at once. Every job is written on paper, photographed
          and sent in on a chat group. The schedule is one spreadsheet only Sam can drive.{' '}
          <strong>Every workaround is a person quietly holding the business together.</strong>
        </p>
      </>
    ),
  },
  {
    title: 'Step 3: Listen to the people',
    act: 2,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen</span>
        </div>
        <h1 className="d dsm anim" style={d('.06s')}>
          Then you listen. Properly.
        </h1>
        <p className="big anim" style={d('.2s')}>
          This is the real skill. It is where the gold is. Who you listen to matters as much as how.
          The founder gives you the official story. The people whose day is shaped by the problem
          give you the real one.
        </p>
        <p className="pull anim" style={d('.36s')}>
          The founder can tell you the plan. Only the team can tell you where it breaks.
        </p>
      </>
    ),
  },
  {
    title: 'Be curious. It is the job.',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          The questions are not the warm up. They are the work.
        </h2>
        <p className="big anim" style={d('.12s')}>
          Everything good in the report comes from a question you thought to ask. So ask more of
          them. Ask the obvious ones too.
        </p>
        <div className="stack anim" style={d('.24s')}>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Curiosity is not nosiness.</strong> Nobody minds being asked about their own
              work. Most people are quietly delighted that somebody finally asked.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>You are not testing them.</strong> You are learning from them. That is a
              completely different energy and they can feel which one you are bringing.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>The daft question is often the best one.</strong> "Why is it done that way?" is
              where a lot of my findings have come from. Nobody in the business has asked it in
              years.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.38s')}>
          Never apologise for asking one more. The good report is on the other side of it.
        </p>
      </>
    ),
  },
  {
    title: 'Step 3: The questions',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          The questions that work on any business
        </h2>
        <p className="anim" style={d('.1s')}>
          Open questions that get someone describing their actual day, not rating a process. This
          bank does not care what you do or what the business does. Take it into any audit.
        </p>
        <div className="qgroups anim" style={d('.18s')}>
          <div>
            <p className="qgt">Set the scene</p>
            <div className="qline">
              What does a really good month look like, what does a bad one look like?
            </div>
            <div className="qline">Name the one thing you think is slowing you down.</div>
          </div>
          <div>
            <p className="qgt">The daily reality</p>
            <div className="qline">Walk me through your day, first thing to last.</div>
            <div className="qline">What takes far longer than it should?</div>
            <div className="qline">When you need a number you trust, where do you go?</div>
          </div>
          <div>
            <p className="qgt">Close</p>
            <div className="qline">If you could fix one thing here, what would it be?</div>
            <div className="qline keep">What have I not asked that I should have?</div>
          </div>
        </div>
        <p className="note anim" style={d('.3s')}>
          That last one is the most valuable question you will ask all day. Keep it.
        </p>
      </>
    ),
  },
  {
    title: 'The same questions, your area',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Those questions work anywhere. These are yours.
        </h2>
        <p className="anim" style={d('.1s')}>
          The bank on the last slide does not care what you do. Underneath it, you go deeper through
          your own area of expertise. Same curiosity, different specifics.
        </p>
        <div className="lenses anim" style={d('.18s')}>
          <div className="lens mine">
            <div className="lh">If systems is your area</div>
            <div className="lq">
              "When you need a number you actually trust, where do you go for it?"
            </div>
            <div className="lq">
              "What do you do by hand that you suspect a system should be doing?"
            </div>
            <div className="lq">
              "Show me what happens from a job coming in to the invoice going out."
            </div>
          </div>
          <div className="lens">
            <div className="lh">If content is your area</div>
            <div className="lq">
              "Where does an idea go, from someone having it to it being published?"
            </div>
            <div className="lq">
              "What gets posted because it is good, what gets posted because it is Tuesday?"
            </div>
            <div className="lq">"Who decides it is finished?"</div>
          </div>
          <div className="lens">
            <div className="lh">If delivery is your area</div>
            <div className="lq">
              "Walk me through the last time you had to present. What happened in the room?"
            </div>
            <div className="lq">"Which part do you dread?"</div>
            <div className="lq">
              "When you are asked something you have not prepared for, what do you do?"
            </div>
          </div>
        </div>
        <p className="note anim" style={d('.32s')}>
          Notice they are all the same question underneath: show me what actually happens, not what
          is supposed to happen.
        </p>
      </>
    ),
  },
  {
    title: 'Always ask to record',
    act: 2,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen</span>
        </div>
        <h1 className="d dsm anim" style={d('.06s')}>
          Always ask if you can <span className="hl">record it.</span>
        </h1>
        <p className="anim" style={{ ...d('.18s'), maxWidth: '38em', fontSize: 'clamp(16px,1.7vw,20px)' }}>
          Every conversation, every time, even when I am sitting in their office. I ask, then I do
          not record unless they say yes.
        </p>
        <div className="stack anim" style={d('.28s')}>
          <div className="row">
            <span className="tk">&rarr;</span>
            <span>
              <strong>You stop scribbling and start listening.</strong> You are looking at them,
              following what they say, asking the next question. That changes the entire
              conversation.
            </span>
          </div>
          <div className="row">
            <span className="tk">&rarr;</span>
            <span>
              <strong>The transcript does the heavy lifting.</strong> It goes to AI, then chunks of
              the report get written from what people actually said, in their words, not my
              paraphrase of my notes from three days ago.
            </span>
          </div>
          <div className="row">
            <span className="tk">&rarr;</span>
            <span>
              <strong>People feel properly listened to.</strong> Because they were. And they can
              tell, because their own words come back in the report.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.44s')}>
          Always ask. Never record without a yes. If someone says no, that is completely fine, take
          notes and carry on.
        </p>
      </>
    ),
  },
  {
    title: 'Step 3: What comes back',
    act: 2,
    tone: 'cream',
    split: true,
    steps: 2,
    body: (
      <div className="splitgrid">
        <div>
          <div className="eyebrow anim">
            My process<span className="stepc">3 &middot; Listen</span>
          </div>
          <h2 className="anim" style={d('.05s')}>
            So you ask. Here is what comes back
          </h2>
          <p className="note anim" style={{ ...d('.26s'), marginTop: '.4em' }}>
            Nobody said the word AI once. None of this was in the brief. It only shows up when you
            ask the right person and listen to the answer.
          </p>
          <More at={1} label="One at a time" />
        </div>
        <div className="quotes anim" style={d('.14s')}>
          {[
            [
              'Marcus',
              'Team leader, on the road',
              '"I write the job up on paper, take a photo of it and send it to the group. Been doing it nine years."',
            ],
            [
              'Sam',
              'Operations lead',
              '"I build the schedule every Thursday. It is all in my head, really. The spreadsheet is just where it ends up."',
            ],
            [
              'Dan',
              'Accounts',
              '"I invoice by scrolling back through the photos. It takes days. I know I miss things."',
            ],
          ].map(([n, r, q], k) => (
            <Build at={k} key={n}>
              <div className="quote">
                <div className="qn">{n}</div>
                <div className="qr">{r}</div>
                <div className="qt">{q}</div>
              </div>
            </Build>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: 'Prompt: prepare your questions',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">3 &middot; Listen &middot; your tool</span>
        </div>
        <Terminal name="audit-questions.prompt" text={QUESTIONS_PROMPT} />
        <p className="note anim" style={d('.24s')}>
          Run this before you go in. You walk in with the right questions rather than a generic list.
        </p>
      </>
    ),
  },
  {
    title: 'When you do not know, say so',
    act: 2,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">Throughout</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          When you do not know, say so
        </h2>
        <p className="big anim" style={d('.12s')}>
          On a recent audit the team asked whether they should move their accounting software. My
          answer was: I do not know.
        </p>
        <p className="anim" style={d('.26s')}>
          And then, depending on the engagement, I am happy to go away, research it properly and come
          back with what I found and why one route might suit them better. What I will not do is
          guess on the spot to look clever.
        </p>
        <p className="note anim" style={d('.38s')}>
          There are so many options for everything now that nobody could reasonably expect you to
          know them all. Honesty in the room is what makes them trust the report.
        </p>
      </>
    ),
  },
  {
    title: 'Their tech stack does not matter',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">Throughout</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          It does not matter what they are running
        </h2>
        <p className="big anim" style={d('.12s')}>
          Teams and Copilot, Google and Gemini, something else entirely. From an audit perspective it
          makes no difference.
        </p>
        <p className="anim" style={d('.26s')}>
          You are going in to find the gaps. If you can build them a solution, offer it. If their
          stack is not something you work with, you share what you know about its limits,{' '}
          <strong>collect your audit fee and move on.</strong> The audit still stands on its own.
        </p>
        <p className="note anim" style={d('.38s')}>
          Pick the tools you know properly and stop trying to learn all of them. Depth in one thing
          is what makes you useful, not a shallow map of everything.
        </p>
      </>
    ),
  },
  {
    title: 'Step 4: Locate the gap',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">4 &middot; Locate</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Locate the gap
        </h2>
        <p className="big anim" style={d('.12s')}>
          Now you compare what leadership believes against what the team lives. The distance between
          the two is usually the whole finding.
        </p>
        <p className="note anim" style={d('.28s')}>
          You are also spotting the bottlenecks and the risks that grow with the business. A problem
          is never just a problem. It is a problem that compounds.
        </p>
      </>
    ),
  },
  { title: 'Step 4: The diagnosis', act: 2, tone: 'cream', body: <DiagnosisSlide /> },
  {
    title: 'Step 5: Deliver the report',
    act: 2,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">5 &middot; Deliver</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Deliver the report
        </h2>
        <p className="big anim" style={d('.12s')}>
          You have a pile of observations and a pile of feedback. Collating is shaping them into one
          structured written report.
        </p>
        <p className="note anim" style={d('.28s')}>
          The listening was human. The write-up does not have to be. This is where AI earns its keep.
          You draft fast, then read every line as yourself.
        </p>
      </>
    ),
  },
  {
    title: 'Prompt: notes into a draft',
    act: 2,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          My process<span className="stepc">5 &middot; Deliver &middot; your tool</span>
        </div>
        <Terminal name="audit-report.prompt" text={REPORT_PROMPT} />
      </>
    ),
  },

  // ── ACT 3: THE REPORT ──
  {
    title: 'Section 03: The report',
    act: 3,
    tone: 'forest',
    cover: true,
    ghost: '03',
    body: (
      <>
        <div className="cnum anim">03</div>
        <h1 className="d anim" style={d('.14s')}>
          The report
        </h1>
        <p className="lead anim" style={d('.3s')}>
          Exactly what goes into the written deliverable, on screen.
        </p>
      </>
    ),
  },
  {
    title: 'What goes in the report',
    act: 3,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">The report</div>
        <h1 className="d dsm anim" style={d('.08s')}>
          The anatomy of a <span className="hl">strong audit report</span>
        </h1>
        <p className="anim" style={{ ...d('.18s'), maxWidth: '38em', fontSize: 'clamp(16px,1.7vw,20px)' }}>
          A cover and ten sections, the same every time. Each one has a job to do.
        </p>
        <p className="anim" style={{ ...d('.24s'), maxWidth: '38em' }}>
          We are not going to crawl through all ten. Next we open up the ones that do the heavy
          lifting, on screen, in the real Maple and Moss report. For each one I will tell you exactly
          what it is doing and why it is there.
        </p>
        <div className="anatomy anim" style={d('.28s')}>
          {[
            ['●', 'The cover', 'who it is for, what you assessed'],
            ['01', 'The summary', 'the whole thing on a page'],
            ['02', 'The context', 'where they are heading'],
            ['03', 'What you looked at', 'and who you listened to'],
            ['04', 'The findings', 'the same four parts, every time'],
            ['05', 'The risk register', 'ordered by growth'],
            ['06', 'The cost of standing still', ''],
            ['07', 'What good looks like', ''],
            ['08', 'The roadmap', 'and the do-not-do'],
            ['09', 'The proposal', 'priced'],
            ['10', 'The appendix', 'what you did not assess'],
          ].map(([n, t, x], i) => (
            <div className="arow" key={i}>
              <span className="an">{n}</span>
              <span className="at">
                {t} {x && <span className="ax">{x}</span>}
              </span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  { title: 'Report: the summary', act: 3, tone: 'cream', body: <SummarySlide /> },
  {
    title: 'Report: context and listening',
    act: 3,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          The report<span className="stepc">Sections 02 and 03</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          Why it matters now and who you heard it from
        </h2>
        <div className="jobstrip anim" style={d('.1s')}>
          <span className="jl">Its job</span>
          <span className="jt">
            Two short sections doing two jobs. Context gives the findings{' '}
            <b>a reason to matter today</b> rather than one day. And naming who you spoke to is what
            makes the finding credible, because it is grounded in their people rather than your
            opinion.
          </span>
        </div>
        <div className="report anim" style={d('.18s')}>
          <div className="rtop">
            <span className="rt">Maple and Moss &middot; Systems Audit</span>
            <span className="rp">Context</span>
          </div>
          <div className="rbody">
            <p className="rlede">
              A short section that gives the findings a reason to matter today, plus shows whose word
              they rest on.
            </p>
            <p>
              <strong>Where they are heading.</strong> The contract book has grown for four years and
              the operation absorbed it through effort rather than systems. The office team has not
              grown with it. The biggest contract in the company's history starts in ten weeks and
              adds forty per cent more sites. That is what makes this urgent rather than interesting.
            </p>
            <p>
              <strong>What you looked at and who you listened to.</strong> One day onsite plus five
              conversations, with the founder, the operations lead, the office coordinator, accounts
              and a team leader, including a morning out in a van. The findings are drawn from the
              team, not just the top.
            </p>
          </div>
        </div>
        <p className="caption anim" style={d('.26s')}>
          Naming who you spoke to is what makes the finding credible. It is grounded in the people,
          not your assumptions.
        </p>
      </>
    ),
  },
  {
    title: 'Report: a finding',
    act: 3,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          The report<span className="stepc">Section 04</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          How I write every finding
        </h2>
        <div className="jobstrip anim" style={d('.1s')}>
          <span className="jl">Its job</span>
          <span className="jt">
            The findings are the heart of the report. This is the shape I use for every single one.
            Four parts, always in this order, so the reader travels from{' '}
            <b>what is happening, to why they should care, to why it gets worse if they do nothing.</b>
          </span>
        </div>
        <div className="report anim" style={d('.18s')}>
          <div className="rtop">
            <span className="rt">Maple and Moss &middot; Systems Audit</span>
            <span className="rp">Section 04 &middot; Finding 01</span>
          </div>
          <div className="rbody">
            <h3>A job exists on paper and nowhere else</h3>
            {[
              [
                'What is happening',
                'Every job is written on a paper sheet on site, photographed at the end of the day and sent into the office on a chat group.',
              ],
              [
                'The workaround',
                'Marcus has done it this way for nine years and is fast at it. Someone in the office reads the photograph and acts on it.',
              ],
              [
                'Why it matters',
                'Once that photo lands in a chat thread the job is gone. It cannot be searched, counted, reported on or checked. It is an image in a conversation.',
              ],
              [
                'How it compounds',
                'Forty per cent more sites in ten weeks. It is also the single reason AI cannot help this business today. There is nothing for it to read.',
              ],
            ].map(([l, x]) => (
              <div className="rbeat" key={l}>
                <span className="bl">{l}</span>
                <span className="bx">{x}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="caption anim" style={d('.26s')}>
          Same shape every time. Always about the process, never a person.
        </p>
      </>
    ),
  },
  { title: 'Report: risk and the hard call', act: 3, tone: 'forest', body: <RiskSlide /> },
  {
    title: 'Report: the roadmap',
    act: 3,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          The report<span className="stepc">Section 08</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          What to do first, in what order
        </h2>
        <div className="jobstrip anim" style={d('.1s')}>
          <span className="jl">Its job</span>
          <span className="jt">
            To turn a pile of problems into <b>a sequence they can start on Monday.</b> Most painful
            thing first, something usable at every stage, plus quick wins that cost nothing and wait
            on no one.
          </span>
        </div>
        <div className="report anim" style={d('.18s')}>
          <div className="rtop">
            <span className="rt">Maple and Moss &middot; Systems Audit</span>
            <span className="rp">Roadmap</span>
          </div>
          <div className="rbody">
            <p>
              <strong>Before the new contract, the next ten weeks.</strong> Get jobs off paper. One
              structured job record captured on site, replacing the sheet and the photo. The contract
              is the deadline.
            </p>
            <p>
              <strong>Then, in order.</strong> Connect that record to invoicing. Then bring
              scheduling in. Then, only then, look at AI properly, when there is real data and the
              conversation can be specific.
            </p>
            <p>
              <strong>Quick wins, straight away.</strong> Back up the scheduling spreadsheet daily
              and agree who owns it. Ask Sam to spend an hour writing down the rules they use to
              build the schedule. Neither waits on a build.
            </p>
          </div>
        </div>
        <p className="caption anim" style={d('.26s')}>
          Solve the most painful thing first, then deliver something usable at every step, so the
          team feels progress rather than promise.
        </p>
      </>
    ),
  },
  {
    title: 'Report: the proposal',
    act: 3,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          The report<span className="stepc">Section 09</span>
        </div>
        <h2 className="anim" style={d('.05s')}>
          And then, the work
        </h2>
        <div className="jobstrip anim" style={d('.1s')}>
          <span className="jl">Its job</span>
          <span className="jt">
            The only section that is optional. Everything above stands on its own and is already
            worth the fee. This is where you say <b>what you could do next and what it costs.</b>
          </span>
        </div>
        <div className="report anim" style={d('.18s')}>
          <div className="rtop">
            <span className="rt">Maple and Moss &middot; Systems Audit</span>
            <span className="rp">Proposal</span>
          </div>
          <div className="rbody">
            <h3>Start small, with a paid first step</h3>
            <p>
              <strong>Discovery.</strong> A short, paid piece of work that turns this audit into a
              defined build plan: exactly what the job record captures, how it connects to the
              accounting software and a firm price. You own the plan whether or not you go further.
            </p>
            <p>
              <strong>The build.</strong> The job record first, then invoicing, then scheduling.
              Priced individually, commissioned in the order that suits the business.
            </p>
            <p>
              <strong>On the numbers.</strong> This audit is charged at &pound;3,500, credited in
              full against Discovery. Discovery is then credited against the build. Every step
              already paid for rolls into the next.
            </p>
          </div>
        </div>
        <p className="caption anim" style={d('.26s')}>
          Nine times out of ten my report ends with a proposal. It does not have to be a build. Nor
          does it have to be shaped like this one. It can be training, an ongoing service or whatever
          you are genuinely best placed to do. This one happens to need a discovery phase first
          because the build is big. Plenty do not.
        </p>
      </>
    ),
  },

  // ── ACT 4: YOUR TEMPLATES ──
  {
    title: 'Section 04: Your templates',
    act: 4,
    tone: 'forest',
    cover: true,
    ghost: '04',
    body: (
      <>
        <div className="cnum anim">04</div>
        <h1 className="d anim" style={d('.14s')}>
          Your templates
        </h1>
        <p className="lead anim" style={d('.3s')}>
          What you are walking away with today.
        </p>
      </>
    ),
  },
  {
    title: 'Your templates',
    act: 4,
    tone: 'cream',
    body: (
      <>
        <div className="shot anim">&#128248; It is all in your classroom</div>
        <div className="eyebrow anim" style={d('.04s')}>
          Your templates
        </div>
        <h2 className="anim" style={d('.08s')}>
          What you are walking away with
        </h2>
        <p className="anim" style={{ ...d('.12s'), maxWidth: '40em' }}>
          You do not start any of this from a blank page. Three things are waiting for you.
        </p>
        <div className="templates anim" style={d('.2s')}>
          {[
            {
              ic: '✎',
              t: 'The field guide',
              x: 'The whole method in your pocket, with the question bank and every prompt.',
              f: 'READ AND KEEP',
            },
            {
              ic: '▣',
              t: 'The report template',
              x: 'The full Maple and Moss report, all ten chapters. Keep the shape, swap in your client, write it in your voice.',
              f: 'OPEN THE REPORT',
              to: '/sampleauditreport',
            },
            {
              ic: '⌂',
              t: 'The three prompts',
              x: 'Prepare your questions, turn notes into a draft, find your first client.',
              f: 'COPY AND RUN',
              to: '/auditprompts',
            },
          ].map(({ ic, t, x, f, to }) => {
            const inner = (
              <>
                <div className="ti">{ic}</div>
                <div className="tt">{t}</div>
                <div className="tx">{x}</div>
                <div className="tf">
                  {f}
                  {to && <span className="tgo"> &rarr;</span>}
                </div>
              </>
            );
            return to ? (
              <Link className="tpl tpl-link" key={t} to={to} target="_blank" rel="noopener">
                {inner}
              </Link>
            ) : (
              <div className="tpl" key={t}>
                {inner}
              </div>
            );
          })}
        </div>
      </>
    ),
  },

  // ── ACT 5: GETTING PAID ──
  {
    title: 'Section 05: Getting paid',
    act: 5,
    tone: 'forest',
    cover: true,
    ghost: '05',
    body: (
      <>
        <div className="cnum anim">05</div>
        <h1 className="d anim" style={d('.14s')}>
          Getting paid, then go
        </h1>
        <p className="lead anim" style={d('.3s')}>
          How to price it, who to partner with and why one good audit keeps paying.
        </p>
      </>
    ),
  },
  {
    title: 'Charge for the audit',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          Myth 3: give it away to win the work that follows
        </h2>
        <p className="big anim" style={d('.12s')}>
          The opposite. Charge for the audit. A paid piece of work makes you the trusted authority
          rather than a supplier hoping for the next job.
        </p>
        <p className="anim" style={d('.26s')}>
          And a business values what it pays for. A free audit gets skimmed and shelved. A paid one
          gets read by the person who signed it off, then taken to the board.
        </p>
        <p className="note anim" style={d('.38s')}>
          Everything after this slide is about how to work out your number. Not mine.
        </p>
      </>
    ),
  },
  {
    title: 'What you are actually pricing',
    act: 5,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          You are not selling your hours
        </h2>
        <p className="big anim" style={d('.12s')}>
          Price by the hour and two things happen. You race to the bottom. You get punished every
          time you get faster. Do not do it.
        </p>
        <p className="anim" style={d('.24s')}>
          You are pricing two things instead. <strong>The depth of the listening</strong>, which is
          how many people you have to talk to and how tangled it is to map. And{' '}
          <strong>what the finding is worth to them</strong>, which is usually a lot more than you
          think.
        </p>
        <p className="note anim" style={d('.36s')}>
          A business that has been losing a day a week for three years is not buying your afternoon.
          It is buying the day back.
        </p>
      </>
    ),
  },
  {
    title: 'What moves the number',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          What moves your number up and down
        </h2>
        <p className="anim" style={d('.1s')}>
          Work out your own baseline, then let these move it. They are the honest drivers. You can
          say every one of them out loud to a client.
        </p>
        <div className="two anim" style={d('.18s')}>
          <div className="tcard">
            <div className="th">Pushes it up</div>
            <ul>
              {[
                'More people to listen to. Every extra voice is another conversation.',
                'More sites, entities or systems to map.',
                'Remote rather than onsite. More elapsed faff, more chasing.',
                'Research and follow-up you agree to do afterwards.',
                'A report that has to stand up to a board or an investor.',
              ].map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="tcard">
            <div className="th">Pulls it down</div>
            <ul>
              {[
                'One location, one day, a small team.',
                'A tight, single-question scope rather than the whole business.',
                'A business you already know well.',
                'Your first one, where you are deliberately buying a case study.',
              ].map(t => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="note anim" style={d('.32s')}>
          Pricing your first one low is a decision, not a default. Make it on purpose, once, knowing
          exactly what you are buying with it.
        </p>
      </>
    ),
  },
  {
    title: 'My number is not your number',
    act: 5,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h1 className="d dsm anim" style={d('.06s')}>
          My number is not <span className="hl pop">your number.</span>
        </h1>
        <p className="big anim" style={d('.2s')}>
          So that you have a real data point rather than a shrug: I charge from &pound;3,500. It
          scales with team size and complexity. A solo brand sits at the entry point. A thirty person
          operation across two entities sits well above it.
        </p>
        <p className="anim" style={{ ...d('.34s'), maxWidth: '40em', fontSize: 'clamp(15.5px,1.6vw,18px)' }}>
          That is not a rule. It is where I landed after years, in my market, doing what I do, for
          the kind of businesses I audit. Yours will be different and it should be.
        </p>
        <p className="pull anim" style={d('.46s')}>
          The test is not what I charge. It is whether you can say your number out loud without
          apologising for it.
        </p>
      </>
    ),
  },
  {
    title: 'The credit: what it is',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          The credit and where it actually comes in
        </h2>
        <p className="anim" style={{ ...d('.1s'), fontSize: 'clamp(16px,1.7vw,19px)' }}>
          This one needs context, because it is not a pricing structure. It is a single move. It
          happens at one specific moment.
        </p>
        <div className="stack anim" style={d('.18s')}>
          <div className="row">
            <span className="tk">1</span>
            <span>
              You run the audit. They pay you for it. That piece of work is{' '}
              <strong>complete and already worth what they paid.</strong>
            </span>
          </div>
          <div className="row">
            <span className="tk">2</span>
            <span>
              Your report ends with a proposal for something bigger you could do next. A build, an
              implementation, training, whatever it is.
            </span>
          </div>
          <div className="row">
            <span className="tk">3</span>
            <span>
              <strong>That is the moment.</strong> Only on that proposal do you offer to knock what
              they paid for the audit off the price of the larger engagement.
            </span>
          </div>
        </div>
        <p className="pull anim" style={d('.32s')}>
          "The &pound;3,500 you have already paid me comes off this."
        </p>
        <p className="note anim" style={d('.42s')}>
          It answers the quiet objection before they say it out loud, which is "we have already spent
          money on this". They have not. They have put a deposit on the next thing.
        </p>
      </>
    ),
  },
  {
    title: 'The credit is your call',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          Offer it when it stacks. Not because you feel you should.
        </h2>
        <p className="anim" style={d('.1s')}>
          This is a lever you choose to pull, not something they are owed. Run the numbers on the
          engagement in front of you and pick one of three.
        </p>
        <div className="stack anim" style={d('.18s')}>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>The lot.</strong> The engagement is big enough to absorb it without touching
              your margin. It makes a large number much easier to say yes to.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Some of it.</strong> The numbers are tighter, so you credit a percentage. Still
              a gesture, still does the job, does not cost you the job.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>None of it.</strong> It does not stack, so you do not offer it. That is a
              perfectly good answer. They paid for an audit and they got an audit.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.32s')}>
          And whatever you offer, put a date on it. Ninety days is plenty. Otherwise the offer drifts
          and you are still honouring last year's price on a job that starts next spring.
        </p>
      </>
    ),
  },
  {
    title: 'Two habits worth building',
    act: 5,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          Two habits worth building
        </h2>
        <p className="anim" style={d('.1s')}>
          Whatever number you land on, these two make it far easier to say out loud and far easier to
          say yes to.
        </p>
        <div className="stack anim" style={d('.18s')}>
          <div className="row">
            <span className="tk">1</span>
            <span>
              <strong>Offer a choice, never one flat number.</strong> Let them pick how hands-on you
              are or how much of it you do. A choice turns the conversation into which one, rather
              than whether at all. That is a far easier yes.
            </span>
          </div>
          <div className="row">
            <span className="tk">2</span>
            <span>
              <strong>Be honest about what you cannot know yet.</strong> Where the work is not nailed
              down, say so, give your best estimate and confirm the firm number once it is. "This is
              my best estimate and I will confirm it once I know more" builds more trust than a
              confident guess ever will.
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    title: 'A no still wins',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          A no still wins. And your first client knows you
        </h2>
        <div className="stack anim" style={d('.14s')}>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Even when they say no to what you propose,</strong> a good audit makes you the
              person who understood their problem better than they did. They remember it. They come
              back.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>You do not need cold outreach.</strong> Your first client is almost certainly
              someone you already know. Start with a business in your own network, drowning in admin.
            </span>
          </div>
        </div>
        <p className="note anim" style={d('.3s')}>
          And you do not have to open with a full audit. A single focused job is a fine first sale,
          plus a gentler way in.
        </p>
      </>
    ),
  },
  {
    title: 'Prompt: find your first client',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">
          Get paid<span className="stepc">Your tool</span>
        </div>
        <Terminal name="first-client.prompt" text={FIRST_CLIENT_PROMPT} />
      </>
    ),
  },
  {
    title: 'You cannot fix everything',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          You hand them the report. Then they ask the question.
        </h2>
        <p className="big anim" style={d('.12s')}>
          "So how do I fix all of that?"
        </p>
        <p className="anim" style={d('.26s')}>
          You have just laid out the findings and the risks. Some of it you can build. Some of it you
          cannot. Some of it you would not want to. If I spot a big governance gap, that is not my
          area or my interest, but I have still noticed it.
        </p>
        <p className="note anim" style={d('.38s')}>
          Saying "that is not in my wheelhouse" is not a failure. Leaving them stuck with a list and
          no way forward is.
        </p>
      </>
    ),
  },
  {
    title: 'Finding good partners',
    act: 5,
    tone: 'terra',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h1 className="d dsm anim" style={d('.06s')}>
          Finding good partners is part of a good audit.
        </h1>
        <p className="big anim" style={d('.2s')}>
          Build a little black book of people who do the things you do not. Then you can say: that is
          not me, but this person is an expert in exactly that.
        </p>
        <div className="stack anim" style={d('.32s')}>
          {[
            'The client gets a real route forward rather than a dead end.',
            'You step back. There is usually a referral fee in it.',
            'You are making good connections. It works both ways.',
          ].map(t => (
            <div className="row" key={t}>
              <span className="tk">&#10003;</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    title: 'Recurring service revenue',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          The proposal does not have to be a one-off
        </h2>
        <p className="big anim" style={d('.12s')}>
          A build is one payday. Some of what you find is better answered by something ongoing.
        </p>
        <p className="anim" style={d('.26s')}>
          A business worried about its data might want an AI kept local to them. That comes with a
          trade-off, since they lose the constant new model releases, which means it needs
          maintaining and retraining. That is a monthly service you can provide, at a monthly fee.
        </p>
        <p className="note anim" style={d('.38s')}>
          Look for what needs looking after, not just what needs building. Training counts too.
        </p>
      </>
    ),
  },
  {
    title: 'It compounds',
    act: 5,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h1 className="d dsm anim" style={d('.06s')}>
          One good audit <span className="hl pop">keeps paying.</span>
        </h1>
        <p className="anim" style={{ ...d('.22s'), maxWidth: '38em', fontSize: 'clamp(16px,1.7vw,20px)' }}>
          This is the part nobody tells you. The audit is not the transaction. It is the front door.
        </p>
        <div className="stack anim" style={d('.32s')}>
          {[
            'A company I audited last year came back this year and paid me to sit in on their recruitment, to make sure they hired the right person for the function. I would never have thought of that as work.',
            'One happy chief executive told her chief executive friends. That has been a steady inbound pipeline ever since, with no outbound slog.',
          ].map((t, i) => (
            <div className="row" key={i}>
              <span className="tk">&rarr;</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
        <p className="note anim" style={d('.46s')}>
          It took about six months to see the full compounding effect. Then it starts to bulk up.
        </p>
      </>
    ),
  },
  {
    title: 'Who to go after',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          Filter by size, not by industry
        </h2>
        <p className="big anim" style={d('.12s')}>
          My sweet spot is businesses with roughly ten to sixty staff. Big enough to have real
          systems problems, small enough to talk to everyone.
        </p>
        <p className="anim" style={d('.26s')}>
          Deliberately not industry specific. I have audited a housing company, a consulting service
          and a maths membership. Completely different worlds, same method. This is counterintuitive
          to the usual niche-down advice, but staying open means you learn faster and opportunities
          percolate out of being in different environments.
        </p>
        <p className="note anim" style={d('.38s')}>
          If that changes in six or twelve months, fine. For now, do not limit yourself.
        </p>
      </>
    ),
  },
  {
    title: 'Make it yours',
    act: 5,
    tone: 'cream',
    body: (
      <>
        <div className="eyebrow anim">Get paid</div>
        <h2 className="anim" style={d('.05s')}>
          The spine is mine. Make the rest yours.
        </h2>
        <p className="anim" style={d('.1s')}>
          What I have given you is a structure that works and has yielded real results. Take it,
          adapt it, add to it and write it in a voice you actually enjoy.
        </p>
        <div className="styles anim" style={d('.2s')}>
          <div className="sc warm">
            <p className="st">Warm and plain</p>
            <p className="ex">
              "None of this is the team's fault. They have adapted around a tool that was never built
              for the job."
            </p>
          </div>
          <div className="sc bold">
            <p className="st">Clipped and confident</p>
            <p className="ex">
              The problem is not the number of enquiries. It is what happens to them.
            </p>
          </div>
        </div>
        <p className="note anim" style={d('.34s')}>
          Both work. Pick the one that sounds like you, because you are going to write a lot of
          these.
        </p>
      </>
    ),
  },
  { title: 'Myth or fact (settle)', act: 5, tone: 'cream', body: <MythRevealSlide /> },
  { title: 'Your turn', act: 5, tone: 'cream', body: <SelfAuditSlide /> },
  {
    title: 'Every gap is work',
    act: 5,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">The payoff</div>
        <h1 className="d dsm anim" style={d('.08s')}>
          Every gap you find is <span className="hl pop">work someone gets paid for.</span>
        </h1>
        <p className="anim" style={{ ...d('.2s'), maxWidth: '38em', fontSize: 'clamp(16px,1.7vw,20px)' }}>
          That is the whole point of the audit. It surfaces the work. What happens next is your
          choice. There is no wrong answer.
        </p>
        <div className="stack anim" style={d('.3s')}>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Some of it is yours.</strong> Whatever sits inside what you already do well.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Some of it is training or something ongoing.</strong> Not everything wants
              building. Plenty wants teaching or looking after.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>Some of it is a name from your black book,</strong> a warm introduction and a
              referral fee.
            </span>
          </div>
          <div className="row">
            <span className="tk">&#10003;</span>
            <span>
              <strong>And some of it is nothing at all.</strong> You collect your fee, they got a
              report worth having, everyone is square.
            </span>
          </div>
        </div>
      </>
    ),
  },
  {
    title: 'If building is your thing',
    act: 5,
    tone: 'forest',
    body: (
      <>
        <div className="eyebrow anim">The payoff</div>
        <h2 className="anim" style={d('.05s')}>
          And if building happens to be your thing
        </h2>
        <p className="anim" style={{ ...d('.12s'), maxWidth: '38em' }}>
          Only if it is. Plenty of you will never write a line of anything. The audit still pays. But
          if you have come through the programmes, this is the bit where they start paying for
          themselves.
        </p>
        <div className="map anim" style={d('.22s')}>
          {[
            ['A job that only exists on paper', 'A real record, captured once', 'SHIP SPRINT'],
            [
              'A schedule locked in one person’s head',
              'A shared system with logins and a database',
              'SHIP SPRINT',
            ],
            ['A business run on remembered process', 'An operating system', 'CLAUDE OS'],
            ['A patchy public presence', 'A real, proper site', 'SITE SPRINT'],
          ].map(([fr, to, tg]) => (
            <div className="mrow" key={fr}>
              <span className="fr">{fr}</span>
              <span className="via">&rarr;</span>
              <span className="to">
                {to}
                <span className="tg2">{tg}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="note anim" style={d('.34s')}>
          Findings you would have walked past a year ago are now quotable pieces of work.
        </p>
      </>
    ),
  },
  {
    title: 'Go and do one',
    act: 5,
    tone: 'terra',
    body: <GoSlide />,
  },
];

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ArtOfTheAudit() {
  const [i, setI] = useState(0);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const total = SLIDES.length;
  const current = SLIDES[i];

  const go = useCallback(
    (n: number) => {
      const t = ((n % total) + total) % total;
      setI(t);
      setStep(0);
    },
    [total]
  );

  // Forward walks the current slide's build steps before moving on; backward
  // unwinds them, and stepping back into a built slide finds it fully built.
  const next = useCallback(() => {
    if (step < (SLIDES[i].steps ?? 0)) setStep(step + 1);
    else go(i + 1);
  }, [go, i, step]);

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1);
    else {
      const t = (i - 1 + total) % total;
      setI(t);
      setStep(SLIDES[t].steps ?? 0);
    }
  }, [i, total, step]);

  useEffect(() => {
    document.body.classList.add('aota-lock');
    return () => document.body.classList.remove('aota-lock');
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (menuOpen) {
        if (e.key === 'Escape') setMenuOpen(false);
        return;
      }
      if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(total - 1);
      else if (e.key === 'm' || e.key === 'M') setMenuOpen(o => !o);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, next, prev, go, total]);

  useEffect(() => {
    let sx: number | null = null;
    const start = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
    };
    const end = (e: TouchEvent) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
      sx = null;
    };
    document.addEventListener('touchstart', start, { passive: true });
    document.addEventListener('touchend', end, { passive: true });
    return () => {
      document.removeEventListener('touchstart', start);
      document.removeEventListener('touchend', end);
    };
  }, [next, prev]);

  // Each slide re-runs its entrance animation on arrival, and scrolls back to its top.
  const scrollers = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const sc = scrollers.current[i];
    if (sc) sc.scrollTop = 0;
  }, [i]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const menuGroups = useMemo(
    () =>
      ACTS.map((a, ai) => ({
        label: a.label,
        items: SLIDES.map((s, si) => ({ s, si })).filter(({ s }) => s.act === ai),
      })),
    []
  );

  const lastAct = ACTS.length - 1;

  // Position within the act, so a 21-slide act reads as progress rather than
  // "slide 14 of 61". The rail fill creeps between nodes on the same basis.
  const actSlides = SLIDES.filter(s => s.act === current.act);
  const actFirst = SLIDES.findIndex(s => s.act === current.act);
  const inAct = i - actFirst + 1;
  const railPct = ((current.act + (inAct - 1) / actSlides.length) / lastAct) * 100;

  return (
    <DeckNav.Provider value={go}>
    <DeckStep.Provider value={step}>
    <div
      id="aota"
      className={`${current.tone !== 'cream' ? 'dark-ui ' : ''}${current.tone === 'terra' ? 'terra-ui' : ''}`}
    >
      <Helmet>
        <title>The Art of the Audit | Vibe Coding Lab</title>
        <meta
          name="description"
          content="How to run a paid business audit start to finish: the five-step process, exactly what goes in the report and the prompts and templates you keep."
        />
        <link rel="canonical" href="https://thevibecodinglab.co/artoftheaudit" />
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="progress">
        <span style={{ width: `${(i / (total - 1)) * 100}%` }} />
      </div>

      <div className="stage">
        <div className="track">
          {SLIDES.map((s, si) => (
            <section
              key={si}
              className={`slide ${s.tone}${s.cover ? ' cover' : ''}${s.split ? ' split' : ''}${
                si === i ? ' reveal' : ''
              }`}
            >
              {s.ghost && <div className="ghost">{s.ghost}</div>}
              <div
                className="scroller"
                ref={el => {
                  scrollers.current[si] = el;
                }}
              >
                <div className="wrap">{s.body}</div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <Link className="wordmark" to="/">
        VIBE<span>CODING</span>LAB
      </Link>

      <div className="rail">
        <div className="railline" />
        <div className="railfill" style={{ height: `${railPct}%` }} />
        {ACTS.map((a, ai) => (
          <button
            key={a.label}
            className={`node${ai === current.act ? ' active' : ''}${ai < current.act ? ' done' : ''}`}
            style={{ top: `${(ai / lastAct) * 100}%` }}
            onClick={() => go(a.slide)}
          >
            <span className="nd" />
            <span className="nl">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="controls">
        <span className="count">
          <span className="ca">{ACTS[current.act].label} </span>
          {pad(inAct)} / {pad(actSlides.length)}
        </span>
        <button className="ctrl" onClick={prev} aria-label="Previous">
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="ctrl" onClick={next} aria-label="Next">
          <svg viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button className="ctrl" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <svg viewBox="0 0 24 24">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
        <button className="ctrl" onClick={toggleFullscreen} aria-label="Full screen">
          <svg viewBox="0 0 24 24">
            <polyline points="8 3 3 3 3 8" />
            <polyline points="16 3 21 3 21 8" />
            <polyline points="16 21 21 21 21 16" />
            <polyline points="8 21 3 21 3 16" />
          </svg>
        </button>
      </div>

      <div className={`menu${menuOpen ? ' open' : ''}`}>
        <button className="mclose" onClick={() => setMenuOpen(false)} aria-label="Close">
          &times;
        </button>
        <h3>The Art of the Audit</h3>
        <p className="sub">JUMP TO ANY POINT</p>
        <div>
          {menuGroups.map((g, ai) => (
            <div className="act" key={g.label}>
              <p className="actlab">
                {pad(ai)} &middot; {g.label}
              </p>
              <div className="mgrid">
                {g.items.map(({ s, si }) => (
                  <button
                    className="mitem"
                    key={si}
                    onClick={() => {
                      go(si);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="mn2">{pad(si + 1)}</span>
                    <span className="mt">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </DeckStep.Provider>
    </DeckNav.Provider>
  );
}
