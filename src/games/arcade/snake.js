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
    food: placeFood(body, rng),
    dead: false,
    score: 0,
  };
}

// Queue a turn. Ignores a 180° reversal.
export function setDir(state, name) {
  const d = DIRS[name];
  if (!d) return state;
  if (d.x === -state.dir.x && d.y === -state.dir.y) return state;
  return { ...state, nextDir: d };
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
  return {
    ...state,
    dir,
    body: newBody,
    food: eating ? placeFood(newBody, rng) : state.food,
    score: eating ? state.score + 1 : state.score,
  };
}

// Ticks/second scales with score.
export function speedFor(score) {
  return Math.min(6 + score * 0.6, 16);
}
