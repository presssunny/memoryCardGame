// Pure Breakout physics in a 100 x 130 unit space (rendered scaled).
export const W = 100;
export const H = 130;
export const PADDLE_W = 20;
export const PADDLE_Y = H - 6;
export const BALL_R = 1.6;

const COLS = 8;
const ROWS = 4;
const BRICK_W = W / COLS;
const BRICK_H = 5;
const BRICK_TOP = 12;

function buildBricks() {
  const bricks = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      bricks.push({
        x: c * BRICK_W,
        y: BRICK_TOP + r * BRICK_H,
        w: BRICK_W,
        h: BRICK_H,
        row: r,
        alive: true,
      });
    }
  }
  return bricks;
}

export function newBreakout() {
  return {
    ball: { x: W / 2, y: PADDLE_Y - 4, vx: 26, vy: -32 },
    paddleX: W / 2,
    bricks: buildBricks(),
    lives: 3,
    score: 0,
    status: "playing", // playing | won | over
  };
}

export function movePaddle(state, x) {
  const half = PADDLE_W / 2;
  return { ...state, paddleX: Math.max(half, Math.min(W - half, x)) };
}

function rectHit(bx, by, r, rect) {
  return (
    bx + r > rect.x &&
    bx - r < rect.x + rect.w &&
    by + r > rect.y &&
    by - r < rect.y + rect.h
  );
}

// One physics tick. `dtMs` is milliseconds.
export function step(state, dtMs) {
  if (state.status !== "playing") return state;
  const dt = dtMs / 1000;
  let { x, y, vx, vy } = state.ball;
  x += vx * dt;
  y += vy * dt;

  if (x - BALL_R < 0) {
    x = BALL_R;
    vx = Math.abs(vx);
  } else if (x + BALL_R > W) {
    x = W - BALL_R;
    vx = -Math.abs(vx);
  }
  if (y - BALL_R < 0) {
    y = BALL_R;
    vy = Math.abs(vy);
  }

  // Paddle.
  const half = PADDLE_W / 2;
  if (
    vy > 0 &&
    y + BALL_R >= PADDLE_Y &&
    y - BALL_R <= PADDLE_Y + 3 &&
    x >= state.paddleX - half &&
    x <= state.paddleX + half
  ) {
    y = PADDLE_Y - BALL_R;
    vy = -Math.abs(vy);
    const offset = (x - state.paddleX) / half; // -1..1
    vx += offset * 18;
  }

  // Bricks — first hit only, to keep it simple and stable.
  let score = state.score;
  let bounced = false;
  const bricks = state.bricks.map((b) => {
    if (!bounced && b.alive && rectHit(x, y, BALL_R, b)) {
      bounced = true;
      score += 10;
      // Bounce vertically off the brick face nearest the ball.
      const fromLeft = x < b.x;
      const fromRight = x > b.x + b.w;
      if (fromLeft || fromRight) vx = -vx;
      else vy = -vy;
      return { ...b, alive: false };
    }
    return b;
  });

  let { lives, status } = state;
  if (y - BALL_R > H) {
    lives -= 1;
    if (lives <= 0) {
      status = "over";
    } else {
      x = W / 2;
      y = PADDLE_Y - 4;
      vx = 26 * (state.ball.vx < 0 ? -1 : 1);
      vy = -32;
    }
  }

  if (status === "playing" && bricks.every((b) => !b.alive)) status = "won";

  // Keep speed in a sane band.
  const speed = Math.hypot(vx, vy);
  const target = Math.min(Math.max(speed, 38), 62);
  if (speed > 0) {
    vx = (vx / speed) * target;
    vy = (vy / speed) * target;
  }

  return { ...state, ball: { x, y, vx, vy }, bricks, score, lives, status };
}
