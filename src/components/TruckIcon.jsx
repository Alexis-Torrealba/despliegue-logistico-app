export default function TruckIcon({ variant }) {
  if (variant === "gandola") {
    // Gandola: chuto con remolque largo
    return (
      <svg className="truck-icon truck-icon--gandola" viewBox="0 0 36 24" aria-hidden="true">
        <g fill="currentColor">
          <rect x="1" y="5" width="21" height="11.5" rx="1.2" />
          <rect x="21" y="14.5" width="3" height="2" />
          <path
            fillRule="evenodd"
            d="M23.5 16.5V9.5A1.5 1.5 0 0 1 25 8h5.2a1.5 1.5 0 0 1 1.2.6l2.3 3.1a1.5 1.5 0 0 1 .3.9v3.4a.5.5 0 0 1-.5.5ZM25.5 10v2.6h5.8L29.4 10Z"
          />
          <circle cx="5" cy="19.2" r="2.1" />
          <circle cx="9.6" cy="19.2" r="2.1" />
          <circle cx="26.6" cy="19.2" r="2.1" />
          <circle cx="31.4" cy="19.2" r="2.1" />
        </g>
      </svg>
    );
  }

  return (
    <svg className="truck-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M2 6.5A1.5 1.5 0 0 1 3.5 5h10A1.5 1.5 0 0 1 15 6.5V8h3.1a1.5 1.5 0 0 1 1.2.6l2.4 3.2a1.5 1.5 0 0 1 .3.9v3.8a1.5 1.5 0 0 1-1.5 1.5h-.6a2.9 2.9 0 0 1-5.6 0H9.7a2.9 2.9 0 0 1-5.6 0h-.6A1.5 1.5 0 0 1 2 16.5Zm13 3v3h5.1L18 9.5ZM6.9 16.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm10.3 0a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"
      />
    </svg>
  );
}
