// Pure Pong physics in a 100 x 68 unit space. Player is the left paddle, the
// CPU is the right. First to TARGET points wins.
export const W = 100;
export const H = 68;
export const PADDLE_H = 16;
export const PADDLE_W = 2.4;
export const BALL_R = 1.6;
export const TARGET = 7;
const PLAYER_X = 3;
const AI_X = W - 3 - PADDLE_W;

// CPU behaviour per difficulty. `chase` is how fast it can move while the
// ball heads toward it; `deadzone` is how far off-centre it tolerates before
// bothering to move (a bigger gap = easier to beat). When the ball is moving
// away it eases back toward the middle at `recenter` speed instead of
// tracking — that return-to-neutral is what leaves openings for a good shot.
export const DIFFICULTY = {
  easy: { chase: 30, recenter: 16, deadzone: 6 },
  normal: { chase: 41, recenter: 22, deadzone: 3.5 },
  hard: { chase: 54, recenter: 34, deadzone: 1.5 },
};
export const DIFFICULTIES = ["easy", "normal", "hard"];

function serve(dir) {
  const angle = (Math.random() - 0.5) * 0.8;
  const speed = 46;
  return {
    x: W / 2,
    y: H / 2,
    vx: Math.cos(angle) * speed * dir,
    vy: Math.sin(angle) * speed,
  };
}

export function newPong(difficulty = "normal") {
  return {
    ball: serve(Math.random() < 0.5 ? -1 : 1),
    playerY: H / 2,
    aiY: H / 2,
    scoreL: 0,
    scoreR: 0,
    difficulty: DIFFICULTY[difficulty] ? difficulty : "normal",
    status: "playing", // playing | won | lost
  };
}

export function movePlayer(state, y) {
  const half = PADDLE_H / 2;
  return { ...state, playerY: Math.max(half, Math.min(H - half, y)) };
}

function paddleBounce(ball, paddleY, paddleX, fromLeft) {
  const half = PADDLE_H / 2;
  const withinY = ball.y > paddleY - half && ball.y < paddleY + half;
  const atX = fromLeft
    ? ball.x - BALL_R <= paddleX + PADDLE_W && ball.vx < 0
    : ball.x + BALL_R >= paddleX && ball.vx > 0;
  if (withinY && atX) {
    const offset = (ball.y - paddleY) / half; // -1..1
    const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.04, 82);
    const dir = fromLeft ? 1 : -1;
    const vy = offset * speed * 0.7;
    const vx = dir * Math.sqrt(Math.max(speed * speed - vy * vy, 1));
    return { ...ball, vx, vy, x: fromLeft ? paddleX + PADDLE_W + BALL_R : paddleX - BALL_R };
  }
  return null;
}

function moveAI(aiY, ball, dt, cfg) {
  const half = PADDLE_H / 2;
  const incoming = ball.vx > 0;
  const target = incoming ? ball.y : H / 2;
  const speed = incoming ? cfg.chase : cfg.recenter;
  const gap = target - aiY;
  // Ignore a small gap so the paddle doesn't jitter — and, while chasing,
  // that same tolerance is the CPU's imperfection.
  if (Math.abs(gap) <= cfg.deadzone) return aiY;
  const stepped = aiY + Math.sign(gap) * Math.min(speed * dt, Math.abs(gap));
  return Math.max(half, Math.min(H - half, stepped));
}

export function step(state, dtMs) {
  if (state.status !== "playing") return state;
  const dt = dtMs / 1000;
  let { x, y, vx, vy } = state.ball;
  x += vx * dt;
  y += vy * dt;

  if (y - BALL_R < 0) {
    y = BALL_R;
    vy = Math.abs(vy);
  } else if (y + BALL_R > H) {
    y = H - BALL_R;
    vy = -Math.abs(vy);
  }

  let ball = { x, y, vx, vy };
  const hitP = paddleBounce(ball, state.playerY, PLAYER_X, true);
  if (hitP) ball = hitP;
  const hitAI = paddleBounce(ball, state.aiY, AI_X, false);
  if (hitAI) ball = hitAI;

  const cfg = DIFFICULTY[state.difficulty] ?? DIFFICULTY.normal;
  const aiY = moveAI(state.aiY, ball, dt, cfg);

  let { scoreL, scoreR, status } = state;
  if (ball.x < -BALL_R) {
    scoreR += 1;
    ball = serve(1);
  } else if (ball.x > W + BALL_R) {
    scoreL += 1;
    ball = serve(-1);
  }
  if (scoreL >= TARGET) status = "won";
  else if (scoreR >= TARGET) status = "lost";

  return { ...state, ball, aiY, scoreL, scoreR, status };
}
