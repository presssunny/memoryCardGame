import { shuffle } from "../../utils/random";

// A bank of short snippets, each with exactly one bug on a known line
// (1-indexed).
//   hint  — one-liner naming the bug (result screen + review fallback)
//   why   — what actually goes wrong at runtime because of it
//   fix   — the corrected version of the buggy line
export const SNIPPETS = [
  {
    lang: "js",
    lines: [
      "function sum(arr) {",
      "  let total = 0;",
      "  for (let i = 0; i <= arr.length; i++) {",
      "    total += arr[i];",
      "  }",
      "  return total;",
      "}",
    ],
    bugLine: 3,
    hint: "`i <= arr.length` runs one past the end — should be `<`.",
    why: "On the last iteration `arr[i]` is `undefined`, so `total` becomes `NaN`.",
    fix: "  for (let i = 0; i < arr.length; i++) {",
  },
  {
    lang: "js",
    lines: [
      "const items = [1, 2, 3];",
      "items.forEach(item => {",
      "  if (item = 2) {",
      "    console.log('found two');",
      "  }",
      "});",
    ],
    bugLine: 3,
    hint: "`item = 2` assigns instead of comparing — needs `===`.",
    why: "The assignment is always truthy, so the block runs for every item.",
    fix: "  if (item === 2) {",
  },
  {
    lang: "jsx",
    lines: [
      "function List({ rows }) {",
      "  return rows.map(row => (",
      "    <li>{row.name}</li>",
      "  ));",
      "}",
    ],
    bugLine: 3,
    hint: "The `<li>` in a list needs a `key` prop.",
    why: "Without a stable key React can't diff the list and may reorder or drop DOM nodes.",
    fix: "    <li key={row.id}>{row.name}</li>",
  },
  {
    lang: "css",
    lines: [
      ".card {",
      "  display: flex;",
      "  flex-direction: colum;",
      "  gap: 12px;",
      "}",
    ],
    bugLine: 3,
    hint: "`colum` is a typo for `column`.",
    why: "The declaration is invalid and ignored, so the layout falls back to `row`.",
    fix: "  flex-direction: column;",
  },
  {
    lang: "js",
    lines: [
      "async function load() {",
      "  const res = fetch('/api/data');",
      "  const json = await res.json();",
      "  return json;",
      "}",
    ],
    bugLine: 2,
    hint: "`fetch()` returns a promise — this line needs `await`.",
    why: "`res` is a Promise, so `res.json` is undefined and line 3 throws.",
    fix: "  const res = await fetch('/api/data');",
  },
  {
    lang: "html",
    lines: [
      "<label>Email</label>",
      "<input type='text' id='email'>",
      "<button onclick='submit()'>Send<button>",
    ],
    bugLine: 3,
    hint: "The closing tag should be `</button>`, not `<button>`.",
    why: "The unclosed button nests a second one, swallowing the rest of the form.",
    fix: "<button onclick='submit()'>Send</button>",
  },
  {
    lang: "js",
    lines: [
      "function greet(name) {",
      "  return 'Hi, ' + Name;",
      "}",
    ],
    bugLine: 2,
    hint: "`Name` is undefined — the parameter is `name` (lowercase).",
    why: "`Name` isn't declared, so the call throws a ReferenceError.",
    fix: "  return 'Hi, ' + name;",
  },
  {
    lang: "js",
    lines: [
      "const nums = [3, 1, 2];",
      "const sorted = nums.sort();",
      "// expected [1, 2, 3] for any numbers",
      "console.log(sorted);",
    ],
    bugLine: 2,
    hint: "`sort()` compares as strings — pass `(a, b) => a - b`.",
    why: "`[10, 2, 1].sort()` gives `[1, 10, 2]` — lexicographic, not numeric.",
    fix: "const sorted = nums.sort((a, b) => a - b);",
  },
  {
    lang: "js",
    lines: [
      "function last(arr) {",
      "  return arr[arr.length];",
      "}",
    ],
    bugLine: 2,
    hint: "`arr[arr.length]` is one past the end — use `arr.length - 1`.",
    why: "It always returns `undefined`, never the actual last element.",
    fix: "  return arr[arr.length - 1];",
  },
  {
    lang: "jsx",
    lines: [
      "function Counter() {",
      "  const [n, setN] = useState(0);",
      "  useEffect(() => {",
      "    setInterval(() => setN(n + 1), 1000);",
      "  }, []);",
      "  return <p>{n}</p>;",
      "}",
    ],
    bugLine: 4,
    hint: "The interval closes over a stale `n` (always 0) — use `setN(v => v + 1)`.",
    why: "The effect runs once, capturing `n = 0`, so the counter sticks at 1.",
    fix: "    setInterval(() => setN(v => v + 1), 1000);",
  },
  {
    lang: "js",
    lines: [
      "const user = null;",
      "if (user.name) {",
      "  console.log(user.name);",
      "}",
    ],
    bugLine: 2,
    hint: "Reading `.name` on `null` throws — guard with `user && user.name`.",
    why: "`Cannot read properties of null` crashes before the log ever runs.",
    fix: "if (user && user.name) {",
  },
  {
    lang: "py",
    lines: [
      "def average(nums):",
      "    total = 0",
      "    for x in nums:",
      "        total += x",
      "    return total / len(nums) + 1",
    ],
    bugLine: 5,
    hint: "`+ 1` is outside the intent — the mean is just `total / len(nums)`.",
    why: "Every average comes back one too high; off-by-one in the formula.",
    fix: "    return total / len(nums)",
  },
];

// generate(round) for useQuizGame: a snippet and one option per line.
export function makeBugHuntQuestion(round, rng = Math.random) {
  const snippet = shuffle(SNIPPETS, rng)[0];
  const options = snippet.lines.map((_, i) => ({
    id: `l${i + 1}`,
    label: `Line ${i + 1}`,
    correct: i + 1 === snippet.bugLine,
  }));
  return { prompt: snippet, options };
}
