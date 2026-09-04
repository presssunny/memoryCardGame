// Pure Snake logic on a GRID x GRID board.
export const GRID = 17;

const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function placeFood(body, rng) {
  const taken = new Set(body.map((c) => `${c.x},${c.y}`));
  const free = [];
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y });
    }
  }
  if (free.length === 0) return null;
  return free[Math.floor(rng() * free.length)];
}

export function newSnake(rng = Math.random) {
  const mid = Math.floor(GRID / 2);
  const body = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ];
  return {
    body,
    dir: DIRS.right,
    nextDir: DIRS.right,
    queuedDir: null,
    food: placeFood(body, rng),
    dead: false,
    score: 0,
  };
}

const isOpposite = (a, b) => a.x === -b.x && a.y === -b.y;
const isSame = (a, b) => a.x === b.x && a.y === b.y;

// Queue a turn. `nextDir` is applied on the next tick; a legal second turn
// pressed before that tick is buffered in `queuedDir` and applied the tick
// after — so a fast "up then left" both land instead of the second press
// being dropped (which read as an unfair death). A 180° reversal of the last
// pending direction is still rejected, so the queue can never fold back on
// the snake's own neck.
export function setDir(state, name) {
  const d = DIRS[name];
  if (!d) return state;
  const pending = state.queuedDir || state.nextDir;
  if (isOpposite(d, pending) || isSame(d, pending)) return state;
  // A reversal of the *committed* dir can't be the immediate next move, but
  // it's a valid follow-up once nextDir has taken effect — buffer it.
  if (isOpposite(d, state.dir)) return { ...state, queuedDir: d };
  return { ...state, nextDir: d, queuedDir: null };
}

// One tick. Returns a new state.
export function step(state, rng = Math.random) {
  if (state.dead) return state;
  const dir = state.nextDir;
  const head = state.body[0];
  const next = { x: head.x + dir.x, y: head.y + dir.y };

  const hitWall =
    next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID;
  const eating = state.food && next.x === state.food.x && next.y === state.food.y;
  // The tail cell frees up unless we're growing this tick.
  const body = eating ? state.body : state.body.slice(0, -1);
  const hitSelf = body.some((c) => c.x === next.x && c.y === next.y);

  if (hitWall || hitSelf) return { ...state, dir, dead: true };

  const newBody = [next, ...body];
  // Promote a buffered turn to be the next move (it was validated against
  // the direction it now follows, so it can't be a 180°).
  const promoted =
    state.queuedDir && !isOpposite(state.queuedDir, dir) ? state.queuedDir : dir;
  return {
    ...state,
    dir,
    nextDir: promoted,
    queuedDir: null,
    body: newBody,
    food: eating ? placeFood(newBody, rng) : state.food,
    score: eating ? state.score + 1 : state.score,
  };
}

// Ticks/second scales with score.
export function speedFor(score) {
  return Math.min(6 + score * 0.6, 16);
}

// Difficulty tier — one every 4 food. Drives the HUD and the "level up"
// flash; the actual speed still comes from speedFor(score).
export function levelFor(score) {
  return Math.floor(score / 4) + 1;
}

// A 1–5 "speed" readout for the HUD, derived from the same curve as speedFor
// so the number the player sees matches how fast it actually feels.
export function speedTierFor(score) {
  return Math.min(5, Math.round((speedFor(score) - 6) / 2) + 1);
}

// The name of a direction vector, for rotating the head sprite.
export function dirName(dir) {
  if (dir.x === 1) return "right";
  if (dir.x === -1) return "left";
  if (dir.y === 1) return "down";
  return "up";
}
