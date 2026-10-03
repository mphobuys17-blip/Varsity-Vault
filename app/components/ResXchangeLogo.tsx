
"use client";

type ResXchangeLogoProps = {
  className?: string;
  compact?: boolean;
};

export default function ResXchangeLogo({
  className = "",
  compact = false,
}: ResXchangeLogoProps) {
  /*
   * =========================================================
   * RESXCHANGE LOGO
   * =========================================================
   *
   * compact = true
   * → Navbar / smaller UI
   *
   * compact = false
   * → Large landing-page / hero logo
   *
   * The SVG uses only inline vector elements, so there are
   * no external image requests or dependency issues.
   */

  if (compact) {
    return (
      <svg
        className={className}
        viewBox="0 0 420 90"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ResXchange"
        preserveAspectRatio="xMinYMid meet"
      >
        <defs>
          <linearGradient
            id="resx-compact-blue"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1687FF" />
            <stop offset="100%" stopColor="#0062FF" />
          </linearGradient>

          <linearGradient
            id="resx-compact-green"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#DFFF00" />
            <stop offset="100%" stopColor="#AFFF00" />
          </linearGradient>
        </defs>

        {/* =====================================================
            ICON
        ===================================================== */}

        {/* Top blue circular arrow */}
        <path
          d="M18 40 C23 18 43 7 63 11 C75 13 84 20 89 29"
          fill="none"
          stroke="url(#resx-compact-blue)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M82 13 L94 30 L73 28 Z"
          fill="url(#resx-compact-blue)"
        />

        {/* Bottom green circular arrow */}
        <path
          d="M91 50 C86 72 66 83 46 79 C34 77 25 70 20 61"
          fill="none"
          stroke="url(#resx-compact-green)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        <path
          d="M27 77 L15 60 L36 62 Z"
          fill="url(#resx-compact-green)"
        />

        {/* =====================================================
            X MARK
        ===================================================== */}

        <path
          d="M36 25 L69 67"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="square"
        />

        <path
          d="M40 68 L72 25"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="square"
        />

        {/* Blue X accent */}
        <path
          d="M55 50 L73 27 L88 27 L65 55 Z"
          fill="url(#resx-compact-blue)"
        />

        {/* =====================================================
            WORDMARK
        ===================================================== */}

        <text
          x="112"
          y="58"
          fill="#FFFFFF"
          fontSize="48"
          fontWeight="900"
          fontStyle="italic"
          fontFamily="Arial, Helvetica, sans-serif"
          letterSpacing="-3"
        >
          ResXchange
        </text>
      </svg>
    );
  }

  /*
   * =========================================================
   * FULL LOGO
   * =========================================================
   */

  return (
    <svg
      className={className}
      viewBox="0 0 1200 620"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ResXchange — Swap. Sell. Connect."
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="resx-full-blue"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#1687FF" />
          <stop offset="100%" stopColor="#0062FF" />
        </linearGradient>

        <linearGradient
          id="resx-full-green"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#DFFF00" />
          <stop offset="100%" stopColor="#AFFF00" />
        </linearGradient>
      </defs>

      {/* =====================================================
          WORDMARK
      ===================================================== */}

      <text
        x="75"
        y="350"
        fill="#FFFFFF"
        fontSize="170"
        fontWeight="900"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="-12"
      >
        Res
      </text>

      <text
        x="735"
        y="350"
        fill="#FFFFFF"
        fontSize="170"
        fontWeight="900"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="-12"
      >
        change
      </text>

      {/* =====================================================
          TOP BLUE ARROW
      ===================================================== */}

      <path
        d="M435 190 C505 115 615 105 710 150"
        fill="none"
        stroke="url(#resx-full-blue)"
        strokeWidth="18"
        strokeLinecap="round"
      />

      <path
        d="M700 98 L770 175 L655 164 Z"
        fill="url(#resx-full-blue)"
      />

      {/* =====================================================
          BOTTOM GREEN ARROW
      ===================================================== */}

      <path
        d="M770 455 C690 530 570 540 475 495"
        fill="none"
        stroke="url(#resx-full-green)"
        strokeWidth="18"
        strokeLinecap="round"
      />

      <path
        d="M475 555 L405 480 L515 488 Z"
        fill="url(#resx-full-green)"
      />

      {/* =====================================================
          CENTRAL X
      ===================================================== */}

      <path
        d="M440 205 L625 440"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="48"
        strokeLinecap="square"
      />

      <path
        d="M470 445 L650 220"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="48"
        strokeLinecap="square"
      />

      {/* Blue section of X */}
      <path
        d="M590 300 L660 215 L735 215 L625 345 Z"
        fill="url(#resx-full-blue)"
      />

      {/* Blue diagonal accent */}
      <path
        d="M570 330 L615 275 L665 275 L600 350 Z"
        fill="url(#resx-full-blue)"
      />

      {/* =====================================================
          TAGLINE
      ===================================================== */}

      <text
        x="325"
        y="515"
        fill="#FFFFFF"
        fontSize="34"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="13"
      >
        SWAP. SELL.
      </text>

      <text
        x="700"
        y="515"
        fill="#1687FF"
        fontSize="34"
        fontWeight="700"
        fontStyle="italic"
        fontFamily="Arial, Helvetica, sans-serif"
        letterSpacing="13"
      >
        CONNECT.
      </text>
    </svg>
  );
}
