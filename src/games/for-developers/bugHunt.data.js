// A bank of short snippets, each with exactly one bug on a known line
// (1-indexed). `hint` explains it on the result screen.
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
  },
];

function shuffle(a, rng) {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
