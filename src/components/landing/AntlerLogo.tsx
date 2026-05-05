"use client";

import { motion } from "framer-motion";

interface AntlerLogoProps {
  className?: string;
  variant?: "stroke" | "filled";
  animated?: boolean;
}

const ANTLER_PATHS = [
  "M12 28 C11 24 9 20 7 16 C5 12 3 8 4 4",
  "M12 28 C13 24 15 20 17 16 C19 12 21 8 20 4",
  "M7.5 14 C5 13 3.5 11 4 8",
  "M16.5 14 C19 13 20.5 11 20 8",
  "M5.5 9 C3 7 1.5 5 2 2",
  "M18.5 9 C21 7 22.5 5 22 2",
];

export function AntlerLogo({
  className = "w-4 h-5",
  variant = "stroke",
  animated = false,
}: AntlerLogoProps) {
  const strokeWidth = variant === "filled" ? 2.8 : 1.6;

  if (animated) {
    return (
      <svg
        viewBox="0 0 24 28"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {ANTLER_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: 1.1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.2, delay: i * 0.08 },
            }}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ANTLER_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
