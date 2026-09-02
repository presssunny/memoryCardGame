import "./gameUI.css";

// The one button used across every game. `variant` sets the look; `size`
// and `block` tune layout. Anything else (onClick, disabled, aria-*, type)
// passes straight through.
//
//   variant: "primary" (default) | "secondary" | "ghost" | "danger" | "icon"
export function GameButton({
  variant = "primary",
  size,
  block = false,
  icon,
  children,
  className = "",
  type = "button",
  ...rest
}) {
  const classes = [
    "gx-btn",
    variant !== "primary" && `gx-btn--${variant}`,
    size && `gx-btn--${size}`,
    block && "gx-btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon && (
        <span className="gx-btn-icon" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
