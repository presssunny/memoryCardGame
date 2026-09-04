// Presentational shell for every quiz-style game (useQuizGame drives it).
// The game passes the current prompt, the options, the engine's `feedback`
// object and an `onAnswer` handler; QuizStage owns the option grid, the
// right/wrong highlight and keyboard/disabled behaviour.
//
//   prompt        — ReactNode shown large above the options
//   instruction   — short line above the prompt ("Which one is different?")
//   options       — [{ id, correct, ... }] from the engine's question
//   renderOption  — (option) => ReactNode for the option's inner content
//   optionLabel   — (option) => string; the option button's accessible name,
//                   for icon/swatch-only options whose visible content names
//                   nothing (Color Tap)
//   feedback      — { id, correct } | null from useQuizGame
//   onAnswer      — (optionId) => void
//   columns       — fixed column count; omit for auto-fit
//   size          — "md" (default) or "lg" for big kid-friendly targets
//   hebrew        — localise the built-in a11y strings (group label, verdict)
export function QuizStage({
  prompt,
  instruction,
  options,
  renderOption = (o) => o.label,
  optionLabel,
  feedback,
  onAnswer,
  columns,
  size = "md",
  promptLabel,
  hebrew = false,
}) {
  const answered = !!feedback;
  const t = hebrew
    ? { choices: "אפשרויות", question: "שאלה", correct: "נכון", wrong: "לא נכון" }
    : {
        choices: "Answer choices",
        question: "Question",
        correct: "Correct",
        wrong: "Not quite",
      };
  const resolvedPromptLabel = promptLabel ?? t.question;

  const stateFor = (option) => {
    if (!answered) return "";
    if (option.id === feedback.id) return feedback.correct ? " is-correct" : " is-wrong";
    // Reveal the right answer when the player picked a wrong one.
    if (!feedback.correct && option.correct) return " is-answer";
    return " is-dimmed";
  };

  return (
    <div className={`quiz-stage quiz-stage--${size}`}>
      {instruction && <div className="quiz-instruction">{instruction}</div>}
      {prompt != null && (
        <div
          className={`quiz-prompt${
            typeof prompt === "string" && prompt.length > 3 ? " is-text" : ""
          }`}
          role="img"
          aria-label={
            typeof prompt === "string"
              ? `${resolvedPromptLabel}: ${prompt}`
              : resolvedPromptLabel
          }
        >
          {prompt}
        </div>
      )}
      <div
        className="quiz-options"
        role="group"
        aria-label={t.choices}
        style={columns ? { "--quiz-cols": columns } : undefined}
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`quiz-option${stateFor(option)}`}
            aria-label={optionLabel ? optionLabel(option) : undefined}
            onClick={() => onAnswer(option.id)}
            disabled={answered}
          >
            {renderOption(option)}
          </button>
        ))}
      </div>
      {/* Announce the result so a screen-reader user isn't left guessing. */}
      <p className="sr-only" role="status" aria-live="polite">
        {answered ? (feedback.correct ? t.correct : t.wrong) : ""}
      </p>
    </div>
  );
}
