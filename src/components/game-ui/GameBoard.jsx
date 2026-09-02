import "./gameUI.css";

// A framed play area: depth, a defined boundary, a polished background.
// Wrap a game's board/stage in this so it reads as a real arena rather than
// a bare element floating on the page. `caption` is the small hint line
// under it (controls, etc.). Extra props (style, aria-label, onPointerMove…)
// pass through to the frame.
export function GameBoard({
  children,
  caption,
  className = "",
  innerRef,
  ...rest
}) {
  return (
    <div className="gx-board-wrap">
      <div
        ref={innerRef}
        className={`gx-board ${className}`.trim()}
        {...rest}
      >
        {children}
      </div>
      {caption && <p className="gx-board-caption">{caption}</p>}
    </div>
  );
}
