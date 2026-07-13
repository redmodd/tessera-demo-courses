<script>
  let { tile } = $props();

  // The tent is drawn TENT_RISE px above its tile and hangs down to the tile's foot, so the
  // canvas rises over the ice while its base still sits on the two 'B' tiles that block.
  const TENT_RISE = 24;
  const TENT_H = $derived(tile + TENT_RISE);
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
    <!-- stick arms -->
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

{#snippet weatherMast()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="50" rx="12" ry="2.5" fill="rgba(80,110,140,0.18)"/>
    <!-- guy lines and mast -->
    <line x1="28" y1="14" x2="14" y2="48" stroke="#9fb2c2" stroke-width="1"/>
    <line x1="28" y1="14" x2="42" y2="48" stroke="#9fb2c2" stroke-width="1"/>
    <rect x="26.5" y="10" width="3" height="38" fill="#8b98a5"/>
    <!-- anemometer -->
    <line x1="28" y1="12" x2="18" y2="7" stroke="#5d6b78" stroke-width="1.4"/>
    <line x1="28" y1="12" x2="38" y2="7" stroke="#5d6b78" stroke-width="1.4"/>
    <line x1="28" y1="12" x2="28" y2="3" stroke="#5d6b78" stroke-width="1.4"/>
    <circle cx="17" cy="6" r="2.6" fill="#e0563f"/>
    <circle cx="39" cy="6" r="2.6" fill="#e0563f"/>
    <circle cx="28" cy="2.5" r="2.6" fill="#e0563f"/>
    <!-- solar panel + instrument box -->
    <rect x="30" y="20" width="13" height="8" rx="1" fill="#2f4d6b" stroke="#8fa6b8" stroke-width="1"/>
    <rect x="19" y="30" width="10" height="9" rx="1.5" fill="#e8eef3" stroke="#8b98a5" stroke-width="1"/>
    <rect x="21" y="33" width="6" height="1.6" fill="#5d6b78"/>
  </svg>
{/snippet}

{#snippet researchTent()}
  <svg width={2 * tile} height={TENT_H} viewBox="0 0 {2 * tile} {TENT_H}" aria-hidden="true">
    <ellipse cx="56" cy="76" rx="48" ry="3.5" fill="rgba(80,110,140,0.18)"/>
    <!-- apex pole + pennant -->
    <line x1="56" y1="18" x2="56" y2="6" stroke="#6d5238" stroke-width="2"/>
    <path d="M56 6 l14 4 l-14 4 z" fill="#e0563f"/>
    <!-- canvas -->
    <polygon points="56,16 100,74 56,74" fill="#e0703f"/>
    <polygon points="56,16 12,74 56,74" fill="#c9552e"/>
    <!-- doorway flap -->
    <polygon points="56,30 78,74 56,74" fill="#3a2b22"/>
    <polygon points="78,74 92,74 70,34 63,32" fill="#eb8a55"/>
    <!-- snow along the hem -->
    <path d="M6 74 q16 -8 30 -3 q12 4 26 2 q16 -3 30 1 q10 2 16 0 l0 4 l-102 0 z" fill="#f4f9fd"/>
    <!-- sample crate -->
    <rect x="86" y="58" width="18" height="14" rx="1.5" fill="#b5844a" stroke="#8a6034" stroke-width="1.2"/>
    <path d="M86 65h18M95 58v14" stroke="#8a6034" stroke-width="1.2"/>
    <rect x="85" y="56.5" width="20" height="2.8" rx="1.4" fill="#f4f9fd"/>
  </svg>
{/snippet}

{#snippet drillRig()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="50" rx="14" ry="2.5" fill="rgba(80,110,140,0.18)"/>
    <!-- tripod legs -->
    <line x1="28" y1="10" x2="13" y2="48" stroke="#6d7b88" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="28" y1="10" x2="43" y2="48" stroke="#6d7b88" stroke-width="2.6" stroke-linecap="round"/>
    <line x1="28" y1="10" x2="30" y2="46" stroke="#5d6b78" stroke-width="2.2" stroke-linecap="round"/>
    <!-- winch head and cable -->
    <rect x="22" y="6" width="12" height="6" rx="2" fill="#e0a63c"/>
    <line x1="28" y1="12" x2="28" y2="36" stroke="#4a5661" stroke-width="1.2"/>
    <!-- ice-core barrel -->
    <rect x="25" y="30" width="6" height="16" rx="1" fill="#c9d4dd" stroke="#7f8d99" stroke-width="1"/>
    <!-- motor box -->
    <rect x="34" y="38" width="12" height="9" rx="1.5" fill="#3f4c58"/>
    <rect x="36" y="40" width="5" height="2" fill="#9fb2c2"/>
  </svg>
{/snippet}

{#snippet rocks()}
  <svg width={tile} height={tile} viewBox="0 0 {tile} {tile}" aria-hidden="true">
    <ellipse cx="28" cy="47" rx="18" ry="3" fill="rgba(80,110,140,0.16)"/>
    <path d="M6 46 Q8 30 20 28 Q33 27 34 46 Z" fill="#8d99a4"/>
    <path d="M8 34 Q14 27 24 29 Q30 31 32 36 Q20 32 8 34 Z" fill="#f2f7fb"/>
    <path d="M30 46 Q31 34 40 33 Q50 33 50 46 Z" fill="#7c8894"/>
    <path d="M32 38 Q37 32 45 34 Q49 36 50 39 Q41 35 32 38 Z" fill="#e6eef4"/>
    <path d="M14 46 L18 36" stroke="#78848f" stroke-width="1" opacity="0.6"/>
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

  <div class="decor" style="left:{8 * tile}px; top:{21 * tile}px;">{@render cocoaHut()}</div>
  <div class="decor" style="left:{9 * tile}px; top:{21 * tile}px;">{@render snowman()}</div>

  <div class="decor" style="left:{17 * tile}px; top:{20 * tile}px;">{@render weatherMast()}</div>
  <div class="decor" style="left:{18 * tile}px; top:{20 * tile - TENT_RISE}px;">{@render researchTent()}</div>
  <div class="decor" style="left:{20 * tile}px; top:{20 * tile}px;">{@render drillRig()}</div>

  <div class="decor" style="left:{33 * tile}px; top:{8 * tile}px;">{@render rocks()}</div>
  <div class="decor" style="left:{30 * tile}px; top:{14 * tile}px;">{@render rocks()}</div>
  <div class="decor" style="left:{13 * tile}px; top:{22 * tile}px;">{@render rocks()}</div>

  <!-- Icebergs: decorative only, the water tiles already block -->
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
