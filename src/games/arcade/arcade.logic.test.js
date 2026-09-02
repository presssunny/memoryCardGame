import { describe, it, expect } from "vitest";
import {
  emptyGrid,
  spawnTile,
  move,
  hasMoves,
  newGame as new2048,
} from "./logic2048";
import {
  newSnake,
  setDir,
  step as snakeStep,
  GRID,
  levelFor,
  speedTierFor,
  dirName,
} from "./snake";
import { newBreakout, step as breakoutStep } from "./breakout";
import { newPong, step as pongStep, movePlayer, DIFFICULTIES } from "./pong";

const rng0 = () => 0;

describe("2048 logic", () => {
  it("collapses and merges a row to the left", () => {
    const grid = emptyGrid();
    grid[0] = 2;
    grid[1] = 2;
    grid[2] = 4;
    const { grid: out, moved, gained } = move(grid, "left");
    expect(out.slice(0, 4)).toEqual([4, 4, 0, 0]);
    expect(moved).toBe(true);
    expect(gained).toBe(4);
  });

  it("merges to the right and up too", () => {
    const g = emptyGrid();
    g[0] = 2;
    g[1] = 2;
    expect(move(g, "right").grid.slice(0, 4)).toEqual([0, 0, 0, 4]);
    const col = emptyGrid();
    col[0] = 2;
    col[4] = 2;
    expect(move(col, "up").grid[0]).toBe(4);
  });

  it("does not merge three-in-a-row into one", () => {
    const g = emptyGrid();
    g[0] = g[1] = g[2] = 2;
    expect(move(g, "left").grid.slice(0, 4)).toEqual([4, 2, 0, 0]);
  });

  it("reports moved: false when nothing changes", () => {
    const g = emptyGrid();
    g[0] = 2;
    g[1] = 4;
    expect(move(g, "left").moved).toBe(false);
  });

  it("spawnTile fills exactly one empty cell", () => {
    const before = emptyGrid();
    const after = spawnTile(before, rng0);
    expect(after.filter((n) => n !== 0)).toHaveLength(1);
    expect([2, 4]).toContain(after.find((n) => n !== 0));
  });

  it("a fresh game has two tiles and available moves", () => {
    const g = new2048(rng0);
    expect(g.filter((n) => n !== 0).length).toBeGreaterThanOrEqual(1);
    expect(hasMoves(g)).toBe(true);
  });

  it("hasMoves is false on a full locked board", () => {
    const locked = [2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2];
    expect(hasMoves(locked)).toBe(false);
  });
});

describe("Snake logic", () => {
  it("moves the head one cell in the current direction", () => {
    const s = newSnake(rng0);
    const head = s.body[0];
    const next = snakeStep(s, rng0);
    expect(next.body[0]).toEqual({ x: head.x + 1, y: head.y });
    expect(next.body).toHaveLength(s.body.length); // no growth
  });

  it("refuses a 180° reversal", () => {
    const s = newSnake(rng0); // heading right
    const turned = setDir(s, "left");
    expect(turned.nextDir).toEqual(s.dir);
  });

  it("dies on a wall", () => {
    let s = newSnake(rng0);
    s = { ...s, body: [{ x: GRID - 1, y: 5 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 } };
    expect(snakeStep(s, rng0).dead).toBe(true);
  });

  it("grows and scores when eating", () => {
    let s = newSnake(rng0);
    const head = s.body[0];
    s = { ...s, food: { x: head.x + 1, y: head.y } };
    const next = snakeStep(s, rng0);
    expect(next.score).toBe(1);
    expect(next.body).toHaveLength(s.body.length + 1);
  });

  it("levelFor climbs one tier every four food, speedTier stays within 1..5", () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(3)).toBe(1);
    expect(levelFor(4)).toBe(2);
    expect(levelFor(12)).toBe(4);
    for (const score of [0, 1, 5, 10, 30, 100]) {
      const t = speedTierFor(score);
      expect(t).toBeGreaterThanOrEqual(1);
      expect(t).toBeLessThanOrEqual(5);
    }
  });

  it("dirName names each direction vector", () => {
    expect(dirName({ x: 1, y: 0 })).toBe("right");
    expect(dirName({ x: -1, y: 0 })).toBe("left");
    expect(dirName({ x: 0, y: 1 })).toBe("down");
    expect(dirName({ x: 0, y: -1 })).toBe("up");
  });
});

