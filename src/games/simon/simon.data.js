// The four Simon pads. `id` is what useSequenceLogic tracks; the rest is
// how the pad is drawn and named for screen readers.
export const PADS = [
  { id: "green", label: "Green", color: "#22c55e" },
  { id: "red", label: "Red", color: "#ef4444" },
  { id: "blue", label: "Blue", color: "#3b82f6" },
  { id: "yellow", label: "Yellow", color: "#eab308" },
];

// useSequenceLogic halves its input (it's built for pair decks), so the pad
// ids are passed doubled.
export const PAD_DECK = [...PADS.map((p) => p.id), ...PADS.map((p) => p.id)];
