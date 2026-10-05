"use client";

import type { SVGProps } from "react";

type ResXchangeLogoProps = SVGProps<SVGSVGElement> & {
  compact?: boolean;
};

export default function ResXchangeLogo({
  compact = false,
  className = "",
  ...props
}: ResXchangeLogoProps) {
  const id = compact ? "rx-compact" : "rx-full";

  return (
    <svg
      viewBox={compact ? "0 0 180 180" : "0 0 1100 300"}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Res X change"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient
          id={`${id}-x`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#5B9CFF" />
          <stop offset="50%" stopColor="#3A86FF" />
          <stop offset="100%" stopColor="#B8F500" />
        </linearGradient>

        <filter
          id={`${id}-glow`}
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur
            stdDeviation="8"
            result="blur"
          />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {compact ? (
        <text
          x="90"
          y="115"
          textAnchor="middle"
          fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
          fontSize="105"
          fontWeight="900"
          fontStyle="italic"
          fill={`url(#${id}-x)`}
          filter={`url(#${id}-glow)`}
        >
          X
        </text>
      ) : (
        <>
          {/* RES */}
          <text
            x="70"
            y="190"
            fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
            fontSize="145"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="-7"
            fill="#FFFFFF"
          >
            Res
          </text>

          {/* X */}
          <text
            x="455"
            y="190"
            textAnchor="middle"
            fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
            fontSize="165"
            fontWeight="900"
            fontStyle="italic"
            fill={`url(#${id}-x)`}
            filter={`url(#${id}-glow)`}
          >
            X
          </text>

          {/* CHANGE */}
          <text
            x="535"
            y="190"
            fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
            fontSize="145"
            fontWeight="900"
            fontStyle="italic"
            letterSpacing="-7"
            fill="#FFFFFF"
          >
            change
          </text>
        </>
      )}
    </svg>
  );
}