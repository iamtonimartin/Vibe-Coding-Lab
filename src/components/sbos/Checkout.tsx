import { useEffect, useRef, useState } from 'react';
import { Lock } from 'lucide-react';
import { THRIVECART, THRIVECART_ACCOUNT } from './config';

const SCRIPT_SRC = '//tinder.thrivecart.com/embed/v2/thrivecart.js';

// Don't dismiss the loader before this, so the message never "flashes".
const MIN_VISIBLE_MS = 600;
// Absolute safety net: reveal even if the ready signal never arrives.
const MAX_WAIT_MS = 25000;

/**
 * The single founding checkout, carrying all three payment options.
 *
 * ThriveCart keeps its iframe `visibility:hidden` and shows its own grey
 * spinner until the checkout is ready, at which point it adds
 * `tc-v2-embeddable-loaded` to the wrapper. So we lay a branded loader over the
 * top and lift it the moment that class appears: no flash, no premature reveal.
 * Detection carried over from the retired /thestack embed, restyled here.
 */
export default function Checkout() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { productId, embedId } = THRIVECART;
  const configured = Boolean(productId && embedId);

  useEffect(() => {
    if (!configured) return;
    const target = targetRef.current;
    if (!target) return;

    const start = Date.now();
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - start));
      window.setTimeout(() => setLoaded(true), wait);
    };

    const checkReady = () => {
      if (
        target.querySelector('.tc-v2-embeddable-loaded') ||
        target.querySelector('input, select, textarea')
      ) {
        reveal();
      }
    };

    const observer = new MutationObserver(checkReady);
    observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    const poll = window.setInterval(checkReady, 400);

    document.getElementById(embedId)?.remove();
    const script = document.createElement('script');
    script.async = true;
    script.src = SCRIPT_SRC;
    script.id = embedId;
    document.body.appendChild(script);

    const fallback = window.setTimeout(reveal, MAX_WAIT_MS);

    return () => {
      observer.disconnect();
      clearInterval(poll);
      clearTimeout(fallback);
      document.getElementById(embedId)?.remove();
    };
  }, [configured, embedId]);

  if (!configured) {
    return (
      <div className="rounded-[1.5rem] border-2 border-dashed border-forest-green/20 bg-sand/60 px-6 py-14 text-center">
        <Lock size={26} className="mx-auto mb-4 text-forest-green/30" />
        <div className="text-xs font-bold uppercase tracking-widest text-forest-green/60">
          ThriveCart checkout goes here
        </div>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-forest-green/50">
          Add the founding product id and embed id to THRIVECART in
          src/components/sbos/config.ts. All three payment options come from that
          one checkout.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-white">
      {!loaded && (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white px-6 text-center"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="mb-5 h-9 w-9 animate-spin rounded-full border-[3px] border-forest-green/15 border-t-terracotta" />
          <h3 className="font-display text-lg font-extrabold">Loading secure checkout</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-60">
            Powered by ThriveCart. This can take a few seconds, so please do not
            refresh or go back.
          </p>
        </div>
      )}

      <div
        ref={targetRef}
        className="tc-v2-embeddable-target"
        data-thrivecart-account={THRIVECART_ACCOUNT}
        data-thrivecart-tpl="v2"
        data-thrivecart-product={productId}
        data-thrivecart-embeddable={embedId}
      />
    </div>
  );
}