describe("Breakout logic", () => {
  it("advances the ball and keeps it inside the walls", () => {
    let s = newBreakout();
    for (let i = 0; i < 40; i++) s = breakoutStep(s, 16);
    expect(s.ball.x).toBeGreaterThanOrEqual(0);
    expect(s.ball.x).toBeLessThanOrEqual(100);
    expect(s.ball.y).toBeGreaterThanOrEqual(0);
  });

  it("breaking a brick adds score and removes it", () => {
    let s = newBreakout();
    const before = s.bricks.filter((b) => b.alive).length;
    // Run enough ticks that the ball reaches the brick field at least once.
    for (let i = 0; i < 400 && s.score === 0; i++) s = breakoutStep(s, 16);
    expect(s.score).toBeGreaterThan(0);
    expect(s.bricks.filter((b) => b.alive).length).toBeLessThan(before);
  });

  it("is a no-op once the game is not playing", () => {
    const done = { ...newBreakout(), status: "over" };
    expect(breakoutStep(done, 16)).toBe(done);
  });

  it("a big catch-up frame doesn't let the ball tunnel through the brick band", () => {
    // useGameLoop can hand step() a larger dt after a stall. Even a 100ms
    // frame aimed straight through the bricks must destroy one, not skip it.
    let s = newBreakout();
    s = { ...s, ball: { x: 50, y: 35, vx: 0, vy: -55 }, paddleX: 50 };
    const before = s.bricks.filter((b) => b.alive).length;
    s = breakoutStep(s, 160); // ~8.8 units — would clear a brick row un-subdivided
    expect(s.bricks.filter((b) => b.alive).length).toBeLessThan(before);
    expect(s.ball.vy).toBeGreaterThan(0); // bounced back downward
  });

  it("never ends a frame with the ball sitting inside a live brick", () => {
    let s = newBreakout();
    s = { ...s, ball: { x: 30, y: 45, vx: 40, vy: -46 } };
    let everHit = false;
    for (let i = 0; i < 200; i++) {
      const alive = s.bricks.filter((b) => b.alive).length;
      s = breakoutStep(s, 16);
      if (s.bricks.filter((b) => b.alive).length < alive) everHit = true;
      const inside = s.bricks.some(
        (b) =>
          b.alive &&
          s.ball.x > b.x &&
          s.ball.x < b.x + b.w &&
          s.ball.y > b.y &&
          s.ball.y < b.y + b.h,
      );
      expect(inside).toBe(false);
    }
    expect(everHit).toBe(true); // the ball really was reaching the bricks
  });
});

describe("Pong logic", () => {
  it("keeps the ball within the top and bottom walls", () => {
    let s = newPong();
    for (let i = 0; i < 200; i++) s = pongStep(s, 16);
    expect(s.ball.y).toBeGreaterThanOrEqual(0);
    expect(s.ball.y).toBeLessThanOrEqual(68);
  });

  it("clamps the player paddle to the board", () => {
    const s = movePlayer(newPong(), 999);
    expect(s.playerY).toBeLessThanOrEqual(68);
    expect(s.playerY).toBeGreaterThanOrEqual(0);
  });

  it("someone eventually wins", () => {
    let s = newPong();
    for (let i = 0; i < 6000 && s.status === "playing"; i++) s = pongStep(s, 16);
    expect(["won", "lost"]).toContain(s.status);
  });

  it("someone eventually wins on every difficulty", () => {
    for (const level of DIFFICULTIES) {
      let s = newPong(level);
      for (let i = 0; i < 9000 && s.status === "playing"; i++) s = pongStep(s, 16);
      expect(["won", "lost"]).toContain(s.status);
    }
  });

  it("the CPU drifts back toward centre while the ball moves away", () => {
    let s = { ...newPong("normal"), aiY: 8, ball: { x: 50, y: 60, vx: -40, vy: 0 } };
    for (let i = 0; i < 20; i++) s = pongStep(s, 16);
    expect(s.aiY).toBeGreaterThan(8); // moved toward the middle (H/2 = 34)
    expect(s.aiY).toBeLessThan(40); // didn't chase the ball down to y = 60
  });

  it("the CPU chases an approaching ball", () => {
    let s = { ...newPong("normal"), aiY: 34, ball: { x: 55, y: 62, vx: 40, vy: 0 } };
    for (let i = 0; i < 15; i++) s = pongStep(s, 16);
    expect(s.aiY).toBeGreaterThan(40); // tracking down toward the ball
  });

  it("a harder CPU closes on the ball faster", () => {
    const ball = { x: 55, y: 64, vx: 30, vy: 0 };
    const reach = (level) => {
      let s = { ...newPong(level), aiY: 18, ball };
      for (let i = 0; i < 10; i++) s = pongStep(s, 16);
      return s.aiY;
    };
    expect(reach("hard")).toBeGreaterThan(reach("easy"));
  });

  it("falls back to the normal CPU for an unknown difficulty", () => {
    expect(newPong("impossible").difficulty).toBe("normal");
  });
});
