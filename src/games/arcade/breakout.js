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

// Cap the distance the ball travels between collision checks. The thinnest
// obstacle (a brick, and the ball's own radius) is ~1.6 units, so stepping
// no more than ~0.8 units at a time means the ball can never skip over one,
// however large a frame's dt is.
const MAX_STEP = 0.8;

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

// Advance the ball by a distance small enough that it can't pass through a
// brick or the paddle. Mutates and returns the running `frame` accumulator.
function subStep(frame, dt) {
  let { x, y, vx, vy } = frame.ball;
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

  const half = PADDLE_W / 2;
  if (
    vy > 0 &&
    y + BALL_R >= PADDLE_Y &&
    y - BALL_R <= PADDLE_Y + 3 &&
    x >= frame.paddleX - half &&
    x <= frame.paddleX + half
  ) {
    y = PADDLE_Y - BALL_R;
    vy = -Math.abs(vy);
    const offset = (x - frame.paddleX) / half; // -1..1
    vx += offset * 18;
  }

  // Bricks — at most one per sub-step, which is now tiny, so nothing is
  // skipped and the ball never ends a frame inside a brick.
  let bounced = false;
  for (let i = 0; i < frame.bricks.length; i++) {
    const b = frame.bricks[i];
    if (!b.alive || !rectHit(x, y, BALL_R, b)) continue;
    bounced = true;
    frame.score += 10;
    // Reflect off the nearest face and nudge the ball clear of the brick so
    // it can't still read as "inside" on the next check.
    const fromSide = x < b.x || x > b.x + b.w;
    if (fromSide) {
      vx = -vx;
      x = x < b.x ? b.x - BALL_R : b.x + b.w + BALL_R;
    } else {
      vy = -vy;
      y = y < b.y ? b.y - BALL_R : b.y + b.h + BALL_R;
    }
    frame.bricks = frame.bricks.slice();
    frame.bricks[i] = { ...b, alive: false };
    break;
  }

  if (y - BALL_R > H) {
    frame.lostBall = true;
  }

  // Keep speed in a sane band.
  const speed = Math.hypot(vx, vy);
  if (speed > 0) {
    const target = Math.min(Math.max(speed, 38), 62);
    vx = (vx / speed) * target;
    vy = (vy / speed) * target;
  }

  frame.ball = { x, y, vx, vy };
  return bounced;
}

// One physics frame. `dtMs` is milliseconds — split into sub-steps so fast
// balls can't tunnel through bricks or the paddle.
export function step(state, dtMs) {
  if (state.status !== "playing") return state;
  const dt = dtMs / 1000;
  const speed = Math.hypot(state.ball.vx, state.ball.vy);
  const subs = Math.max(1, Math.ceil((speed * dt) / MAX_STEP));
  const subDt = dt / subs;

  const frame = {
    ball: state.ball,
    paddleX: state.paddleX,
    bricks: state.bricks,
    score: state.score,
    lostBall: false,
  };

  for (let s = 0; s < subs && !frame.lostBall; s++) subStep(frame, subDt);

  let { lives, status } = state;
  let ball = frame.ball;
  if (frame.lostBall) {
    lives -= 1;
    if (lives <= 0) {
      status = "over";
    } else {
      ball = { x: W / 2, y: PADDLE_Y - 4, vx: 26 * (state.ball.vx < 0 ? -1 : 1), vy: -32 };
    }
  }

  if (status === "playing" && frame.bricks.every((b) => !b.alive)) status = "won";

  return { ...state, ball, bricks: frame.bricks, score: frame.score, lives, status };
}
