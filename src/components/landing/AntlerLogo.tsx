"use client";

import { motion } from "framer-motion";
import { ANTLER_LOGO_PATHS } from "./antler-logo-paths";

interface AntlerLogoProps {
  className?: string;
  variant?: "stroke" | "filled";
  animated?: boolean;
}

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
        {ANTLER_LOGO_PATHS.map((d, i) => (
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
      {ANTLER_LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
