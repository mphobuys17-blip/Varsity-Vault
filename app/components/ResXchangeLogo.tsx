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
   * Rebuilt to match the brand reference 1:1 (768x512 canvas).
   *
   * Structure of the mark (bottom -> top):
   *   1. "/" arm of the X (white)
   *   2. blue diagonal shaft          (passes BEHIND the "/" arm)
   *   3. blue top arc + arrowhead     (passes IN FRONT of the "/" arm)
   *   4. "\" arm of the X (white)
   *   5. lime return arc + arrowhead
   */
  const id = compact ? "rx-c" : "rx-f";

  const symbol = (
    <>
      {/* ============ "/" arm of the X (bottom layer) ============ */}
      <path
        d="M286.4 315.0L399.6 223.0L381.8 201.0L268.5 292.9Z"
        fill="#FFFFFF"
      />

      {/* ============ blue diagonal shaft (behind "/" arm) ============ */}
      <path
        d="M378 196L436 196L388 252L364 260Z"
        fill={`url(#${id}-blue)`}
      />

      {/* ============ blue arc over the top ============ */}
      <path
        d="M285 186A90.6 90.6 0 0 1 399 157"
        fill="none"
        stroke={`url(#${id}-blue)`}
        strokeWidth="25"
        strokeLinecap="round"
      />

      {/* ============ blue arrowhead (right) ============ */}
      <path
        d="M396 148L444 182L396 202Z"
        fill={`url(#${id}-blue)`}
      />

      {/* ============ "\" arm of the X (top layer) ============ */}
      <path
        d="M281.8 207.4L410.8 327.2L430.6 305.8L301.7 186.0Z"
        fill="#FFFFFF"
      />

      {/* ============ lime return arc ============ */}
      <path
        d="M408 328A162.8 162.8 0 0 1 311 356"
        fill="none"
        stroke={`url(#${id}-lime)`}
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* ============ lime arrowhead (left) ============ */}
      <path
        d="M262 330L308 320L308 354Z"
        fill={`url(#${id}-lime)`}
      />
    </>
  );

  const gradients = (
    <defs>
      <linearGradient id={`${id}-blue`} x1="0" y1="0" x2="0.55" y2="1">
        <stop offset="0%" stopColor="#2090FF" />
        <stop offset="100%" stopColor="#0663EE" />
      </linearGradient>
      <linearGradient id={`${id}-lime`} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#CDF92E" />
        <stop offset="100%" stopColor="#E4FF4C" />
      </linearGradient>
    </defs>
  );

  /* ============ COMPACT: just the mark ============ */
  if (compact) {
    return (
      <svg
        viewBox="255 140 210 225"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="ResXchange"
        className={className}
        {...props}
      >
        {gradients}
        {symbol}
      </svg>
    );
  }

  /* ============ FULL LOGO ============ */
  return (
    <svg
      viewBox="0 0 768 512"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ResXchange — Swap. Sell. Connect."
      className={className}
      {...props}
    >
      {gradients}

      {/* brand navy */}
      <rect width="768" height="512" fill="#031334" />

      {/* ============ wordmark ============ */}
      <g
        fontStyle="italic"
        fontWeight="900"
        fontFamily="'Arial Black','Helvetica Neue',Arial,sans-serif"
        fill="#FFFFFF"
      >
        <text x="78" y="288" fontSize="100" textLength="189">
          Res
        </text>
        <text x="432" y="288" fontSize="95" textLength="286">
          change
        </text>
      </g>

      {/* ============ the exchange symbol ============ */}
      {symbol}

      {/* ============ tagline ============ */}
      <g
        fontFamily="Arial,'Helvetica Neue',sans-serif"
        fontWeight="800"
        fontSize="16"
      >
        <text x="195" y="394" fill="#FFFFFF" textLength="186">
          SWAP. SELL.
        </text>
        <text x="405" y="394" fill="#0E66E3" textLength="140">
          CONNECT.
        </text>
      </g>
    </svg>
  );
}