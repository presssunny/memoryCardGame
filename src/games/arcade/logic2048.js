// Pure 2048 logic — no React. The grid is a flat array of 16 numbers
// (0 = empty), row-major.
export const SIZE = 4;

export function emptyGrid() {
  return Array(SIZE * SIZE).fill(0);
}

function emptyCells(grid) {
  const out = [];
  for (let i = 0; i < grid.length; i++) if (grid[i] === 0) out.push(i);
  return out;
}

// Adds one tile (2 with p=0.9, else 4) to a random empty cell. Returns a new
// grid; if the grid was full, returns it unchanged.
export function spawnTile(grid, rng = Math.random) {
  const cells = emptyCells(grid);
  if (cells.length === 0) return grid;
  const at = cells[Math.floor(rng() * cells.length)];
  const next = [...grid];
  next[at] = rng() < 0.9 ? 2 : 4;
  return next;
}

// Slide + merge a single row to the left. Returns { row, gained }.
function collapseRow(row) {
  const nums = row.filter((n) => n !== 0);
  const out = [];
  let gained = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === nums[i + 1]) {
      const merged = nums[i] * 2;
      out.push(merged);
      gained += merged;
      i++;
    } else {
      out.push(nums[i]);
    }
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}

function getRow(grid, r) {
  return grid.slice(r * SIZE, r * SIZE + SIZE);
}

// Reads the grid as rows for the given direction so every move is a
// left-collapse: "left" as-is, "right" reversed, "up"/"down" by column.
function linesFor(grid, dir) {
  const lines = [];
  for (let i = 0; i < SIZE; i++) {
    let line;
    if (dir === "left") line = getRow(grid, i);
    else if (dir === "right") line = getRow(grid, i).reverse();
    else if (dir === "up") line = [0, 1, 2, 3].map((r) => grid[r * SIZE + i]);
    else line = [3, 2, 1, 0].map((r) => grid[r * SIZE + i]);
    lines.push(line);
  }
  return lines;
}

function writeLine(grid, dir, i, line) {
  if (dir === "left") {
    for (let c = 0; c < SIZE; c++) grid[i * SIZE + c] = line[c];
  } else if (dir === "right") {
    for (let c = 0; c < SIZE; c++) grid[i * SIZE + (SIZE - 1 - c)] = line[c];
  } else if (dir === "up") {
    for (let r = 0; r < SIZE; r++) grid[r * SIZE + i] = line[r];
  } else {
    for (let r = 0; r < SIZE; r++) grid[(SIZE - 1 - r) * SIZE + i] = line[r];
  }
}

// move(grid, dir) -> { grid, moved, gained }
export function move(grid, dir) {
  const next = [...grid];
  let gained = 0;
  const lines = linesFor(grid, dir);
  lines.forEach((line, i) => {
    const collapsed = collapseRow(line);
    gained += collapsed.gained;
    writeLine(next, dir, i, collapsed.row);
  });
  const moved = next.some((v, i) => v !== grid[i]);
  return { grid: next, moved, gained };
}

export function hasMoves(grid) {
  if (emptyCells(grid).length > 0) return true;
  return ["left", "up"].some((dir) => move(grid, dir).moved);
}

export function maxTile(grid) {
  return Math.max(...grid);
}

export function newGame(rng = Math.random) {
  return spawnTile(spawnTile(emptyGrid(), rng), rng);
}
