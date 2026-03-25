// Continent paths drawn in a 320×320 equatorial strip.
// Rendered twice side-by-side so the CSS translateX loop is seamless.
function LandPaths() {
  return (
    <>
      {/* ── Western Hemisphere ─────────────────────────────── */}

      {/* Greenland */}
      <path d="M 118,38 L 130,30 L 148,28 L 160,33
               L 165,42 L 160,52 L 148,58 L 133,58
               L 120,52 Z" />

      {/* Iceland */}
      <path d="M 158,62 L 168,58 L 175,63 L 172,70 L 160,72 Z" />

      {/* North America */}
      <path d="
        M  50,82  L  58,64  L  72,52  L  92,46
        L 112,46  L 130,52  L 142,62  L 148,76
        L 150,90  L 146,104 L 140,114 L 134,122
        L 128,124 L 122,120 L 116,118 L 108,120
        L  98,124 L  90,132 L  86,144 L  84,158
        L  88,166 L  84,160 L  76,144 L  66,126
        L  54,106 Z
      " />
      {/* Florida */}
      <path d="M 140,114 L 144,120 L 140,128 L 133,130
               L 130,124 L 134,118 Z" />
      {/* Cuba */}
      <path d="M 112,138 L 124,136 L 126,140 L 114,142 Z" />
      <path d="M 128,142 L 133,140 L 134,144 L 129,145 Z" />

      {/* South America */}
      <path d="
        M  90,172 L 104,166 L 120,164 L 138,168
        L 150,178 L 158,194 L 158,214 L 152,234
        L 140,250 L 126,262 L 114,264 L 104,256
        L  96,240 L  90,220 L  88,200 L  90,182 Z
      " />

      {/* ── Europe & Africa ────────────────────────────────── */}

      {/* Europe main */}
      <path d="
        M 172,68  L 174,58  L 180,52  L 190,48
        L 200,50  L 208,56  L 212,65  L 208,74
        L 200,80  L 193,84  L 186,82  L 180,76
        L 174,78  L 170,74  Z
      " />
      {/* Iberian lower jut */}
      <path d="M 172,72 L 178,76 L 175,84 L 168,82 L 168,74 Z" />
      {/* British Isles */}
      <path d="M 176,52 L 180,46 L 186,46 L 186,54 L 180,56 Z" />
      {/* Scandinavia */}
      <path d="M 200,44 L 208,38 L 215,42 L 214,54 L 208,56 L 202,50 Z" />

      {/* Africa */}
      <path d="
        M 172,104 L 186,96  L 202,94  L 216,98
        L 226,108 L 230,122 L 228,140 L 232,152
        L 224,162 L 214,178 L 206,196 L 198,216
        L 190,230 L 180,234 L 170,228 L 163,210
        L 162,190 L 164,168 L 168,148 L 168,128
        L 170,112 Z
      " />
      {/* Horn of Africa */}
      <path d="M 228,138 L 236,142 L 230,152 L 222,158 L 224,148 Z" />
      {/* Madagascar */}
      <path d="M 216,198 L 222,192 L 226,202 L 222,214 L 215,212 Z" />

      {/* ── Middle East & Asia ─────────────────────────────── */}

      {/* Arabia */}
      <path d="
        M 228,106 L 240,108 L 252,114 L 254,128
        L 248,142 L 238,148 L 230,142 L 228,128 Z
      " />

      {/* India */}
      <path d="
        M 244,108 L 258,106 L 268,112 L 272,124
        L 270,138 L 262,152 L 252,162 L 246,156
        L 242,142 L 240,126 Z
      " />

      {/* East Asia / China */}
      <path d="
        M 258,62  L 272,56  L 288,58  L 300,66
        L 308,78  L 310,92  L 306,106 L 296,114
        L 282,118 L 268,116 L 256,110 L 250,96
        L 250,80  Z
      " />

      {/* Southeast Asia */}
      <path d="
        M 268,118 L 280,114 L 290,118 L 294,130
        L 288,142 L 276,146 L 266,140 L 262,128 Z
      " />
      {/* Malay peninsula */}
      <path d="M 278,142 L 284,138 L 286,150 L 280,156 L 274,150 Z" />

      {/* Japan */}
      <path d="M 298,72 L 304,68 L 310,74 L 308,84 L 300,86 L 296,80 Z" />

      {/* Australia */}
      <path d="
        M 268,182 L 284,176 L 300,176 L 312,184
        L 318,196 L 316,210 L 308,220 L 294,226
        L 278,224 L 266,216 L 260,204 L 260,192 Z
      " />
      {/* New Zealand */}
      <path d="M 316,206 L 320,200 L 324,206 L 320,214 Z" />
      <path d="M 318,218 L 322,214 L 325,220 L 320,226 Z" />
    </>
  );
}

