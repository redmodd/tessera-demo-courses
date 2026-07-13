<script>
  // Coordinates match the 'B'/'I' tiles in worldmap.js.

  let { tile } = $props();
  const W = 2 * tile; // two-tile bench span
</script>

{#snippet wideBench()}
  <svg width={W} height={tile} viewBox="0 0 {W} {tile}">
    <!-- rear legs -->
    <rect x="10"      y="14" width="5" height="12" rx="1.5" fill="#7c6038"/>
    <rect x={W/2 - 2} y="14" width="4" height="12" rx="1"   fill="#7c6038"/>
    <rect x={W - 15}  y="14" width="5" height="12" rx="1.5" fill="#7c6038"/>
    <!-- backrest -->
    <rect x="7" y="12" width={W - 14} height="7" rx="2"   fill="#c09a62"/>
    <!-- seat slats -->
    <rect x="7" y="29" width={W - 14} height="6" rx="1.5" fill="#ad8a59"/>
    <rect x="7" y="36" width={W - 14} height="6" rx="1.5" fill="#9a7b50"/>
    <!-- front legs -->
    <rect x="10"      y="42" width="5" height="10" rx="1.5" fill="#7c6038"/>
    <rect x={W/2 - 2} y="42" width="4" height="10" rx="1"   fill="#7c6038"/>
    <rect x={W - 15}  y="42" width="5" height="10" rx="1.5" fill="#7c6038"/>
    <!-- connecting rail -->
    <rect x="15" y="44" width={W - 30} height="3" rx="1" fill="#7c6038"/>
  </svg>
{/snippet}

<div class="savanna-decor" aria-hidden="true">

  <div class="decor" style="left:{19 * tile}px; top:{21 * tile}px;">
    {@render wideBench()}
  </div>

  {#each [22, 23] as row}
    <div class="decor" style="left:{20 * tile}px; top:{row * tile}px;">
      {@render wideBench()}
    </div>
  {/each}

  <div class="decor" style="left:{24 * tile}px; top:{21 * tile}px;">
    {@render wideBench()}
  </div>

  {#each [22, 23] as row}
    <div class="decor" style="left:{23 * tile}px; top:{row * tile}px;">
      {@render wideBench()}
    </div>
  {/each}

  <div class="decor" style="left:{19 * tile}px; top:{22 * tile}px;">
    <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}">
      <!-- handle -->
      <rect x="21" y="10" width="14" height="6" rx="3" fill="#4e5e4e"/>
      <!-- lid -->
      <rect x="13" y="15" width="30" height="7" rx="3" fill="#5a6a5a"/>
      <rect x="13" y="14" width="30" height="4" rx="2" fill="#6e7e6e"/>
      <!-- body -->
      <rect x="16" y="21" width="24" height="25" rx="3" fill="#6b7b6b"/>
      <rect x="16" y="21" width="8"  height="25" rx="3" fill="rgba(255,255,255,0.08)"/>
      <!-- horizontal bands -->
      <rect x="16" y="31" width="24" height="2" rx="1" fill="rgba(0,0,0,0.2)"/>
      <rect x="16" y="39" width="24" height="2" rx="1" fill="rgba(0,0,0,0.2)"/>
    </svg>
  </div>

  <div class="decor" style="left:{23 * tile}px; top:{17 * tile}px;">
    <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}">
      <!-- canopy -->
      <polygon points="5,24 51,24 45,9 11,9" fill="#c03820"/>
      <polygon points="11,24 17,24 14,9 9,9"  fill="rgba(255,255,255,0.42)"/>
      <polygon points="22,24 28,24 25,9 20,9"  fill="rgba(255,255,255,0.42)"/>
      <polygon points="33,24 39,24 36,9 31,9"  fill="rgba(255,255,255,0.42)"/>
      <polygon points="44,24 50,24 47,9 42,9"  fill="rgba(255,255,255,0.42)"/>
      <!-- pole -->
      <rect x="26" y="9" width="4" height="19" fill="#7a5230"/>
      <!-- counter top -->
      <rect x="6"  y="28" width="44" height="6" rx="2" fill="#c09a6a"/>
      <circle cx="16" cy="27" r="4"   fill="#f0c030"/>
      <circle cx="28" cy="27" r="3.5" fill="#e05020"/>
      <circle cx="40" cy="27" r="3.5" fill="#42a832"/>
      <!-- cart body -->
      <rect x="8"  y="34" width="40" height="12" rx="2" fill="#a07040"/>
      <!-- wheels -->
      <circle cx="18" cy="45" r="5" fill="#5a4028"/>
      <circle cx="38" cy="45" r="5" fill="#5a4028"/>
      <circle cx="18" cy="45" r="2" fill="#7a6038"/>
      <circle cx="38" cy="45" r="2" fill="#7a6038"/>
    </svg>
  </div>

</div>

<style>
  .savanna-decor {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  }
  .decor {
    position: absolute;
  }
</style>
