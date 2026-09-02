import { pic } from "../../assets/kids/registry";

// A single Kids picture (Twemoji SVG, see src/assets/kids). Use it anywhere a
// game used to drop a bare emoji character.
//
//   <Pic id="lion" />              content image, English alt ("lion")
//   <Pic id="lion" hebrew />       content image, Hebrew alt ("אריה")
//   <Pic id="c" alt="red circle" /> content image, explicit alt
//   <Pic id="star" decorative />   alt="", hidden from the a11y tree
//
// `size` is a convenience: "sm" | "md" | "lg" | "xl" map to CSS sizes; omit it
// and the picture fills its container (width:100%) for grid tiles.
export function Pic({ id, hebrew = false, decorative = false, alt, size, className = "" }) {
  const p = pic(id);
  if (!p || !p.src) return null;
  const resolvedAlt = decorative ? "" : (alt ?? (hebrew ? p.he : p.en));
  return (
    <img
      className={`kid-pic${size ? ` kid-pic--${size}` : ""}${className ? ` ${className}` : ""}`}
      src={p.src}
      alt={resolvedAlt}
      draggable={false}
      aria-hidden={decorative || undefined}
      loading="lazy"
      decoding="async"
    />
  );
}
