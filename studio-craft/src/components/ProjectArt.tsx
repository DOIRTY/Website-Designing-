/**
 * Generated abstract artwork used as the "high-res image placeholder" for each
 * case-study card. Inline SVG keeps it crisp at any size, themeable, and free of
 * external image requests.
 */
export function ProjectArt({ variant }: { variant: number }) {
  const art = [
    // 0 — fintech dashboard
    <>
      <circle cx="322" cy="48" r="96" fill="#fff" opacity="0.05" />
      <circle cx="322" cy="48" r="58" fill="#fff" opacity="0.05" />
      <rect x="28" y="52" width="126" height="204" rx="24" fill="#000" opacity="0.26" />
      <rect
        x="28"
        y="52"
        width="126"
        height="204"
        rx="24"
        stroke="#fff"
        strokeOpacity="0.16"
        fill="none"
      />
      <rect x="46" y="76" width="58" height="9" rx="4.5" fill="#fff" opacity="0.45" />
      <rect x="46" y="98" width="90" height="9" rx="4.5" fill="#fff" opacity="0.2" />
      <rect x="46" y="126" width="90" height="58" rx="12" fill="#67e8f9" opacity="0.85" />
      <rect x="46" y="198" width="42" height="15" rx="7.5" fill="#fff" opacity="0.4" />
      <rect x="178" y="72" width="180" height="56" rx="14" fill="#fff" opacity="0.08" />
      <rect x="178" y="142" width="180" height="56" rx="14" fill="#fff" opacity="0.08" />
      <rect x="196" y="92" width="64" height="15" rx="7.5" fill="#fff" opacity="0.4" />
      <rect x="196" y="162" width="96" height="15" rx="7.5" fill="#fff" opacity="0.22" />
      <path
        d="M196 244 L246 224 L296 232 L346 200"
        stroke="#c4b5fd"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
    </>,
    // 1 — commerce editorial
    <>
      <circle cx="120" cy="150" r="98" fill="#fff" opacity="0.1" />
      <circle cx="120" cy="150" r="60" fill="#000" opacity="0.18" />
      <path
        d="M96 126c14-14 34-14 48 0"
        stroke="#fff"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M96 174c14 14 34 14 48 0"
        stroke="#fff"
        strokeOpacity="0.28"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <g opacity="0.45">
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 8 }, (_, c) => (
            <circle
              key={`${r}-${c}`}
              cx={238 + c * 24}
              cy={62 + r * 32}
              r="3.2"
              fill="#fff"
              opacity={0.8 - r * 0.1}
            />
          )),
        )}
      </g>
      <rect x="34" y="228" width="148" height="10" rx="5" fill="#fff" opacity="0.28" />
      <rect x="34" y="250" width="92" height="10" rx="5" fill="#fff" opacity="0.16" />
    </>,
    // 2 — analytics
    <>
      <rect x="24" y="34" width="352" height="214" rx="20" fill="#000" opacity="0.24" />
      <rect
        x="24"
        y="34"
        width="352"
        height="214"
        rx="20"
        stroke="#fff"
        strokeOpacity="0.15"
        fill="none"
      />
      <rect x="24" y="34" width="352" height="36" rx="20" fill="#fff" opacity="0.06" />
      <circle cx="46" cy="52" r="4" fill="#fff" opacity="0.55" />
      <circle cx="60" cy="52" r="4" fill="#fff" opacity="0.32" />
      <circle cx="74" cy="52" r="4" fill="#fff" opacity="0.18" />
      <rect x="42" y="94" width="128" height="58" rx="12" fill="#fff" opacity="0.08" />
      <rect x="184" y="94" width="86" height="58" rx="12" fill="#fff" opacity="0.08" />
      <rect x="284" y="94" width="76" height="58" rx="12" fill="#fff" opacity="0.08" />
      <g fill="#5eead4">
        <rect x="56" y="184" width="16" height="34" rx="5" opacity="0.9" />
        <rect x="82" y="170" width="16" height="48" rx="5" opacity="0.72" />
        <rect x="108" y="188" width="16" height="30" rx="5" opacity="0.55" />
        <rect x="134" y="158" width="16" height="60" rx="5" opacity="1" />
      </g>
      <path
        d="M196 200 L226 178 L256 188 L286 158 L316 168 L346 142"
        stroke="#a5f3fc"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
    </>,
    // 3 — health
    <>
      <circle cx="304" cy="128" r="88" fill="#fff" opacity="0.06" />
      <circle cx="304" cy="128" r="56" fill="#fff" opacity="0.06" />
      <path
        d="M32 158h44l16-40 22 78 20-54 16 28h70"
        stroke="#ffd6e8"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.95"
      />
      <path
        d="M32 212c42 0 60-24 96-24s54 24 96 24"
        stroke="#fff"
        strokeOpacity="0.2"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <rect x="32" y="56" width="112" height="12" rx="6" fill="#fff" opacity="0.36" />
      <rect x="32" y="80" width="70" height="12" rx="6" fill="#fff" opacity="0.18" />
      <circle cx="304" cy="128" r="14" fill="#ffd6e8" opacity="0.9" />
    </>,
    // 4 — travel
    <>
      <circle cx="312" cy="66" r="40" fill="#ffd28a" opacity="0.92" />
      <path d="M0 224 L104 116 L166 184 L222 126 L312 224Z" fill="#000" opacity="0.26" />
      <path
        d="M0 224 L104 116 L166 184 L222 126 L312 224Z"
        stroke="#fff"
        strokeOpacity="0.3"
        strokeWidth="2"
        fill="none"
      />
      <path d="M72 156 L104 116 L136 156Z" fill="#fff" opacity="0.6" />
      <path d="M190 164 L222 126 L254 164Z" fill="#fff" opacity="0.36" />
      <path
        d="M0 252h400"
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <rect x="28" y="42" width="124" height="10" rx="5" fill="#fff" opacity="0.32" />
      <rect x="28" y="64" width="78" height="10" rx="5" fill="#fff" opacity="0.18" />
    </>,
    // 5 — AI
    <>
      <g stroke="#fff" strokeOpacity="0.22" strokeWidth="1.6" fill="none">
        <path d="M200 142 L108 84 M200 142 L292 84 M200 142 L108 202 M200 142 L292 202" />
        <path d="M108 84 L292 202 M108 202 L292 84 M200 48 L200 236 M108 84 L292 84 M108 202 L292 202" />
      </g>
      <g fill="#f0abfc">
        <circle cx="200" cy="142" r="16" opacity="1" />
        <circle cx="108" cy="84" r="9" opacity="0.9" />
        <circle cx="292" cy="84" r="9" opacity="0.9" />
        <circle cx="108" cy="202" r="9" opacity="0.9" />
        <circle cx="292" cy="202" r="9" opacity="0.9" />
        <circle cx="200" cy="48" r="7" opacity="0.7" />
        <circle cx="200" cy="236" r="7" opacity="0.7" />
      </g>
      <circle
        cx="200"
        cy="142"
        r="32"
        stroke="#f0abfc"
        strokeOpacity="0.45"
        strokeWidth="2"
        fill="none"
      />
      <circle
        cx="200"
        cy="142"
        r="56"
        stroke="#22d3ee"
        strokeOpacity="0.24"
        strokeWidth="2"
        fill="none"
      />
    </>,
  ]

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 size-full"
      role="presentation"
      focusable="false"
    >
      {art[variant % art.length]}
    </svg>
  )
}
