import { GameResult } from "./game-ui/GameResult";

// Game-over screen. Public API unchanged (title, message, note, onRetry,
// hebrew) plus optional onExit and, for score-based games, bigValue /
// bigLabel / isRecord / meta to show a proper result. Renders GameResult.
export const LoseMessage = ({
  title,
  message,
  note,
  onRetry,
  onExit,
  hebrew = false,
  bigValue,
  bigLabel,
  isRecord = false,
  meta = [],
}) => {
  const combinedNote =
    message || note ? (
      <>
        {message && <span>{message}</span>}
        {message && note && <br />}
        {note && <span>{note}</span>}
      </>
    ) : undefined;

  return (
    <GameResult
      variant="lose"
      title={title}
      bigValue={bigValue}
      bigLabel={bigLabel}
      isRecord={isRecord}
      meta={meta}
      note={combinedNote}
      onPlayAgain={onRetry}
      onExit={onExit}
      hebrew={hebrew}
    />
  );
};
