/**
 * Full-bleed relief band above the footer.
 *
 * The image's top edge is masked away with a gradient so it emerges out of the
 * white page instead of starting on a hard line. A CSS mask is used rather
 * than a white gradient overlay: an overlay only works while the page behind
 * it is white, and would leave a pale rectangle the moment anything sits
 * behind the band.
 *
 * Ornamental. The alt text is empty and the element is hidden from assistive
 * tech deliberately — it carries no information that is not already in the
 * page, and inventing a description of a decorative relief map would be worse
 * than omitting one.
 */
export default function BasinBand() {
  return (
    <div
      className="no-print pointer-events-none select-none"
      aria-hidden="true"
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 55%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 55%)',
      }}
    >
      <img
        src="/brand/basin-relief.webp"
        alt=""
        width="1774"
        height="887"
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}
