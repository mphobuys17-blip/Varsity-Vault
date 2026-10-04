
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
  /*
   * ============================================================
   * COMPACT VERSION
   * ============================================================
   *
   * Used in the navbar / smaller spaces.
   *
   * Keeps the recognizable:
   * - blue exchange arrow
   * - white X
   * - neon-lime exchange arrow
   */

  if (compact) {
    return (
      <svg
        viewBox="0 0 170 150"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ResXchange"
        className={className}
        {...props}
      >
        <defs>
          <linearGradient
            id="rx-blue-compact"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#2387FF" />
            <stop offset="100%" stopColor="#0066FF" />
          </linearGradient>

          <linearGradient
            id="rx-lime-compact"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#DFFF00" />
            <stop offset="100%" stopColor="#B8F500" />
          </linearGradient>
        </defs>

        {/* ======================================================
            BLUE TOP EXCHANGE ARC
        ====================================================== */}

        <path
          d="M35 65
             C47 32 79 15 112 24
             C126 28 138 36 148 48"
          fill="none"
          stroke="url(#rx-blue-compact)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* BLUE ARROW HEAD */}

        <path
          d="M127 23
             L154 49
             L118 49
             Z"
          fill="url(#rx-blue-compact)"
        />

        {/* ======================================================
            BLUE DIAGONAL X SECTION
        ====================================================== */}

        <path
          d="M92 57
             L121 57
             L78 103
             L62 103
             Z"
          fill="url(#rx-blue-compact)"
        />

        <path
          d="M122 57
             L149 57
             L91 120
             L74 120
             Z"
          fill="url(#rx-blue-compact)"
        />

        {/* ======================================================
            WHITE X
        ====================================================== */}

        <path
          d="M35 48
             L61 48
             L133 119
             L106 119
             Z"
          fill="#FFFFFF"
        />

        <path
          d="M128 48
             L151 48
             L74 126
             L49 126
             Z"
          fill="#FFFFFF"
        />

        {/* ======================================================
            LIME BOTTOM EXCHANGE ARC
        ====================================================== */}

        <path
          d="M133 105
             C120 132 89 143 59 134
             C47 130 37 124 28 114"
          fill="none"
          stroke="url(#rx-lime-compact)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* LIME ARROW HEAD */}

        <path
          d="M40 104
             L18 113
             L43 135
             Z"
          fill="url(#rx-lime-compact)"
        />
      </svg>
    );
  }

  /*
   * ============================================================
   * FULL LOGO
   * ============================================================
   *
   * Designed around the supplied ResXchange reference:
   *
   * RES  [X / exchange symbol]  CHANGE
   *
   * with the tagline underneath.
   */

  return (
    <svg
      viewBox="0 0 1000 430"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ResXchange — Swap. Sell. Connect."
      className={className}
      {...props}
    >
      <defs>
        {/* ======================================================
            BLUE GRADIENT
        ====================================================== */}

        <linearGradient
          id="rx-blue"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#2387FF" />
          <stop offset="55%" stopColor="#0877FF" />
          <stop offset="100%" stopColor="#0062FF" />
        </linearGradient>

        {/* ======================================================
            LIME GRADIENT
        ====================================================== */}

        <linearGradient
          id="rx-lime"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#E4FF19" />
          <stop offset="55%" stopColor="#CFFF00" />
          <stop offset="100%" stopColor="#B8F500" />
        </linearGradient>

        {/* ======================================================
            SUBTLE WHITE SHADOW
        ====================================================== */}

        <filter
          id="rx-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="3"
            stdDeviation="3"
            floodColor="#000000"
            floodOpacity="0.16"
          />
        </filter>
      </defs>

      {/* ========================================================
          BRAND WORDMARK
      ======================================================== */}

      <g
        fontFamily="Arial Black, Helvetica Neue, Arial, sans-serif"
        fontStyle="italic"
        fontWeight="900"
        fill="#FFFFFF"
        letterSpacing="-8"
        filter="url(#rx-shadow)"
      >
        {/* RES */}

        <text
          x="48"
          y="246"
          fontSize="154"
        >
          Res
        </text>

        {/* CHANGE */}

        <text
          x="536"
          y="246"
          fontSize="142"
          letterSpacing="-7"
        >
          change
        </text>
      </g>

      {/* ========================================================
          EXCHANGE SYMBOL
      ======================================================== */}

      <g filter="url(#rx-shadow)">
        {/* ======================================================
            BLUE TOP ARC
        ====================================================== */}

        <path
          d="
            M327 143
            C347 91 397 61 451 66
            C481 69 509 82 531 103
          "
          fill="none"
          stroke="url(#rx-blue)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* ======================================================
            BLUE TOP ARROW HEAD
        ====================================================== */}

        <path
          d="
            M507 70
            L548 108
            L493 108
            Z
          "
          fill="url(#rx-blue)"
        />

        {/* ======================================================
            BLUE INNER EXCHANGE STROKE
        ====================================================== */}

        <path
          d="
            M435 119
            L502 119
            L452 170
            L422 199
            L393 199
            Z
          "
          fill="url(#rx-blue)"
        />

        <path
          d="
            M488 119
            L536 119
            L458 201
            L427 233
            L397 233
            Z
          "
          fill="url(#rx-blue)"
        />

        {/* ======================================================
            MAIN WHITE X — LEFT TO RIGHT
        ====================================================== */}

        <path
          d="
            M327 121
            L369 121
            L497 251
            L452 251
            Z
          "
          fill="#FFFFFF"
        />

        {/* ======================================================
            MAIN WHITE X — RIGHT TO LEFT
        ====================================================== */}

        <path
          d="
            M489 121
            L530 121
            L397 260
            L356 260
            Z
          "
          fill="#FFFFFF"
        />

        {/* ======================================================
            SMALL BLUE INNER X ACCENT
        ====================================================== */}

        <path
          d="
            M427 170
            L451 146
            L466 161
            L442 185
            Z
          "
          fill="url(#rx-blue)"
        />

        {/* ======================================================
            LIME BOTTOM ARC
        ====================================================== */}

        <path
          d="
            M494 245
            C475 286 426 306 379 298
            C348 293 322 276 303 255
          "
          fill="none"
          stroke="url(#rx-lime)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* ======================================================
            LIME BOTTOM ARROW HEAD
        ====================================================== */}

        <path
          d="
            M321 245
            L286 257
            L324 291
            Z
          "
          fill="url(#rx-lime)"
        />
      </g>

      {/* ========================================================
          TAGLINE
      ======================================================== */}

      <g
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="10"
      >
        {/* SWAP. SELL. */}

        <text
          x="274"
          y="340"
          fill="#FFFFFF"
        >
          SWAP. SELL.
        </text>

        {/* CONNECT. */}

        <text
          x="563"
          y="340"
          fill="#2387FF"
        >
          CONNECT.
        </text>
      </g>
    </svg>
  );
}
