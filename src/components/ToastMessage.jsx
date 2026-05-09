export const ToastMessage = ({ message }) => {
  return (
    <div className="toast-message" role="status" aria-live="polite">
      <span className="toast-dot" />
      <span>{message}</span>
    </div>
  );
};
