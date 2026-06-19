<script>
  // Decorative overlay for the zoo entrance.
  // Left side (parking): car at (row 1, col 1), roundabout ring at (rows 2–5, cols 3–5).
  // Right side (before Central Plaza): ticket booths at cols 19–20, flush with the right
  //   end of the approach path (which ends at col 18). Upper booth: rows 6–9. Lower: rows
  //   11–14. Sellers stand at col 18 (path); queue stretches left along the path.
  // Drawn above tile cells (z-index 1), below character sprites (z-index 2).

  let { tile } = $props();
</script>

{#snippet ticketBooth()}
  {@const w = 2 * tile}
  {@const h = 4 * tile}
  <svg width={w} height={h} viewBox="0 0 {w} {h}" aria-hidden="true">
    <!-- canopy -->
    <rect x="4" y="6" width={w - 8} height="22" rx="3" fill="#3a6b9e"/>
    <rect x="4" y="6" width={w - 8} height="7" rx="3" fill="rgba(255,255,255,0.2)"/>
    <!-- scalloped canopy edge -->
    {#each [10, 22, 34, 46, 58, 70, 82, 96, 104] as cx}
      <circle {cx} cy="28" r="9" fill="#3a6b9e"/>
    {/each}
    <!-- TICKETS sign on canopy -->
    <rect x="22" y="9" width={w - 44} height="13" rx="2" fill="#f5d65b"/>
    <text x={w / 2} y="20" text-anchor="middle" font-size="7.5" fill="#3a2a10"
      font-family="sans-serif" font-weight="bold">TICKETS</text>
    <!-- booth body -->
    <rect x="6" y="28" width={w - 12} height="52" rx="3" fill="#e4d0a0"/>
    <!-- two service windows, side by side -->
    <rect x="12"      y="34" width="36" height="30" rx="3" fill="#bfe0ea" stroke="#4a6a8a" stroke-width="2"/>
    <line x1={12 + 18} y1="34" x2={12 + 18} y2="64" stroke="#4a6a8a" stroke-width="1.5"/>
    <line x1="12" y1="49" x2="48" y2="49" stroke="#4a6a8a" stroke-width="1.5"/>
    <rect x={tile + 8} y="34" width="36" height="30" rx="3" fill="#bfe0ea" stroke="#4a6a8a" stroke-width="2"/>
    <line x1={tile + 8 + 18} y1="34" x2={tile + 8 + 18} y2="64" stroke="#4a6a8a" stroke-width="1.5"/>
    <line x1={tile + 8} y1="49" x2={tile + 44} y2="49" stroke="#4a6a8a" stroke-width="1.5"/>
    <!-- transaction slots -->
    <rect x="18" y="60" width="22" height="5" rx="2" fill="#7a5a30"/>
    <rect x={tile + 14} y="60" width="22" height="5" rx="2" fill="#7a5a30"/>
    <!-- base counter -->
    <rect x="4" y="80" width={w - 8} height="8" rx="2" fill="#c8b880"/>
    <!-- queue rope stanchions -->
    <circle cx="10" cy={2 * tile + 20} r="5" fill="#b8a060"/>
    <circle cx={w - 10} cy={2 * tile + 20} r="5" fill="#b8a060"/>
    <line x1="10" y1={2 * tile + 20} x2={w - 10} y2={2 * tile + 20}
      stroke="#d4a030" stroke-width="2" stroke-dasharray="5 4"/>
    <circle cx="10" cy={3 * tile + 10} r="5" fill="#b8a060"/>
    <circle cx={w - 10} cy={3 * tile + 10} r="5" fill="#b8a060"/>
    <line x1="10" y1={3 * tile + 10} x2={w - 10} y2={3 * tile + 10}
      stroke="#d4a030" stroke-width="2" stroke-dasharray="5 4"/>
  </svg>
{/snippet}

{#snippet roundabout()}
  {@const w = 3 * tile}
  {@const h = 4 * tile}
  {@const cx = w / 2}
  {@const cy = h / 2}
  {@const outerR = Math.min(w, h) * 0.46}
  {@const innerR = outerR * 0.46}
  <svg width={w} height={h} viewBox="0 0 {w} {h}" aria-hidden="true">
    <!-- road surface -->
    <circle {cx} {cy} r={outerR} fill="#c8bca8" stroke="#a09080" stroke-width="5"/>
    <!-- lane divider dashes -->
    <circle {cx} {cy} r={outerR * 0.74} fill="none" stroke="#e8e0d0" stroke-width="3" stroke-dasharray="8 7"/>
    <!-- centre island -->
    <circle {cx} {cy} r={innerR} fill="#5a9a4a" stroke="#3a7a30" stroke-width="3"/>
    <!-- shrub cluster on island -->
    <circle {cx} {cy} r={innerR * 0.55} fill="#2d6a2a"/>
    <circle cx={cx - 8} cy={cy + 4} r={innerR * 0.3} fill="#3a7a30"/>
    <circle cx={cx + 8} cy={cy - 3} r={innerR * 0.28} fill="#3a7a30"/>
    <!-- entry/exit notches (cardinal directions) -->
    <rect x={cx - 5} y="0" width="10" height="14" fill="#c8bca8"/>
    <rect x={cx - 5} y={h - 14} width="10" height="14" fill="#c8bca8"/>
    <rect x="0" y={cy - 5} width="14" height="10" fill="#c8bca8"/>
    <rect x={w - 14} y={cy - 5} width="14" height="10" fill="#c8bca8"/>
  </svg>
{/snippet}

{#snippet car()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- body -->
    <rect x="7" y="28" width="42" height="18" rx="5" fill="#c03828"/>
    <!-- cabin -->
    <rect x="12" y="13" width="32" height="17" rx="5" fill="#d04838"/>
    <!-- windows -->
    <rect x="14" y="15" width="13" height="11" rx="2" fill="#90c8e0"/>
    <rect x="29" y="15" width="13" height="11" rx="2" fill="#90c8e0"/>
    <!-- wheels -->
    <circle cx="16" cy="46" r="6" fill="#2a2020"/>
    <circle cx="40" cy="46" r="6" fill="#2a2020"/>
    <circle cx="16" cy="46" r="2.5" fill="#605040"/>
    <circle cx="40" cy="46" r="2.5" fill="#605040"/>
    <!-- headlights -->
    <rect x="7" y="32" width="5" height="5" rx="1" fill="#f8e898"/>
    <rect x="44" y="32" width="5" height="5" rx="1" fill="#f8e898"/>
    <!-- tail lights -->
    <rect x="7" y="38" width="5" height="4" rx="1" fill="#e03030"/>
    <rect x="44" y="38" width="5" height="4" rx="1" fill="#e03030"/>
  </svg>
{/snippet}

<div class="entrance-decor" aria-hidden="true">

  <!-- Car — row 1, col 1 -->
  <div class="decor" style="left:{1 * tile}px; top:{1 * tile}px;">
    {@render car()}
  </div>

  <!-- Roundabout — rows 2–5, cols 3–5 -->
  <div class="decor" style="left:{3 * tile}px; top:{2 * tile}px;">
    {@render roundabout()}
  </div>

  <!-- Upper ticket booth — rows 6–9, cols 27–28 (near Plaza connector) -->
  <div class="decor" style="left:{27 * tile}px; top:{6 * tile}px;">
    {@render ticketBooth()}
  </div>

  <!-- Lower ticket booth — rows 11–14, cols 27–28 -->
  <div class="decor" style="left:{27 * tile}px; top:{11 * tile}px;">
    {@render ticketBooth()}
  </div>

</div>

<style>
  .entrance-decor {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .decor {
    position: absolute;
  }
</style>
