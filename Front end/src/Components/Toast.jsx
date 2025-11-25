export default function Toast({ message, onClose }) {
  return (
    <div className="reddit-toast">
      <span>{message}</span>
      <button className="reddit-toast-close" onClick={onClose}>✕</button>
    </div>
  );
}
