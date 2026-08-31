function shuffle(a, rng) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// generate(round): a quick arithmetic problem. Adds subtraction from round 3
// and multiplication from round 8; difficulty (operand size) grows slowly.
export function makeMathSprintQuestion(round, rng = Math.random) {
  const ops = ["+"];
  if (round >= 3) ops.push("−");
  if (round >= 8) ops.push("×");
  const op = ops[Math.floor(rng() * ops.length)];
  const size = Math.min(6 + Math.floor(round / 2), 20);

  let a;
  let b;
  let answer;
  if (op === "+") {
    a = 2 + Math.floor(rng() * size);
    b = 2 + Math.floor(rng() * size);
    answer = a + b;
  } else if (op === "−") {
    a = 4 + Math.floor(rng() * size);
    b = 1 + Math.floor(rng() * (a - 1));
    answer = a - b;
  } else {
    a = 2 + Math.floor(rng() * 9);
    b = 2 + Math.floor(rng() * 9);
    answer = a * b;
  }

  const candidates = new Set([answer]);
  while (candidates.size < 4) {
    const delta = 1 + Math.floor(rng() * 5);
    const alt = rng() < 0.5 ? answer + delta : answer - delta;
    if (alt >= 0 && alt !== answer) candidates.add(alt);
  }
  const options = shuffle(
    [...candidates].map((n) => ({ id: `n${n}`, label: String(n), correct: n === answer })),
    rng,
  );
  return { prompt: { a, b, op, text: `${a} ${op} ${b}` }, options };
}