export default function Globe({ size = 320, fast = false }: { size?: number; fast?: boolean }) {
  const clipId = "globe-clip";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <style>{`
          @keyframes globeSpin {
            from { transform: translateX(0px);    }
            to   { transform: translateX(-320px); }
          }
          .globe-spin {
            animation: globeSpin 32s linear infinite;
          }
          .globe-spin-fast {
            animation: globeSpin 3s linear infinite;
            transition: animation-duration 0.6s ease-in;
          }
        `}</style>

        <clipPath id={clipId}>
          <circle cx="160" cy="160" r="158" />
        </clipPath>

        {/* Ocean — deep navy at edges, mid-blue at lit centre */}
        <radialGradient id="g-ocean" cx="40%" cy="35%" r="62%">
          <stop offset="0%"   stopColor="#2e7ab8" />
          <stop offset="45%"  stopColor="#1a5088" />
          <stop offset="100%" stopColor="#080e28" />
        </radialGradient>

        {/* Broad light wash — top-left illumination */}
        <radialGradient id="g-light" cx="34%" cy="28%" r="58%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.22)" />
          <stop offset="60%"  stopColor="rgba(255,255,255,0.04)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>

        {/* Specular hot-spot */}
        <radialGradient id="g-specular" cx="36%" cy="30%" r="18%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.45)" />
          <stop offset="55%"  stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
        </radialGradient>

        {/* Terminator — day/night diagonal */}
        <linearGradient id="g-terminator" x1="0.15" y1="0" x2="1" y2="1">
          <stop offset="38%"  stopColor="rgba(0,0,18,0)"    />
          <stop offset="60%"  stopColor="rgba(0,0,18,0.50)" />
          <stop offset="100%" stopColor="rgba(0,0,18,0.82)" />
        </linearGradient>

        {/* Limb darkening — edges darken naturally */}
        <radialGradient id="g-limb" cx="50%" cy="50%" r="50%">
          <stop offset="65%"  stopColor="rgba(0,0,20,0)"    />
          <stop offset="88%"  stopColor="rgba(0,0,20,0.28)" />
          <stop offset="100%" stopColor="rgba(0,0,20,0.62)" />
        </radialGradient>

        {/* Atmosphere rim */}
        <radialGradient id="g-atmos" cx="50%" cy="50%" r="50%">
          <stop offset="82%"  stopColor="rgba(80,160,255,0)"     />
          <stop offset="90%"  stopColor="rgba(100,185,255,0.32)" />
          <stop offset="96%"  stopColor="rgba(80,155,255,0.18)"  />
          <stop offset="100%" stopColor="rgba(60,120,255,0.02)"  />
        </radialGradient>
      </defs>

      {/* ── 1. Ocean base (static) ── */}
      <circle cx="160" cy="160" r="158" fill="url(#g-ocean)" />

      {/* ── 2. Spinning continents — two tiled copies ── */}
      <g clipPath={`url(#${clipId})`} fill="#7aab6a" fillOpacity="0.88">
        <g className={fast ? "globe-spin-fast" : "globe-spin"}>
          <g><LandPaths /></g>
          <g transform="translate(320, 0)"><LandPaths /></g>
        </g>
      </g>

      {/* ── 3. Depth + lighting layers (static, over continents) ── */}
      <g clipPath={`url(#${clipId})`}>
        <circle cx="160" cy="160" r="158" fill="url(#g-light)"      />
        <circle cx="160" cy="160" r="158" fill="url(#g-terminator)" />
        <circle cx="160" cy="160" r="158" fill="url(#g-limb)"       />
        <circle cx="160" cy="160" r="158" fill="url(#g-specular)"   />
      </g>

      {/* ── 4. Atmosphere rim (bleeds past edge) ── */}
      <circle cx="160" cy="160" r="174" fill="url(#g-atmos)" />

      {/* ── 5. Crisp border ── */}
      <circle cx="160" cy="160" r="158" fill="none"
        stroke="rgba(100,170,255,0.2)" strokeWidth="1.5" />
    </svg>
  );
}
