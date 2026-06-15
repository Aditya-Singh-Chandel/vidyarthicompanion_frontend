/**
 * Decorative animated aurora backdrop.
 * Fixed behind all content; pure CSS animation (no JS), so it stays
 * cheap and works as a server component.
 */
export default function AuroraBackground() {
  return (
    <div className="cf-aurora" aria-hidden="true">
      <span className="cf-blob cf-blob-1" />
      <span className="cf-blob cf-blob-2" />
      <span className="cf-blob cf-blob-3" />
      <span className="cf-blob cf-blob-4" />
      <div className="cf-grid" />
    </div>
  );
}
