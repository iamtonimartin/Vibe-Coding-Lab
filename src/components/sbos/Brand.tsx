/**
 * The Service Business OS lockup, matching the share card: a boxed SB/OS mark
 * beside the wordmark.
 *
 * Built as markup rather than an image so it stays sharp, themes with the
 * palette and costs no request. It exists because a reader told us the name
 * was so small at the top of the page that they never saw it, and could not
 * say what they would be buying.
 */
export default function Brand({
  size = 'sm',
  className = '',
}: {
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const lg = size === 'lg';
  return (
    <div className={`flex items-center ${lg ? 'gap-3.5' : 'gap-2.5'} ${className}`}>
      <div
        className={`rounded-lg border-2 border-terracotta/70 leading-none ${
          lg ? 'px-2.5 py-2' : 'px-1.5 py-1'
        }`}
      >
        <div
          className={`font-display font-black tracking-tight text-warm-cream ${
            lg ? 'text-base' : 'text-[10px]'
          }`}
        >
          SB
        </div>
        <div
          className={`font-display font-black tracking-tight text-terracotta ${
            lg ? 'text-base mt-0.5' : 'text-[10px]'
          }`}
        >
          OS
        </div>
      </div>
      <div className="leading-none">
        <div
          className={`font-display font-extrabold text-warm-cream ${
            lg ? 'text-2xl md:text-3xl tracking-[0.16em]' : 'text-xs tracking-[0.14em]'
          }`}
        >
          SERVICE
        </div>
        <div
          className={`font-display font-bold text-terracotta ${
            lg ? 'text-xs md:text-sm tracking-[0.28em] mt-1.5' : 'text-[9px] tracking-[0.2em] mt-1'
          }`}
        >
          BUSINESS OS
        </div>
      </div>
    </div>
  );
}
