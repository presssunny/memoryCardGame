import "./gameUI.css";

// A segmented difficulty control. `options` is a list of strings (or
// { value, label }); `value` is the active one.
export function DifficultyPills({ options, value, onChange, ariaLabel = "Difficulty" }) {
  const items = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o,
  );
  return (
    <div className="gx-diff" role="group" aria-label={ariaLabel}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          className={`gx-diff-btn${value === item.value ? " is-active" : ""}`}
          aria-pressed={value === item.value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
