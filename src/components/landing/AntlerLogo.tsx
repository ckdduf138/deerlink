export function AntlerLogo({ className = "w-4 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Left main beam */}
      <path d="M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4" />
      {/* Left upper tine */}
      <path d="M5.5 9 C3 7 1.5 5 2 2" />
      {/* Left lower tine */}
      <path d="M7.5 14 C5 13 3.5 11 4 8" />

      {/* Right main beam */}
      <path d="M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4" />
      {/* Right upper tine */}
      <path d="M18.5 9 C21 7 22.5 5 22 2" />
      {/* Right lower tine */}
      <path d="M16.5 14 C19 13 20.5 11 20 8" />
    </svg>
  );
}
