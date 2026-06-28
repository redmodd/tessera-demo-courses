<script>
  // Decorative overlay for the polar overworld. Drawn above tile cells (z-index 1) but
  // below character sprites (z-index 2). The hot-cocoa hut and snowman sit on the two 'B'
  // prop tiles in worldmap.js (so they block the player); the icebergs are purely visual,
  // floating over the frozen lake's water tiles (already impassable), so they need no tiles.

  let { tile } = $props();
</script>

{#snippet cocoaHut()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <!-- snow-capped roof -->
    <polygon points="6,21 50,21 44,9 12,9" fill="#b23b3b"/>
    <polygon points="6,21 50,21 50,17 6,17" fill="rgba(255,255,255,0.85)"/>
    <!-- posts -->
    <rect x="9"  y="21" width="3" height="20" fill="#7a5230"/>
    <rect x="44" y="21" width="3" height="20" fill="#7a5230"/>
    <!-- counter -->
    <rect x="7" y="34" width="42" height="7" rx="2" fill="#caa063"/>
    <rect x="7" y="40" width="42" height="6" rx="1" fill="#8a5e30"/>
    <!-- steaming cup of cocoa -->
    <rect x="22" y="27" width="12" height="9" rx="2" fill="#f2e6d0"/>
    <rect x="24" y="28" width="8" height="2" fill="#6f4a2c"/>
    <path d="M33 30 q5 1 0 5" stroke="#f2e6d0" stroke-width="2" fill="none"/>
    <path d="M25 26 q-2 -4 1 -7" stroke="#e8eef3" stroke-width="2" fill="none" opacity="0.8"/>
    <path d="M30 26 q2 -4 -1 -7"  stroke="#e8eef3" stroke-width="2" fill="none" opacity="0.8"/>
  </svg>
{/snippet}

{#snippet snowman()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="51" rx="14" ry="3" fill="rgba(80,110,140,0.18)"/>
    <!-- stick arms (behind the body) -->
    <line x1="19" y1="27" x2="9"  y2="22" stroke="#7a5230" stroke-width="1.6"/>
    <line x1="37" y1="27" x2="47" y2="22" stroke="#7a5230" stroke-width="1.6"/>
    <!-- three snowballs -->
    <circle cx="28" cy="41" r="11"  fill="#f4f9fd"/>
    <circle cx="28" cy="27" r="8.5" fill="#f4f9fd"/>
    <circle cx="28" cy="15" r="6.5" fill="#f4f9fd"/>
    <!-- coal buttons -->
    <circle cx="28" cy="39" r="1.3" fill="#3a3a44"/>
    <circle cx="28" cy="43" r="1.3" fill="#3a3a44"/>
    <!-- face -->
    <circle cx="25.5" cy="14" r="1" fill="#3a3a44"/>
    <circle cx="30.5" cy="14" r="1" fill="#3a3a44"/>
    <polygon points="28,16 28,18 34,17" fill="#e8862e"/>
    <!-- scarf -->
    <rect x="21" y="20" width="14" height="3" rx="1.5" fill="#2f7d5b"/>
    <rect x="31" y="21" width="3"  height="7" rx="1.5" fill="#2f7d5b"/>
    <!-- top hat -->
    <rect x="21" y="7" width="14" height="3" fill="#2a2a33"/>
    <rect x="24" y="1" width="8"  height="7" fill="#2a2a33"/>
  </svg>
{/snippet}

{#snippet iceberg()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <polygon points="6,42 17,22 27,31 37,17 50,42" fill="#dceffa"/>
    <polygon points="17,22 27,31 23,42 6,42"  fill="#c4e1f3"/>
    <polygon points="37,17 50,42 31,42 27,31" fill="#bedaef"/>
    <line x1="27" y1="31" x2="27" y2="42" stroke="#a9cde6" stroke-width="1"/>
  </svg>
{/snippet}

<div class="polar-decor" aria-hidden="true">

  <!-- Hot-cocoa hut + snowman — the 'B' prop tiles, row 22 cols 7–8 -->
  <div class="decor" style="left:{7 * tile}px; top:{22 * tile}px;">{@render cocoaHut()}</div>
  <div class="decor" style="left:{8 * tile}px; top:{22 * tile}px;">{@render snowman()}</div>

  <!-- Icebergs drifting in the frozen lake (decorative; the water already blocks) -->
  <div class="decor" style="left:{16 * tile}px; top:{12 * tile}px;">{@render iceberg()}</div>
  <div class="decor" style="left:{19 * tile}px; top:{13 * tile}px;">{@render iceberg()}</div>
  <div class="decor" style="left:{17 * tile}px; top:{14 * tile}px;">{@render iceberg()}</div>

</div>

<style>
  .polar-decor {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .decor {
    position: absolute;
  }
</style>
