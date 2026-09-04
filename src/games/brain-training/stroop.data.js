import { shuffle } from "../../utils/random";

export const STROOP_COLORS = [
  { id: "red", name: "RED", hex: "#ef4444" },
  { id: "blue", name: "BLUE", hex: "#3b82f6" },
  { id: "green", name: "GREEN", hex: "#22c55e" },
  { id: "yellow", name: "YELLOW", hex: "#eab308" },
  { id: "purple", name: "PURPLE", hex: "#a855f7" },
  { id: "orange", name: "ORANGE", hex: "#f97316" },
];

// generate(round): a colour word printed in a different colour of ink. The
// answer is the INK colour, not the word. Options are 3→4 colour names.
export function makeStroopQuestion(round, rng = Math.random) {
  const optionCount = round < 4 ? 3 : 4;
  const pool = shuffle(STROOP_COLORS, rng);
  const word = pool[0];
  // Ink is a different colour ~85% of the time (a congruent trial now and
  // then keeps it honest).
  const ink = rng() < 0.15 ? word : pool[1];
  const others = pool.filter((c) => c.id !== ink.id).slice(0, optionCount - 1);
  const options = shuffle(
    [ink, ...others].map((c) => ({
      id: c.id,
      name: c.name,
      correct: c.id === ink.id,
    })),
    rng,
  );
  return {
    prompt: { word: word.name, ink: ink.hex, inkName: ink.name },
    options,
  };
}
