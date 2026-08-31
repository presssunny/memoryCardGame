// Presentational shell for every quiz-style game (useQuizGame drives it).
// The game passes the current prompt, the options, the engine's `feedback`
// object and an `onAnswer` handler; QuizStage owns the option grid, the
// right/wrong highlight and keyboard/disabled behaviour.
//
//   prompt        — ReactNode shown large above the options
//   instruction   — short line above the prompt ("Which one is different?")
//   options       — [{ id, correct, ... }] from the engine's question
//   renderOption  — (option) => ReactNode for the option's inner content
//   feedback      — { id, correct } | null from useQuizGame
//   onAnswer      — (optionId) => void
//   columns       — fixed column count; omit for auto-fit
//   size          — "md" (default) or "lg" for big kid-friendly targets
export function QuizStage({
  prompt,
  instruction,
  options,
  renderOption = (o) => o.label,
  feedback,
  onAnswer,
  columns,
  size = "md",
  promptLabel = "Question",
}) {
  const answered = !!feedback;

  const stateFor = (option) => {
    if (!answered) return "";
    if (option.id === feedback.id) return feedback.correct ? " is-correct" : " is-wrong";
    // Reveal the right answer when the player picked a wrong one.
    if (!feedback.correct && option.correct) return " is-answer";
    return " is-dimmed";
  };

  return (
    <div className={`quiz-stage quiz-stage--${size}`}>
      {instruction && <p className="quiz-instruction">{instruction}</p>}
      {prompt != null && (
        <div
          className={`quiz-prompt${
            typeof prompt === "string" && prompt.length > 3 ? " is-text" : ""
          }`}
          role="img"
          aria-label={
            typeof prompt === "string"
              ? `${promptLabel}: ${prompt}`
              : promptLabel
          }
        >
          {prompt}
        </div>
      )}
      <div
        className="quiz-options"
        role="group"
        aria-label="Answer choices"
        style={
          columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined
        }
      >
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`quiz-option${stateFor(option)}`}
            onClick={() => onAnswer(option.id)}
            disabled={answered}
          >
            {renderOption(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
