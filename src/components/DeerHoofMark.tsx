interface DeerHoofMarkProps {
  className?: string;
}

export function DeerHoofMark({ className = "w-3 h-4" }: DeerHoofMarkProps) {
  return (
    <svg
      viewBox="0 0 12 16"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="3.6" cy="8" rx="1.7" ry="5.5" />
      <ellipse cx="8.4" cy="8" rx="1.7" ry="5.5" />
    </svg>
  );
}
