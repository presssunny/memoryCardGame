// Short, real snippets across the stack. Kept to one line so the typing
// target fits without scrolling.
export const SNIPPETS = [
  "const sum = (a, b) => a + b;",
  "for (let i = 0; i < items.length; i++) {}",
  "arr.filter((x) => x > 0).map((x) => x * 2);",
  ".card { display: flex; gap: 12px; }",
  "const [count, setCount] = useState(0);",
  "if (!user) return <Login />;",
  "await fetch('/api/data').then((r) => r.json());",
  "export default function App() { return null; }",
  "type User = { id: number; name: string };",
  "npm run build && npm run preview",
  "git commit -m 'fix: off-by-one in loop'",
  "app.get('/health', (req, res) => res.send('ok'));",
];

export function pickSnippet(rng = Math.random) {
  return SNIPPETS[Math.floor(rng() * SNIPPETS.length)];
}
