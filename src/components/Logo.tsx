// The AISB lockup. Replaces the old VIBECODINGLAB text wordmark that used to be
// hardcoded into every nav and footer.
//
// The supplied art carried a near-invisible halo (alpha 1-10) well outside the
// mark, which made the visible logo about half the height of its own box. These
// files are cropped past that halo, so a height class renders the mark at that
// height. Both variants are padded to a shared 7.37:1 so swapping one for the
// other never shifts layout.
//
// `on` describes the BACKGROUND the logo sits on, not the logo's own colour:
// on="light" gives the dark-ink mark, on="dark" gives the cream one.
type LogoProps = {
  on?: 'light' | 'dark';
  /** Tailwind height classes. Width follows from the lockup ratio. */
  className?: string;
};

export default function Logo({ on = 'light', className = 'h-8 md:h-11' }: LogoProps) {
  return (
    <img
      src={on === 'dark' ? '/aisb-logo-darkbg.png' : '/aisb-logo-lightbg.png'}
      alt="AI for Service Businesses"
      width={1938}
      height={263}
      className={`w-auto max-w-full ${className}`}
    />
  );
}
